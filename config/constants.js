export const CATEGORIES = [
	{ key: 'food', label: '餐饮', icon: '🍔', color: '#34D399' },
	{ key: 'transport', label: '交通', icon: '🚌', color: '#FB923C' },
	{ key: 'shopping', label: '购物', icon: '🛍', color: '#F472B6' },
	{ key: 'entertainment', label: '娱乐', icon: '🎮', color: '#8B5CF6' },
	{ key: 'medical', label: '医疗', icon: '🏥', color: '#EF4444' },
	{ key: 'housing', label: '住房', icon: '🏠', color: '#3B82F6' },
	{ key: 'cat', label: '猫咪', icon: '🐟', color: '#F6C445' },
	{ key: 'other', label: '其他', icon: '🐾', color: '#9CA3AF' }
]

export const ACHIEVEMENTS = {
	FIRST_BUDGET: { key: 'first_budget', label: '首次设置预算', description: '给猫咪分配第一笔粮饷', fish: 2 },
	FIRST_EXPENSE: { key: 'first_expense', label: '首次记账', description: '第一次投喂猫咪金币', fish: 1 },
	STREAK_3: { key: 'streak_3', label: '连续3天记账', description: '猫咪开始信任你了', fish: 3 },
	STREAK_7: { key: 'streak_7', label: '连续7天记账', description: '获得自律猫徽章', fish: 5 },
	STREAK_30: { key: 'streak_30', label: '连续30天记账', description: '猫咪管家认证', fish: 10 },
	UNDER_BUDGET: { key: 'under_budget', label: '月度不超支', description: '本月猫粮充足', fish: 8 },
	SAVE_MASTER: { key: 'save_master', label: '省钱达人', description: '连续7天不超日均', fish: 5 }
}

export const BUDGET_PRESETS = [3000, 5000, 8000, 10000]

export const CAT_BREEDS = [
	{ key: 'orange', label: '橘猫', unlockLevel: 1 },
	{ key: 'british_short', label: '英短', unlockLevel: 5 },
	{ key: 'ragdoll', label: '布偶', unlockLevel: 10 },
	{ key: 'black', label: '黑猫', unlockLevel: 15 }
]

export const BUDGET_STATUS = {
	GOOD: { key: 'good', label: '节奏良好', color: '#34D399', catFace: '😸' },
	WARNING: { key: 'warning', label: '节奏偏快', color: '#FB923C', catFace: '😐' },
	DANGER: { key: 'danger', label: '严重超支', color: '#EF4444', catFace: '🙀' }
}
