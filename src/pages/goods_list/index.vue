<template>
    <div>
        <Tabs @event1="change($event)" :tabs="tabs">
            <block v-if="tabs[0].isActive">
                <div class="weui-panel__bd" v-for="(item2,index2) in goodsList" :key="index2">
                    <a :href="'/pages/goods_detail/main?goods_id='+item2.goods_id" class="weui-media-box weui-media-box_appmsg">
                        <div class="weui-media-box__hd">
                            <img class="weui-media-box__thumb" :src="item2.goods_imgUrl[0]" alt="">
                        </div>
                        <div class="weui-media-box__bd">
                            <h4 class="weui-media-box__title">【<span style="color: red;">￥{{ item2.goods_price }}</span>】{{ item2.goods_name }}</h4>
                            <!-- <span style="right: 0;color: red;">{{ item2.goods_price }}￥</span> -->
                        <p class="weui-media-box__desc">{{ item2.description }}</p>
                        </div>
                    </a>
            </div>
            </block>
            <block v-else-if="tabs[1].isActive">浏览量</block>
            <block v-else-if="tabs[2].isActive">价格</block>
        </Tabs>
    </div>
</template>

<script>
import Tabs from '../components/Tabs'
export default {
  data () {
    return {
      goodsList: [],
      tabs: [
        {
          id: 0,
          value: '综合',
          isActive: true
        },
        {
          id: 1,
          value: '浏览量',
          isActive: false
        },
        {
          id: 2,
          value: '价格',
          isActive: false
        }
      ],
      Paging: {
        pageNum: 0,
        pageSize: 0,
        pageCounts: 0,
        total: 0
      }

    }
  },
  methods: {
    async getGoodsList () {
    //   console.log(this.$root.$mp.query)
      const goodsType = this.$root.$mp.query.goods_type
      const {data} = await this.$fly.get(`/goods/goodsList?goods_type=${goodsType}`, {pageSize: 8})
      const {pageNum, pageSize, pageCounts, total} = data.data
      this.Paging = { pageNum, pageSize, pageCounts, total }
      this.goodsList = data.data.goodsList
      //  关闭下拉刷新窗口
      wx.stopPullDownRefresh()
    },
    change (index) {
      this.tabs.forEach((v, i) => {
        i === index ? v.isActive = true : v.isActive = false
      })
    },
    async getOtherData () {
      this.Paging.pageNum++
      const goodsType = this.$root.$mp.query.goods_type
      const {data} = await this.$fly.get(`/goods/goodsList?goods_type=${goodsType}`,
        {pageNum: this.Paging.pageNum, pageSize: 8})
      const goodsList = data.data.goodsList
      this.goodsList = [ ...this.goodsList, ...goodsList ]
    }
  },
  onShow () {
    this.getGoodsList()
  },
  // 监听触底事件
  onReachBottom () {
    if (this.Paging.pageNum + 1 >= this.Paging.pageCounts) {
      wx.showToast({
        title: '已到达底部'
      })
    } else {
      // 获取下一页数据后 进行拼接
      this.getOtherData()
    }
  },
  // 下拉刷新事件 重置数据 页码
  onPullDownRefresh () {
    // this.goodsList = []
    // this.Paging.pageNum = 0
    this.getGoodsList()
  },
  components: {Tabs}
}
</script>

<style lang = "less">
    .weui-panel__bd{
        background-color: #fdf6ec;
        border-bottom: 2px solid #fff;
    }
</style>
