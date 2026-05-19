# Phase 1-A: 基础架构搭建

## Context

项目初始化阶段，搭建完整的技术底座，为后续功能开发提供基础设施。

## 完成内容

### 1. 数据库层

- `utils/db/schema.js` — 5 张表定义（user、monthly_budget、expense_record、cat_status、achievement）
- `utils/db/storage-adapter.js` — localStorage 适配器（H5/小程序降级方案）
- `utils/db/sqlite-adapter.js` — SQLite 适配器（APP-PLUS 原生端）
- `utils/db/index.js` — 统一入口，条件编译选择适配器

### 2. Hooks 逻辑层

- `hooks/use-expense.js` — 消费记录 CRUD（loadByDate、loadByMonth、addExpense、deleteExpense、updateExpense、loadTemplates）
- `hooks/use-budget.js` — 预算管理（loadCurrentMonthBudget、createBudget、updateBudget）
- `hooks/use-cat.js` — 猫咪养成逻辑

### 3. Pinia Store 状态层

- `store/expense-store.js` — 消费状态共享（todayExpenses、monthExpenses、monthTotal）
- `store/budget-store.js` — 预算状态共享（currentBudget、budgetAmount、hasBudget）
- `store/user-store.js` — 用户状态（userId、initGuestUser、toggleDarkMode）

### 4. 配置与工具

- `config/constants.js` — CATEGORIES、ACHIEVEMENTS、BUDGET_PRESETS、CAT_BREEDS、BUDGET_STATUS
- `utils/helpers.js` — formatMoney、getToday、getCurrentTime、getCurrentYearMonth、getRemainingDays 等

### 5. 页面 UI 骨架

- 9 个页面 UI 实现（splash、welcome、home、add、detail、stats、budget、report、profile）
- 自定义 TabBar 组件（custom-tab-bar）
- 全局样式系统（theme.scss、animation.scss）
- 猫爪加载组件（cat-loading）

### 6. 项目配置

- `pages.json` — 路由配置、tabBar 配置（custom: true）
- `App.vue` — 全局生命周期、样式导入
- easycom 自动注册组件

## 技术决策

- 本地优先架构，V1.0 不依赖网络
- 条件编译实现跨平台适配
- Hooks + Store 分层，SFC 只负责渲染
- CSS 变量统一主题管理
