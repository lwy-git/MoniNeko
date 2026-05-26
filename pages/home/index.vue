<template>
	<view class="page-home">
		<view class="page-content anim-fade-in">
			<!-- 顶部：月份 + 头像 -->
			<view class="header">
				<view class="header-left">
					<text class="month-arrow-btn" @tap="prevMonth">‹</text>
					<view class="month-display" @tap="resetToCurrentMonth">
						<text class="month-title">{{ currentMonth }}月</text>
					</view>
					<text class="month-arrow-btn" @tap="nextMonth">›</text>
				</view>
				<view class="avatar-wrap" @tap="goProfile">
					<image class="avatar-img" :src="catStore.breedEmoji" mode="aspectFit"></image>
				</view>
			</view>

			<cat-loading v-if="loading" />
			<view v-else class="main-content">
				<!-- 预算卡片 -->
				<view class="budget-card">
					<view class="budget-top">
						<view class="budget-left">
							<text class="budget-label">本月已花</text>
							<text class="budget-amount">¥ {{ formatMoney(monthSpent) }}</text>
						</view>
						<view class="budget-right">
							<text class="budget-label">预算剩余</text>
							<text class="budget-remain">¥ {{ formatMoney(budgetRemain) }}</text>
						</view>
					</view>
					<view class="progress-bar">
						<view class="progress-fill" :style="{ width: progressPercent + '%' }"></view>
					</view>
					<view class="budget-bottom">
						<view class="cat-status">
							<image class="cat-status-icon" :src="catStore.breedEmoji" mode="aspectFit"></image>
							<text class="cat-status-text">{{ catStatus.label }}喵~</text>
						</view>
						<view class="budget-btn" @tap="goBudget">
							<text class="budget-btn-text">调整预算</text>
						</view>
					</view>
				</view>

				<!-- 日历卡片 -->
				<view class="calendar-card">
					<view class="calendar-weekdays">
						<text v-for="day in weekdays" :key="day" class="weekday">{{ day }}</text>
					</view>
					<view class="calendar-grid">
						<view
							v-for="(cell, idx) in calendarCells"
							:key="idx"
							:class="['calendar-cell', { 'is-today': cell.isToday, 'is-other-month': cell.isOtherMonth }]"
							@tap="cell.day && !cell.isOtherMonth ? onDayTap(cell.day) : null"
						>
							<view v-if="cell.isToday" class="today-highlight">
								<text class="cell-day today-text">{{ cell.day }}</text>
							</view>
							<text v-else class="cell-day">{{ cell.day }}</text>
							<text v-if="cell.amount" class="cell-amount">{{ cell.amount }}</text>
							<text v-else-if="cell.day && !cell.isOtherMonth" class="cell-paw">🐾</text>
						</view>
					</view>
				</view>

				<!-- 快捷入口 -->
				<view class="quick-entries">
					<view class="quick-card quick-card-green" @tap="goDetail">
						<text class="quick-icon">📝</text>
						<view class="quick-info">
							<text class="quick-title">收支明细</text>
							<text class="quick-desc">查看每一笔</text>
						</view>
					</view>
					<view class="quick-card quick-card-pink" @tap="goStats">
						<text class="quick-icon">📊</text>
						<view class="quick-info">
							<text class="quick-title">数据分析</text>
							<text class="quick-desc">钱都花哪了</text>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 悬浮招财猫 -->
		<view class="floating-cat" @tap="goReport">
			<image class="floating-cat-img" :src="catStore.breedEmoji" mode="aspectFit"></image>
		</view>

		<my-custom-tabbar :current="0" />
	</view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { useExpenseStore } from '@/store/expense-store.js'
import { useBudgetStore } from '@/store/budget-store.js'
import { useUserStore } from '@/store/user-store.js'
import { useCatStore } from '@/store/cat-store.js'
import { BUDGET_STATUS } from '@/config/constants.js'

const expenseStore = useExpenseStore()
const budgetStore = useBudgetStore()
const userStore = useUserStore()
const catStore = useCatStore()
const loading = ref(false)

onShow(async () => {
	const hasLaunched = uni.getStorageSync('has_launched')
	if (!hasLaunched) {
		uni.navigateTo({ url: '/pages/splash/index' })
		return
	}
	loading.value = true
	await loadMonthData()
	await catStore.fetchCatStatus(userStore.userId)
	loading.value = false
})

const now = new Date()
const currentMonth = ref(now.getMonth() + 1)
const currentYear = ref(now.getFullYear())

async function loadMonthData() {
	const ym = `${currentYear.value}-${String(currentMonth.value).padStart(2, '0')}`
	await Promise.all([
		expenseStore.fetchByMonth(userStore.userId, ym),
		budgetStore.fetchBudgetByMonth(userStore.userId, ym)
	])
}

function prevMonth() {
	if (currentMonth.value === 1) {
		currentMonth.value = 12
		currentYear.value--
	} else {
		currentMonth.value--
	}
	loadMonthData()
}

function nextMonth() {
	const nowMonth = now.getMonth() + 1
	const nowYear = now.getFullYear()
	if (currentYear.value === nowYear && currentMonth.value >= nowMonth) return
	if (currentMonth.value === 12) {
		currentMonth.value = 1
		currentYear.value++
	} else {
		currentMonth.value++
	}
	loadMonthData()
}

function resetToCurrentMonth() {
	currentMonth.value = now.getMonth() + 1
	currentYear.value = now.getFullYear()
	loadMonthData()
}

const monthSpent = computed(() => expenseStore.monthTotal)
const monthBudget = computed(() => budgetStore.budgetAmount)
const budgetRemain = computed(() => monthBudget.value - monthSpent.value)
const progressPercent = computed(() => {
	if (monthBudget.value === 0) return 0
	return Math.min(100, Math.round((monthSpent.value / monthBudget.value) * 100))
})

const catStatus = computed(() => {
	if (monthBudget.value === 0) return BUDGET_STATUS.GOOD
	const ratio = monthSpent.value / monthBudget.value
	if (ratio >= 1) return BUDGET_STATUS.DANGER
	if (ratio >= 0.7) return BUDGET_STATUS.WARNING
	return BUDGET_STATUS.GOOD
})

const weekdays = ['日', '一', '二', '三', '四', '五', '六']

const calendarCells = computed(() => {
	const year = currentYear.value
	const month = currentMonth.value - 1
	const firstDay = new Date(year, month, 1).getDay()
	const daysInMonth = new Date(year, month + 1, 0).getDate()
	const today = now.getDate()

	const dailyAmounts = {}
	expenseStore.monthExpenses.forEach(e => {
		const day = parseInt(e.expense_date.split('-')[2], 10)
		dailyAmounts[day] = (dailyAmounts[day] || 0) + e.amount
	})

	const cells = []
	const prevMonthDays = new Date(year, month, 0).getDate()
	for (let i = firstDay - 1; i >= 0; i--) {
		cells.push({ day: prevMonthDays - i, isOtherMonth: true })
	}

	for (let d = 1; d <= daysInMonth; d++) {
		cells.push({
			day: d,
			isToday: d === today && month === now.getMonth() && year === now.getFullYear(),
			amount: dailyAmounts[d] ? Math.round(dailyAmounts[d]) : null,
			isOtherMonth: false
		})
	}

	const remaining = 42 - cells.length
	for (let i = 1; i <= remaining; i++) {
		cells.push({ day: i, isOtherMonth: true })
	}
	return cells
})

function formatMoney(val) {
	return Number(val).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

function onDayTap(day) {
	// TODO: 跳转到当日明细
}

function goProfile() {
	uni.switchTab({ url: '/pages/profile/index' })
}

function goBudget() {
	const ym = `${currentYear.value}-${String(currentMonth.value).padStart(2, '0')}`
	uni.navigateTo({ url: `/pages/budget/index?yearMonth=${ym}` })
}

function goDetail() {
	uni.switchTab({ url: '/pages/detail/index' })
}

function goStats() {
	uni.switchTab({ url: '/pages/stats/index' })
}

function goReport() {
	uni.navigateTo({ url: '/pages/report/index' })
}
</script>

<style lang="scss" scoped>
.page-home {
	min-height: 100vh;
	background: var(--color-bg);
	padding-bottom: var(--tabbar-height);
}

.page-content {
	padding: 0 24rpx 220rpx;
}

.header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 80rpx 8rpx 24rpx;
}

.header-left {
	display: flex;
	align-items: center;
	gap: 4rpx;
}

.month-display {
	display: flex;
	align-items: center;
	gap: 4rpx;
}

.month-title {
	font-size: 48rpx;
	font-weight: 800;
	color: var(--color-text-primary);
}

.month-arrow-btn {
	font-size: 44rpx;
	font-weight: 700;
	color: var(--color-text-muted);
	padding: 0 12rpx;
}

.avatar-wrap {
	width: 80rpx;
	height: 80rpx;
	border-radius: 50%;
	border: 4rpx solid var(--color-primary);
	display: flex;
	align-items: center;
	justify-content: center;
	overflow: hidden;
}

.avatar-img {
	width: 60rpx;
	height: 60rpx;
}

/* 预算卡片 */
.budget-card {
	background: var(--color-bg-card);
	border-radius: 48rpx;
	padding: 40rpx;
	box-shadow: var(--shadow-card);
	margin-bottom: 24rpx;
}

.budget-top {
	display: flex;
	justify-content: space-between;
	align-items: flex-end;
	margin-bottom: 16rpx;
}

.budget-left, .budget-right {
	display: flex;
	flex-direction: column;
}

.budget-right {
	text-align: right;
}

.budget-label {
	font-size: 22rpx;
	color: var(--color-text-muted);
	margin-bottom: 8rpx;
}

.budget-amount {
	font-size: 44rpx;
	font-weight: 800;
	color: var(--color-text-primary);
}

.budget-remain {
	font-size: 28rpx;
	font-weight: 700;
	color: #34D399;
}

.progress-bar {
	height: 16rpx;
	background: var(--color-bg-gray);
	border-radius: var(--radius-full);
	overflow: hidden;
}

.progress-fill {
	height: 100%;
	background: #34D399;
	border-radius: var(--radius-full);
	transition: width 0.5s;
}

.budget-bottom {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-top: 20rpx;
}

.cat-status {
	display: flex;
	align-items: center;
	gap: 8rpx;
}

.cat-status-icon {
	width: 36rpx;
	height: 36rpx;
}

.cat-status-text {
	font-size: 22rpx;
	color: var(--color-text-muted);
}

.budget-btn {
	background: rgba(246, 196, 69, 0.1);
	padding: 8rpx 20rpx;
	border-radius: var(--radius-full);
}

.budget-btn-text {
	font-size: 20rpx;
	font-weight: 700;
	color: var(--color-primary);
}

/* 日历卡片 */
.calendar-card {
	background: var(--color-bg-card);
	border-radius: 48rpx;
	padding: 32rpx;
	box-shadow: var(--shadow-card);
	margin-bottom: 24rpx;
}

.calendar-weekdays {
	display: grid;
	grid-template-columns: repeat(7, 1fr);
	text-align: center;
	margin-bottom: 16rpx;
}

.weekday {
	font-size: 20rpx;
	font-weight: 700;
	color: var(--color-text-muted);
}

.calendar-grid {
	display: grid;
	grid-template-columns: repeat(7, 1fr);
	gap: 12rpx 0;
}

.calendar-cell {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	height: 80rpx;
}

.calendar-cell.is-other-month {
	opacity: 0.2;
}

.cell-day {
	font-size: 24rpx;
	font-weight: 700;
	color: var(--color-text-primary);
}

.today-highlight {
	width: 56rpx;
	height: 56rpx;
	background: var(--color-primary);
	border-radius: 16rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.today-text {
	font-size: 24rpx;
	font-weight: 700;
	color: #FFFFFF;
}

.cell-amount {
	font-size: 16rpx;
	color: #EF4444;
	margin-top: 2rpx;
}

.cell-paw {
	font-size: 14rpx;
	margin-top: 2rpx;
}

/* 快捷入口 */
.quick-entries {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 24rpx;
	margin-bottom: 40rpx;
}

.quick-card {
	padding: 32rpx;
	border-radius: 32rpx;
	display: flex;
	align-items: center;
	gap: 20rpx;
}

.quick-card-green {
	background: rgba(52, 211, 153, 0.1);
}

.quick-card-pink {
	background: rgba(244, 114, 182, 0.1);
}

.quick-icon {
	font-size: 40rpx;
}

.quick-info {
	display: flex;
	flex-direction: column;
}

.quick-title {
	font-size: 26rpx;
	font-weight: 700;
	color: var(--color-text-primary);
}

.quick-desc {
	font-size: 20rpx;
	color: var(--color-text-muted);
}

/* 悬浮招财猫 */
.floating-cat {
	position: fixed;
	bottom: 200rpx;
	right: 32rpx;
	width: 96rpx;
	height: 96rpx;
	background: var(--color-bg-card);
	border-radius: 32rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: var(--shadow-elevated);
	border: 2rpx solid var(--color-primary);
	z-index: 100;
	animation: floating 3s ease-in-out infinite;
}

.floating-cat-img {
	width: 56rpx;
	height: 56rpx;
}

@keyframes floating {
	0%, 100% { transform: translateY(0); }
	50% { transform: translateY(-10rpx); }
}
</style>
