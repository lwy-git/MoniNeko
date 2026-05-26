# Phase 1-E: 猫咪养成系统

## Context

Phase 1-D 数据功能完善已完成。猫咪养成系统从静态装饰变为有反馈的养成系统：等级、鱼干奖励、成就解锁、品种切换。

## 完成内容

### Step 1: 等级系统工具函数

**新建**: `utils/cat-level.js`

- `getLevelForFish(totalFish)` — level N 需要 N*10 累计鱼干
- `getFishForNextLevel(level)` — 下一级所需鱼干
- `getLevelProgress(totalFish)` — 返回 { level, current, needed, percent }
- `getUnlockedBreeds(level)` — 当前等级可用品种

**修改**: `config/constants.js` — 新增 `CAT_BREED_EMOJI` 映射

### Step 2: 增强 Hooks 层

**修改**: `hooks/use-cat.js`

- `addFish` 增强：加鱼后自动计算等级，返回 { newFish, leveled, newLevel }
- 新增 `updateBreed(userId, breedKey)`
- 新增 `getRecordStreak(userId)` — 从今天往前数连续记账天数

### Step 3: 成就检测逻辑

**新建**: `hooks/use-achievement-detector.js`

- `checkAfterExpense` — 检测 FIRST_EXPENSE、STREAK_3/7/30
- `checkAfterBudget` — 检测 FIRST_BUDGET
- `checkUnderBudget` — 检测月度不超支

### Step 4: 增强 Cat Store

**修改**: `store/cat-store.js`

- 新增 computed：`levelProgress`、`unlockedBreeds`、`breedEmoji`
- 新增 action：`changeBreed`、`checkAchievements`
- `earnFish` 处理升级逻辑

### Step 5: 记账/预算触发鱼干奖励

**修改**: `store/expense-store.js` — createExpense 后 +1 鱼干 + 成就检测
**修改**: `store/budget-store.js` — setBudget 后成就检测

### Step 6: Profile 页面接入真实数据

**修改**: `pages/profile/index.vue`

- 替换所有硬编码为 catStore 数据
- 添加签到按钮（每日一次 +1 鱼干）
- 添加品种切换区域（已解锁品种可选）

### Step 7: 成就页面

**新建**: `pages/achievements/index.vue`

- 鱼干总数展示
- 成就列表（已解锁/未解锁状态）
- 显示解锁时间和鱼干奖励

**修改**: `pages.json` — 注册成就页路由

### Step 8: 首页猫咪动态化

**修改**: `pages/home/index.vue`

- 导入 catStore，onShow 加载猫咪状态
- header 头像和浮动猫咪 emoji 改为 `catStore.breedEmoji`

## 验证清单

1. 记一笔账 → 鱼干 +1 → profile 经验条增长
2. 累计 10 鱼干 → 升到 Lv.2
3. 首次记账 → 解锁"首次记账"成就
4. 连续 3 天记账 → 解锁"连续3天记账"
5. profile 签到 → 鱼干 +1 → 按钮变为"已签到"
6. 升到 Lv.5 → 英短解锁 → 可切换品种 → 首页头像更新
