<template>
	<view class="page-report">
		<view class="report-overlay" @tap="goBack">
			<view class="report-card" @tap.stop>
				<!-- 装饰圆 -->
				<view class="deco-circle"></view>

				<!-- 猫咪 -->
				<view class="report-cat">
					<text class="report-cat-emoji">😻</text>
				</view>

				<!-- 猫咪对话气泡 -->
				<view class="chat-bubble">
					<view class="bubble-arrow"></view>
					<text class="bubble-text">铲屎官，今天的账单算好啦喵！</text>
				</view>

				<!-- 数据 -->
				<view class="report-data">
					<view class="report-row">
						<text class="report-label">今日总支出</text>
						<text class="report-value">¥ {{ formatAmount(todaySpent) }}</text>
					</view>
					<view class="report-row">
						<text class="report-label">预算剩余</text>
						<text class="report-value report-value-green">¥ {{ formatAmount(budgetRemain) }}</text>
					</view>
					<view class="report-divider"></view>
					<text class="report-quote">{{ suggestion }}</text>
				</view>

				<!-- 按钮 -->
				<view class="report-btn" @tap="goBack">
					<text class="report-btn-text">知道了喵～</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { computed } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { useExpenseStore } from '@/store/expense-store.js'
import { useBudgetStore } from '@/store/budget-store.js'
import { useUserStore } from '@/store/user-store.js'
import { getToday, getRemainingDays, getCurrentYearMonth } from '@/utils/helpers.js'

const expenseStore = useExpenseStore()
const budgetStore = useBudgetStore()
const userStore = useUserStore()

onShow(async () => {
	const today = getToday()
	const yearMonth = getCurrentYearMonth()
	await Promise.all([
		expenseStore.fetchByDate(userStore.userId, today),
		expenseStore.fetchByMonth(userStore.userId, yearMonth),
		budgetStore.fetchCurrentBudget(userStore.userId)
	])
})

const todaySpent = computed(() => expenseStore.todayTotal)
const budgetRemain = computed(() => budgetStore.budgetAmount - expenseStore.monthTotal)

const suggestion = computed(() => {
	const remain = budgetRemain.value
	const days = getRemainingDays()
	if (remain <= 0) return '"预算已经超支了喵...要注意控制开销哦 🙀"'
	const dailyBudget = Math.round(remain / days)
	return `"建议每天花费不超过 ¥${dailyBudget}，就能安全到月底喵 🐟！"`
})

function formatAmount(val) {
	return Number(val).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

function goBack() {
	uni.navigateBack()
}
</script>

<style lang="scss" scoped>
.page-report {
	min-height: 100vh;
}

.report-overlay {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.4);
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 48rpx;
	z-index: 1000;
}

.report-card {
	width: 100%;
	background: var(--color-bg-card);
	border-radius: 64rpx;
	padding: 48rpx;
	position: relative;
	overflow: hidden;
}

.deco-circle {
	position: absolute;
	top: -64rpx;
	right: -64rpx;
	width: 200rpx;
	height: 200rpx;
	background: rgba(246, 196, 69, 0.1);
	border-radius: 50%;
}

.report-cat {
	display: flex;
	justify-content: center;
	margin-bottom: 32rpx;
}

.report-cat-emoji {
	font-size: 120rpx;
}

.chat-bubble {
	background: var(--color-bg);
	border-radius: 32rpx;
	padding: 24rpx 32rpx;
	margin-bottom: 32rpx;
	position: relative;
}

.bubble-arrow {
	position: absolute;
	top: -12rpx;
	left: 80rpx;
	width: 24rpx;
	height: 24rpx;
	background: var(--color-bg);
	transform: rotate(45deg);
}

.bubble-text {
	font-size: 26rpx;
	font-weight: 700;
	color: var(--color-text-primary);
	text-align: center;
}

.report-data {
	margin-bottom: 40rpx;
}

.report-row {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 24rpx;
}

.report-label {
	font-size: 26rpx;
	color: var(--color-text-muted);
}

.report-value {
	font-size: 36rpx;
	font-weight: 800;
	color: var(--color-text-primary);
}

.report-value-green {
	color: #34D399;
}

.report-divider {
	height: 2rpx;
	background: var(--color-bg-gray);
	margin: 16rpx 0 24rpx;
}

.report-quote {
	font-size: 24rpx;
	color: var(--color-text-muted);
	text-align: center;
	font-style: italic;
	line-height: 1.6;
}

.report-btn {
	width: 100%;
	padding: 32rpx;
	background: var(--color-primary);
	border-radius: var(--radius-full);
	text-align: center;
	box-shadow: 0 8rpx 24rpx rgba(246, 196, 69, 0.3);
}

.report-btn-text {
	font-size: 30rpx;
	font-weight: 700;
	color: #FFFFFF;
}
</style>
