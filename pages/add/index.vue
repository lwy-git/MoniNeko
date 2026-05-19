<template>
	<view class="page-add">
		<view class="page-content">
			<view class="header">
				<text class="cancel-btn" @tap="goBack">取消</text>
				<view class="type-switch">
					<text class="type-active">支出</text>
					<text class="type-inactive">收入</text>
				</view>
				<text class="done-btn">完成</text>
			</view>
			<view class="placeholder-card">
				<text class="placeholder-text">💰 记账表单 - Phase 1-B 实现</text>
			</view>
		</view>
		<custom-tab-bar :current="2" />
	</view>
</template>

<script setup>
function goBack() {
	uni.switchTab({ url: '/pages/home/index' })
}
</script>

<style lang="scss" scoped>
.page-add {
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

.cancel-btn {
	font-size: 28rpx;
	color: var(--color-text-muted);
	font-weight: 600;
}

.done-btn {
	font-size: 28rpx;
	color: var(--color-primary);
	font-weight: 600;
}

.type-switch {
	display: flex;
	background: var(--color-bg-gray);
	border-radius: var(--radius-full);
	padding: 4rpx;
}

.type-active {
	padding: 12rpx 32rpx;
	background: var(--color-bg-card);
	border-radius: var(--radius-full);
	font-size: 24rpx;
	font-weight: 700;
	box-shadow: var(--shadow-card);
}

.type-inactive {
	padding: 12rpx 32rpx;
	font-size: 24rpx;
	font-weight: 700;
	color: var(--color-text-muted);
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
