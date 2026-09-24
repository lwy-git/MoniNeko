<template>
	<view class="page-detail">
		<view class="page-content anim-fade-in">
			<!-- 顶部 -->
			<view class="header">
				<view class="header-back" @tap="goBack">
					<text class="back-icon">‹</text>
				</view>
				<text class="page-title">{{ focusedDate ? '当日明细' : '记账明细' }}</text>
				<view class="header-search" @tap="showSearch = !showSearch">
					<text class="search-icon">🔍</text>
				</view>
			</view>

			<!-- 搜索栏 -->
			<view v-if="showSearch" class="search-bar">
				<view class="search-input-wrap">
					<text class="search-input-icon">🔍</text>
					<input class="search-input" v-model="searchKeyword" placeholder="搜索记录..." />
					<text v-if="searchKeyword" class="search-clear" @tap="searchKeyword = ''">✕</text>
				</view>
				<scroll-view scroll-x class="filter-chips">
					<text :class="['filter-chip', { 'filter-chip-active': !filterCategory }]" @tap="filterCategory = null">全部</text>
					<text
						v-for="cat in allCategories"
						:key="cat.key"
						:class="['filter-chip', { 'filter-chip-active': filterCategory === cat.key }]"
						@tap="filterCategory = filterCategory === cat.key ? null : cat.key"
					>{{ cat.icon }} {{ cat.label }}</text>
				</scroll-view>
			</view>

			<!-- 时间轴列表 -->
			<cat-loading v-if="loading" />
			<scroll-view v-else scroll-y class="timeline-scroll">
				<view v-if="filteredExpenses.length === 0" class="empty-state">
					<text class="empty-icon">🐾</text>
					<text class="empty-text">{{ searchKeyword || filterCategory ? '没有找到匹配的记录喵~' : '还没有记录喵，快去记一笔吧~' }}</text>
				</view>

				<view class="day-group" v-for="(group, gIdx) in filteredExpenses" :key="gIdx">
					<view class="day-header">
						<view :class="['day-badge', gIdx === 0 ? 'day-badge-today' : 'day-badge-past']">
							<text :class="gIdx === 0 ? 'day-badge-text' : 'day-badge-text-past'">{{ group.label }}</text>
						</view>
						<view class="day-line"></view>
					</view>
					<view :class="['day-items', { 'day-items-past': gIdx > 0 }]">
						<view class="timeline-item" v-for="(item, idx) in group.items" :key="item.id || idx">
							<view :class="['timeline-dot', { 'timeline-dot-past': gIdx > 0 }]"></view>
							<view class="swipe-container" @tap="resetSwipe">
								<view
									:class="['item-card', { 'item-card-past': gIdx > 0 }]"
									:style="{ transform: `translateX(${swipingId === item.id ? -160 : 0}rpx)` }"
									@tap.stop="goEdit(item)"
									@touchstart.passive="onTouchStart($event, item)"
									@touchmove.passive="onTouchMove($event)"
									@touchend="onTouchEnd($event, item)"
								>
									<view class="item-left">
										<view class="item-icon-wrap" :style="{ background: item.bgColor }">
											<text class="item-icon">{{ item.icon }}</text>
										</view>
										<view class="item-info">
											<text class="item-name">{{ item.name }}</text>
											<text class="item-meta">{{ item.time }}{{ item.remark ? ' · ' + item.remark : '' }}</text>
										</view>
									</view>
									<text class="item-amount">{{ item.type === 'income' ? '+' : '-' }}{{ item.amountStr }}</text>
								</view>
								<view class="delete-btn" @tap.stop="confirmDelete(item.id)">
									<text class="delete-btn-text">删除</text>
								</view>
							</view>
						</view>
					</view>
				</view>

				<view v-if="focusedDate" class="date-summary">
					<view class="date-summary-info">
						<text class="date-summary-label">当日支出</text>
						<text class="date-summary-value">¥{{ focusedDateTotal.toFixed(2) }}</text>
					</view>
					<view class="quick-add-btn" @tap="quickAddForDate">
						<text class="quick-add-text">＋ 快速记一笔</text>
					</view>
				</view>
			</scroll-view>
		</view>
		<my-custom-tabbar :current="3" />
	</view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onShow, onHide } from '@dcloudio/uni-app'
import { useExpenseStore } from '@/store/expense-store.js'
import { useUserStore } from '@/store/user-store.js'
import { CATEGORIES, INCOME_CATEGORIES } from '@/config/constants.js'
import { getCurrentYearMonth, getToday } from '@/utils/helpers.js'

const expenseStore = useExpenseStore()
const userStore = useUserStore()

const categoryMap = {}
CATEGORIES.forEach(c => { categoryMap[c.key] = c })
INCOME_CATEGORIES.forEach(c => { categoryMap[c.key] = c })

const allCategories = [...CATEGORIES, ...INCOME_CATEGORIES]

const swipingId = ref(null)
const loading = ref(false)
const showSearch = ref(false)
const searchKeyword = ref('')
const filterCategory = ref(null)
const focusedDate = ref('')
let touchStartX = 0
let touchStartY = 0
let isSwiping = false

function onTouchStart(e, item) {
	touchStartX = e.touches[0].clientX
	touchStartY = e.touches[0].clientY
	isSwiping = false
}

function onTouchMove(e) {
	const deltaX = e.touches[0].clientX - touchStartX
	const deltaY = e.touches[0].clientY - touchStartY
	if (!isSwiping && Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
		isSwiping = true
	}
}

function onTouchEnd(e, item) {
	if (!isSwiping) return
	const deltaX = e.changedTouches[0].clientX - touchStartX
	if (deltaX < -60) {
		swipingId.value = item.id
	} else {
		swipingId.value = null
	}
}

function resetSwipe() {
	swipingId.value = null
}

function confirmDelete(id) {
	uni.showModal({
		title: '确认删除',
		content: '确定要删除这条记录喵？',
		success: async (res) => {
			if (res.confirm) {
				await expenseStore.removeExpense(id)
				uni.showToast({ title: '已删除喵~', icon: 'none' })
			}
			swipingId.value = null
		}
	})
}

function goEdit(item) {
	if (swipingId.value || isSwiping) return
	expenseStore.setEditingRecord(item.raw)
	uni.switchTab({ url: '/pages/add/index' })
}

onShow(async () => {
	loading.value = true
	const requestedDate = expenseStore.consumeDetailDate()
	if (requestedDate) {
		focusedDate.value = requestedDate
	}
	if (focusedDate.value) {
		await expenseStore.fetchByDate(userStore.userId, focusedDate.value)
	} else {
		const yearMonth = getCurrentYearMonth()
		await expenseStore.fetchByMonth(userStore.userId, yearMonth)
	}
	loading.value = false
})

onHide(() => {
	focusedDate.value = ''
	swipingId.value = null
})

const groupedExpenses = computed(() => {
	const expenses = focusedDate.value ? expenseStore.todayExpenses : expenseStore.monthExpenses
	if (!expenses.length) return []

	const today = getToday()
	const yesterday = (() => {
		const d = new Date()
		d.setDate(d.getDate() - 1)
		return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
	})()

	const groups = {}
	expenses.forEach(e => {
		const date = e.expense_date
		if (!groups[date]) groups[date] = []
		const cat = categoryMap[e.category] || { icon: '🐾', label: '其他', color: '#9CA3AF' }
		groups[date].push({
			id: e.id,
			icon: cat.icon,
			name: e.item_name || cat.label,
			time: e.expense_time || '',
			remark: e.remark || '',
			amountStr: Number(e.amount).toFixed(2),
			type: e.type || 'expense',
			bgColor: `${cat.color}1A`,
			raw: e
		})
	})

	const sortedDates = Object.keys(groups).sort((a, b) => b.localeCompare(a))
	return sortedDates.map(date => {
		let label
		if (date === today) {
			const m = parseInt(date.split('-')[1], 10)
			const d = parseInt(date.split('-')[2], 10)
			label = `${m}月${d}日 今日`
		} else if (date === yesterday) {
			const m = parseInt(date.split('-')[1], 10)
			const d = parseInt(date.split('-')[2], 10)
			label = `${m}月${d}日 昨天`
		} else {
			const m = parseInt(date.split('-')[1], 10)
			const d = parseInt(date.split('-')[2], 10)
			label = `${m}月${d}日`
		}
		return { date, label, items: groups[date] }
	})
})

const focusedDateTotal = computed(() => {
	return expenseStore.todayExpenses
		.filter(item => item.type !== 'income')
		.reduce((sum, item) => sum + Number(item.amount), 0)
})

const filteredExpenses = computed(() => {
	const groups = groupedExpenses.value
	if (!searchKeyword.value && !filterCategory.value) return groups

	const keyword = searchKeyword.value.toLowerCase()
	return groups
		.map(group => {
			const items = group.items.filter(item => {
				if (filterCategory.value && item.raw.category !== filterCategory.value) return false
				if (keyword) {
					const nameMatch = (item.name || '').toLowerCase().includes(keyword)
					const remarkMatch = (item.remark || '').toLowerCase().includes(keyword)
					if (!nameMatch && !remarkMatch) return false
				}
				return true
			})
			return { ...group, items }
		})
		.filter(group => group.items.length > 0)
})

function goBack() {
	focusedDate.value = ''
	uni.switchTab({ url: '/pages/home/index' })
}

function quickAddForDate() {
	expenseStore.createForDate(focusedDate.value)
	uni.switchTab({ url: '/pages/add/index' })
}
</script>

<style lang="scss" scoped>
.page-detail {
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

.header-back, .header-search {
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

.search-icon {
	font-size: 32rpx;
}

.page-title {
	font-size: 36rpx;
	font-weight: 700;
	color: var(--color-text-primary);
}

.timeline-scroll {
	flex: 1;
	padding: 0 24rpx 220rpx;
	box-sizing: border-box;
}

/* 搜索栏 */
.search-bar {
	padding: 0 24rpx 16rpx;
}

.search-input-wrap {
	display: flex;
	align-items: center;
	background: var(--color-bg-card);
	border-radius: var(--radius-full);
	padding: 16rpx 24rpx;
	gap: 12rpx;
	box-shadow: var(--shadow-card);
}

.search-input-icon {
	font-size: 24rpx;
}

.search-input {
	flex: 1;
	font-size: 26rpx;
	color: var(--color-text-primary);
}

.search-clear {
	font-size: 24rpx;
	color: var(--color-text-muted);
	padding: 8rpx;
}

.filter-chips {
	display: flex;
	white-space: nowrap;
	margin-top: 16rpx;
	padding: 4rpx 0;
}

.filter-chip {
	display: inline-block;
	padding: 10rpx 24rpx;
	font-size: 22rpx;
	font-weight: 600;
	color: var(--color-text-muted);
	background: var(--color-bg-card);
	border-radius: var(--radius-full);
	margin-right: 12rpx;
}

.filter-chip-active {
	background: var(--color-primary);
	color: #FFFFFF;
}

/* 日期分组 */
.day-group {
	margin-bottom: 40rpx;
	margin-right: 12rpx;
}

.day-header {
	display: flex;
	align-items: center;
	gap: 16rpx;
	margin-bottom: 24rpx;
}

.day-badge {
	padding: 8rpx 24rpx;
	border-radius: var(--radius-full);
}

.day-badge-today {
	background: var(--color-primary);
}

.day-badge-past {
	background: var(--color-bg-gray);
}

.day-badge-text {
	font-size: 22rpx;
	font-weight: 700;
	color: #FFFFFF;
}

.day-badge-text-past {
	font-size: 22rpx;
	font-weight: 700;
	color: var(--color-text-muted);
}

.day-line {
	flex: 1;
	height: 2rpx;
	background: var(--color-bg-gray);
}

/* 时间轴条目 */
.day-items {
	padding-left: 16rpx;
	border-left: 4rpx solid rgba(246, 196, 69, 0.2);
	margin-left: 16rpx;
}

.day-items-past {
	border-left-color: var(--color-bg-gray);
}

.timeline-item {
	position: relative;
	margin-bottom: 24rpx;
}

.swipe-container {
	position: relative;
	overflow: hidden;
	border-radius: 32rpx;
	margin-left: 16rpx;
}

.timeline-dot {
	position: absolute;
	left: -28rpx;
	top: 36rpx;
	width: 24rpx;
	height: 24rpx;
	background: var(--color-primary);
	border-radius: 50%;
	border: 6rpx solid var(--color-bg);
}

.timeline-dot-past {
	background: var(--color-bg-gray);
}

.item-card {
	background: var(--color-bg-card);
	border-radius: 32rpx;
	padding: 28rpx 24rpx;
	box-shadow: var(--shadow-card);
	display: flex;
	align-items: center;
	justify-content: space-between;
	transition: transform 0.2s ease;
	position: relative;
	z-index: 1;
}

.delete-btn {
	position: absolute;
	right: 0;
	top: 0;
	bottom: 0;
	width: 160rpx;
	background: #EF4444;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 0 32rpx 32rpx 0;
}

.delete-btn-text {
	font-size: 26rpx;
	font-weight: 700;
	color: #FFFFFF;
}

.item-card-past {
	opacity: 0.8;
}

.item-left {
	display: flex;
	align-items: center;
	gap: 20rpx;
}

.item-icon-wrap {
	width: 72rpx;
	height: 72rpx;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
}

.item-icon {
	font-size: 32rpx;
}

.item-info {
	display: flex;
	flex-direction: column;
	gap: 4rpx;
}

.item-name {
	font-size: 28rpx;
	font-weight: 700;
	color: var(--color-text-primary);
}

.item-meta {
	font-size: 20rpx;
	color: var(--color-text-muted);
}

.item-amount {
	font-size: 28rpx;
	font-weight: 800;
	color: var(--color-text-primary);
}

.empty-state {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 120rpx 0;
}

.empty-icon {
	font-size: 80rpx;
	margin-bottom: 24rpx;
}

.empty-text {
	font-size: 26rpx;
	color: var(--color-text-muted);
}

.date-summary {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 24rpx;
	background: var(--color-bg-card);
	border-radius: 32rpx;
	padding: 28rpx 32rpx;
	margin: 8rpx 12rpx 32rpx 0;
	box-shadow: var(--shadow-card);
}

.date-summary-info {
	display: flex;
	flex-direction: column;
}

.date-summary-label {
	font-size: 22rpx;
	color: var(--color-text-muted);
}

.date-summary-value {
	font-size: 34rpx;
	font-weight: 800;
	color: var(--color-text-primary);
}

.quick-add-btn {
	padding: 18rpx 28rpx;
	background: var(--color-primary);
	border-radius: var(--radius-full);
}

.quick-add-text {
	font-size: 24rpx;
	font-weight: 800;
	color: #FFFFFF;
}
</style>
