<template>
	<view class="page-profile">
		<view class="page-content">
			<view class="profile-header">
				<view class="cat-avatar">
					<text class="cat-emoji">😺</text>
					<view class="level-badge">
						<text class="level-text">Lv.1</text>
					</view>
				</view>
				<view class="cat-info">
					<text class="cat-name">招财小金喵</text>
					<view class="exp-bar">
						<view class="exp-fill" style="width: 0%"></view>
					</view>
					<text class="cat-tip">开始记账来升级猫咪吧~</text>
				</view>
			</view>
			<view class="placeholder-card">
				<text class="placeholder-text">😺 猫咪养成 - Phase 1-D 实现</text>
			</view>
		</view>
		<custom-tab-bar :current="4" />
	</view>
</template>

<script setup>
</script>

<style lang="scss" scoped>
.page-profile {
	min-height: 100vh;
	background: var(--color-bg);
	padding-bottom: var(--tabbar-height);
}

.page-content {
	padding: 0 32rpx;
}

.profile-header {
	padding: 100rpx 0 32rpx;
	display: flex;
	align-items: center;
	gap: 24rpx;
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
	position: relative;
}

.cat-emoji {
	font-size: 64rpx;
}

.level-badge {
	position: absolute;
	bottom: -10rpx;
	right: -10rpx;
	background: var(--color-paw-pink);
	padding: 4rpx 16rpx;
	border-radius: var(--radius-full);
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

.exp-bar {
	width: 100%;
	height: 12rpx;
	background: var(--color-bg-gray);
	border-radius: var(--radius-full);
	margin-top: 12rpx;
	overflow: hidden;
}

.exp-fill {
	height: 100%;
	background: var(--color-paw-pink);
	border-radius: var(--radius-full);
	transition: width 0.3s;
}

.cat-tip {
	font-size: 22rpx;
	color: var(--color-text-muted);
	margin-top: 8rpx;
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
