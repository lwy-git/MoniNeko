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
			<view class="category-budgets">
				<view class="category-budget-item" v-for="(item, idx) in categoryBudgets" :key="idx">
					<view class="cb-left">
						<text class="cb-icon">{{ item.icon }}</text>
						<text class="cb-name">{{ item.name }}</text>
					</view>
					<view class="cb-right">
						<text class="cb-amount">¥{{ item.amount.toLocaleString() }}</text>
						<text class="cb-paw">🐾</text>
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
	</view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useBudgetStore } from '@/store/budget-store.js'
import { useUserStore } from '@/store/user-store.js'
import { getCurrentYearMonth } from '@/utils/helpers.js'

const budgetStore = useBudgetStore()
const userStore = useUserStore()

const budgetAmount = ref(4000)

const categoryBudgets = ref([
	{ icon: '🍔', name: '餐饮预算', amount: 1500 },
	{ icon: '🛍', name: '购物预算', amount: 1000 }
])

onMounted(async () => {
	await budgetStore.fetchCurrentBudget(userStore.userId)
	if (budgetStore.hasBudget) {
		budgetAmount.value = budgetStore.budgetAmount
	}
})

function onSliderChange(e) {
	budgetAmount.value = e.detail.value
}

async function onSave() {
	const yearMonth = getCurrentYearMonth()
	try {
		if (budgetStore.hasBudget) {
			await budgetStore.modifyBudget(budgetStore.currentBudget.id, budgetAmount.value)
		} else {
			await budgetStore.setBudget(userStore.userId, yearMonth, budgetAmount.value)
		}
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
	font-size: 24rpx;
	color: var(--color-primary);
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
