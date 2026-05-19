<template>
	<view class="tabbar safe-area-bottom">
		<view
			v-for="(item, index) in tabs"
			:key="index"
			:class="['tabbar-item', { active: current === index }]"
			@tap="switchTab(index)"
		>
			<view v-if="index === 2" class="center-btn">
				<text class="center-icon">+</text>
			</view>
			<template v-else>
				<view class="tab-icon-wrap">
					<text class="tab-icon">{{ item.icon }}</text>
				</view>
				<text class="tab-text">{{ item.text }}</text>
			</template>
		</view>
	</view>
</template>

<script setup>
const props = defineProps({
	current: {
		type: Number,
		default: 0
	}
})

const tabs = [
	{ text: '首页', path: '/pages/home/index', icon: '📅' },
	{ text: '统计', path: '/pages/stats/index', icon: '📊' },
	{ text: '记账', path: '/pages/add/index', icon: '+' },
	{ text: '明细', path: '/pages/detail/index', icon: '📝' },
	{ text: '我的', path: '/pages/profile/index', icon: '😺' }
]

function switchTab(index) {
	if (index === props.current) return
	uni.switchTab({ url: tabs[index].path })
}
</script>

<style lang="scss" scoped>
.tabbar {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	height: 120rpx;
	background: var(--color-bg-card);
	display: flex;
	justify-content: space-around;
	align-items: center;
	border-top: 1rpx solid var(--color-border);
	z-index: 999;
	padding-bottom: constant(safe-area-inset-bottom);
	padding-bottom: env(safe-area-inset-bottom);
}

.tabbar-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	flex: 1;
	height: 100%;
	position: relative;

	&.active {
		.tab-icon-wrap {
			color: var(--color-primary);
		}
		.tab-text {
			color: var(--color-primary);
		}
	}
}

.tab-icon-wrap {
	font-size: 40rpx;
	margin-bottom: 4rpx;
}

.tab-icon {
	font-size: 40rpx;
}

.tab-text {
	font-size: 20rpx;
	color: var(--color-text-muted);
	font-weight: 600;
}

.center-btn {
	width: 112rpx;
	height: 112rpx;
	background: var(--color-paw-pink);
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-top: -60rpx;
	box-shadow: 0 8rpx 24rpx rgba(244, 114, 182, 0.4);
	border: 8rpx solid var(--color-bg-card);
}

.center-icon {
	font-size: 56rpx;
	color: #FFFFFF;
	font-weight: 300;
	line-height: 1;
}
</style>
