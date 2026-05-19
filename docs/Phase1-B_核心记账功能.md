# Phase 1-B: 核心记账功能

## Context

Phase 1-A 已完成基础架构。所有页面使用硬编码 mock 数据，没有接入 Store/DB。Phase 1-B 将 UI 与数据层打通，实现完整记账闭环。

## 完成内容

### Step 1: App 启动初始化

**文件**: `App.vue`

- `onLaunch` 中 `initDB()` 之后调用 `useUserStore().initGuestUser()`
- 确保后续页面可直接使用 `userStore.userId`

### Step 2: 记账页接入 Store

**文件**: `pages/add/index.vue`

- 导入 `useExpenseStore`、`useUserStore`、`CATEGORIES`
- 用 `CATEGORIES` 替换硬编码分类数组
- `remark` 绑定 `v-model`
- `onSubmit` 构造 record 并调用 `expenseStore.createExpense()`
- 成功后 `uni.showToast` + `uni.switchTab` 回首页

### Step 3: 预算页接入 Store

**文件**: `pages/budget/index.vue`

- 导入 `useBudgetStore`、`useUserStore`
- `onMounted` 加载已有预算回显
- `onSave` 调用 `setBudget` 或 `modifyBudget`

### Step 4: 首页接入 Store（数据驱动）

**文件**: `pages/home/index.vue`

- `onShow` 加载当月消费 + 预算
- 预算卡片用 store computed 驱动
- 日历从 `monthExpenses` 按日聚合金额
- 猫咪状态根据 `BUDGET_STATUS` 阈值动态切换（GOOD/WARNING/DANGER）

### Step 5: 明细页接入 Store

**文件**: `pages/detail/index.vue`

- `onShow` 加载当月消费
- 按日期分组（今日/昨日/更早）
- 从 `CATEGORIES` 匹配图标颜色

### Step 6: 统计页接入 Store

**文件**: `pages/stats/index.vue`

- 按 category 聚合金额和占比，生成动态饼图
- 按最近 7 天聚合日消费驱动柱状图
- 消费排行榜从真实数据生成

### Step 7: 结算卡片接入 Store

**文件**: `pages/report/index.vue`

- 展示真实今日支出、预算剩余
- 建议额度 = 剩余预算 / 剩余天数

## Bug 修复

- 修复 `getToday()` 使用 UTC 时间导致日历日期偏移问题（改为本地时间）
- 修复 `monthTotal`/`todayTotal` 未过滤 income 类型
- 修复 `expense_record` schema 缺少 `type` 字段
- 修复记账页缺少 `item_name` 字段
- 恢复被注释的 `custom-tab-bar` 组件引用

## 验证清单

1. 首次进入 → 预算卡片显示 ¥0.00
2. 设置预算 → 返回首页预算更新
3. 记一笔账 → 首页日历当日显示金额
4. 明细页展示真实记录
5. 统计页饼图反映分类占比
6. 结算卡片显示真实数据
