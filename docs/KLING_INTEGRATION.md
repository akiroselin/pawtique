# Kling AI 集成说明

## 接入方式

PawTique 通过双通道接入 Kling AI（快手可灵）：

### 通道 1: 官方 API（生产推荐）
设置环境变量 `KLING_API_KEY` 后自动启用。

```bash
# .env.local
KLING_API_KEY=your_kling_api_key_here
```

申请地址: https://klingai.kuaishou.com/dev

### 通道 2: 浏览器自动化（开发/无 API key fallback）
通过 daemon CDP 连接到用户已在 klingai.kuaishou.com 登录的 Chromium，
自动调用网页版生成视频。

**前置条件：**
1. 用户在浏览器手动打开 https://klingai.kuaishou.com 并登录一次
2. browser-harness daemon 连接到用户的 Chromium（`BU_CDP_URL=http://localhost:9222`）

## 工作流程

```
用户上传照片
    ↓
选择动作模板（温柔眨眼 / 转头回眸 / 安静呼吸 / 开心微笑 等）
    ↓
POST /api/kling/generate
    ↓
[有 API key] → 调用 Kling 官方 API
[无 API key] → 写入 /tmp/kling_queue_*.json，调用 scripts/kling_browser_worker.py
    ↓
前端轮询 GET /api/kling/status?taskId=xxx
    ↓
完成后返回 videoUrl → 用户下载/分享
```

## 文件结构

```
src/lib/kling/
├── types.ts          # 共享类型 + 提示词库（客户端可用）
└── server.ts         # server-only（含 fs/child_process）

src/app/api/kling/
├── generate/route.ts # POST 提交任务
└── status/route.ts   # GET 查询任务状态

src/app/configure/virtual-pet/
└── page.tsx          # 用户 UI：4 步流程（上传 → 配置 → 生成 → 结果）

scripts/
└── kling_browser_worker.py  # CDP 浏览器自动化 fallback
```

## 提示词模板

`PET_MOTION_PROMPTS` in `types.ts`:
- gentle_blink - 温柔眨眼
- head_turn - 转头回眸
- breathing - 安静呼吸
- smile - 开心微笑
- stretch - 伸懒腰
- standing_walk - 缓步走来
- sleep_dream - 安静沉睡
- custom - 自定义 prompt

## 测试

1. 启动 dev server: `npm run dev`
2. 打开 http://localhost:3456/configure/virtual-pet
3. 上传一张宠物正脸照
4. 选择动作模板
5. 点击 "开始复活"
6. 等待 1-3 分钟查看生成结果

## 定价

- 5 秒视频: £29
- 10 秒视频: £49
- 不满意免费重做 1 次
- MP4 + GIF 双格式
- 商用授权