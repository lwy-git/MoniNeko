<template>
	<view class="page-profile">
		<!-- 顶部渐变头部 -->
		<view class="profile-header">
			<view class="profile-info">
				<view class="cat-avatar-wrap">
					<view class="cat-avatar">
						<image class="cat-emoji-img" :src="catStore.breedEmoji" mode="aspectFit"></image>
					</view>
					<view class="level-badge">
						<text class="level-text">Lv.{{ catStore.level }}</text>
					</view>
				</view>
				<view class="cat-info">
					<text class="cat-name">{{ catStore.catName }}</text>
					<view class="exp-row">
						<view class="exp-bar">
							<view class="exp-fill" :style="{ width: catStore.levelProgress.percent + '%' }"></view>
						</view>
						<text class="exp-percent">{{ catStore.levelProgress.percent }}%</text>
					</view>
					<text class="cat-tip">🐟 {{ catStore.fishCount }} · 还需{{ catStore.levelProgress.needed - catStore.levelProgress.current }}条鱼升级</text>
				</view>
			</view>

			<!-- 签到按钮 -->
			<view v-if="catStore.canCheckin" class="checkin-btn" @tap="onCheckin">
				<text class="checkin-btn-text">签到 +1🐟</text>
			</view>
			<view v-else class="checkin-done">
				<text class="checkin-done-text">今日已签到 ✓</text>
			</view>
		</view>

		<!-- 品种切换 -->
		<view class="breed-section" v-if="catStore.unlockedBreeds.length > 1">
			<text class="breed-title">切换猫咪</text>
			<view class="breed-list">
				<view
					v-for="b in catStore.unlockedBreeds"
					:key="b.key"
					:class="['breed-item', { 'breed-active': catStore.breed === b.key }]"
					@tap="onChangeBreed(b.key)"
				>
					<image class="breed-emoji-img" :src="breedEmojiMap[b.key]" mode="aspectFit"></image>
					<text class="breed-label">{{ b.label }}</text>
				</view>
			</view>
		</view>

		<!-- 功能区 -->
		<view class="profile-body">
			<!-- 快捷入口 -->
			<view class="quick-grid">
				<view class="quick-item" @tap="goShop">
					<text class="quick-item-icon">🎀</text>
					<text class="quick-item-text">装扮商店</text>
				</view>
				<view class="quick-item" @tap="goAchievements">
					<text class="quick-item-icon">🏆</text>
					<text class="quick-item-text">成就徽章</text>
				</view>
			</view>

			<!-- 设置列表 -->
			<view class="settings-card">
				<view class="settings-item">
					<view class="settings-left">
						<text class="settings-icon settings-icon-gold">☁️</text>
						<text class="settings-label">数据同步</text>
					</view>
					<text class="settings-arrow">›</text>
				</view>
				<view class="settings-item" @tap="onExport">
					<view class="settings-left">
						<text class="settings-icon settings-icon-green">📤</text>
						<text class="settings-label">导出数据</text>
					</view>
					<text class="settings-arrow">›</text>
				</view>
				<view class="settings-item">
					<view class="settings-left">
						<text class="settings-icon settings-icon-pink">🔒</text>
						<text class="settings-label">指纹解锁</text>
					</view>
					<text class="settings-arrow">›</text>
				</view>
			</view>

			<!-- 退出 -->
			<view class="logout-area">
				<text class="logout-btn" @tap="goWelcome">退出登录喵...</text>
			</view>
		</view>

		<my-custom-tabbar :current="4" />
	</view>
</template>

<script setup>
import { onShow } from '@dcloudio/uni-app'
import { useUserStore } from '@/store/user-store.js'
import { useCatStore } from '@/store/cat-store.js'
import { CAT_BREED_EMOJI } from '@/config/constants.js'
import { exportToCSV, downloadCSV } from '@/utils/export.js'
import { getDB } from '@/utils/db/index.js'

const userStore = useUserStore()
const catStore = useCatStore()
const breedEmojiMap = CAT_BREED_EMOJI

onShow(async () => {
	await catStore.fetchCatStatus(userStore.userId)
	await catStore.fetchAchievements(userStore.userId)
})

async function onCheckin() {
	await catStore.doCheckin(userStore.userId)
	uni.showToast({ title: '签到成功 +1🐟', icon: 'none' })
}

function onChangeBreed(breedKey) {
	catStore.changeBreed(userStore.userId, breedKey)
}

async function onExport() {
	try {
		const db = getDB()
		const records = await db.query('expense_record', (r) => r.user_id === userStore.userId)
		if (!records.length) {
			uni.showToast({ title: '暂无数据可导出喵~', icon: 'none' })
			return
		}
		const sorted = records.sort((a, b) => b.expense_date.localeCompare(a.expense_date))
		const csv = exportToCSV(sorted)
		const filename = `招财记账_${new Date().toISOString().slice(0, 10)}.csv`
		downloadCSV(csv, filename)
		uni.showToast({ title: '导出成功喵~', icon: 'success' })
	} catch (e) {
		uni.showToast({ title: '导出失败', icon: 'none' })
	}
}

function goShop() {
	uni.showToast({ title: '装扮商店即将开放喵~', icon: 'none' })
}

function goAchievements() {
	uni.navigateTo({ url: '/pages/achievements/index' })
}

function goWelcome() {
	uni.navigateTo({ url: '/pages/welcome/index' })
}
</script>

<style lang="scss" scoped>
.page-profile {
	min-height: 100vh;
	background: var(--color-bg);
	padding-bottom: var(--tabbar-height);
}

.profile-header {
	background: linear-gradient(180deg, var(--color-primary) 0%, var(--color-bg) 100%);
	padding: 80rpx 32rpx 48rpx;
}

.profile-info {
	display: flex;
	align-items: center;
	gap: 24rpx;
}

.cat-avatar-wrap {
	position: relative;
}

.cat-avatar {
	width: 140rpx;
	height: 140rpx;
	background: var(--color-bg-card);
	border-radius: 40rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: var(--shadow-elevated);
	border: 4rpx solid var(--color-bg-card);
}

.cat-emoji-img {
	width: 80rpx;
	height: 80rpx;
}

.level-badge {
	position: absolute;
	bottom: -12rpx;
	right: -12rpx;
	background: var(--color-paw-pink);
	padding: 4rpx 16rpx;
	border-radius: var(--radius-full);
	box-shadow: 0 4rpx 8rpx rgba(244, 114, 182, 0.3);
}

.level-text {
	font-size: 20rpx;
	color: #FFFFFF;
	font-weight: 700;
}

.cat-info {
	flex: 1;
}

.cat-name {
	font-size: 36rpx;
	font-weight: 800;
	color: var(--color-text-primary);
}

.exp-row {
	display: flex;
	align-items: center;
	gap: 12rpx;
	margin-top: 12rpx;
}

.exp-bar {
	flex: 1;
	height: 12rpx;
	background: rgba(255, 255, 255, 0.5);
	border-radius: var(--radius-full);
	overflow: hidden;
}

.exp-fill {
	height: 100%;
	background: var(--color-paw-pink);
	border-radius: var(--radius-full);
}

.exp-percent {
	font-size: 20rpx;
	font-weight: 700;
	color: var(--color-text-primary);
}

.cat-tip {
	font-size: 20rpx;
	color: rgba(74, 55, 40, 0.6);
	margin-top: 8rpx;
}

.checkin-btn {
	margin-top: 24rpx;
	background: var(--color-bg-card);
	border-radius: var(--radius-full);
	padding: 16rpx 32rpx;
	text-align: center;
	box-shadow: var(--shadow-card);
}

.checkin-btn-text {
	font-size: 26rpx;
	font-weight: 700;
	color: var(--color-primary);
}

.checkin-done {
	margin-top: 24rpx;
	padding: 16rpx 32rpx;
	text-align: center;
}

.checkin-done-text {
	font-size: 24rpx;
	color: rgba(74, 55, 40, 0.4);
}

/* 品种切换 */
.breed-section {
	padding: 0 24rpx;
	margin-bottom: 24rpx;
}

.breed-title {
	font-size: 24rpx;
	font-weight: 700;
	color: var(--color-text-muted);
	margin-bottom: 16rpx;
}

.breed-list {
	display: flex;
	gap: 20rpx;
}

.breed-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 8rpx;
	padding: 16rpx 24rpx;
	background: var(--color-bg-card);
	border-radius: 32rpx;
	border: 4rpx solid transparent;
}

.breed-active {
	border-color: var(--color-primary);
}

.breed-emoji-img {
	width: 48rpx;
	height: 48rpx;
}

.breed-label {
	font-size: 20rpx;
	font-weight: 700;
	color: var(--color-text-primary);
}

/* 功能区 */
.profile-body {
	padding: 0 24rpx;
}

.quick-grid {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 24rpx;
	margin-bottom: 24rpx;
}

.quick-item {
	background: var(--color-bg-card);
	padding: 32rpx;
	border-radius: 40rpx;
	box-shadow: var(--shadow-card);
	border: 2rpx solid var(--color-bg-gray);
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 12rpx;
}

.quick-item-icon {
	font-size: 48rpx;
}

.quick-item-text {
	font-size: 26rpx;
	font-weight: 700;
	color: var(--color-text-primary);
}

/* 设置列表 */
.settings-card {
	background: var(--color-bg-card);
	border-radius: 40rpx;
	padding: 8rpx;
	box-shadow: var(--shadow-card);
	margin-bottom: 32rpx;
}

.settings-item {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 28rpx 32rpx;
	border-radius: 32rpx;
}

.settings-left {
	display: flex;
	align-items: center;
	gap: 20rpx;
}

.settings-icon {
	font-size: 32rpx;
}

.settings-label {
	font-size: 28rpx;
	font-weight: 700;
	color: var(--color-text-primary);
}

.settings-arrow {
	font-size: 32rpx;
	color: var(--color-text-muted);
}

/* 退出 */
.logout-area {
	text-align: center;
	padding: 24rpx;
}

.logout-btn {
	font-size: 26rpx;
	font-weight: 700;
	color: #EF4444;
}
</style>
