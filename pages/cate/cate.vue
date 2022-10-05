<template>
	<view>
		<view class="scroll-view-container">
			<!-- 左侧的滚动视图 -->
			<scroll-view scroll-y="true" :style="{height: wh + 'px'}" class="left-scroll-view">
				<block v-for="(item,index) in cateList" :key="item.cat_id">
					<view :class="['left-scroll-view-item',index === active ? 'active':'']"
						@click="activeChanged(index)">{{item.cat_name}}
					</view>
				</block>
			</scroll-view>
			<!-- 右侧的滚动视图 -->
			<scroll-view scroll-y="true" class="right-scroll-view" :style="{height: wh + 'px'}" :scroll-top="scrollTop">
				<view class="cate-lv2" v-for="(item2,index2) in cateLevel2" :key="item2.cat_id">
					<view class="cate-lv2-title">/ {{item2.cat_name}} /</view>
					<!-- 动态渲染三级列表数据 -->
					<view class="cate-lv3-list">
						<view class="cate-lv3-item" v-for="(item3,index3) in item2.children" :key="index3"
							@click="gotoGoodsList(item3)">
							<image :src="item3.cat_icon.replace('dev','web')" mode=""></image>
							<text>{{item3.cat_name}}</text>
						</view>
					</view>
				</view>
				<view class="left-scroll-view-item"></view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 窗口的可用高度 = 屏幕高度 - navigationBar高度 - tabbar高度
				wh: 0,
				// 分类数据列表
				cateList: [],
				// 当前选中项的索引，默认让第一项被选中
				active: 0,
				// 二级分类列表
				cateLevel2: [],
				// 滚动条距离顶部的距离
				scrollTop: 0,
			};
		},
		onLoad() {
			const sysInfo = uni.getSystemInfoSync()
			this.wh = sysInfo.windowHeight
			// 调用方法获取分类数据
			this.getCateList()
		},
		methods: {
			// 获取分类数据
			async getCateList() {
				const {
					data: res
				} = await uni.$http.get('/api/public/v1/categories')
				if (res.meta.status !== 200) return uni.$showMsg()
				// 为一级分类赋值
				this.cateList = res.message
				// 为二级分类赋值
				this.cateLevel2 = res.message[0].children
				console.log('this.cateList', this.cateList);
			},
			// 选中项改变的事件处理函数
			activeChanged(index) {
				this.active = index
				// 为二级分类列表重新赋值
				this.cateLevel2 = this.cateList[index].children
				// 让scrollTop的值在0与1之间切换
				this.scrollTop = this.scrollTop === 0 ? 1 : 0
			},
			// 跳转到详细页面
			gotoGoodsList(item3) {
				uni.navigateTo({
					url: '/subpkg/goods_list/goods_list?cid=' + item3.cat_id
				})
			}
		}
	}
</script>

<style lang="scss">
	.scroll-view-container {
		display: flex;

		.left-scroll-view {
			width: 120rpx;

			.left-scroll-view-item {
				line-height: 60px;
				background-color: #f7f7f7;
				text-align: center;
				font-size: 12px;

				&.active {
					background-color: #fff;
					position: relative;

					&::before {
						content: '';
						display: block;
						width: 3px;
						height: 30px;
						background-color: #c00000;
						position: absolute;
						top: 50%;
						transform: translateY(-50%);
						left: 0;
					}
				}
			}
		}
	}

	.cate-lv2-title {
		font-size: 12px;
		font-weight: bold;
		text-align: center;
		padding: 15px 0;
	}

	.cate-lv3-list {
		display: flex;
		flex-wrap: wrap;

		.cate-lv3-item {
			width: 33.33%;
			margin-bottom: 10px;
			display: flex;
			flex-direction: column;
			align-items: center;

			image {
				width: 60px;
				height: 60px;
			}

			text {
				font-size: 12px;
			}
		}
	}
</style>
