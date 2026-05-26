<template>
	<view class="page-stats">
		<view class="page-content anim-fade-in">
			<!-- 顶部 -->
			<view class="header">
				<view class="header-back" @tap="goBack">
					<text class="back-icon">‹</text>
				</view>
				<view class="month-nav">
					<text class="month-arrow-btn" @tap="prevMonth">‹</text>
					<text class="month-text" @tap="resetMonth">{{ displayMonth }}</text>
					<text class="month-arrow-btn" @tap="nextMonth">›</text>
				</view>
				<view class="header-placeholder"></view>
			</view>

			<cat-loading v-if="loading" />
			<scroll-view v-else scroll-y class="stats-scroll">
				<view v-if="periodTotal === 0" class="empty-state">
					<image class="empty-icon" src="/static/icons/tabbar/baimao.svg"></image>
					<text class="empty-text">这个月还没有消费记录喵~</text>
					<text class="empty-sub">快去记一笔吧</text>
				</view>
				<view v-else>
				<!-- 周/月切换 -->
				<view class="period-switch">
					<text :class="['period-item', { 'period-active': currentPeriod === 'week' }]" @tap="currentPeriod = 'week'">周</text>
					<text :class="['period-item', { 'period-active': currentPeriod === 'month' }]" @tap="currentPeriod = 'month'">月</text>
				</view>

				<!-- 总支出卡片 -->
				<view class="total-card">
					<text class="total-label">总支出</text>
					<text class="total-amount">¥ {{ formatAmount(periodTotal) }}</text>
					<!-- 饼图占位 -->
					<view class="chart-placeholder">
						<view class="pie-mock" :style="{ background: pieGradient }"></view>
						<view class="pie-legend">
							<view class="legend-item" v-for="(item, idx) in categoryStats" :key="idx">
								<view class="legend-dot" :style="{ background: item.color }"></view>
								<text class="legend-text">{{ item.label }} {{ item.percent }}%</text>
							</view>
						</view>
					</view>
				</view>

				<!-- 消费趋势 -->
				<view class="trend-card">
					<view class="trend-header">
						<text class="trend-title">消费趋势</text>
						<text class="trend-sub">最近7天</text>
					</view>
					<view class="trend-bars">
						<view v-for="(bar, idx) in trendData" :key="idx" class="bar-col">
							<view class="bar-track">
								<view class="bar-fill" :style="{ height: bar.percent + '%' }"></view>
							</view>
							<text class="bar-label">{{ bar.day }}</text>
						</view>
					</view>
				</view>

				<!-- 消费排行 -->
				<view class="rank-section">
					<text class="rank-title">消费排行榜</text>
					<view class="rank-item" v-for="(item, idx) in rankData" :key="idx">
						<view class="rank-left">
							<text class="rank-icon">{{ item.icon }}</text>
							<text class="rank-name">{{ item.name }}</text>
						</view>
						<view class="rank-right">
							<text class="rank-amount">¥ {{ item.amount }}</text>
							<text class="rank-percent">占比 {{ item.percent }}%</text>
						</view>
					</view>
				</view>
				</view>
			</scroll-view>
		</view>
		<my-custom-tabbar :current="1" />
	</view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { useExpenseStore } from '@/store/expense-store.js'
import { useUserStore } from '@/store/user-store.js'
import { CATEGORIES, INCOME_CATEGORIES } from '@/config/constants.js'
import { useExpense } from '@/hooks/use-expense.js'

const expenseStore = useExpenseStore()
const userStore = useUserStore()
const { loadByMonth } = useExpense()
const loading = ref(false)

const currentPeriod = ref('month')
const statsYear = ref(new Date().getFullYear())
const statsMonth = ref(new Date().getMonth() + 1)
const statsExpenses = ref([])

const categoryMap = {}
CATEGORIES.forEach(c => { categoryMap[c.key] = c })
INCOME_CATEGORIES.forEach(c => { categoryMap[c.key] = c })

const statsYearMonth = computed(() =>
	`${statsYear.value}-${String(statsMonth.value).padStart(2, '0')}`
)

const displayMonth = computed(() => `${statsMonth.value}月`)

function prevMonth() {
	if (statsMonth.value === 1) {
		statsMonth.value = 12
		statsYear.value--
	} else {
		statsMonth.value--
	}
	loadStatsData()
}

function nextMonth() {
	const now = new Date()
	const nowYear = now.getFullYear()
	const nowMonth = now.getMonth() + 1
	if (statsYear.value === nowYear && statsMonth.value >= nowMonth) return
	if (statsMonth.value === 12) {
		statsMonth.value = 1
		statsYear.value++
	} else {
		statsMonth.value++
	}
	loadStatsData()
}

function resetMonth() {
	const now = new Date()
	statsYear.value = now.getFullYear()
	statsMonth.value = now.getMonth() + 1
	loadStatsData()
}

async function loadStatsData() {
	loading.value = true
	statsExpenses.value = await loadByMonth(userStore.userId, statsYearMonth.value)
	loading.value = false
}

onShow(() => {
	loadStatsData()
})

const expenseRecords = computed(() =>
	statsExpenses.value.filter(e => e.type !== 'income')
)

const periodExpenses = computed(() => {
	if (currentPeriod.value === 'week') {
		const now = new Date()
		const weekAgo = new Date(now)
		weekAgo.setDate(weekAgo.getDate() - 6)
		const weekAgoStr = `${weekAgo.getFullYear()}-${String(weekAgo.getMonth() + 1).padStart(2, '0')}-${String(weekAgo.getDate()).padStart(2, '0')}`
		return expenseRecords.value.filter(e => e.expense_date >= weekAgoStr)
	}
	return expenseRecords.value
})

const periodTotal = computed(() =>
	periodExpenses.value.reduce((sum, e) => sum + e.amount, 0)
)

const categoryStats = computed(() => {
	if (periodTotal.value === 0) return []

	const grouped = {}
	periodExpenses.value.forEach(e => {
		const key = e.category || 'other'
		grouped[key] = (grouped[key] || 0) + e.amount
	})

	return Object.entries(grouped)
		.map(([key, amount]) => {
			const cat = categoryMap[key] || { label: '其他', color: '#9CA3AF', icon: '🐾' }
			return { key, label: cat.label, icon: cat.icon, color: cat.color, amount, percent: Math.round((amount / periodTotal.value) * 100) }
		})
		.sort((a, b) => b.amount - a.amount)
		.slice(0, 5)
})

const pieGradient = computed(() => {
	if (categoryStats.value.length === 0) return 'var(--color-bg-gray)'
	let acc = 0
	const stops = categoryStats.value.map(item => {
		const start = acc
		acc += item.percent
		return `${item.color} ${start}% ${acc}%`
	})
	if (acc < 100) {
		stops.push(`#9CA3AF ${acc}% 100%`)
	}
	return `conic-gradient(${stops.join(', ')})`
})

const trendData = computed(() => {
	const days = ['一', '二', '三', '四', '五', '六', '日']
	const now = new Date()
	const dailyTotals = []

	for (let i = 6; i >= 0; i--) {
		const d = new Date(now)
		d.setDate(d.getDate() - i)
		const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
		const dayTotal = expenseRecords.value
			.filter(e => e.expense_date === dateStr)
			.reduce((sum, e) => sum + e.amount, 0)
		dailyTotals.push({ day: days[d.getDay() === 0 ? 6 : d.getDay() - 1], amount: dayTotal })
	}

	const maxAmount = Math.max(...dailyTotals.map(d => d.amount), 1)
	return dailyTotals.map(d => ({
		day: d.day,
		percent: Math.round((d.amount / maxAmount) * 100)
	}))
})

const rankData = computed(() => {
	return categoryStats.value.map(item => ({
		icon: item.icon,
		name: item.label,
		amount: Number(item.amount).toFixed(2),
		percent: item.percent
	}))
})

function formatAmount(val) {
	return Number(val).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

function goBack() {
	uni.switchTab({ url: '/pages/home/index' })
}
</script>

<style lang="scss" scoped>
.page-stats {
	min-height: 100vh;
	background: var(--color-bg);
	padding-bottom: var(--tabbar-height);
}

.page-content {
	display: flex;
	flex-direction: column;
	height: 100vh;
}

.header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 80rpx 24rpx 24rpx;
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

.month-nav {
	display: flex;
	align-items: center;
	gap: 16rpx;
}

.month-arrow-btn {
	width: 48rpx;
	height: 48rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 36rpx;
	color: var(--color-text-primary);
	font-weight: 700;
}

.month-text {
	font-size: 32rpx;
	font-weight: 700;
	color: var(--color-text-primary);
}

.page-title {
	font-size: 36rpx;
	font-weight: 700;
	color: var(--color-text-primary);
}

.stats-scroll {
	flex: 1;
	padding: 0 24rpx 220rpx;
	box-sizing: border-box;
}

/* 周期切换 */
.period-switch {
	display: flex;
	background: var(--color-bg-card);
	border-radius: var(--radius-full);
	padding: 4rpx;
	margin-bottom: 32rpx;
	margin-right: 12rpx;
}

.period-item {
	flex: 1;
	text-align: center;
	padding: 16rpx;
	font-size: 26rpx;
	font-weight: 700;
	color: var(--color-text-muted);
	border-radius: var(--radius-full);
}

.period-active {
	background: var(--color-primary);
	color: #FFFFFF;
	box-shadow: var(--shadow-card);
}

/* 总支出卡片 */
.total-card {
	background: var(--color-bg-card);
	border-radius: 48rpx;
	padding: 40rpx;
	box-shadow: var(--shadow-card);
	margin-bottom: 24rpx;
	text-align: center;
	margin-right: 12rpx;
}

.total-label {
	font-size: 22rpx;
	color: var(--color-text-muted);
}

.total-amount {
	display: block;
	font-size: 44rpx;
	font-weight: 800;
	color: var(--color-text-primary);
	margin-top: 8rpx;
	margin-bottom: 32rpx;
}

.chart-placeholder {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 40rpx;
}

.pie-mock {
	width: 200rpx;
	height: 200rpx;
	border-radius: 50%;
	position: relative;
}

.pie-mock::after {
	content: '';
	position: absolute;
	top: 25%;
	left: 25%;
	width: 50%;
	height: 50%;
	background: var(--color-bg-card);
	border-radius: 50%;
}

.pie-legend {
	display: flex;
	flex-direction: column;
	gap: 12rpx;
}

.legend-item {
	display: flex;
	align-items: center;
	gap: 12rpx;
}

.legend-dot {
	width: 16rpx;
	height: 16rpx;
	border-radius: 50%;
}

.legend-text {
	font-size: 22rpx;
	color: var(--color-text-muted);
}

/* 趋势卡片 */
.trend-card {
	background: var(--color-bg-card);
	border-radius: 48rpx;
	padding: 40rpx;
	box-shadow: var(--shadow-card);
	margin-bottom: 24rpx;
	margin-right:12rpx;
}

.trend-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 32rpx;
}

.trend-title {
	font-size: 28rpx;
	font-weight: 700;
	color: var(--color-text-primary);
}

.trend-sub {
	font-size: 20rpx;
	color: var(--color-text-muted);
}

.trend-bars {
	display: flex;
	justify-content: space-between;
	align-items: flex-end;
	height: 200rpx;
}

.bar-col {
	display: flex;
	flex-direction: column;
	align-items: center;
	flex: 1;
	gap: 8rpx;
}

.bar-track {
	width: 32rpx;
	height: 160rpx;
	background: var(--color-bg-gray);
	border-radius: var(--radius-full);
	display: flex;
	align-items: flex-end;
	overflow: hidden;
}

.bar-fill {
	width: 100%;
	background: var(--color-primary);
	border-radius: var(--radius-full);
	transition: height 0.3s;
}

.bar-label {
	font-size: 20rpx;
	color: var(--color-text-muted);
}

/* 排行 */
.rank-section {
	margin-bottom: 40rpx;
}

.rank-title {
	font-size: 28rpx;
	font-weight: 700;
	color: var(--color-text-primary);
	margin-bottom: 20rpx;
	padding: 0 8rpx;
}

.rank-item {
	background: var(--color-bg-card);
	border-radius: 32rpx;
	padding: 28rpx 24rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 16rpx;
	margin-right: 12rpx;
}

.rank-left {
	display: flex;
	align-items: center;
	gap: 20rpx;
}

.rank-icon {
	font-size: 32rpx;
}

.rank-name {
	font-size: 28rpx;
	font-weight: 700;
	color: var(--color-text-primary);
}

.rank-right {
	text-align: right;
}

.rank-amount {
	font-size: 28rpx;
	font-weight: 700;
	color: var(--color-text-primary);
}

.rank-percent {
	display: block;
	font-size: 20rpx;
	color: var(--color-text-muted);
}

.empty-state {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 200rpx 0;
}

.empty-icon {
	font-size: 120rpx;
	margin-bottom: 24rpx;
}

.empty-text {
	font-size: 28rpx;
	color: var(--color-text-muted);
	font-weight: 700;
}

.empty-sub {
	font-size: 22rpx;
	color: var(--color-text-muted);
	margin-top: 8rpx;
}
</style>
