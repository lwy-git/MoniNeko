# 招财记账 App 产品需求文档（PRD）

**文档版本**：V2.0  
**产品名称**：招财记账（MoniNeko）  
**产品类型**：移动端 App  
**目标用户**：有日常消费记录和预算管理需求、喜爱猫咪/萌宠文化的个人用户  
**核心价值**：以“日”为维度记录消费明细，以“月”为维度管控预算，智能推荐每日可用额度。以“招财猫”主题提供轻松有趣的记账体验，通过猫咪伙伴养成降低坚持记账的心理门槛，让冰冷的数字变得有温度。  


## 一、产品概述

**产品定位**  
一款以“招财猫”为主题的极简智能记账工具。用户像养了一只招财猫管家：它帮你管钱、提醒预算、为你的节俭喝彩，也在超支时撒娇提醒。日历、结算、建议全部穿上猫咪外衣，实现“记账即养猫，省钱即投喂”。

**用户画像**  
- 18~35岁，喜欢猫但未必能养真猫的年轻人  
- 需要管控月度支出、却常因枯燥而放弃记账的白领/学生  
- 偏好轻量、可爱、有情感反馈的工具  
- 有数据同步需求，希望多设备共享记账数据

**差异化特色**  
将记账行为与猫咪伙伴养成、招财进宝的视觉反馈结合，提供“游客模式即开即用、云端同步无缝升级”的账户体验，让每一笔消费都转化为与猫的互动，强化正向激励。


## 二、核心功能模块

### 模块零：用户账户系统

**设计原则：**  
- 先本地，后云端：新用户无需注册即可开始记账，所有数据优先存储在本地。  
- 无感升级：当用户需要云同步或多设备功能时，可随时注册/登录，本地数据无缝合并到云端账户。  
- 游客身份唯一性：本地生成设备唯一 ID 作为游客标识，保障数据可追溯。  
- 猫咪伙伴跟随：账户系统绑定猫咪状态和成就，换设备登录时猫咪数据同步还原。

#### 登录/注册方案

| 方式 | 说明 | 优先级 |
|------|------|--------|
| 手机号 + 验证码 | 大陆用户首选，支持一键登录 | P0 |
| 微信 / Apple ID 登录 | 社交账号授权，降低注册门槛 | P0 |
| 邮箱 + 密码 | 兼顾海外用户及习惯 | P1 |
| 游客模式（默认） | 无需注册，立即使用，数据存本地；登录后可迁移 | P0 |

**交互流程：**  
1. 首次启动 App，进入猫咪欢迎页，底部提供两个入口：  
   - 「立即体验」→ 以游客身份进入主页。  
   - 「登录 / 注册」→ 跳转登录页，提供手机号、微信、Apple 登录。  
2. 游客在使用过程中，若点击「云端同步」或「多设备」等功能，弹窗提示：“需要登录招财猫账户才能同步哦～”，引导注册。  
3. 游客登录时，系统自动检测当前本地数据，询问“是否将本地账本关联到该账户”，确认后完成数据合并。  
4. 已登录用户可在设置中切换账户、退出登录（退出后回退为游客模式，本地数据保留）。  
5. 账户注销后，云端数据在 7 天内彻底清除，本地数据可保留或删除由用户选择。

#### 账户关联数据

| 数据 | 说明 |
|------|------|
| 用户资料 | 头像、昵称（默认“铲屎官”，可修改）、手机号 |
| 猫咪档案 | 猫咪名称、品种、等级、小鱼干数量、配饰、成就 |
| 账本列表 | 支持创建多个账本（如个人账、家庭账），每个账本独立预算 |
| 同步时间戳 | 记录最后同步时间，解决多端冲突 |
| 会员状态 | 预留付费会员字段（后期商业化） |

#### 数据安全与隐私
- 数据采用 AES-256 加密传输，云端存储脱敏处理。  
- 支持面容 / 指纹解锁进入 App（本地验证，保护账目隐私）。  
- 用户可随时在“设置-隐私”中导出全部数据或彻底删除云端数据。  
- 严格遵循 GDPR 和《个人信息保护法》，隐私政策弹窗首次启动即展示。


### 模块一：月度预算设置

**功能描述：** 每月初（或任意时间）用户可设定本月计划消费总额。设定预算相当于给招财猫管家分配“本月粮饷”，它会据此帮你规划。

| 字段 | 说明 |
|------|------|
| 月度预算金额 | 用户手动输入，单位：元；支持快捷填入常用预算（如 3000/5000/8000） |
| 预算周期 | 自然月（1 号 ~ 月末） |
| 修改权限 | 月中可修改，修改后重新计算剩余可用，猫咪会跳出对话“主人调整预算啦，让我重新算算～” |

**交互流程：**  
1. 首次进入当月，弹窗展示一只招手小猫，文案：“主人，请给我本月的生活费预算吧！” 输入金额，点击“交给猫咪”。  
2. 预算设置完成，小猫抱着金币袋跳回主页。  
3. 修改预算时，进入设置页调整，确认后碗中食物量动态变化。

**视觉反馈：**  
- 预算条设计为猫粮碗，满碗为预算总额，已消费部分变成空缺，展示剩余“猫粮”。  
- 顶部进度条为猫碗形状，动态显示百分比。


### 模块二：每日消费记录

**功能描述：** 用户点击日历中的某一天，进入当日消费明细页，按时间线展示每笔消费。记账时模拟“给猫咪投喂金币”的趣味操作。

#### 2.1 消费条目字段

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| 消费时间 | 时间选择器 | 是 | 精确到分钟，默认当前时间 |
| 消费项目 | 文本输入 | 是 | 如“早餐-包子豆浆”，支持常用模板快捷填入 |
| 消费金额 | 数字输入 | 是 | 单位：元，小数点后两位；支持计算器输入 |
| 消费分类 | 图标化选择 | 否 | 猫咪主题分类：<br>🐟 餐饮、🚗 交通、🛍 购物、🎮 娱乐、🐾 其他 |
| 备注 | 文本输入 | 否 | 可加照片（如小票拍照） |

**快捷记账优化：**  
- 长按主页“+”按钮可触发语音记账：“早餐花了8块” → 自动识别分类与金额。  
- 支持复制昨日消费记录，一键微调。  
- 常用消费可收藏为模板，一键添加。  
- 下拉“添加一笔”区域可快速选择最近常用分类和金额。

#### 2.2 每日明细页展示

```
┌─────────────────────────────────────┐
│  ← 2026年5月16日（周六）   🐱       │
├─────────────────────────────────────┤
│                                     │
│  🕗 08:30  🐟 早餐 - 包子豆浆  ¥8.00│
│  🕙 10:15  🐟 咖啡 - 美式     ¥18.00│
│  🕛 12:00  🐟 午餐 - 黄焖鸡   ¥25.00│
│  🕐 13:30  🐟 奶茶 - 杨枝甘露 ¥15.00│
│  🕕 18:30  🐟 晚餐 - 火锅     ¥86.00│
│  🕘 21:00  🐟 水果 - 西瓜草莓 ¥22.00│
│                                     │
├─────────────────────────────────────┤
│  今日投喂猫咪：¥174.00 🪙          │
├─────────────────────────────────────┤
│     [ + 快速记一笔 ]   [模板]       │
└─────────────────────────────────────┘
```

每笔消费左侧显示对应分类的猫咪小图标，增加辨识度。

#### 2.3 添加消费的动效
- 点击“添加一笔”后，一枚金币从上方落入猫咪存钱罐，伴随“叮”声和猫叫。  
- 若当日累计消费超过建议额度，存钱罐出现裂缝动画，猫咪委屈脸。  
- 编辑或删除消费时，猫咪做出相应反应（如删除时金币飞走，猫猫疑惑）。


### 模块三：每日结算卡片 & 智能建议

**功能描述：** 每天结束时（或用户主动查看），猫咪管家呈上当日结算报告，并用“猫语”给出明日建议。

#### 3.1 结算信息展示

```
┌─────────────────────────────────────┐
│      🐱 猫咪管家汇报                 │
├─────────────────────────────────────┤
│                                     │
│   🎯 本月粮饷预算       ¥5,000.00   │
│   📉 本月已投喂猫咪     ¥2,340.00   │
│   📆 今日投喂             ¥174.00   │
│                                     │
│  ─────────────────────────────      │
│                                     │
│   🍖 剩余猫粮           ¥2,660.00   │
│   ⏳ 距离发粮日还有       14 天      │
│                                     │
├─────────────────────────────────────┤
│        💬 招财猫的建议               │
├─────────────────────────────────────┤
│                                     │
│    “主人，接下来每天花 ¥190.00，   │
│     我们就不会饿肚子哦~ 喵！”      │
│                                     │
│   📊 消费节奏：有点快喵！           │
│   (日均 ¥167.14，计划 ¥161.00)      │
│                                     │
│        [🍖投喂小鱼干鼓励猫咪]        │
└─────────────────────────────────────┘
```

#### 3.2 智能建议算法

```
每日建议额度 = 剩余可用预算 ÷ 本月剩余天数（含今天）
```

**预算状态与猫咪反应：**

| 状态 | 条件 | 猫咪表情 | 颜色 | 对话示例 |
|------|------|----------|------|----------|
| 节奏良好 | 实际日均 ≤ 计划日均 | 😸 招财猫大笑 | 绿色 | “主人真棒！我们是省钱达人喵~” |
| 节奏偏快 | 实际日均 > 计划日均 且 < 计划日均×1.3 | 😐 猫咪挠头 | 橙色 | “唔…稍微花快了一点点，要注意哦” |
| 严重超支 | 实际日均 ≥ 计划日均×1.3 | 🙀 炸毛流泪 | 红色 | “呜哇！猫粮快见底了！主人救救我！” |

点击“投喂小鱼干”可触发动画：小鱼干落入猫碗，随机弹出省钱小贴士。


### 模块四：月度日历主页（招财猫之家）

**功能描述：** 以猫咪主题日历展示当月每天的消费概况，并住着一只动态招财猫，是整个 App 的中心。

#### 4.1 日历视图

```
┌─────────────────────────────────────┐
│  ←  2026年5月  →        🐱 握手猫   │
│  🎯预算:¥5,000  已喂:¥2,340  🍖60%  │
├─────────────────────────────────────┤
│  一    二    三    四    五   六  日  │
│                    1     2    3   4  │
│                  🪙120 🪙85 🪙200 🪙55│
│  5     6     7    8     9   10  11  │
│ 🪙130 🪙95 🪙180 🪙60 🪙145🪙220🪙88│
│  12   13    14   15    16   17  18  │
│ 🪙110 🪙75 🪙200 🪙158🪙174  -   -  │
│  ...                                │
├─────────────────────────────────────┤
│  🍖剩余：¥2,660 | 💬建议：¥190/天   │
└─────────────────────────────────────┘
```
- 每日金额用金币图标 🪙 + 数字展示，无消费则显示猫爪印 🐾（表示当日暂无投喂）。  
- 顶部进度条为猫碗形状，已消费部分猫粮减少，动态显示百分比。  
- 背景随消费节奏改变色调：绿色良好，暖橙偏快，淡红超支。  
- 左右滑动切换月份，猫咪会转身切换月份牌。

#### 4.2 招财猫互动
- 主页常驻一只根据预算状态变化表情的招财猫。猫会随机招手、打哈欠、舔毛。  
- **点击猫咪**：弹出今日结算卡片（模块三）。  
- **长按猫咪**：进入“猫咪装扮”页，可用记账获得的“小鱼干”兑换猫的项圈、帽子、背景等（V1.1 成就系统）。  
- **摇晃手机**：猫咪做出被吓一跳的动画，并掉落一枚金币（彩蛋）。

#### 4.3 快捷操作
- 右下角悬浮“+金币”按钮，点击直接进入当日记账页。  
- 支持 3D Touch / 长按快捷菜单：记一笔、查看今日结算、语音记账。  
- 桌面小组件（iOS/Android）：展示猫咪和当日建议额度，一键跳转记账。


### 模块五：我的猫咪（情感化激励）

**功能描述：**  
每坚持记账、控制消费，会获得“小鱼干”奖励；小鱼干可用来换取猫咪配饰，或者解锁不同品种猫咪（橘猫、英短、布偶等）。猫咪会对用户记账习惯做出反馈，比如连续 7 天记账解锁“自律猫”徽章，猫咪戴上领结。

**V1.0 基础实现：**  
- 每日首次记账获得 1 条小鱼干。  
- 当日消费不超过建议额度，额外奖励 1 条小鱼干。  
- 每月全勤记账，猫咪会“进化”一次外观（换个颜色/加个铃铛）。  
- 成就墙展示简单里程碑（首次设置预算、连续 7 天记账等）。

**V1.1 扩展（进阶养成）：**  
- 猫咪装扮商店：使用小鱼干兑换帽子、项圈、眼镜、背景。  
- 多猫品种解锁：达到一定记账天数或成就可解锁新品种。  
- 猫咪心情日记：每日生成一条猫咪对消费的“吐槽”。


## 三、全局视觉与主题规范

| 元素 | 设计方向 |
|------|----------|
| 主色调 | 暖金色（#FFB347）与米白，辅以猫爪粉（#FFB6C1） |
| 字体 | 圆体 / 卡通体，凸显亲切感 |
| 图标 | 全部采用猫咪相关元素：猫爪、金币、鱼骨、猫碗 |
| 动效 | 金币投喂、猫碗进度、猫咪表情变化，轻量不打扰 |
| 音效 | 猫叫声“喵~”、金币叮当声、碗响（可关闭） |
| 空状态 | 一只睡觉的猫，文案“今天还没投喂我呢~” |
| 加载 | 猫爪印逐个出现，形成一串 |
| 暗黑模式 | 猫咪变成黑猫造型，背景深蓝，金币发光 |
| 无障碍 | 支持 VoiceOver 朗读，重要元素均有文本替代 |


## 四、页面流程图

```
         ┌─────────┐
         │  启动页  │ (猫爪开屏动画)
         └────┬────┘
              ▼
      ┌───────────────┐     ┌─────────────┐
      │  欢迎/登录页   │←───│ 设置/账户管理│
      └───┬───┬───┬───┘     └─────────────┘
          │   │   │
   游客进入│   │   │登录/注册
          ▼   │   ▼
  ┌───────────────┐
  │ 月度日历主页   │← 招财猫常驻，核心枢纽
  └───┬───┬───┬───┘
      │   │   │
 点击日期│   │   │点击猫咪/结算卡片
      ▼   │   ▼
┌──────────┐│ ┌──────────────┐
│每日明细页 ││ │每日结算卡片   │
└────┬─────┘│ └──────────────┘
     │      │
 添加/编辑 │ 左右滑动切换月份
 消费记录  │
     │      │
     ▼      ▼
┌──────────┐ ┌──────────────┐
│ 记账表单  │ │ 设置月度预算  │
└──────────┘ └──────────────┘
     │
 快捷模板/语音

设置页可进入：账户信息、猫咪装扮、成就墙、数据导出、隐私设置等。
```


## 五、数据模型设计

### 5.1 用户表（user）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT / UUID | 主键 |
| account_type | VARCHAR(20) | 游客/手机/微信/Apple |
| mobile | VARCHAR(20) | 手机号（可选） |
| email | VARCHAR(100) | 邮箱（可选） |
| wechat_unionid | VARCHAR(64) | 微信 UnionID |
| apple_user_id | VARCHAR(64) | Apple 用户 ID |
| nickname | VARCHAR(50) | 昵称，默认“铲屎官” |
| avatar_url | VARCHAR(255) | 头像 URL |
| created_at | DATETIME | 注册时间 |
| last_login_at | DATETIME | 最后登录时间 |
| is_member | TINYINT | 是否为会员（预留） |

### 5.2 月度预算表（monthly_budget）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT | 主键 |
| user_id | INT | 关联用户 |
| year_month | VARCHAR(7) | 如 "2026-05" |
| budget_amount | DECIMAL(10,2) | 预算金额 |
| created_at | DATETIME | 创建时间 |
| updated_at | DATETIME | 修改时间 |

### 5.3 消费记录表（expense_record）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT | 主键 |
| user_id | INT | 关联用户 |
| expense_date | DATE | 消费日期 |
| expense_time | TIME | 消费时间 |
| item_name | VARCHAR(100) | 消费项目名称 |
| amount | DECIMAL(10,2) | 消费金额 |
| category | VARCHAR(20) | 分类代码 |
| remark | VARCHAR(200) | 备注 |
| photo_url | VARCHAR(255) | 可选，票据照片 |
| is_template | TINYINT | 是否为模板记录 |
| created_at | DATETIME | 创建时间 |

### 5.4 猫咪状态表（cat_status）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT | 主键 |
| user_id | INT | 关联用户，唯一 |
| cat_name | VARCHAR(50) | 猫咪名称，默认“招财” |
| breed | VARCHAR(50) | 品种，默认“橘猫” |
| current_fish | INT | 当前小鱼干数量 |
| current_level | INT | 等级（连续记账天数） |
| current_accessory | VARCHAR(100) | 佩戴饰品 ID 列表 |
| last_checkin_date | DATE | 最后签到日期 |

### 5.5 成就记录表（achievement）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT | 主键 |
| user_id | INT | 关联用户 |
| achievement_key | VARCHAR(50) | 成就标识 |
| unlocked_at | DATETIME | 解锁时间 |

### 5.6 同步元数据表（sync_meta）

| 字段 | 类型 | 说明 |
|------|------|------|
| user_id | INT | 用户 ID |
| last_sync_time | DATETIME | 最后同步时间 |
| device_id | VARCHAR(100) | 设备标识 |
| sync_version | INT | 同步版本号 |


## 六、非功能性需求

| 维度 | 要求 |
|------|------|
| 数据存储 | SQLite 本地优先，支持 iCloud / 自建云同步（V1.1 起） |
| 离线可用 | 完全离线记账，联网后同步 |
| 性能 | 页面加载 < 800ms，记录保存 < 300ms |
| 安全 | 支持面容 / 指纹解锁进入 App（可选）；网络传输 AES-256 加密；云端数据脱敏 |
| 平台 | iOS 14+，Android 10+（Flutter 实现） |
| 主题适配 | 支持浅色 / 深色模式，猫咪皮肤自动适配 |
| 国际化 | 中文简 / 繁，后续增加英文 |
| 无障碍 | 支持 VoiceOver，所有图标配有文本描述 |
| 兼容性 | 全面屏、折叠屏适配，小组件支持 iOS Widget 和 Android AppWidget |


## 七、版本规划

| 版本 | 功能范围 | 优先级 |
|------|----------|--------|
| V1.0 招财初遇 | 游客模式；月预算设置+每日记账（含快捷模板）；每日结算卡片+智能建议；猫咪基础互动（表情/动画）；基础成就；桌面小组件 | P0 |
| V1.1 猫咪养成 | 手机号/微信/Apple 登录注册；云端同步（手动）；分类统计图表（猫爪饼图/鱼骨趋势图）；猫咪装扮商店；成就系统完善；数据导出 | P0 |
| V1.2 多猫同步 | 多账本支持；多设备自动同步；周期账单（订阅提醒）；账单拍照 OCR；预算自定义周期 | P1 |
| V1.3 智能进阶 | 语音记账 AI 优化；消费预测；智能省钱建议；年预算 | P2 |
| V2.0 猫村社区 | 家庭共享账本；记账挑战赛；猫咪社交（比谁家猫更省钱）；会员体系 | P2 |

**说明：** V1.0 无需登录，但后端账户服务需提前部署，确保 V1.1 快速接入。


## 八、验收标准

1. **预算设置**：用户可设置并修改月度预算，猫咪管家正确展示预算进度与表情。  
2. **记账功能**：用户可按时间线添加每笔消费，包含时间、项目、金额、猫咪分类；支持快捷模板和语音输入。  
3. **每日明细**：点击日历上任一日期可查看当日所有消费明细及总“投喂金币”数。  
4. **结算卡片**：每日结算卡片正确显示：今日消费、本月已消费、剩余预算、剩余天数，并给出猫咪口吻的建议。  
5. **智能算法**：建议额度 = 剩余预算 / 剩余天数（含当天），并按照规则正确判定预算节奏（良好/偏快/严重超支）。  
6. **日历主页**：日历每日显示消费金币数，无消费显示猫爪印；预算进度用猫碗可视化；猫咪表情与消费状态联动。  
7. **猫咪互动**：点击猫咪看结算，添加消费有金币投喂动画；不同预算状态对应不同猫咪表情和对话。  
8. **主题风格**：所有页面遵循猫咪主题设计规范，无风格不一致元素。  
9. **离线性能**：离线可用，记录保存与加载时间满足指标（保存<300ms）。  
10. **用户系统**：  
    - 新用户首次打开 App 可立即进入游客模式记账，无任何登录强阻断。  
    - 游客登录账户后，本地猫咪状态和记账数据完整迁移，不丢失。  
    - 手机号/微信/Apple 登录均能正常调起，验证码下发 5 秒内到达。  
    - 同一账户在多台设备登录，猫咪数据保持一致。  
    - 退出登录后本地数据保留，游客可继续使用；重新登录后数据合并无冲突。  
    - 账户注销后，云端数据在 7 天内彻底清除，本地数据可保留或删除由用户选择。  
11. **稳定性**：应用内无闪退、数据丢失等严重缺陷，通过基础崩溃率测试。  

---

**附录：猫咪对话/提示语素材库（节选）**
- 设置预算：“主人，把本月的猫粮交给我保管吧！”  
- 超支：“喵？！金币全飞走了！接下来得吃土了…呜…”  
- 连续记账 7 天：“主人已经连续一周没饿着我了，奖励你摸摸我的头～”  
- 修改预算：“咦？换猫粮品牌了吗？让我重新算算…”  
- 删除记录：“这枚金币要消失了，你确定吗？喵~”  


ui图请按照这个样式开发：<html lang="zh-CN">

<head>
  <meta charset="utf-8">
  <meta content="width=device-width, initial-scale=1.0" name="viewport">
  <title>招财喵记账 - 治愈系记账APP</title>
  <!-- Tailwind CSS (本地) -->
  <script src="https://modao.cc/agent-py/static/source/js/tailwindcss.js"></script>
  <!-- Iconify图标 -->
  <script src="https://modao.cc/agent-py/static/source/js/iconify-icon.min.js"></script>
  <!-- ECharts (本地) -->
  <script src="https://modao.cc/agent-py/static/source/js/echarts.min.js"></script>
  <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&amp;display=swap" rel="stylesheet">
  <style>
    body {
      font-family: 'Nunito', 'PingFang SC', 'HarmonyOS Sans', sans-serif;
      background-color: #F3F4F6;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      margin: 0;
      overflow: hidden;
    }

    #app-container {
      width: 375px;
      height: 667px;
      background-color: #FFF8F0;
      position: relative;
      overflow: hidden;
      border-radius: 40px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      border: 8px solid #4A3728;
    }

    .page {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: none;
      flex-direction: column;
      animation: fadeIn 0.4s ease-out forwards;
    }

    .page.active {
      display: flex;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: scale(0.98);
      }

      to {
        opacity: 1;
        transform: scale(1);
      }
    }

    .btn-active:active {
      transform: scale(0.95);
    }

    .cat-float {
      animation: floating 3s ease-in-out infinite;
    }

    @keyframes floating {

      0%,
      100% {
        transform: translateY(0);
      }

      50% {
        transform: translateY(-10px);
      }
    }

    .paw-print {
      position: absolute;
      opacity: 0.1;
      z-index: 0;
    }

    /* 隐藏滚动条 */
    .no-scrollbar::-webkit-scrollbar {
      display: none;
    }

    .no-scrollbar {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }

    /* 招财猫光晕 */
    .glow {
      box-shadow: 0 0 30px #F6C445;
    }

    /* 底部导航栏样式 */
    .nav-bar {
      position: absolute;
      bottom: 0;
      width: 100%;
      height: 70px;
      background: white;
      display: flex;
      justify-content: space-around;
      align-items: center;
      border-top: 1px solid #F3F4F6;
      padding-bottom: 10px;
      z-index: 50;
    }

    .nav-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      color: #9CA3AF;
      font-size: 10px;
    }

    .nav-item.active {
      color: #F6C445;
    }

    .add-btn {
      width: 56px;
      height: 56px;
      background: #F472B6;
      border-radius: 28px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: white;
      box-shadow: 0 4px 10px rgba(244, 114, 182, 0.4);
      margin-top: -35px;
      border: 4px solid white;
    }
  </style>
</head>

<body>
  <div id="app-container">
    <!-- 1. 开屏启动页 -->
    <div class="page active bg-gradient-to-b from-[#F6C445] to-[#FBBF24] items-center justify-center" id="page-splash">
      <div class="relative">
        <div class="w-40 h-40 bg-white/20 rounded-full absolute -top-4 -left-4 animate-ping"></div>
        <div class="w-32 h-32 bg-white rounded-full flex items-center justify-center glow cat-float">
          <iconify-icon class="text-7xl" icon="emojione:cat-face"></iconify-icon>
        </div>
      </div>
      <h1 class="mt-8 text-3xl font-extrabold text-[#4A3728] tracking-widest">招财喵记账</h1>
      <p class="mt-2 text-[#4A3728]/70 font-medium">让记账像撸猫一样治愈</p>
      <div class="absolute bottom-12 flex flex-col items-center">
        <div class="flex space-x-2 mb-4">
          <iconify-icon class="text-[#4A3728] animate-bounce" icon="mdi:paw"></iconify-icon>
          <iconify-icon class="text-[#4A3728] animate-bounce delay-75" icon="mdi:paw"></iconify-icon>
          <iconify-icon class="text-[#4A3728] animate-bounce delay-150" icon="mdi:paw"></iconify-icon>
        </div>
        <button class="px-6 py-2 bg-[#4A3728] text-white rounded-full text-sm font-bold btn-active" onclick="switchPage('welcome')">立即开始喵~</button>
      </div>
    </div>
    <!-- 2. 欢迎登录注册页 -->
    <div class="page bg-[#FFF8F0] px-6 py-10" id="page-welcome">
      <div class="flex justify-center mb-8">
        <img alt="Welcome Illustration" class="w-48 h-48 rounded-3xl object-cover shadow-lg" src="https://modao.cc/agent-py/media/generated_images/2026-05-17/9382e92f8d4c40038307c1bb249293ba.jpg">
      </div>
      <div class="bg-white rounded-[32px] p-6 shadow-sm border border-[#F6C445]/20">
        <div class="flex border-b border-gray-100 mb-6">
          <button class="flex-1 pb-3 text-lg font-bold text-[#F6C445] border-b-2 border-[#F6C445]">登录</button>
          <button class="flex-1 pb-3 text-lg font-bold text-gray-400">注册</button>
        </div>
        <div class="space-y-4">
          <div class="bg-gray-50 rounded-2xl p-4 flex items-center">
            <iconify-icon class="text-gray-400 text-xl mr-3" icon="mdi:phone-outline"></iconify-icon>
            <input class="bg-transparent outline-none w-full text-[#4A3728]" placeholder="输入手机号" type="text">
          </div>
          <div class="bg-gray-50 rounded-2xl p-4 flex items-center">
            <iconify-icon class="text-gray-400 text-xl mr-3" icon="mdi:lock-outline"></iconify-icon>
            <input class="bg-transparent outline-none w-full text-[#4A3728]" placeholder="输入密码" type="password">
          </div>
          <button class="w-full py-4 bg-[#F472B6] text-white rounded-full font-bold text-lg shadow-md btn-active flex items-center justify-center space-x-2" onclick="switchPage('home')">
            <iconify-icon icon="mdi:paw"></iconify-icon>
            <span>猫爪登录</span>
          </button>
        </div>
        <div class="mt-6 text-center">
          <button class="text-gray-400 text-sm underline" onclick="switchPage('guest')">先以游客身份逛逛喵~</button>
        </div>
      </div>
    </div>
    <!-- 3. 游客体验页 -->
    <div class="page bg-gradient-to-br from-[#FB923C]/10 to-[#F6C445]/10 p-6 items-center" id="page-guest">
      <div class="mt-12 text-center">
        <iconify-icon class="text-8xl mb-4 cat-float" icon="noto:smiling-cat-with-heart-eyes"></iconify-icon>
        <h2 class="text-2xl font-bold text-[#4A3728]">先逛逛吧～</h2>
        <p class="text-gray-500 mt-2">数据支持随时同步到云端</p>
      </div>
      <div class="mt-8 w-full space-y-4">
        <div class="bg-white p-4 rounded-2xl shadow-sm border-l-4 border-[#34D399] flex justify-between items-center">
          <div class="flex items-center">
            <div class="w-10 h-10 bg-[#34D399]/10 rounded-full flex items-center justify-center text-xl mr-3">🍔</div>
            <div>
              <div class="font-bold text-[#4A3728]">午餐</div>
              <div class="text-xs text-gray-400">今天 12:30</div>
            </div>
          </div>
          <div class="font-bold text-[#4A3728]">- ¥25.00</div>
        </div>
        <div class="bg-white p-4 rounded-2xl shadow-sm border-l-4 border-[#F472B6] flex justify-between items-center opacity-70">
          <div class="flex items-center">
            <div class="w-10 h-10 bg-[#F472B6]/10 rounded-full flex items-center justify-center text-xl mr-3">🛍</div>
            <div>
              <div class="font-bold text-[#4A3728]">猫罐头</div>
              <div class="text-xs text-gray-400">昨天 18:20</div>
            </div>
          </div>
          <div class="font-bold text-[#4A3728]">- ¥88.00</div>
        </div>
      </div>
      <button class="mt-12 w-full py-4 bg-[#F472B6] text-white rounded-full font-bold text-lg shadow-lg btn-active" onclick="switchPage('home')">立即体验</button>
      <p class="mt-4 text-xs text-gray-400">登录后可同步数据并解锁更多装扮</p>
    </div>
    <!-- 4. 核心主页 (月度日历) -->
    <div class="page bg-[#FFF8F0]" id="page-home">
      <!-- 顶部 -->
      <div class="px-6 pt-10 pb-4 flex justify-between items-center">
        <div class="flex items-center space-x-2">
          <span class="text-2xl font-black text-[#4A3728]">5月</span>
          <iconify-icon class="text-[#4A3728]" icon="mdi:chevron-down"></iconify-icon>
        </div>
        <div class="w-10 h-10 rounded-full border-2 border-[#F6C445] overflow-hidden btn-active" onclick="switchPage('profile')">
          <img alt="User Avatar" class="w-full h-full object-cover" src="https://modao.cc/agent-py/media/generated_images/2026-05-17/274b3434a0684468a5ad39de0fe92f76.jpg">
        </div>
      </div>
      <!-- 猫碗预算进度 -->
      <div class="px-6 mb-4">
        <div class="bg-white rounded-[24px] p-5 shadow-sm relative overflow-hidden" id="budget-card">
          <div class="flex justify-between items-end mb-2">
            <div>
              <div class="text-xs text-gray-400 mb-1">本月已花</div>
              <div class="text-2xl font-black text-[#4A3728]">¥ 1,280.50</div>
            </div>
            <div class="text-right">
              <div class="text-xs text-gray-400 mb-1">预算剩余</div>
              <div class="text-sm font-bold text-[#34D399]">¥ 2,719.50</div>
            </div>
          </div>
          <!-- 猫碗进度条 -->
          <div class="relative h-4 bg-gray-100 rounded-full overflow-hidden">
            <div class="absolute top-0 left-0 h-full bg-[#34D399] transition-all duration-500" id="budget-progress" style="width: 32%"></div>
          </div>
          <div class="mt-3 flex items-center justify-between">
            <div class="flex items-center space-x-1">
              <iconify-icon class="text-xl" icon="noto:smiling-cat-with-open-mouth" id="cat-status-icon"></iconify-icon>
              <span class="text-xs text-gray-500" id="cat-status-text">猫猫很开心，继续保持喵~</span>
            </div>
            <button class="text-[10px] bg-[#F6C445]/10 text-[#F6C445] px-2 py-1 rounded-full font-bold" onclick="switchPage('budget')">调整预算</button>
          </div>
          <!-- 状态切换模拟 (仅演示用) -->
          <div class="absolute top-2 right-2 flex space-x-1">
            <div class="w-2 h-2 rounded-full bg-[#34D399] cursor-pointer" onclick="updateBudgetState('normal')"></div>
            <div class="w-2 h-2 rounded-full bg-[#FB923C] cursor-pointer" onclick="updateBudgetState('warning')"></div>
            <div class="w-2 h-2 rounded-full bg-[#EF4444] cursor-pointer" onclick="updateBudgetState('danger')"></div>
          </div>
        </div>
      </div>
      <!-- 日历主体 -->
      <div class="px-4 flex-1 overflow-y-auto no-scrollbar">
        <div class="bg-white rounded-[24px] p-4 shadow-sm">
          <div class="grid grid-cols-7 gap-1 text-center mb-2">
            <div class="text-[10px] text-gray-400 font-bold">日</div>
            <div class="text-[10px] text-gray-400 font-bold">一</div>
            <div class="text-[10px] text-gray-400 font-bold">二</div>
            <div class="text-[10px] text-gray-400 font-bold">三</div>
            <div class="text-[10px] text-gray-400 font-bold">四</div>
            <div class="text-[10px] text-gray-400 font-bold">五</div>
            <div class="text-[10px] text-gray-400 font-bold">六</div>
          </div>
          <div class="grid grid-cols-7 gap-y-3">
            <!-- 简易日历填充 -->
            <div class="h-10 flex flex-col items-center justify-center opacity-20 text-xs">26</div>
            <div class="h-10 flex flex-col items-center justify-center opacity-20 text-xs">27</div>
            <div class="h-10 flex flex-col items-center justify-center opacity-20 text-xs">28</div>
            <div class="h-10 flex flex-col items-center justify-center opacity-20 text-xs">29</div>
            <div class="h-10 flex flex-col items-center justify-center opacity-20 text-xs">30</div>
            <div class="h-10 flex flex-col items-center justify-center text-xs font-bold">1<span class="text-[8px] text-[#EF4444] mt-0.5">25</span></div>
            <div class="h-10 flex flex-col items-center justify-center text-xs font-bold">2<span class="text-[8px] text-[#EF4444] mt-0.5">12</span></div>
            <!-- 今日高亮 -->
            <div class="h-10 flex flex-col items-center justify-center text-xs font-bold relative">
              <div class="absolute -top-1 -right-1">🐾</div>
              <div class="w-8 h-8 bg-[#F6C445] rounded-lg flex items-center justify-center text-white">17</div>
              <span class="text-[8px] text-[#EF4444] mt-0.5">88</span>
            </div>
            <!-- 更多日期... -->
            <script>
              for (let i = 18; i <= 31; i++) {
                document.write(`<div class="h-10 flex flex-col items-center justify-center text-xs font-bold">${i}</div>`);
              }
            </script>
          </div>
        </div>
        <!-- 快捷入口 -->
        <div class="grid grid-cols-2 gap-4 mt-4 mb-20">
          <div class="bg-[#34D399]/10 p-4 rounded-2xl flex items-center space-x-3 btn-active" onclick="switchPage('timeline')">
            <div class="text-2xl">📝</div>
            <div>
              <div class="font-bold text-[#4A3728] text-sm">收支明细</div>
              <div class="text-[10px] text-gray-500">查看每一笔</div>
            </div>
          </div>
          <div class="bg-[#F472B6]/10 p-4 rounded-2xl flex items-center space-x-3 btn-active" onclick="switchPage('stats')">
            <div class="text-2xl">📊</div>
            <div>
              <div class="font-bold text-[#4A3728] text-sm">数据分析</div>
              <div class="text-[10px] text-gray-500">钱都花哪了</div>
            </div>
          </div>
        </div>
      </div>
      <!-- 悬浮招财猫 -->
      <div class="absolute bottom-24 right-4 z-40 group">
        <div class="bg-white p-2 rounded-2xl shadow-lg border border-[#F6C445] flex flex-col items-center cat-float cursor-pointer">
          <iconify-icon class="text-4xl" icon="noto:smiling-cat-with-open-mouth" id="home-floating-cat"></iconify-icon>
          <div class="absolute -top-12 right-0 bg-white px-3 py-1 rounded-xl shadow-sm border border-gray-100 text-[10px] w-24 opacity-0 group-hover:opacity-100 transition-opacity">
            点我记账喵，今天也要省钱哦！
          </div>
        </div>
      </div>
      <!-- 底部导航 -->
      <div class="nav-bar">
        <div class="nav-item active">
          <iconify-icon class="text-2xl" icon="mdi:calendar-month"></iconify-icon>
          <span>首页</span>
        </div>
        <div class="nav-item" onclick="switchPage('stats')">
          <iconify-icon class="text-2xl" icon="mdi:chart-pie"></iconify-icon>
          <span>统计</span>
        </div>
        <div class="add-btn btn-active" onclick="switchPage('add')">
          <iconify-icon class="text-3xl" icon="mdi:plus"></iconify-icon>
        </div>
        <div class="nav-item" onclick="switchPage('timeline')">
          <iconify-icon class="text-2xl" icon="mdi:format-list-bulleted"></iconify-icon>
          <span>明细</span>
        </div>
        <div class="nav-item" onclick="switchPage('profile')">
          <iconify-icon class="text-2xl" icon="mdi:account"></iconify-icon>
          <span>我的</span>
        </div>
      </div>
    </div>
    <!-- 5. 预算设置页 -->
    <div class="page bg-[#FFF8F0] p-6" id="page-budget">
      <div class="flex items-center mb-8">
        <button class="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm btn-active" onclick="switchPage('home')">
          <iconify-icon class="text-2xl" icon="mdi:chevron-left"></iconify-icon>
        </button>
        <h2 class="flex-1 text-center text-xl font-bold text-[#4A3728]">月度预算</h2>
        <div class="w-10"></div>
      </div>
      <div class="bg-white rounded-[32px] p-8 shadow-sm text-center">
        <div class="inline-block p-4 bg-[#F6C445]/10 rounded-full mb-4">
          <iconify-icon class="text-5xl" icon="noto:money-bag"></iconify-icon>
        </div>
        <div class="text-gray-400 text-sm mb-1">设置本月总预算</div>
        <div class="text-4xl font-black text-[#4A3728] mb-6">¥ 4,000</div>
        <input class="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#F6C445]" max="10000" min="500" step="100" type="range" value="4000">
        <div class="flex justify-between mt-2 text-xs text-gray-400">
          <span>¥500</span>
          <span>¥10,000</span>
        </div>
      </div>
      <div class="mt-6 space-y-4">
        <div class="bg-white p-4 rounded-2xl flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <span class="text-xl">🍔</span>
            <span class="font-bold text-[#4A3728]">餐饮预算</span>
          </div>
          <div class="flex items-center space-x-2">
            <span class="text-sm font-bold">¥1,500</span>
            <iconify-icon class="text-[#F6C445]" icon="mdi:paw"></iconify-icon>
          </div>
        </div>
        <div class="bg-white p-4 rounded-2xl flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <span class="text-xl">🛍</span>
            <span class="font-bold text-[#4A3728]">购物预算</span>
          </div>
          <div class="flex items-center space-x-2">
            <span class="text-sm font-bold">¥1,000</span>
            <iconify-icon class="text-[#F6C445]" icon="mdi:paw"></iconify-icon>
          </div>
        </div>
      </div>
      <button class="mt-auto mb-4 w-full py-4 bg-[#F6C445] text-white rounded-full font-bold text-lg shadow-lg btn-active" onclick="switchPage('home')">保存喵～</button>
    </div>
    <!-- 6. 每日明细时间轴页 -->
    <div class="page bg-[#FFF8F0]" id="page-timeline">
      <div class="px-6 pt-10 pb-4 flex items-center">
        <button class="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm btn-active" onclick="switchPage('home')">
          <iconify-icon class="text-2xl" icon="mdi:chevron-left"></iconify-icon>
        </button>
        <h2 class="flex-1 text-center text-xl font-bold text-[#4A3728]">记账明细</h2>
        <button class="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm btn-active">
          <iconify-icon class="text-xl" icon="mdi:magnify"></iconify-icon>
        </button>
      </div>
      <div class="flex-1 overflow-y-auto px-6 py-4 no-scrollbar">
        <!-- 日期分组 -->
        <div class="mb-6 relative">
          <div class="flex items-center space-x-2 mb-4">
            <div class="bg-[#F6C445] text-white px-3 py-1 rounded-full text-xs font-bold">5月17日 今日</div>
            <div class="h-[1px] flex-1 bg-gray-100"></div>
          </div>
          <div class="space-y-4 pl-4 border-l-2 border-[#F6C445]/20 ml-2">
            <div class="bg-white p-4 rounded-2xl shadow-sm flex justify-between items-center relative">
              <div class="absolute -left-[23px] w-4 h-4 bg-[#F6C445] rounded-full border-4 border-[#FFF8F0]"></div>
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-[#34D399]/10 rounded-full flex items-center justify-center text-xl">🍔</div>
                <div>
                  <div class="font-bold text-[#4A3728]">午餐咖喱饭</div>
                  <div class="text-[10px] text-gray-400">12:30 · 微信支付</div>
                </div>
              </div>
              <div class="font-black text-[#4A3728]">-25.00</div>
            </div>
            <div class="bg-white p-4 rounded-2xl shadow-sm flex justify-between items-center relative">
              <div class="absolute -left-[23px] w-4 h-4 bg-[#F6C445] rounded-full border-4 border-[#FFF8F0]"></div>
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-[#FB923C]/10 rounded-full flex items-center justify-center text-xl">🚌</div>
                <div>
                  <div class="font-bold text-[#4A3728]">打车回家</div>
                  <div class="text-[10px] text-gray-400">09:15 · 支付宝</div>
                </div>
              </div>
              <div class="font-black text-[#4A3728]">-18.50</div>
            </div>
          </div>
        </div>
        <!-- 更多日期 -->
        <div class="mb-6 relative">
          <div class="flex items-center space-x-2 mb-4">
            <div class="bg-gray-200 text-gray-500 px-3 py-1 rounded-full text-xs font-bold">5月16日 昨天</div>
            <div class="h-[1px] flex-1 bg-gray-100"></div>
          </div>
          <div class="space-y-4 pl-4 border-l-2 border-gray-100 ml-2">
            <div class="bg-white p-4 rounded-2xl shadow-sm flex justify-between items-center relative opacity-80">
              <div class="absolute -left-[23px] w-4 h-4 bg-gray-200 rounded-full border-4 border-[#FFF8F0]"></div>
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-[#F472B6]/10 rounded-full flex items-center justify-center text-xl">🛍</div>
                <div>
                  <div class="font-bold text-[#4A3728]">猫咪玩具</div>
                  <div class="text-[10px] text-gray-400">18:20 · 银行卡</div>
                </div>
              </div>
              <div class="font-black text-[#4A3728]">-45.00</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 7. 新增记账表单页 -->
    <div class="page bg-[#FFF8F0]" id="page-add">
      <div class="px-6 pt-10 pb-4 flex items-center justify-between">
        <button class="text-gray-400 font-bold" onclick="switchPage('home')">取消</button>
        <div class="flex bg-gray-100 p-1 rounded-full">
          <button class="px-4 py-1 bg-white rounded-full text-xs font-bold shadow-sm">支出</button>
          <button class="px-4 py-1 text-xs font-bold text-gray-400">收入</button>
        </div>
        <button class="text-[#F6C445] font-bold" onclick="switchPage('home')">完成</button>
      </div>
      <div class="px-6 py-4">
        <div class="text-right mb-4">
          <div class="text-gray-400 text-xs mb-1">输入金额</div>
          <div class="text-5xl font-black text-[#4A3728]">¥ 0.00</div>
        </div>
        <div class="grid grid-cols-4 gap-4 mb-6">
          <div class="flex flex-col items-center space-y-1">
            <div class="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-sm border-2 border-[#F6C445]">🍔</div>
            <span class="text-[10px] font-bold text-[#4A3728]">餐饮</span>
          </div>
          <div class="flex flex-col items-center space-y-1">
            <div class="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-sm">🚌</div>
            <span class="text-[10px] font-bold text-gray-400">交通</span>
          </div>
          <div class="flex flex-col items-center space-y-1">
            <div class="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-sm">🛍</div>
            <span class="text-[10px] font-bold text-gray-400">购物</span>
          </div>
          <div class="flex flex-col items-center space-y-1">
            <div class="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-sm">🎮</div>
            <span class="text-[10px] font-bold text-gray-400">娱乐</span>
          </div>
          <div class="flex flex-col items-center space-y-1">
            <div class="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-sm">🏥</div>
            <span class="text-[10px] font-bold text-gray-400">医疗</span>
          </div>
          <div class="flex flex-col items-center space-y-1">
            <div class="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-sm">🏠</div>
            <span class="text-[10px] font-bold text-gray-400">住房</span>
          </div>
          <div class="flex flex-col items-center space-y-1">
            <div class="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-sm">🐟</div>
            <span class="text-[10px] font-bold text-gray-400">猫咪</span>
          </div>
          <div class="flex flex-col items-center space-y-1" onclick="switchPage('voice')">
            <div class="w-12 h-12 bg-[#F472B6]/10 rounded-2xl flex items-center justify-center text-2xl shadow-sm text-[#F472B6]">
              <iconify-icon icon="mdi:microphone"></iconify-icon>
            </div>
            <span class="text-[10px] font-bold text-[#F472B6]">语音</span>
          </div>
        </div>
        <div class="bg-white rounded-2xl p-4 mb-4 flex items-center space-x-3">
          <iconify-icon class="text-gray-400" icon="mdi:note-edit-outline"></iconify-icon>
          <input class="bg-transparent outline-none flex-1 text-sm" placeholder="写点备注喵..." type="text">
        </div>
        <!-- 数字键盘 -->
        <div class="grid grid-cols-4 gap-2">
          <button class="h-14 bg-white rounded-xl font-bold text-xl btn-active">1</button>
          <button class="h-14 bg-white rounded-xl font-bold text-xl btn-active">2</button>
          <button class="h-14 bg-white rounded-xl font-bold text-xl btn-active">3</button>
          <button class="h-14 bg-gray-100 rounded-xl font-bold text-xl btn-active text-gray-400">
            <iconify-icon icon="mdi:backspace-outline"></iconify-icon>
          </button>
          <button class="h-14 bg-white rounded-xl font-bold text-xl btn-active">4</button>
          <button class="h-14 bg-white rounded-xl font-bold text-xl btn-active">5</button>
          <button class="h-14 bg-white rounded-xl font-bold text-xl btn-active">6</button>
          <button class="h-14 bg-[#F6C445] text-white rounded-xl font-bold text-xl row-span-3 btn-active">记账<br>喵~</button>
          <button class="h-14 bg-white rounded-xl font-bold text-xl btn-active">7</button>
          <button class="h-14 bg-white rounded-xl font-bold text-xl btn-active">8</button>
          <button class="h-14 bg-white rounded-xl font-bold text-xl btn-active">9</button>
          <button class="h-14 bg-white rounded-xl font-bold text-xl btn-active">.</button>
          <button class="h-14 bg-white rounded-xl font-bold text-xl btn-active col-span-2">0</button>
          <button class="h-14 bg-white rounded-xl font-bold text-xl btn-active">
            <iconify-icon icon="mdi:calendar"></iconify-icon>
          </button>
        </div>
      </div>
    </div>
    <!-- 8. 语音快捷记账页 -->
    <div class="page bg-gradient-to-b from-[#FFF8F0] to-[#F472B6]/20 items-center justify-center p-6" id="page-voice">
      <button class="absolute top-10 left-6 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm" onclick="switchPage('add')">
        <iconify-icon class="text-xl" icon="mdi:close"></iconify-icon>
      </button>
      <div class="text-center mb-12">
        <div class="relative inline-block">
          <iconify-icon class="text-7xl cat-float" icon="noto:cat-face"></iconify-icon>
          <div class="absolute -right-2 -top-2 bg-white p-1 rounded-full shadow-sm">🐾</div>
        </div>
        <h2 class="text-xl font-bold text-[#4A3728] mt-4">请说话喵~</h2>
        <p class="text-gray-400 text-sm mt-1">例如：“中午吃饭花了35元”</p>
      </div>
      <div class="w-full bg-white/50 backdrop-blur-sm rounded-3xl p-6 mb-12 min-h-[100px] flex items-center justify-center text-center">
        <p class="text-[#4A3728] font-bold text-lg">“中午吃饭花了<span class="text-[#F472B6]">35</span>元”</p>
      </div>
      <!-- 录音波纹动画模拟 -->
      <div class="flex items-end justify-center space-x-1 h-12 mb-12">
        <div class="w-1 bg-[#F472B6] rounded-full animate-pulse h-4"></div>
        <div class="w-1 bg-[#F472B6] rounded-full animate-pulse h-8 delay-75"></div>
        <div class="w-1 bg-[#F472B6] rounded-full animate-pulse h-12 delay-150"></div>
        <div class="w-1 bg-[#F472B6] rounded-full animate-pulse h-6 delay-100"></div>
        <div class="w-1 bg-[#F472B6] rounded-full animate-pulse h-10 delay-200"></div>
      </div>
      <div class="w-24 h-24 bg-[#F472B6] rounded-full flex items-center justify-center shadow-lg shadow-[#F472B6]/40 btn-active border-8 border-white">
        <iconify-icon class="text-4xl text-white" icon="mdi:microphone"></iconify-icon>
      </div>
      <button class="mt-8 text-gray-500 font-bold" onclick="switchPage('add')">手动修改喵~</button>
    </div>
    <!-- 9. 每日结算汇报卡片 -->
    <div class="page bg-black/40 items-center justify-center p-6" id="page-report">
      <div class="bg-white rounded-[40px] w-full p-8 relative overflow-hidden">
        <div class="absolute top-0 right-0 w-32 h-32 bg-[#F6C445]/10 rounded-full -mr-16 -mt-16"></div>
        <div class="flex justify-center mb-6">
          <iconify-icon class="text-8xl" icon="noto:smiling-cat-with-heart-eyes"></iconify-icon>
        </div>
        <div class="bg-[#FFF8F0] rounded-2xl p-4 mb-6 relative">
          <div class="absolute -top-2 left-10 w-4 h-4 bg-[#FFF8F0] rotate-45"></div>
          <p class="text-[#4A3728] font-bold text-center">铲屎官，今天的账单算好啦喵！</p>
        </div>
        <div class="space-y-4 mb-8">
          <div class="flex justify-between items-center">
            <span class="text-gray-400">今日总支出</span>
            <span class="text-xl font-black text-[#4A3728]">¥ 43.50</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-gray-400">预算剩余</span>
            <span class="text-xl font-black text-[#34D399]">¥ 2,719.50</span>
          </div>
          <div class="h-[1px] bg-gray-100"></div>
          <p class="text-xs text-gray-500 leading-relaxed text-center italic">
            “今天省下了不少钱呢，奖励你一个小鱼干 🐟！”
          </p>
        </div>
        <button class="w-full py-4 bg-[#F6C445] text-white rounded-full font-bold text-lg shadow-lg btn-active" onclick="switchPage('home')">知道了喵～</button>
      </div>
    </div>
    <!-- 10. 统计分析页 -->
    <div class="page bg-[#FFF8F0]" id="page-stats">
      <div class="px-6 pt-10 pb-4 flex items-center">
        <button class="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm btn-active" onclick="switchPage('home')">
          <iconify-icon class="text-2xl" icon="mdi:chevron-left"></iconify-icon>
        </button>
        <h2 class="flex-1 text-center text-xl font-bold text-[#4A3728]">收支统计</h2>
        <div class="w-10"></div>
      </div>
      <div class="px-6 py-4 flex-1 overflow-y-auto no-scrollbar">
        <div class="flex bg-white p-1 rounded-full mb-6">
          <button class="flex-1 py-2 bg-[#F6C445] text-white rounded-full text-sm font-bold shadow-sm">周</button>
          <button class="flex-1 py-2 text-sm font-bold text-gray-400">月</button>
          <button class="flex-1 py-2 text-sm font-bold text-gray-400">年</button>
        </div>
        <div class="bg-white rounded-[32px] p-6 shadow-sm mb-6">
          <div class="text-center mb-4">
            <div class="text-xs text-gray-400">总支出</div>
            <div class="text-2xl font-black text-[#4A3728]">¥ 1,280.50</div>
          </div>
          <div class="w-full h-48" id="chart-pie"></div>
        </div>
        <div class="bg-white rounded-[32px] p-6 shadow-sm mb-6">
          <div class="flex justify-between items-center mb-4">
            <div class="font-bold text-[#4A3728]">消费趋势</div>
            <div class="text-[10px] text-gray-400">最近7天</div>
          </div>
          <div class="w-full h-40" id="chart-line"></div>
        </div>
        <div class="space-y-4 mb-20">
          <h3 class="font-bold text-[#4A3728] px-2">消费排行榜</h3>
          <div class="bg-white p-4 rounded-2xl flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <span class="text-xl">🍔</span>
              <span class="font-bold text-[#4A3728]">餐饮美食</span>
            </div>
            <div class="text-right">
              <div class="font-bold">¥ 650.00</div>
              <div class="text-[10px] text-gray-400">占比 50.7%</div>
            </div>
          </div>
        </div>
      </div>
      <!-- 底部导航 (复用) -->
      <div class="nav-bar">
        <div class="nav-item" onclick="switchPage('home')">
          <iconify-icon class="text-2xl" icon="mdi:calendar-month"></iconify-icon>
          <span>首页</span>
        </div>
        <div class="nav-item active">
          <iconify-icon class="text-2xl" icon="mdi:chart-pie"></iconify-icon>
          <span>统计</span>
        </div>
        <div class="add-btn btn-active" onclick="switchPage('add')">
          <iconify-icon class="text-3xl" icon="mdi:plus"></iconify-icon>
        </div>
        <div class="nav-item" onclick="switchPage('timeline')">
          <iconify-icon class="text-2xl" icon="mdi:format-list-bulleted"></iconify-icon>
          <span>明细</span>
        </div>
        <div class="nav-item" onclick="switchPage('profile')">
          <iconify-icon class="text-2xl" icon="mdi:account"></iconify-icon>
          <span>我的</span>
        </div>
      </div>
    </div>
    <!-- 11. 个人中心/猫咪养成页 -->
    <div class="page bg-[#FFF8F0]" id="page-profile">
      <div class="bg-gradient-to-b from-[#F6C445] to-[#FFF8F0] pt-12 pb-6 px-6">
        <div class="flex items-center space-x-4">
          <div class="relative">
            <div class="w-20 h-20 bg-white rounded-3xl p-2 shadow-lg border-2 border-white">
              <img alt="Cat Avatar" class="w-full h-full object-cover rounded-2xl" src="https://modao.cc/agent-py/media/generated_images/2026-05-17/7254d26098814731ad3b8631de6ea0fb.jpg">
            </div>
            <div class="absolute -bottom-2 -right-2 bg-[#F472B6] text-white text-[10px] px-2 py-0.5 rounded-full font-bold shadow-sm">Lv.5</div>
          </div>
          <div>
            <h2 class="text-xl font-black text-[#4A3728]">招财小金喵</h2>
            <div class="mt-1 flex items-center space-x-2">
              <div class="w-32 h-2 bg-white/50 rounded-full overflow-hidden">
                <div class="w-3/4 h-full bg-[#F472B6]"></div>
              </div>
              <span class="text-[10px] font-bold text-[#4A3728]">75%</span>
            </div>
            <p class="text-[10px] text-[#4A3728]/60 mt-1">再记账3次即可升级喵~</p>
          </div>
        </div>
      </div>
      <div class="px-6 py-4 flex-1 overflow-y-auto no-scrollbar">
        <div class="grid grid-cols-2 gap-4 mb-6">
          <div class="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center btn-active" onclick="switchPage('shop')">
            <iconify-icon class="text-3xl mb-2" icon="noto:ribbon"></iconify-icon>
            <span class="font-bold text-[#4A3728] text-sm">装扮商店</span>
          </div>
          <div class="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center btn-active" onclick="switchPage('achievements')">
            <iconify-icon class="text-3xl mb-2" icon="noto:trophy"></iconify-icon>
            <span class="font-bold text-[#4A3728] text-sm">成就徽章</span>
          </div>
        </div>
        <div class="bg-white rounded-3xl p-2 shadow-sm mb-6">
          <div class="flex items-center justify-between p-4 hover:bg-gray-50 rounded-2xl transition-colors" onclick="switchPage('sync')">
            <div class="flex items-center space-x-3">
              <iconify-icon class="text-xl text-[#F6C445]" icon="mdi:cloud-sync-outline"></iconify-icon>
              <span class="font-bold text-[#4A3728]">数据同步</span>
            </div>
            <iconify-icon class="text-gray-300" icon="mdi:chevron-right"></iconify-icon>
          </div>
          <div class="flex items-center justify-between p-4 hover:bg-gray-50 rounded-2xl transition-colors" onclick="switchPage('export')">
            <div class="flex items-center space-x-3">
              <iconify-icon class="text-xl text-[#34D399]" icon="mdi:file-export-outline"></iconify-icon>
              <span class="font-bold text-[#4A3728]">导出数据</span>
            </div>
            <iconify-icon class="text-gray-300" icon="mdi:chevron-right"></iconify-icon>
          </div>
          <div class="flex items-center justify-between p-4 hover:bg-gray-50 rounded-2xl transition-colors" onclick="switchPage('unlock')">
            <div class="flex items-center space-x-3">
              <iconify-icon class="text-xl text-[#F472B6]" icon="mdi:fingerprint"></iconify-icon>
              <span class="font-bold text-[#4A3728]">指纹解锁</span>
            </div>
            <iconify-icon class="text-gray-300" icon="mdi:chevron-right"></iconify-icon>
          </div>
        </div>
        <button class="w-full py-4 text-red-400 font-bold text-sm" onclick="switchPage('welcome')">退出登录喵...</button>
      </div>
      <!-- 底部导航 (复用) -->
      <div class="nav-bar">
        <div class="nav-item" onclick="switchPage('home')">
          <iconify-icon class="text-2xl" icon="mdi:calendar-month"></iconify-icon>
          <span>首页</span>
        </div>
        <div class="nav-item" onclick="switchPage('stats')">
          <iconify-icon class="text-2xl" icon="mdi:chart-pie"></iconify-icon>
          <span>统计</span>
        </div>
        <div class="add-btn btn-active" onclick="switchPage('add')">
          <iconify-icon class="text-3xl" icon="mdi:plus"></iconify-icon>
        </div>
        <div class="nav-item" onclick="switchPage('timeline')">
          <iconify-icon class="text-2xl" icon="mdi:format-list-bulleted"></iconify-icon>
          <span>明细</span>
        </div>
        <div class="nav-item active">
          <iconify-icon class="text-2xl" icon="mdi:account"></iconify-icon>
          <span>我的</span>
        </div>
      </div>
    </div>
    <!-- 12. 装扮商店页 -->
    <div class="page bg-[#FFF8F0]" id="page-shop">
      <div class="px-6 pt-10 pb-4 flex items-center">
        <button class="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm btn-active" onclick="switchPage('profile')">
          <iconify-icon class="text-2xl" icon="mdi:chevron-left"></iconify-icon>
        </button>
        <h2 class="flex-1 text-center text-xl font-bold text-[#4A3728]">猫咪装扮</h2>
        <div class="flex items-center space-x-1 bg-white px-3 py-1 rounded-full shadow-sm">
          <span class="text-xs font-black text-[#F6C445]">🪙 1,250</span>
        </div>
      </div>
      <div class="px-6 py-4 grid grid-cols-2 gap-4 flex-1 overflow-y-auto no-scrollbar mb-4">
        <div class="bg-white p-4 rounded-3xl shadow-sm border-2 border-[#F6C445] relative">
          <div class="absolute top-2 right-2 text-[#34D399]">✅</div>
          <div class="w-full aspect-square bg-gray-50 rounded-2xl mb-3 flex items-center justify-center text-4xl">🎩</div>
          <div class="font-bold text-[#4A3728] text-sm">绅士礼帽</div>
          <div class="text-[10px] text-gray-400">已拥有</div>
        </div>
        <div class="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 btn-active">
          <div class="w-full aspect-square bg-gray-50 rounded-2xl mb-3 flex items-center justify-center text-4xl">🧣</div>
          <div class="font-bold text-[#4A3728] text-sm">暖心围巾</div>
          <div class="flex items-center justify-between mt-1">
            <span class="text-[10px] text-[#F6C445] font-bold">🪙 500</span>
            <button class="text-[8px] bg-[#F6C445] text-white px-2 py-0.5 rounded-full">购买</button>
          </div>
        </div>
        <div class="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 btn-active">
          <div class="w-full aspect-square bg-gray-50 rounded-2xl mb-3 flex items-center justify-center text-4xl">🕶️</div>
          <div class="font-bold text-[#4A3728] text-sm">酷炫墨镜</div>
          <div class="flex items-center justify-between mt-1">
            <span class="text-[10px] text-[#F6C445] font-bold">🪙 800</span>
            <button class="text-[8px] bg-[#F6C445] text-white px-2 py-0.5 rounded-full">购买</button>
          </div>
        </div>
        <div class="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 btn-active">
          <div class="w-full aspect-square bg-gray-50 rounded-2xl mb-3 flex items-center justify-center text-4xl">🔔</div>
          <div class="font-bold text-[#4A3728] text-sm">金铃铛</div>
          <div class="flex items-center justify-between mt-1">
            <span class="text-[10px] text-[#F6C445] font-bold">🪙 300</span>
            <button class="text-[8px] bg-[#F6C445] text-white px-2 py-0.5 rounded-full">购买</button>
          </div>
        </div>
      </div>
    </div>
    <!-- 13. 成就徽章页 -->
    <div class="page bg-[#FFF8F0]" id="page-achievements">
      <div class="px-6 pt-10 pb-4 flex items-center">
        <button class="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm btn-active" onclick="switchPage('profile')">
          <iconify-icon class="text-2xl" icon="mdi:chevron-left"></iconify-icon>
        </button>
        <h2 class="flex-1 text-center text-xl font-bold text-[#4A3728]">成就勋章</h2>
        <div class="w-10"></div>
      </div>
      <div class="px-6 py-4 flex-1 overflow-y-auto no-scrollbar">
        <div class="bg-white rounded-3xl p-6 shadow-sm mb-6 text-center">
          <div class="text-3xl font-black text-[#4A3728] mb-1">5 / 12</div>
          <div class="text-xs text-gray-400 mb-4">已解锁勋章</div>
          <div class="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div class="w-[42%] h-full bg-[#F6C445]"></div>
          </div>
        </div>
        <div class="grid grid-cols-3 gap-4">
          <div class="flex flex-col items-center">
            <div class="w-16 h-16 bg-[#F6C445]/20 rounded-full flex items-center justify-center text-3xl mb-1 shadow-sm border-2 border-[#F6C445]">🏅</div>
            <span class="text-[10px] font-bold text-[#4A3728]">记账达人</span>
          </div>
          <div class="flex flex-col items-center">
            <div class="w-16 h-16 bg-[#F6C445]/20 rounded-full flex items-center justify-center text-3xl mb-1 shadow-sm border-2 border-[#F6C445]">🐟</div>
            <span class="text-[10px] font-bold text-[#4A3728]">省钱小能手</span>
          </div>
          <div class="flex flex-col items-center">
            <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-3xl mb-1 grayscale opacity-50">👑</div>
            <span class="text-[10px] font-bold text-gray-400">大富大贵</span>
          </div>
          <div class="flex flex-col items-center">
            <div class="w-16 h-16 bg-[#F6C445]/20 rounded-full flex items-center justify-center text-3xl mb-1 shadow-sm border-2 border-[#F6C445]">🐾</div>
            <span class="text-[10px] font-bold text-[#4A3728]">连续7天</span>
          </div>
          <div class="flex flex-col items-center">
            <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-3xl mb-1 grayscale opacity-50">🌙</div>
            <span class="text-[10px] font-bold text-gray-400">月光族</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 14. 同步设置页 -->
    <div class="page bg-[#FFF8F0]" id="page-sync">
      <div class="px-6 pt-10 pb-4 flex items-center">
        <button class="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm btn-active" onclick="switchPage('profile')">
          <iconify-icon class="text-2xl" icon="mdi:chevron-left"></iconify-icon>
        </button>
        <h2 class="flex-1 text-center text-xl font-bold text-[#4A3728]">数据同步</h2>
        <div class="w-10"></div>
      </div>
      <div class="p-6">
        <div class="bg-white rounded-3xl p-6 shadow-sm mb-6 text-center">
          <iconify-icon class="text-6xl text-[#34D399] mb-4" icon="mdi:cloud-check"></iconify-icon>
          <div class="font-bold text-[#4A3728]">数据已安全同步</div>
          <div class="text-xs text-gray-400 mt-1">上次同步：今天 14:30</div>
        </div>
        <div class="bg-white rounded-3xl p-2 shadow-sm space-y-2">
          <div class="flex items-center justify-between p-4">
            <span class="font-bold text-[#4A3728]">iCloud 自动备份</span>
            <div class="w-10 h-5 bg-[#34D399] rounded-full relative">
              <div class="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full"></div>
            </div>
          </div>
          <div class="flex items-center justify-between p-4">
            <span class="font-bold text-[#4A3728]">仅在 WiFi 下同步</span>
            <div class="w-10 h-5 bg-gray-200 rounded-full relative">
              <div class="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full"></div>
            </div>
          </div>
        </div>
        <button class="mt-8 w-full py-4 bg-[#F6C445] text-white rounded-full font-bold shadow-lg btn-active">立即同步喵~</button>
      </div>
    </div>
    <!-- 15. 指纹解锁页 -->
    <div class="page bg-[#4A3728] items-center justify-center p-6" id="page-unlock">
      <div class="text-center mb-16">
        <div class="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <iconify-icon class="text-5xl" icon="noto:cat-face"></iconify-icon>
        </div>
        <h2 class="text-2xl font-black text-white">招财喵记账</h2>
        <p class="text-white/60 mt-2">保护您的账单安全</p>
      </div>
      <div class="relative cursor-pointer group" onclick="switchPage('home')">
        <div class="w-32 h-32 bg-white/5 rounded-full flex items-center justify-center animate-pulse">
          <iconify-icon class="text-6xl text-[#F6C445]" icon="mdi:paw"></iconify-icon>
        </div>
        <div class="absolute inset-0 border-4 border-[#F6C445]/30 rounded-full animate-ping"></div>
      </div>
      <p class="mt-8 text-[#F6C445] font-bold tracking-widest">轻触猫爪解锁 ฅ'ω'ฅ</p>
      <button class="mt-20 text-white/40 text-sm underline">使用密码解锁</button>
    </div>
    <!-- 16. 导出数据页 -->
    <div class="page bg-[#FFF8F0]" id="page-export">
      <div class="px-6 pt-10 pb-4 flex items-center">
        <button class="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm btn-active" onclick="switchPage('profile')">
          <iconify-icon class="text-2xl" icon="mdi:chevron-left"></iconify-icon>
        </button>
        <h2 class="flex-1 text-center text-xl font-bold text-[#4A3728]">数据导出</h2>
        <div class="w-10"></div>
      </div>
      <div class="p-6">
        <h3 class="font-bold text-[#4A3728] mb-4">选择导出格式</h3>
        <div class="grid grid-cols-1 gap-4 mb-8">
          <div class="bg-white p-5 rounded-3xl shadow-sm border-2 border-[#F6C445] flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <iconify-icon class="text-4xl" icon="vscode-icons:file-type-excel"></iconify-icon>
              <div>
                <div class="font-bold text-[#4A3728]">Excel 电子表格</div>
                <div class="text-xs text-gray-400">适合在电脑上查看</div>
              </div>
            </div>
            <iconify-icon class="text-2xl text-[#F6C445]" icon="mdi:check-circle"></iconify-icon>
          </div>
          <div class="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between opacity-60">
            <div class="flex items-center space-x-4">
              <iconify-icon class="text-4xl" icon="vscode-icons:file-type-pdf"></iconify-icon>
              <div>
                <div class="font-bold text-[#4A3728]">PDF 文档</div>
                <div class="text-xs text-gray-400">适合打印和阅读</div>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-3xl p-6 shadow-sm mb-8">
          <div class="font-bold text-[#4A3728] mb-4">选择时间范围</div>
          <div class="flex space-x-2">
            <button class="flex-1 py-2 bg-gray-100 rounded-xl text-xs font-bold text-gray-500">本月</button>
            <button class="flex-1 py-2 bg-[#F6C445] rounded-xl text-xs font-bold text-white shadow-sm">近三个月</button>
            <button class="flex-1 py-2 bg-gray-100 rounded-xl text-xs font-bold text-gray-500">全部</button>
          </div>
        </div>
        <button class="w-full py-4 bg-[#F6C445] text-white rounded-full font-bold shadow-lg btn-active" onclick="switchPage('loading')">生成报表喵~</button>
      </div>
    </div>
    <!-- 17. 空状态页 -->
    <div class="page bg-[#FFF8F0] items-center justify-center p-10 text-center" id="page-empty">
      <iconify-icon class="text-9xl mb-6 opacity-30" icon="noto:sleeping-face"></iconify-icon>
      <h2 class="text-2xl font-black text-[#4A3728]/30">这里空空如也～</h2>
      <p class="text-[#4A3728]/20 mt-2">猫猫还没开始干活呢，快去记一笔吧！</p>
      <button class="mt-12 px-8 py-4 bg-[#F472B6] text-white rounded-full font-bold shadow-lg btn-active" onclick="switchPage('add')">去记账喵</button>
    </div>
    <!-- 18. 加载动画页 -->
    <div class="page bg-[#FFF8F0] items-center justify-center" id="page-loading">
      <div class="relative">
        <iconify-icon class="text-8xl animate-bounce" icon="noto:cat-face"></iconify-icon>
        <div class="absolute -bottom-4 left-1/2 -translate-x-1/2 w-16 h-4 bg-black/5 rounded-full blur-md"></div>
      </div>
      <div class="mt-12 flex space-x-2">
        <div class="w-3 h-3 bg-[#F6C445] rounded-full animate-bounce"></div>
        <div class="w-3 h-3 bg-[#F6C445] rounded-full animate-bounce delay-75"></div>
        <div class="w-3 h-3 bg-[#F6C445] rounded-full animate-bounce delay-150"></div>
      </div>
      <p class="mt-6 text-[#4A3728] font-bold animate-pulse">正在拼命算账喵…</p>
      <script>
        // 模拟加载完成后自动跳转
        setTimeout(() => {
          const loadingPage = document.getElementById('page-loading');
          if (loadingPage.classList.contains('active')) {
            switchPage('home');
          }
        }, 3000);
      </script>
    </div>
  </div>
  <script>
    // 页面切换逻辑
    function switchPage(pageId) {
      // 隐藏所有页面
      const pages = document.querySelectorAll('.page');
      pages.forEach(p => p.classList.remove('active'));

      // 显示目标页面
      const targetPage = document.getElementById(`page-${pageId}`);
      if (targetPage) {
        targetPage.classList.add('active');

        // 如果切换到统计页，初始化图表
        if (pageId === 'stats') {
          setTimeout(initCharts, 100);
        }
      }
    }

    // 初始化图表
    function initCharts() {
      // 饼图
      const pieChart = echarts.init(document.getElementById('chart-pie'));
      pieChart.setOption({
        color: ['#F6C445', '#F472B6', '#34D399', '#FB923C', '#9CA3AF'],
        series: [{
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: false
          },
          data: [{
              value: 650,
              name: '餐饮'
            },
            {
              value: 300,
              name: '购物'
            },
            {
              value: 150,
              name: '交通'
            },
            {
              value: 100,
              name: '娱乐'
            },
            {
              value: 80,
              name: '其他'
            }
          ]
        }]
      });

      // 折线图
      const lineChart = echarts.init(document.getElementById('chart-line'));
      lineChart.setOption({
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          }
        },
        yAxis: {
          type: 'value',
          show: false
        },
        grid: {
          top: 10,
          bottom: 20,
          left: 0,
          right: 0
        },
        series: [{
          data: [120, 200, 150, 80, 70, 110, 130],
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 8,
          itemStyle: {
            color: '#F6C445'
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgba(246, 196, 69, 0.3)'
              },
              {
                offset: 1,
                color: 'rgba(246, 196, 69, 0)'
              }
            ])
          }
        }]
      });
    }

    // 预算状态模拟
    function updateBudgetState(state) {
      const progress = document.getElementById('budget-progress');
      const icon = document.getElementById('cat-status-icon');
      const text = document.getElementById('cat-status-text');
      const floatingCat = document.getElementById('home-floating-cat');

      if (state === 'normal') {
        progress.style.width = '32%';
        progress.style.backgroundColor = '#34D399';
        icon.setAttribute('icon', 'noto:smiling-cat-with-open-mouth');
        floatingCat.setAttribute('icon', 'noto:smiling-cat-with-open-mouth');
        text.innerText = '猫猫很开心，继续保持喵~';
      } else if (state === 'warning') {
        progress.style.width = '75%';
        progress.style.backgroundColor = '#FB923C';
        icon.setAttribute('icon', 'noto:hushed-face');
        floatingCat.setAttribute('icon', 'noto:hushed-face');
        text.innerText = '有点危险了，少买点小鱼干喵！';
      } else if (state === 'danger') {
        progress.style.width = '92%';
        progress.style.backgroundColor = '#EF4444';
        icon.setAttribute('icon', 'noto:crying-cat');
        floatingCat.setAttribute('icon', 'noto:crying-cat');
        text.innerText = '要破产了喵！快住手！';
      }
    }

    // 2秒后自动进入欢迎页
    setTimeout(() => {
      const splash = document.getElementById('page-splash');
      if (splash.classList.contains('active')) {
        switchPage('welcome');
      }
    }, 3000);
  </script>


</body>

</html>
