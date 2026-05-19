<template>
	<view class="page-report">
		<view class="page-content">
			<view class="placeholder-card">
				<text class="placeholder-text">🐱 每日结算卡片 - Phase 1-C 实现</text>
			</view>
		</view>
	</view>
</template>

<script setup>
</script>

<style lang="scss" scoped>
.page-report {
	min-height: 100vh;
	background: var(--color-bg);
}

.page-content {
	padding: 32rpx;
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
