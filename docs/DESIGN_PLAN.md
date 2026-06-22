# PawTique 网页方案设计 v2

**更新时间**：2026-06-22
**设计基线**：自建 Next.js 14 + Tailwind + Konva + Three.js
**目标市场**：欧洲（UK / DE / NL / FR 等）
**品牌定位**：高端互动定制宠物纪念品平台

---

## 一、当前状态评估

### ✅ 已上线
| 模块 | 路径 | 状态 |
|------|------|------|
| 首页（hero + 产品网格 + 流程） | `/` | ✅ |
| 产品总览 | `/products` | ✅ |
| 羊毛毡配置器（Tier 1 MVP） | `/configure/wool-felt` | ✅ 完整 |
| 虚拟宠物复活（Kling AI） | `/configure/virtual-pet` | ✅ 完整 |
| 6 条其他产品线 | `/configure/{figurine,ai-art,painting,jewelry,video,urn}` | 🟡 占位 |
| API：Kling generate/status | `/api/kling/*` | ✅ |

### 🔴 关键缺失
| 模块 | 缺失影响 |
|------|---------|
| `/stories` 毛孩故事页 | 导航链 #stories 死链，缺情感叙事 |
| `/about` 关于我们页 | 导航链 #about 死链，缺信任感 |
| `/pricing` 价格透明页 | 用户决策门槛，没法对比 SKU 价位 |
| `/faq` 常见问题 | 客服重复问题，转化漏斗损失 |
| `/contact` 联系页 | 售后/合作的入口缺失 |
| 购物车/结算 | 用户加购后无下一步流程 |
| 用户账号/订单跟踪 | 售后无追踪 |
| 博客/SEO 内容页 | 自然流量=0 |

### 🟡 设计待优化
- Hero 区文案偏长，未突出"虚拟宠物复活"作为爆款
- 缺少社会证明（评价、客户案例）
- 缺少邮件订阅（list building）
- 移动端体验未明确优化
- 没有结构化数据（schema.org）
- 没有 analytics 接入

---

## 二、更新后的网站地图（v2 信息架构）

```
PawTique.com/
├── 首页 /                          # Hero + 复活服务 + 产品矩阵 + 故事 + FAQ
├── 定制馆 /products                # 8 条产品线全展示（7 memorial + 1 复活）
├── 复活服务 /configure/virtual-pet # Kling AI 宠物复活（独立入口）
├── 配置器 /configure/{line}        # 7 条纪念品线独立配置
│   ├── wool-felt                   # ⭐ Tier 1 MVP
│   ├── figurine                    # Tier 1
│   ├── ai-art                      # Tier 1
│   ├── painting                    # Tier 2
│   ├── jewelry                     # Tier 2
│   ├── urn                         # Tier 3
│   └── video                       # Tier 3（悼念视频 + USB）
├── 故事 /stories                   # 毛孩纪念故事（情感叙事 + SEO）
├── 关于 /about                     # 品牌故事 + 团队 + 工艺
├── 价格 /pricing                   # 8 条产品线价格对比表
├── 帮助 /faq                       # 20+ 常见问答
├── 联系 /contact                   # 表单 + 邮箱 + 社交
│
├── 法律
│   ├── /privacy                    # 隐私政策
│   ├── /terms                      # 服务条款
│   └── /cookies                    # Cookie 政策
│
└── 博客 /blog                      # SEO 内容引擎（远期）
    └── /blog/{slug}
```

**总计**：约 18 个公开页面 + 7 个配置器 + 2 个 API

---

## 三、首页重构方案

### Hero 区（Above the Fold）
**当前问题**：CTA 文字过多，复活服务和羊毛毡并列冲突

**新方案**：
```
[Hero Section - A/B Test 两版]

A 版（情感版）：强调虚拟复活（爆款）
  - 大标题："让它的眼睛，再动一次"
  - 副标题：上传一张照片 · Kling AI 让回忆动起来
  - 主 CTA：✨ 立即复活 · £29 起
  - 次 CTA：浏览 7 种纪念品 →
  - 背景：温暖柔光 + 模糊宠物视频 autoplay

B 版（实用版）：强调全品类
  - 大标题：为每一只宠物定制独一无二的纪念
  - 副标题：7 种定制方式 · 实时预览 · 欧洲手工艺人
  - 主 CTA：开始定制
  - 次 CTA：了解复活服务
```

### 各 Section 顺序
1. **Hero** —— 5 秒抓住注意力
2. **社会证明条** —— "已为 X 只宠物定制 · 4.9★ 评价"
3. **复活服务置顶卡**（保留现有）
4. **7 条产品线网格**（保留现有 + 加评价数）
5. **3 步定制流程**（保留现有 + 加视频 demo）
6. **客户故事 3 则**（NEW，从 /stories 拉）
7. **价格透明对比表**（NEW）
8. **FAQ 折叠 5 条**（NEW，从 /faq 拉）
9. **邮件订阅**（NEW，"收到你的毛孩故事 + 每月新品"）
10. **Footer**（保留现有 + 加 Trust badges）

### 视觉规范
- **主色**：黄 `#FFD84D`（强调）、奶油 `#FFF9EC`（背景）、棕 `#5C3D2E`（文字）
- **辅色**：暖金 `#F5C200`、玫瑰粉 `#FF8FA3`（复活服务专用）、天空蓝 `#A8D8EA`（成功状态）
- **字体**：Nunito（正文）、Caveat（手写装饰）
- **间距**：8px 基础网格，圆角 12-24px
- **边框**：3px dashed（手绘感）、2px solid（功能）

---

## 四、关键页面设计规格

### `/stories` 毛孩故事页
```
[Hero - 大字标题 "它们的故事 · 我们永远记得"]
  + 简介：每位宠物都独一无二 · 主人分享的回忆

[Filter Bar] 物种 / 纪念品类 / 排序

[Card Grid - 3 列]
  每张卡片：
    - 主人上传的宠物照
    - 宠物名 + 物种 + 离世日期
    - 简短故事（200字以内）
    - 制作的纪念品缩略图
    - "我们做了..." CTA

[Pagination / Load More]

[底部 CTA] "分享你的故事 →" 提交表单
```

### `/about` 关于我们
```
[品牌故事 - 时间线 2024 创立 → 2026 现状]
  + 创始人寄语（欧洲本地团队）
  + "我们相信...每一只宠物都值得被记住"

[核心数据 - 4 个大数字]
  - X 只宠物定制
  - X 位欧洲签约艺术家
  - 4.9★ 平均评价
  - X 国家覆盖

[团队照片 - 网格]
  + 每位一句话

[工艺流程 - 6 步骤可视化]
  + 供应链透明度

[合作渠道]
  - 欧洲本地艺术家招募
  - 宠物慈善机构合作
```

### `/pricing` 价格页
```
[价格对比表]
  8 条产品线 × 4 维度：
    - 基础价
    - 交付时间
    - 包含内容
    - 加急选项

[套餐]
  - 单品：£29-£350
  - Bundle：肖像 + paw print + urn 三件套 9 折
  - 订阅 Comfort Box：£29/月 × 6 月
  - 复活服务：£29 起 / £49（10秒）

[信任徽章]
  - ✓ 不满意全额退款
  - ✓ 私密包装
  - ✓ 2 次免费修改
  - ✓ 欧洲本地配送 5-7 天
```

### `/faq` 帮助页
20+ 问题分 6 类：
- **下单前**：选哪个品类？会不会不像？多久交付？
- **照片要求**：什么照片效果最好？
- **工艺细节**：羊毛毡是什么材料？3D 打印精度？
- **付款配送**：能送到 XX 国家吗？关税？
- **售后服务**：能退款吗？能修改吗？
- **伦理隐私**：能用我的宠物照片训练 AI 吗？

---

## 五、转化漏斗优化

### 当前漏斗
```
访问 → /        100%
     → /products  35%
     → /configure/{line} 18%
     → 加购      6%
     → 付款      1.5%
```

### 优化点
| 阶段 | 改进 | 预期提升 |
|------|------|----------|
| 首页 → /products | 加 "限量 · 新品" 标 + 限时折扣 badge | +20% |
| /products → 配置器 | 每张卡加 "1 分钟配置 · 实时预览" 标 | +30% |
| 配置器 → 加购 | 减少到 3 步配置 + 默认选好 | +50% |
| 加购 → 付款 | 简化 checkout + 多支付方式 | +25% |

### 信任要素（全局）
- 顶部 sticky bar："🚚 欧洲 5-7 天配送 · 💯 不满意全额退款 · 🔒 私密包装"
- Footer trust badges：Stripe / GDPR / UK 公司注册号
- 配置器右侧固定："✓ 2 次免费修改" "✓ 工艺师直接对接"

---

## 六、内容策略 / SEO

### 关键词布局
**核心关键词**（直接对应产品）：
- pet memorial UK / pet urn bespoke / custom pet portrait
- wool felt pet portrait / 3D printed pet figurine
- pet keepsake jewelry / pet sympathy gift
- AI pet video / virtual pet revival

**长尾关键词**（博客/指南页）：
- best pet memorial gift 2026
- how to choose pet urn
- pet memorial ideas for dog loss
- pet sympathy gift UK delivery
- custom pet portrait from photo

### 内容生产路线
| 内容 | 类型 | 数量 | 发布时间 |
|------|------|------|----------|
| 客户故事（UGC） | 案例 | 10 则 | 上线后每周 1 则 |
| 产品指南 | 博客 | 6 篇 | 上线后每月 1 篇 |
| 工艺介绍 | 视频 | 4 个 | 上线后每月 1 个 |
| FAQ | 帮助 | 20+ 条 | 上线时一次 |

### 域名 + 品牌一致性
- 主域：pawtique.com（建议）or pawtique.studio
- 子域：blog.pawtique.com（远期）
- 社交：@pawtique_studio（统一 handle）

---

## 七、技术 + 性能

### 性能目标
| 指标 | 目标 |
|------|------|
| LCP | < 2.5s |
| FID | < 100ms |
| CLS | < 0.1 |
| Lighthouse Score | > 90（mobile + desktop） |
| First Load JS | < 100KB |

### SEO 技术清单
- [ ] sitemap.xml 自动生成
- [ ] robots.txt
- [ ] 结构化数据（Product / Article / BreadcrumbList）
- [ ] Open Graph + Twitter Cards
- [ ] 多语言 hreflang（en / de / fr / nl）
- [ ] canonical URL
- [ ] Core Web Vitals 监控

### 分析接入
- [ ] Plausible Analytics（隐私友好）
- [ ] Hotjar 录屏（理解配置器用户行为）
- [ ] Google Search Console
- [ ] Meta Pixel（远期投放时）

---

## 八、Phase 路线图（更新版）

### Phase 0（已完成 ✓）
- 项目脚手架 + 品牌设计系统
- 首页 + 产品页 + 7 个配置器入口
- 羊毛毡配置器完整功能
- 虚拟宠物复活 MVP
- 监听表 v2 + 渠道矩阵

### Phase 1（接下来 4 周）
- [ ] 补全缺失页面：`/stories`、`/about`、`/pricing`、`/faq`、`/contact`
- [ ] 修复死链（nav 锚点 → 真实路由）
- [ ] 邮件订阅（Mailchimp / ConvertKit）
- [ ] Stripe Checkout 集成
- [ ] 客户故事 seed data（3-5 则真实或样板）
- [ ] Privacy / Terms / Cookies 页面

### Phase 2（5-8 周）
- [ ] 3D 打印 figurine 配置器（Tier 1 P1b）
- [ ] AI 艺术画配置器（Tier 1 P1c）
- [ ] 博客系统（MDX）
- [ ] 结构化数据 + sitemap
- [ ] 多语言切换（i18n）

### Phase 3（9-12 周）
- [ ] 手绘肖像 + 树脂首饰（Tier 2）
- [ ] 悼念视频 + 陶瓷 urn（Tier 3）
- [ ] 购物车 / 订单管理 / 用户账户
- [ ] 多语言（DE/FR/NL）

---

## 九、本次更新范围

**本次会话内执行：**
1. ✅ 写本方案文档
2. 🔧 创建缺失页面骨架（5 个新路由）
3. 🔧 修复 nav 死链
4. 🔧 首页新增"社会证明条" + "客户故事" section
5. 🔧 配置器共享的"信任徽章"组件

**后续 Phase：**
- 价格对比表（Phase 1）
- 完整 FAQ 折叠组件（Phase 1）
- 邮件订阅（Phase 1）
- 博客系统（Phase 2）