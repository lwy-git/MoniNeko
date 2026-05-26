<template>
	<view class="page-budget">
		<view class="page-content anim-fade-in">
			<!-- 顶部 -->
			<view class="header">
				<view class="header-back" @tap="goBack">
					<text class="back-icon">‹</text>
				</view>
				<text class="page-title">{{ budgetStore.hasBudget ? '调整预算' : '设置预算' }}</text>
				<view class="header-placeholder"></view>
			</view>

			<view v-if="budgetStore.hasBudget" class="current-budget-hint">
				<text class="hint-text">当前预算: ¥{{ budgetStore.budgetAmount.toLocaleString() }}</text>
			</view>

			<!-- 预算设置卡片 -->
			<view class="budget-main-card">
				<view class="budget-icon-wrap">
					<text class="budget-icon">💰</text>
				</view>
				<text class="budget-hint">设置本月总预算</text>
				<text class="budget-value">¥ {{ budgetAmount.toLocaleString() }}</text>
				<slider
					class="budget-slider"
					:min="500"
					:max="10000"
					:step="100"
					:value="budgetAmount"
					activeColor="#F6C445"
					backgroundColor="#F3F4F6"
					block-size="20"
					@change="onSliderChange"
				/>
				<view class="slider-labels">
					<text class="slider-label">¥500</text>
					<text class="slider-label">¥10,000</text>
				</view>
			</view>

			<!-- 分类预算 -->
			<view class="category-summary">
				<text class="category-summary-text">分类合计 ¥{{ categoryTotal.toLocaleString() }}</text>
				<text :class="['category-summary-text', budgetDiff === 0 ? 'summary-ok' : 'summary-warning']">
					{{ budgetDiffText }}
				</text>
			</view>
			<view class="category-budgets">
				<view
					class="category-budget-item"
					v-for="(item, idx) in categoryBudgets"
					:key="item.key"
					@tap="openCategoryEditor(idx)"
				>
					<view class="cb-left">
						<text class="cb-icon">{{ item.icon }}</text>
						<text class="cb-name">{{ item.name }}</text>
					</view>
					<view class="cb-right">
						<text class="cb-amount">¥{{ item.amount.toLocaleString() }}</text>
						<text class="cb-paw">›</text>
					</view>
				</view>
			</view>

			<!-- 保存按钮 -->
			<view class="save-area">
				<view class="save-btn" @tap="onSave">
					<text class="save-btn-text">保存喵～</text>
				</view>
			</view>
		</view>

		<view v-if="showEditor" class="modal-mask" @tap="closeCategoryEditor">
			<view class="edit-modal" @tap.stop>
				<text class="edit-title">修改{{ editingCategoryName }}</text>
				<view class="edit-input-row">
					<text class="edit-prefix">¥</text>
					<input
						class="edit-input"
						v-model="editingAmount"
						type="digit"
						placeholder="请输入预算金额"
						focus
					/>
				</view>
				<text class="edit-tip">三项分类预算合计必须等于总预算 ¥{{ budgetAmount.toLocaleString() }}</text>
				<view class="edit-actions">
					<view class="edit-btn edit-cancel" @tap="closeCategoryEditor">
						<text class="edit-btn-text cancel-text">取消</text>
					</view>
					<view class="edit-btn edit-confirm" @tap="confirmCategoryEdit">
						<text class="edit-btn-text confirm-text">确定</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useBudgetStore } from '@/store/budget-store.js'
import { useUserStore } from '@/store/user-store.js'
import { getCurrentYearMonth } from '@/utils/helpers.js'

const budgetStore = useBudgetStore()
const userStore = useUserStore()

const budgetAmount = ref(4000)
const targetYearMonth = ref(getCurrentYearMonth())
const showEditor = ref(false)
const editingIndex = ref(-1)
const editingAmount = ref('')

const categoryBudgets = ref([
	{ key: 'food', icon: '🍔', name: '餐饮预算', amount: 1500 },
	{ key: 'shopping', icon: '🛍', name: '购物预算', amount: 1000 },
	{ key: 'housing', icon: '🏠', name: '住宿预算', amount: 1500 }
])

const categoryTotal = computed(() =>
	categoryBudgets.value.reduce((sum, item) => sum + Number(item.amount), 0)
)

const budgetDiff = computed(() => Number((budgetAmount.value - categoryTotal.value).toFixed(2)))

const budgetDiffText = computed(() => {
	if (budgetDiff.value === 0) return '已匹配总预算'
	if (budgetDiff.value > 0) return `还需分配 ¥${budgetDiff.value.toLocaleString()}`
	return `超出 ¥${Math.abs(budgetDiff.value).toLocaleString()}`
})

const editingCategory = computed(() => categoryBudgets.value[editingIndex.value] || null)
const editingCategoryName = computed(() => editingCategory.value ? editingCategory.value.name : '')

onLoad((options) => {
	if (options.yearMonth) {
		targetYearMonth.value = options.yearMonth
	}
})

onMounted(async () => {
	await budgetStore.fetchBudgetByMonth(userStore.userId, targetYearMonth.value)
	if (budgetStore.hasBudget) {
		budgetAmount.value = budgetStore.budgetAmount
	}
	loadCategoryBudgets()
})

function onSliderChange(e) {
	const oldAmount = budgetAmount.value
	budgetAmount.value = e.detail.value
	syncCategoryBudgetsToTotal(oldAmount, budgetAmount.value)
}

function getCategoryBudgetKey() {
	return `category_budgets_${userStore.userId}_${targetYearMonth.value}`
}

function createDefaultCategoryBudgets(total) {
	const food = roundBudget(total * 0.375)
	const shopping = roundBudget(total * 0.25)
	const housing = roundBudget(total - food - shopping)
	return [
		{ key: 'food', icon: '🍔', name: '餐饮预算', amount: food },
		{ key: 'shopping', icon: '🛍', name: '购物预算', amount: shopping },
		{ key: 'housing', icon: '🏠', name: '住宿预算', amount: housing }
	]
}

function loadCategoryBudgets() {
	const stored = uni.getStorageSync(getCategoryBudgetKey())
	if (stored && Array.isArray(stored) && stored.length === 3) {
		categoryBudgets.value = createDefaultCategoryBudgets(budgetAmount.value).map(defaultItem => {
			const storedItem = stored.find(item => item.key === defaultItem.key)
			return storedItem ? { ...defaultItem, amount: Number(storedItem.amount) || 0 } : defaultItem
		})
		return
	}
	categoryBudgets.value = createDefaultCategoryBudgets(budgetAmount.value)
}

function saveCategoryBudgets() {
	uni.setStorageSync(getCategoryBudgetKey(), categoryBudgets.value)
}

function syncCategoryBudgetsToTotal(oldAmount, newAmount) {
	if (!oldAmount || categoryTotal.value === 0) {
		categoryBudgets.value = createDefaultCategoryBudgets(newAmount)
		return
	}
	const ratio = newAmount / categoryTotal.value
	const next = categoryBudgets.value.map(item => ({
		...item,
		amount: roundBudget(item.amount * ratio)
	}))
	const firstTwoTotal = next[0].amount + next[1].amount
	next[2].amount = roundBudget(newAmount - firstTwoTotal)
	categoryBudgets.value = next
}

function openCategoryEditor(index) {
	editingIndex.value = index
	editingAmount.value = String(categoryBudgets.value[index].amount)
	showEditor.value = true
}

function closeCategoryEditor() {
	showEditor.value = false
	editingIndex.value = -1
	editingAmount.value = ''
}

function confirmCategoryEdit() {
	const amount = roundBudget(Number(editingAmount.value))
	if (Number.isNaN(amount) || amount < 0) {
		uni.showToast({ title: '请输入有效金额', icon: 'none' })
		return
	}
	const otherTotal = categoryBudgets.value.reduce((sum, item, idx) => {
		return idx === editingIndex.value ? sum : sum + Number(item.amount)
	}, 0)
	if (otherTotal + amount > budgetAmount.value) {
		uni.showToast({ title: '分类合计不能超过总预算', icon: 'none' })
		return
	}

	categoryBudgets.value[editingIndex.value].amount = amount
	closeCategoryEditor()
}

function roundBudget(value) {
	return Math.round(Number(value) * 100) / 100
}

async function onSave() {
	try {
		if (budgetDiff.value !== 0) {
			uni.showToast({ title: '分类预算合计需等于总预算', icon: 'none' })
			return
		}
		if (budgetStore.hasBudget) {
			await budgetStore.modifyBudget(budgetStore.currentBudget.id, budgetAmount.value)
		} else {
			await budgetStore.setBudget(userStore.userId, targetYearMonth.value, budgetAmount.value)
		}
		saveCategoryBudgets()
		uni.showToast({ title: '预算设置成功喵~', icon: 'success' })
		setTimeout(() => { uni.navigateBack() }, 500)
	} catch (e) {
		uni.showToast({ title: '保存失败', icon: 'none' })
	}
}

function goBack() {
	uni.navigateBack()
}
</script>

<style lang="scss" scoped>
.page-budget {
	min-height: 100vh;
	background: var(--color-bg);
}

.page-content {
	padding: 0 24rpx;
	display: flex;
	flex-direction: column;
	min-height: 100vh;
}

.header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 80rpx 8rpx 32rpx;
}

.header-back {
	width: 72rpx;
	height: 72rpx;
	background: var(--color-bg-card);
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: var(--shadow-card);
}

.back-icon {
	font-size: 40rpx;
	color: var(--color-text-primary);
}

.header-placeholder {
	width: 72rpx;
}

.page-title {
	font-size: 36rpx;
	font-weight: 700;
	color: var(--color-text-primary);
}

.current-budget-hint {
	background: rgba(246, 196, 69, 0.1);
	border-radius: var(--radius-full);
	padding: 16rpx 32rpx;
	margin-bottom: 24rpx;
	text-align: center;
}

.hint-text {
	font-size: 24rpx;
	color: var(--color-primary);
	font-weight: 600;
}

/* 预算主卡片 */
.budget-main-card {
	background: var(--color-bg-card);
	border-radius: 48rpx;
	padding: 48rpx;
	box-shadow: var(--shadow-card);
	text-align: center;
	margin-bottom: 32rpx;
}

.budget-icon-wrap {
	display: inline-flex;
	padding: 24rpx;
	background: rgba(246, 196, 69, 0.1);
	border-radius: 50%;
	margin-bottom: 24rpx;
}

.budget-icon {
	font-size: 64rpx;
}

.budget-hint {
	display: block;
	font-size: 26rpx;
	color: var(--color-text-muted);
	margin-bottom: 8rpx;
}

.budget-value {
	display: block;
	font-size: 64rpx;
	font-weight: 800;
	color: var(--color-text-primary);
	margin-bottom: 32rpx;
}

.budget-slider {
	margin: 0 16rpx;
}

.slider-labels {
	display: flex;
	justify-content: space-between;
	margin-top: 12rpx;
	padding: 0 16rpx;
}

.slider-label {
	font-size: 22rpx;
	color: var(--color-text-muted);
}

/* 分类预算 */
.category-summary {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 8rpx;
	margin-bottom: 16rpx;
}

.category-summary-text {
	font-size: 22rpx;
	font-weight: 700;
	color: var(--color-text-muted);
}

.summary-ok {
	color: var(--color-success);
}

.summary-warning {
	color: var(--color-danger);
}

.category-budgets {
	display: flex;
	flex-direction: column;
	gap: 20rpx;
}

.category-budget-item {
	background: var(--color-bg-card);
	border-radius: 32rpx;
	padding: 28rpx 32rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	box-shadow: var(--shadow-card);
}

.cb-left {
	display: flex;
	align-items: center;
	gap: 20rpx;
}

.cb-icon {
	font-size: 32rpx;
}

.cb-name {
	font-size: 28rpx;
	font-weight: 700;
	color: var(--color-text-primary);
}

.cb-right {
	display: flex;
	align-items: center;
	gap: 12rpx;
}

.cb-amount {
	font-size: 26rpx;
	font-weight: 700;
	color: var(--color-text-primary);
}

.cb-paw {
	font-size: 36rpx;
	color: var(--color-primary);
}

.modal-mask {
	position: fixed;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.35);
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 48rpx;
	z-index: 9999;
}

.edit-modal {
	width: 100%;
	background: var(--color-bg-card);
	border-radius: 40rpx;
	padding: 40rpx;
	box-shadow: var(--shadow-elevated);
}

.edit-title {
	display: block;
	font-size: 32rpx;
	font-weight: 800;
	color: var(--color-text-primary);
	text-align: center;
	margin-bottom: 32rpx;
}

.edit-input-row {
	display: flex;
	align-items: center;
	background: var(--color-bg-gray);
	border-radius: 28rpx;
	padding: 24rpx 28rpx;
	margin-bottom: 20rpx;
}

.edit-prefix {
	font-size: 36rpx;
	font-weight: 800;
	color: var(--color-text-primary);
	margin-right: 12rpx;
}

.edit-input {
	flex: 1;
	font-size: 36rpx;
	font-weight: 800;
	color: var(--color-text-primary);
}

.edit-tip {
	display: block;
	font-size: 22rpx;
	color: var(--color-text-muted);
	text-align: center;
	margin-bottom: 32rpx;
}

.edit-actions {
	display: flex;
	gap: 20rpx;
}

.edit-btn {
	flex: 1;
	padding: 24rpx;
	border-radius: var(--radius-full);
	text-align: center;
}

.edit-cancel {
	background: var(--color-bg-gray);
}

.edit-confirm {
	background: var(--color-primary);
}

.edit-btn-text {
	font-size: 28rpx;
	font-weight: 800;
}

.cancel-text {
	color: var(--color-text-muted);
}

.confirm-text {
	color: #FFFFFF;
}

/* 保存按钮 */
.save-area {
	margin-top: auto;
	padding: 32rpx 0 64rpx;
}

.save-btn {
	width: 100%;
	padding: 32rpx;
	background: var(--color-primary);
	border-radius: var(--radius-full);
	text-align: center;
	box-shadow: 0 8rpx 24rpx rgba(246, 196, 69, 0.3);
}

.save-btn-text {
	font-size: 32rpx;
	font-weight: 700;
	color: #FFFFFF;
}
</style>
