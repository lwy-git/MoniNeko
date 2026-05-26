<template>
	<view class="page-achievements">
		<view class="page-content anim-fade-in">
			<!-- 顶部 -->
			<view class="header">
				<view class="header-back" @tap="goBack">
					<text class="back-icon">‹</text>
				</view>
				<text class="page-title">成就徽章</text>
				<view class="header-placeholder"></view>
			</view>

			<!-- 鱼干总数 -->
			<view class="fish-summary">
				<text class="fish-icon">🐟</text>
				<text class="fish-count">{{ catStore.fishCount }}</text>
				<text class="fish-label">条小鱼干</text>
			</view>

			<!-- 成就列表 -->
			<scroll-view scroll-y class="achievement-scroll">
				<view class="section-header">
					<text class="section-title">每日任务</text>
					<text class="section-sub">每天刷新，完成后领取小鱼干</text>
				</view>
				<view v-if="catStore.dailyTasks.length === 0" class="task-empty">
					<text class="task-empty-icon">😸</text>
					<text class="task-empty-text">今日任务已全部领取喵~</text>
				</view>
				<view
					v-for="task in catStore.dailyTasks"
					:key="task.key"
					:class="['task-card', { 'task-ready': task.completed, 'task-disabled': !task.completed }]"
					@tap="claimTask(task)"
				>
					<view class="task-left">
						<view class="task-icon-wrap">
							<text class="task-icon">{{ task.icon }}</text>
						</view>
						<view class="task-info">
							<text class="task-label">{{ task.label }}</text>
							<text class="task-desc">{{ task.description }}</text>
						</view>
					</view>
					<view class="task-right">
						<text class="task-fish">+{{ task.fish }}🐟</text>
						<text class="task-status">{{ task.completed ? '领取' : '未完成' }}</text>
					</view>
				</view>

				<view class="section-header achievement-section-header">
					<text class="section-title">成就记录</text>
					<text class="section-sub">长期里程碑</text>
				</view>
				<view
					v-for="item in achievementList"
					:key="item.key"
					:class="['achievement-card', { 'achievement-locked': !item.unlocked }]"
				>
					<view class="achievement-left">
						<view :class="['achievement-icon-wrap', { 'achievement-icon-locked': !item.unlocked }]">
							<text class="achievement-icon">{{ item.unlocked ? '🏆' : '🔒' }}</text>
						</view>
						<view class="achievement-info">
							<text class="achievement-label">{{ item.label }}</text>
							<text class="achievement-desc">{{ item.description }}</text>
						</view>
					</view>
					<view class="achievement-right">
						<text class="achievement-fish">+{{ item.fish }}🐟</text>
						<text v-if="item.unlocked" class="achievement-time">{{ item.unlockedTime }}</text>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script setup>
import { computed } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { useCatStore } from '@/store/cat-store.js'
import { useUserStore } from '@/store/user-store.js'
import { ACHIEVEMENTS } from '@/config/constants.js'

const catStore = useCatStore()
const userStore = useUserStore()

onShow(async () => {
	await catStore.fetchCatStatus(userStore.userId)
	await catStore.fetchAchievements(userStore.userId)
	await catStore.fetchDailyTasks(userStore.userId)
})

const achievementList = computed(() => {
	const unlockedKeys = catStore.achievements.map(a => a.achievement_key)
	return Object.values(ACHIEVEMENTS).map(a => {
		const unlocked = unlockedKeys.includes(a.key)
		const record = catStore.achievements.find(r => r.achievement_key === a.key)
		return {
			...a,
			unlocked,
			unlockedTime: record ? record.unlocked_at.slice(0, 10) : ''
		}
	})
})

async function claimTask(task) {
	if (!task.completed) {
		uni.showToast({ title: '任务还没完成喵~', icon: 'none' })
		return
	}
	const result = await catStore.claimTask(userStore.userId, task.key)
	if (result.success) {
		uni.showToast({ title: `领取成功 +${task.fish}🐟`, icon: 'none' })
	} else {
		uni.showToast({ title: '今天已经领取过啦', icon: 'none' })
		await catStore.fetchDailyTasks(userStore.userId)
	}
}

function goBack() {
	uni.navigateBack()
}
</script>

<style lang="scss" scoped>
.page-achievements {
	min-height: 100vh;
	background: var(--color-bg);
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

.page-title {
	font-size: 36rpx;
	font-weight: 700;
	color: var(--color-text-primary);
}

.fish-summary {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 12rpx;
	padding: 24rpx;
	margin: 0 24rpx 24rpx;
	background: var(--color-bg-card);
	border-radius: var(--radius-full);
	box-shadow: var(--shadow-card);
}

.fish-icon {
	font-size: 36rpx;
}

.fish-count {
	font-size: 40rpx;
	font-weight: 800;
	color: var(--color-primary);
}

.fish-label {
	font-size: 24rpx;
	color: var(--color-text-muted);
}

.achievement-scroll {
	flex: 1;
	padding: 0 24rpx 32rpx;
}

.section-header {
	display: flex;
	align-items: flex-end;
	justify-content: space-between;
	margin-bottom: 16rpx;
	padding: 0 8rpx;
}

.achievement-section-header {
	margin-top: 32rpx;
}

.section-title {
	font-size: 30rpx;
	font-weight: 800;
	color: var(--color-text-primary);
}

.section-sub {
	font-size: 20rpx;
	color: var(--color-text-muted);
	margin-right:25px;
}

.task-empty {
	background: var(--color-bg-card);
	border-radius: 32rpx;
	padding: 40rpx 24rpx;
	margin-bottom: 16rpx;
	box-shadow: var(--shadow-card);
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 12rpx;
}

.task-empty-icon {
	font-size: 56rpx;
}

.task-empty-text {
	font-size: 24rpx;
	font-weight: 700;
	color: var(--color-text-muted);
}

.task-card {
	display: flex;
	align-items: center;
	justify-content: space-between;
	background: var(--color-bg-card);
	border-radius: 32rpx;
	padding: 28rpx 24rpx;
	margin-bottom: 16rpx;
	margin-right: 50rpx;
	box-shadow: var(--shadow-card);
	border: 2rpx solid transparent;
}

.task-ready {
	border-color: rgba(246, 196, 69, 0.5);
}

.task-disabled {
	opacity: 0.6;
}

.task-left {
	display: flex;
	align-items: center;
	gap: 20rpx;
}

.task-icon-wrap {
	width: 72rpx;
	height: 72rpx;
	background: rgba(246, 196, 69, 0.12);
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
}

.task-icon {
	font-size: 32rpx;
}

.task-info {
	display: flex;
	flex-direction: column;
	gap: 4rpx;
}

.task-label {
	font-size: 28rpx;
	font-weight: 700;
	color: var(--color-text-primary);
}

.task-desc {
	font-size: 22rpx;
	color: var(--color-text-muted);
}

.task-right {
	text-align: right;
}

.task-fish {
	font-size: 24rpx;
	font-weight: 800;
	color: var(--color-primary);
}

.task-status {
	display: block;
	font-size: 20rpx;
	color: var(--color-text-muted);
	margin-top: 4rpx;
}

.achievement-card {
	display: flex;
	align-items: center;
	justify-content: space-between;
	background: var(--color-bg-card);
	border-radius: 32rpx;
	padding: 28rpx 24rpx;
	margin-bottom: 16rpx;
	margin-right: 50rpx;
	box-shadow: var(--shadow-card);
}

.achievement-locked {
	opacity: 0.5;
}

.achievement-left {
	display: flex;
	align-items: center;
	gap: 20rpx;
}

.achievement-icon-wrap {
	width: 72rpx;
	height: 72rpx;
	background: rgba(246, 196, 69, 0.1);
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
}

.achievement-icon-locked {
	background: var(--color-bg-gray);
}

.achievement-icon {
	font-size: 32rpx;
}

.achievement-info {
	display: flex;
	flex-direction: column;
	gap: 4rpx;
}

.achievement-label {
	font-size: 28rpx;
	font-weight: 700;
	color: var(--color-text-primary);
}

.achievement-desc {
	font-size: 22rpx;
	color: var(--color-text-muted);
}

.achievement-right {
	text-align: right;
}

.achievement-fish {
	font-size: 24rpx;
	font-weight: 700;
	color: var(--color-primary);
}

.achievement-time {
	display: block;
	font-size: 20rpx;
	color: var(--color-text-muted);
	margin-top: 4rpx;
}
</style>
