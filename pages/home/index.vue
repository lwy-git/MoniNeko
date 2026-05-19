<template>
	<view class="page-home">
		<view class="page-content">
			<view class="header">
				<view class="header-left">
					<text class="month-title">5月</text>
				</view>
				<view class="header-right">
					<view class="avatar-wrap">
						<text class="avatar-emoji">😺</text>
					</view>
				</view>
			</view>
			<view class="placeholder-card">
				<text class="placeholder-text">📅 日历主页 - Phase 1-C 实现</text>
			</view>
		</view>
		<custom-tab-bar :current="0" />
	</view>
</template>

<script setup>
import { onShow } from '@dcloudio/uni-app'

onShow(() => {
	const hasLaunched = uni.getStorageSync('has_launched')
	if (!hasLaunched) {
		uni.navigateTo({ url: '/pages/splash/index' })
	}
})
</script>

<style lang="scss" scoped>
.page-home {
	min-height: 100vh;
	background: var(--color-bg);
	padding-bottom: var(--tabbar-height);
}

.page-content {
	padding: 0 32rpx;
}

.header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 100rpx 0 32rpx;
}

.month-title {
	font-size: 48rpx;
	font-weight: 800;
	color: var(--color-text-primary);
}

.avatar-wrap {
	width: 80rpx;
	height: 80rpx;
	border-radius: 50%;
	border: 4rpx solid var(--color-primary);
	display: flex;
	align-items: center;
	justify-content: center;
}

.avatar-emoji {
	font-size: 40rpx;
}

.placeholder-card {
	background: var(--color-bg-card);
	border-radius: var(--radius-lg);
	box-shadow: var(--shadow-card);
	padding: 64rpx 32rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-top: 32rpx;
}

.placeholder-text {
	font-size: 28rpx;
	color: var(--color-text-muted);
}
</style>
