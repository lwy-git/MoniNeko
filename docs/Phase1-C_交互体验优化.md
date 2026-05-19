# Phase 1-C: 交互体验优化

## Context

Phase 1-B 已完成核心记账闭环。App 功能可用但交互体验缺乏打磨：无删除功能、日历锁定当月、无加载状态、表单无反馈。Phase 1-C 补齐交互细节，让 App 从"能用"变为"好用"。

## 完成内容

### Step 1: 明细页左滑删除（高优先）

**文件**: `pages/detail/index.vue`

- 每条记录外层包裹 `.swipe-container`（overflow: hidden）
- `@touchstart`/`@touchmove`/`@touchend` 手势追踪
- 左滑超过阈值（60px）→ 卡片 translateX 露出右侧红色删除按钮
- 点击删除 → `uni.showModal` 确认 → `expenseStore.removeExpense(id)`
- 同一时间只允许一条记录处于滑开状态
- 水平滑动优先判断（deltaX > deltaY 才触发，避免与 scroll-view 冲突）

### Step 2: 首页月份切换（高优先）

**文件**: `pages/home/index.vue`

- header-left 区域改为：`‹` 左箭头 + "X月" + `›` 右箭头
- `prevMonth()` / `nextMonth()` 修改 `currentMonth`/`currentYear`，处理年份翻转
- 不允许切换到未来月份
- 点击月份文字 → 回到当前月
- 切换后调用 `loadMonthData()` 重新加载消费+预算

### Step 3: 记账页表单验证反馈（中优先）

**文件**: `pages/add/index.vue`

- 金额为 0 时提交 → 金额显示区 shake 动画 + toast "请输入金额喵~"
- `shaking` ref 控制动画 class，500ms 后自动重置
- 记账成功后清空表单状态（amountStr、remark、selectedCategory）

### Step 4: 加载状态（中优先）

**文件**: `pages/home/index.vue`、`pages/detail/index.vue`、`pages/stats/index.vue`

- 复用已有 `components/common/cat-loading.vue`（easycom 自动注册）
- 各页面添加 `loading` ref，`onShow` 开始设 true，数据加载完设 false
- `<cat-loading v-if="loading" />` + `v-else` 包裹主内容

### Step 5: 统计页空状态（中优先）

**文件**: `pages/stats/index.vue`

- 当 `monthTotal === 0` 且非 loading 时，显示猫咪空状态提示
- "😿 这个月还没有消费记录喵~"

### Step 6: TabBar 加号按钮按压效果（中优先）

**文件**: `components/custom-tab-bar/custom-tab-bar.vue`

- 外层 view 添加 `hover-class="add-btn-pressed"` + `:hover-stay-time="100"`
- `.add-btn` 添加 `transition: transform 0.15s ease`
- `.add-btn-pressed` → `transform: scale(0.88); opacity: 0.85`

### Step 7: 预算页上下文提示（低优先）

**文件**: `pages/budget/index.vue`

- 标题动态切换："设置预算" vs "调整预算"
- 编辑模式下显示当前预算提示条

### Step 8: 页面入场动画（低优先）

**文件**: 各页面 `.page-content`

- 添加 `anim-fade-in` class（已在 `styles/animation.scss` 中定义）
- 实现 0.4s 淡入+微缩放入场效果

## 复用模块

- `components/common/cat-loading.vue` → 加载状态组件
- `styles/animation.scss` → `shake`/`fadeIn` 关键帧
- `store/expense-store.js` → `removeExpense(id)`、`fetchByMonth()`
- `store/budget-store.js` → `hasBudget`、`budgetAmount`

## 验证清单

1. 明细页左滑一条记录 → 红色删除按钮出现 → 确认删除 → 记录消失
2. 首页点击左箭头 → 切换到上月 → 日历和预算卡片更新
3. 记账页输入 0 点提交 → 金额抖动 + toast 提示
4. 各页面首次进入 → 短暂显示猫爪加载动画
5. 统计页无数据时 → 显示空状态提示
6. 按压 TabBar 加号 → 按钮缩小反馈
