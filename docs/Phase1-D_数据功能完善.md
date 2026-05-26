# Phase 1-D: 数据功能完善

## Context

Phase 1-C 交互体验优化已完成。Phase 1-D 补齐数据功能短板：收入分类、编辑记录、搜索筛选、统计月份导航、数据导出、预算历史月份支持。

## 完成内容

### Step 1: 收入分类支持

**文件**: `config/constants.js`、`pages/add/index.vue`

- 新增 `INCOME_CATEGORIES` 常量（工资/奖金/理财/兼职/红包/其他）
- 记账页 `categories` 改为 computed，根据支出/收入切换动态显示对应分类
- 切换类型时自动重置 `selectedCategory`

### Step 2: 编辑记录功能

**文件**: `store/expense-store.js`、`pages/add/index.vue`、`pages/detail/index.vue`

- Store 新增 `editingRecord` ref + `setEditingRecord`/`clearEditingRecord` 方法
- 记账页支持编辑模式：`onShow` 检测 editingRecord 并填充表单
- 编辑模式下 header 显示"返回/保存"，提交调用 `editExpense`
- 明细页点击记录卡片 → 设置 editingRecord → switchTab 到记账页
- 非滑动状态下才触发编辑（避免与左滑删除冲突）

### Step 3: 明细页搜索与筛选

**文件**: `pages/detail/index.vue`

- 点击搜索图标展开搜索栏（输入框 + 分类标签横向滚动）
- `searchKeyword` 匹配 item_name / remark
- `filterCategory` 按分类筛选
- `filteredExpenses` computed 在 groupedExpenses 基础上过滤
- 支持收入分类（INCOME_CATEGORIES 也加入 categoryMap）

### Step 4: 统计页月份导航 + 周期切换

**文件**: `pages/stats/index.vue`

- header 改为月份导航（‹ X月 ›），支持前后月切换
- 使用独立 `statsExpenses` ref（直接调用 hooks 层），不影响首页数据
- 周期切换功能化：周（最近7天）/ 月（当月全部）
- "年"选项移除，延迟到 V1.1
- 所有统计数据（饼图/趋势/排行）基于 `periodExpenses` computed

### Step 5: 数据导出 CSV

**文件**: `utils/export.js`（新建）、`pages/profile/index.vue`

- `exportToCSV(records)` 生成 UTF-8 BOM CSV（日期/时间/类型/分类/金额/备注）
- `downloadCSV` 支持 H5（Blob + download link）和 APP（plus.io + shareFile）
- 个人页"导出数据"点击 → 查询全部记录 → 生成 CSV → 下载/分享

### Step 6: 预算 Store 历史月份支持

**文件**: `store/budget-store.js`、`pages/home/index.vue`

- Store 新增 `fetchBudgetByMonth(userId, yearMonth)` 方法
- 首页 `loadMonthData` 改用 `fetchBudgetByMonth` 替代 `fetchCurrentBudget`
- 切换历史月份时预算卡片正确显示对应月份预算

## 验证清单

1. 记账页切换"收入" → 分类变为收入类 → 记一笔收入 → 明细页显示 +金额
2. 明细页点击记录 → 跳转记账页编辑模式 → 修改保存 → 返回明细页数据更新
3. 明细页搜索 → 输入关键词实时过滤 → 分类标签进一步筛选
4. 统计页左箭头 → 切换上月 → 饼图和排行更新
5. 个人页"导出数据" → 生成 CSV → 提示成功
6. 首页切换历史月份 → 预算卡片显示该月预算
