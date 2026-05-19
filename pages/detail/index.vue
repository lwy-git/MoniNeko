<template>
	<view class="page-detail">
		<view class="page-content">
			<view class="header">
				<text class="page-title">记账明细</text>
			</view>
			<view class="placeholder-card">
				<text class="placeholder-text">📝 消费明细时间轴 - Phase 1-B 实现</text>
			</view>
		</view>
		<custom-tab-bar :current="3" />
	</view>
</template>

<script setup>
</script>

<style lang="scss" scoped>
.page-detail {
	min-height: 100vh;
	background: var(--color-bg);
	padding-bottom: var(--tabbar-height);
}

.page-content {
	padding: 0 32rpx;
}

.header {
	padding: 100rpx 0 32rpx;
	text-align: center;
}

.page-title {
	font-size: 36rpx;
	font-weight: 700;
	color: var(--color-text-primary);
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
