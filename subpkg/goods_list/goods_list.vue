<template>
	<view>
		<view class="goods-list">
			<view v-for="(goods, i) in goodsList" :key="i" @click="gotoDetail(goods)">
				<!-- 为 my-goods 组件动态绑定 goods 属性的值 -->
				<my-goods :goods="goods"></my-goods>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				queryObj: {
					// 查询关键词
					query: '',
					// 商品分类id
					cid: '',
					// 页码值
					pagenum: 1,
					// 每页显示多少条数据
					pagesize: 10
				},
				// 商品列表的数据
				goodsList: [],
				// 总数量，用于分页
				total: 0,
				// 是否正在请求数据(用于节流，节省资源)
				isLoading: false
			}
		},
		onLoad(options) {
			// 将页面参数转存到this.queryObj对象中
			this.queryObj.query = options.query || ''
			this.queryObj.cid = options.cid || ''
			// 用于获取商品列表数据的方法
			this.getGoodsList()
		},
		// 上拉加载
		onReachBottom() {
			// 判断是否还有下一页的数据
			if (this.queryObj.pagenum * this.queryObj.pagesize >= this.total) return uni.$showMsg('数据加载完毕！')
			// 判断是否正在发起请求，若是，则不发起额外的请求
			if (this.isLoading) return
			// 让页码的值自动加1
			this.queryObj.pagenum += 1
			// 重新获取列表数据
			this.getGoodsList()
		},
		// 下拉刷新
		onPullDownRefresh() {
			// 重置关键数据
			this.queryObj.pagenum = 1
			this.total = 0
			this.isLoading = false
			this.goodsList = []

			// 重新发求一次请求
			this.getGoodsList(() => uni.stopPullDownRefresh())
		},
		methods: {
			// 获取商品列表数据的方法
			async getGoodsList(cb) {
				// 在发起请求之前，先打开节流阀
				this.isLoading = true
				// 发起请求
				const {
					data: res
				} = await uni.$http.get('/api/public/v1/goods/search', this.queryObj)
				// 请求完毕，关闭节流阀
				this.isLoading = false
				// 只要数据加载完毕，立即调用cb回调函数
				cb && cb()
				if (res.meta.status !== 200) return uni.$showMsg()
				// 为数据赋值
				// this.goodsList = res.message.goods
				this.goodsList = [...this.goodsList, ...res.message.goods]
				this.total = res.message.total
			},
			// 跳转到详情页面
			gotoDetail(item) {
				uni.navigateTo({
					url: '/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id
				})
			}
		}
	}
</script>

<style lang="scss">

</style>
