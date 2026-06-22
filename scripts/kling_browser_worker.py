#!/usr/bin/env python3
"""
Kling AI 浏览器自动化 Worker
通过 CDP 连接到用户已登录的 Chromium，使用 klingai.kuaishou.com 网页界面
生成虚拟宠物复活视频

用法：
  python3 kling_browser_worker.py submit <queue_file.json>
  python3 kling_browser_worker.py check <queue_file.json>

工作原理：
  1. 从 queue file 读取请求（imageUrl, prompt, duration, aspectRatio）
  2. 通过 daemon socket 连接用户的 Chromium
  3. 找到 Kling 已登录的标签页（如无则提示用户先打开并登录）
  4. 上传图片 + 设置 prompt + 提交生成
  5. 轮询直到完成，写入 videoUrl 回 queue file
"""

import sys
import json
import time
import socket
import urllib.request
import urllib.parse
import os
import re

SOCK = "/tmp/bu-default.sock"  # browser-harness daemon socket

# ── CDP helpers ──

def cdp_send(req, session_id=None, timeout=15):
    s = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)
    s.settimeout(timeout)
    s.connect(SOCK)
    req["session_id"] = session_id
    s.sendall((json.dumps(req) + "\n").encode())
    data = b""
    try:
        while not data.endswith(b"\n"):
            chunk = s.recv(1 << 20)
            if not chunk:
                break
            data += chunk
    except socket.timeout:
        pass
    s.close()
    return json.loads(data) if data else {}


def find_kling_tab():
    """查找用户 Chromium 中已打开的 Kling 标签页"""
    targets = cdp_send({"method": "Target.getTargets", "params": {}})
    pages = [t for t in targets.get("result", {}).get("targetInfos", [])
             if t.get("type") == "page"]
    for t in pages:
        url = t.get("url", "")
        if "klingai" in url:
            return t
    return None


def attach_and_activate(target_id):
    """附加并激活目标标签页"""
    attach = cdp_send({
        "method": "Target.attachToTarget",
        "params": {"targetId": target_id, "flatten": True}
    })
    session_id = attach["result"]["sessionId"]
    cdp_send({"method": "Target.activateTarget", "params": {"targetId": target_id}})
    return session_id


def evaluate(expression, session_id):
    """在页面上执行 JS 并返回结果"""
    r = cdp_send({
        "method": "Runtime.evaluate",
        "params": {"expression": expression, "returnByValue": True, "awaitPromise": True},
        "session_id": session_id
    })
    return r.get("result", {}).get("result", {}).get("value")


def navigate(url, session_id):
    cdp_send({
        "method": "Page.navigate",
        "params": {"url": url},
        "session_id": session_id
    })
    time.sleep(2)


# ── 主流程 ──

def submit_task(queue_file):
    with open(queue_file) as f:
        queue = json.load(f)

    task_id = queue["taskId"]
    req = queue["request"]

    print(f"[kling worker] task={task_id} prompt={req.get('prompt', '')[:50]}...")

    # 1. 找 Kling 标签页
    tab = find_kling_tab()
    if not tab:
        queue.update({
            "status": "failed",
            "errorMessage": "未找到 klingai.com 标签页 - 请在浏览器打开并登录 klingai.kuaishou.com",
            "completedAt": int(time.time() * 1000),
        })
        with open(queue_file, "w") as f:
            json.dump(queue, f, indent=2)
        return

    print(f"[kling worker] Found Kling tab: {tab['title'][:50]}")
    session_id = attach_and_activate(tab["targetId"])

    try:
        # 2. 导航到 Kling 图片生成视频页面
        navigate("https://klingai.kuaishou.com/image-to-video", session_id)
        time.sleep(3)

        # 3. 上传图片
        # 找到上传 input 或按钮
        uploaded = evaluate(f"""
        (function() {{
            // 找上传文件 input
            var inputs = document.querySelectorAll('input[type="file"]');
            if (inputs.length > 0) {{
                return {{success: true, count: inputs.length}};
            }}
            // 找 "上传图片" 按钮并点击
            var btns = document.querySelectorAll('button');
            var uploadBtn = null;
            for (var b of btns) {{
                var t = b.textContent.trim();
                if (t.includes('上传') || t.includes('Upload') || t.includes('选择文件')) {{
                    uploadBtn = b;
                    break;
                }}
            }}
            if (uploadBtn) {{
                uploadBtn.click();
                return {{success: true, clicked: uploadBtn.textContent.trim()}};
            }}
            return {{success: false, msg: '未找到上传按钮'}};
        }})()
        """, session_id)
        print(f"[kling worker] upload result: {uploaded}")

        # 4. 通过 CDP 设置文件（实际需要更复杂的注入）
        # 简化版：提示用户手动上传文件
        # TODO: 实现 Input.dispatchKeyEvent + 文件路径注入

        # 5. 设置 prompt（如果页面有文本框）
        prompt_result = evaluate(f"""
        (function() {{
            var prompt = {json.dumps(req.get('prompt', ''))};
            // 找 prompt 输入框
            var tas = document.querySelectorAll('textarea');
            for (var ta of tas) {{
                if (ta.placeholder && (ta.placeholder.includes('描述') || ta.placeholder.includes('prompt'))) {{
                    var setter = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value').set;
                    setter.call(ta, prompt);
                    ta.dispatchEvent(new Event('input', {{bubbles: true}}));
                    return 'filled textarea: ' + prompt.length + ' chars';
                }}
            }}
            var inputs = document.querySelectorAll('input[type="text"]');
            for (var inp of inputs) {{
                if (inp.placeholder && (inp.placeholder.includes('描述') || inp.placeholder.includes('prompt'))) {{
                    var setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
                    setter.call(inp, prompt);
                    inp.dispatchEvent(new Event('input', {{bubbles: true}}));
                    return 'filled input: ' + prompt.length + ' chars';
                }}
            }}
            return 'no prompt input found';
        }})()
        """, session_id)
        print(f"[kling worker] prompt: {prompt_result}")

        # 6. 点击生成按钮
        time.sleep(1)
        clicked = evaluate("""
        (function() {
            var btns = document.querySelectorAll('button');
            for (var b of btns) {
                var t = b.textContent.trim();
                if (t.includes('生成') || t.includes('Generate') || t.includes('立即生成')) {
                    if (!b.disabled) {
                        b.click();
                        return 'clicked: ' + t;
                    }
                }
            }
            return 'no enabled generate button';
        })()
        """, session_id)
        print(f"[kling worker] generate: {clicked}")

        # 7. 轮询结果
        max_wait = 300  # 5 分钟
        start = time.time()
        while time.time() - start < max_wait:
            time.sleep(10)
            status = evaluate("""
            (function() {
                // 检查视频元素
                var videos = document.querySelectorAll('video');
                for (var v of videos) {
                    if (v.src && v.src.startsWith('http')) {
                        return {status: 'succeed', videoUrl: v.src};
                    }
                }
                // 检查进度文字
                var body = document.body.textContent;
                if (body.includes('生成失败') || body.includes('Failed')) {
                    return {status: 'failed', msg: '生成失败'};
                }
                if (body.includes('排队') || body.includes('处理中') || body.includes('生成中')) {
                    return {status: 'processing'};
                }
                return {status: 'processing'};
            })()
            """, session_id)

            print(f"[kling worker] poll: {status}")
            if status.get("status") == "succeed":
                queue.update({
                    "status": "succeed",
                    "videoUrl": status.get("videoUrl"),
                    "completedAt": int(time.time() * 1000),
                })
                with open(queue_file, "w") as f:
                    json.dump(queue, f, indent=2)
                print(f"[kling worker] SUCCESS! video={status.get('videoUrl')}")
                return
            elif status.get("status") == "failed":
                queue.update({
                    "status": "failed",
                    "errorMessage": status.get("msg", "Unknown error"),
                    "completedAt": int(time.time() * 1000),
                })
                with open(queue_file, "w") as f:
                    json.dump(queue, f, indent=2)
                return

        # 超时
        queue.update({
            "status": "failed",
            "errorMessage": "Polling timeout (5min)",
            "completedAt": int(time.time() * 1000),
        })
        with open(queue_file, "w") as f:
            json.dump(queue, f, indent=2)

    except Exception as e:
        queue.update({
            "status": "failed",
            "errorMessage": f"Worker exception: {str(e)}",
            "completedAt": int(time.time() * 1000),
        })
        with open(queue_file, "w") as f:
            json.dump(queue, f, indent=2)
        print(f"[kling worker] EXCEPTION: {e}")


def check_task(queue_file):
    with open(queue_file) as f:
        queue = json.load(f)
    print(json.dumps(queue, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: kling_browser_worker.py submit|check <queue_file>")
        sys.exit(1)

    action, queue_file = sys.argv[1], sys.argv[2]
    if action == "submit":
        submit_task(queue_file)
    elif action == "check":
        check_task(queue_file)
    else:
        print(f"Unknown action: {action}")
        sys.exit(1)