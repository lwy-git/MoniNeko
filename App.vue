<script setup>
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'
import { initDB } from '@/utils/db/index.js'

onLaunch(async () => {
	console.log('App Launch - 招财记账')
	try {
		await initDB()
		console.log('数据库初始化成功')
	} catch (e) {
		console.error('数据库初始化失败', e)
	}
})

onShow(() => {})
onHide(() => {})
</script>

<style lang="scss">
	@import './styles/theme.scss';
	@import './styles/animation.scss';

	page {
		font-family: var(--font-family);
		background-color: var(--color-bg);
		color: var(--color-text-primary);
		min-height: 100vh;
		font-size: 28rpx;
		line-height: 1.6;
	}

	view, text {
		box-sizing: border-box;
	}

	.safe-area-bottom {
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
	}

	.page-container {
		min-height: 100vh;
		background-color: var(--color-bg);
		padding-bottom: var(--tabbar-height);
	}
</style>
