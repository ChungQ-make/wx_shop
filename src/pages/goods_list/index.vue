<template>
  <div>
    <Tabs @event1="change($event)" :tabs="tabs">
      <block v-if="tabs[0].isActive">
        <div class="box_out">
          <div class="box">
            <div
              class="item"
              v-for="(item2, index2) in goodsList"
              :key="index2"
            >
              <a
                :href="'/pages/goods_detail/main?goods_id=' + item2.goods_id"
                class="weui-media-box weui-media-box_appmsg"
              >
                <div class="weui-media-box__hd">
                  <img
                    class="weui-media-box__thumb"
                    :src="item2.goods_imgUrl[0]"
                    alt=""
                  />
                </div>
                <div class="weui-media-box__bd">
                  <h4 class="weui-media-box__title">
                    【<span style="color: red">￥{{ item2.goods_price }}</span
                    >】{{ item2.goods_name }}
                  </h4>
                  <!-- <span style="right: 0;color: red;">{{ item2.goods_price }}￥</span> -->
                  <p class="weui-media-box__desc">{{ item2.description }}</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </block>
      <block v-else-if="tabs[1].isActive">
        <div class="box_out">
          <div class="box">
            <div
              class="item"
              v-for="(item2, index2) in pageViewsSort"
              :key="index2"
            >
              <a
                :href="'/pages/goods_detail/main?goods_id=' + item2.goods_id"
                class="weui-media-box weui-media-box_appmsg"
              >
                <div class="weui-media-box__hd">
                  <img
                    class="weui-media-box__thumb"
                    :src="item2.goods_imgUrl[0]"
                    alt=""
                  />
                </div>
                <div class="weui-media-box__bd">
                  <h4 class="weui-media-box__title">
                    【<span style="color: red">￥{{ item2.goods_price }}</span
                    >】{{ item2.goods_name }}
                  </h4>
                  <!-- <span style="right: 0;color: red;">{{ item2.goods_price }}￥</span> -->
                  <p class="weui-media-box__desc">{{ item2.description }}</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </block>
      <block v-else-if="tabs[2].isActive">
        <div class="box_out">
            <div class="box">
                <div class="item btn" @click="changPriceSort(state)">
                    切换排序
                </div>
            </div>
          <div class="box">
            <div
              class="item"
              v-for="(item2, index2) in priceSort"
              :key="index2"
            >
              <a
                :href="'/pages/goods_detail/main?goods_id=' + item2.goods_id"
                class="weui-media-box weui-media-box_appmsg"
              >
                <div class="weui-media-box__hd">
                  <img
                    class="weui-media-box__thumb"
                    :src="item2.goods_imgUrl[0]"
                    alt=""
                  />
                </div>
                <div class="weui-media-box__bd">
                  <h4 class="weui-media-box__title">
                    【<span style="color: red">￥{{ item2.goods_price }}</span
                    >】{{ item2.goods_name }}
                  </h4>
                  <!-- <span style="right: 0;color: red;">{{ item2.goods_price }}￥</span> -->
                  <p class="weui-media-box__desc">{{ item2.description }}</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </block>
    </Tabs>
  </div>
</template>

<script>
import Tabs from '../components/Tabs'
// import _ from 'lodash'
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
      },
      pageViewsSort: [],
      priceSort: [],
      //   升降排序状态（默认升序）
      state: false
    }
  },
  methods: {
    async getGoodsList () {
      //   console.log(this.$root.$mp.query)
      const goodsType = this.$root.$mp.query.goods_type
      if (!goodsType) {
        const { data } = await this.$fly.get(`/goods/goodsList`, {
          pageSize: 8
        })
        const { pageNum, pageSize, pageCounts, total } = data.data
        this.Paging = { pageNum, pageSize, pageCounts, total }
        this.goodsList = data.data.goodsList
        // 获取排序数据
        this.getPageViewSortData()
        this.getPriceSortData()
      } else {
        const { data } = await this.$fly.get(
          `/goods/goodsList?goods_type=${goodsType}`,
          {
            pageSize: 8
          }
        )
        const { pageNum, pageSize, pageCounts, total } = data.data
        this.Paging = { pageNum, pageSize, pageCounts, total }
        this.goodsList = data.data.goodsList

        // 获取排序数据
        this.getPageViewSortData(goodsType)
        this.getPriceSortData(goodsType)
      }
      //  关闭下拉刷新窗口
      wx.stopPullDownRefresh()
    },
    change (index) {
      this.tabs.forEach((v, i) => {
        i === index ? (v.isActive = true) : (v.isActive = false)
      })
    },
    async getOtherData () {
      this.Paging.pageNum++
      const goodsType = this.$root.$mp.query.goods_type
      if (!goodsType) {
        const { data } = await this.$fly.get(`/goods/goodsList`, {
          pageNum: this.Paging.pageNum,
          pageSize: 8
        })
        const goodsList = data.data.goodsList
        this.goodsList = [...this.goodsList, ...goodsList]
      } else {
        const { data } = await this.$fly.get(
          `/goods/goodsList?goods_type=${goodsType}`,
          {
            pageNum: this.Paging.pageNum,
            pageSize: 8
          }
        )
        const goodsList = data.data.goodsList
        this.goodsList = [...this.goodsList, ...goodsList]
      }
    },
    // 获取浏览量排序数据
    async getPageViewSortData (goodsType) {
      if (!goodsType) {
        const { data } = await this.$fly.get('/goods/goodsList', {
          pageSize: this.Paging.total
        })
        let goodsList = data.data.goodsList
        this.pageViewsSort = goodsList.sort((a, b) => {
          return b.pageViews - a.pageViews
        })
      } else {
        const { data } = await this.$fly.get(
          `/goods/goodsList?goods_type=${goodsType}`,
          {
            pageSize: this.Paging.total
          }
        )
        const goodsList = data.data.goodsList
        this.pageViewsSort = goodsList.sort((a, b) => {
          return b.pageViews - a.pageViews
        })
      }
    },
    // 获取价格排序数据
    async getPriceSortData (goodsType) {
      if (!goodsType) {
        const { data } = await this.$fly.get('/goods/goodsList', {
          pageSize: this.Paging.total
        })
        const goodsList = data.data.goodsList
        this.priceSort = goodsList.sort((a, b) => {
          return b.goods_price - a.goods_price
        })
      } else {
        const { data } = await this.$fly.get(
          `/goods/goodsList?goods_type=${goodsType}`,
          {
            pageSize: this.Paging.total
          }
        )
        const goodsList = data.data.goodsList
        this.priceSort = goodsList.sort((a, b) => {
          return b.goods_price - a.goods_price
        })
      }
    },
    // 改变价格升降排序
    changPriceSort (state) {
      this.state = !state
      if (this.state) {
        this.priceSort = this.priceSort.reverse()
      }
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
  components: {
    Tabs
  } /* ,
  computed: {
    pageViewsSort: {
      // 通过计算属性得到按浏览量从大到小的排序数据
      get: function () {
        let _goodsList = []
        _goodsList = this.goodsList.sort((a, b) => {
          return b.pageViews - a.pageViews
        })
        return _goodsList
      }
    },
    priceSort: {
      // 通过计算属性得到按价格从大到小的排序数据
      get: function () {
        let _goodsList = []
        _goodsList = this.goodsList.sort((a, b) => {
          return b.pageViews - a.pageViews
        })
        return _goodsList
      }
    }
  } */
}
</script>

<style lang = "less">
.box_out {
  background-color: #e4efff;
  .box {
    padding: 10rpx;
    .item {
      background-color: #fff;
      border-radius: 8rpx;
      padding: 10rpx;
      margin-bottom: 10rpx;
    }
    .btn{
        display: flex; 
        justify-content: center;
        align-items: center;
        color: var(--themeColor);
        /* font-family: Arial, Helvetica, sans-serif; */
    }
  }
}
</style>
