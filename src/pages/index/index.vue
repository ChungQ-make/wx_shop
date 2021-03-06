<template>
  <div class="pyg_index"> 
      <!-- 搜索栏 -->
     <SearchInput />
     <!-- 轮播图 -->
    <view class="index_swiper">
        <swiper autoplay="true" indicator-dots="true" circular="true">
            <swiper-item v-for="(item,index) in swiperList" :key="index">
                <navigator :url="item.navigator_url">
                    <image :src="item.image_src" mode="widthFix"></image>
                </navigator>
            </swiper-item>
        </swiper>
    </view>
    <!-- 导航栏 -->
    <div class="index_cate">
        <a v-for="(item,index) in catitems" :key="index" 
        :href="item.navigator_url" open-type="switchTab" >
            <image :src="item.image_src" mode="widthFix"></image>
            <span>{{item.name}}</span>
        </a>       
    </div>

    <!-- 楼层数据 -->
    <div class="weui-panel weui-panel_access" v-for="(item1,index1) in floorDate" :key="index1" :hidden="!item1.children[0]">
            <div class="weui-panel__hd">{{item1.sort_name}}</div>
                <div>
                    <div class="weui-panel__bd" v-for="(item2,index2) in item1.children" :key="index2" >
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
                </div>
                <div class="weui-panel__ft">
                    <a :href="'/pages/goods_list/main?goods_type='+item1.sort_name" class="weui-cell weui-cell_active weui-cell_access weui-cell_link">
                        <div class="weui-cell__bd">查看更多</div>
                        <span class="weui-cell__ft"></span>
                    </a>    
                </div>
        </div>
  </div>
</template>

<script>
import SearchInput from '../components/SearchInput'

export default {
  data () {
    return {
      swiperList: [],
      catitems: [],
      floorDate: []
    }
  },
  methods: {
    async getSwiperList () {
      const {data} = await this.$fly.get('/home/swiperdata')
      this.swiperList = data.data || []
    },
    async getCatitemsInfo () {
      const {data} = await this.$fly.get('/home/catitems')
      this.catitems = data.data || []
    },
    async getFloorData () {
      const {data} = await this.$fly.get('/home/floordata')
      this.floorDate = data.data.floorData || []
    }
  },
  onShow () {
    this.getSwiperList()
    this.getCatitemsInfo()
    this.getFloorData()
    // 开启分享功能
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
  },
  onShareAppMessage: function () {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
    return {
      title: '应科二手市场',
      path: '/pages/index/main',
      success: function (shareTickets) {
        console.info(shareTickets + '成功')
        // 转发成功
      },
      fail: function (res) {
        console.log(res + '失败')
        // 转发失败
      },
      complete: function (res) {
        // 不管成功失败都会执行
      }
    }
  },
  onShareTimeline: function () {
  },
  components: {SearchInput}

}
</script>

<style lang="less">
.pyg_index{
    .weui-panel__hd{
        color: var(--themeColor);
        background-color:#ecf5ff;
    }
    .weui-panel__bd{
        background-color: #fdf6ec;
        border-bottom: 2px solid #fff;
    }
    .weui-panel__ft{
        background-color: #ecf5ff;
    }
    .index_swiper{
        swiper{
            //  可以不写 ipone6 默认屏幕宽 750rpx
            // width: 750rpx;
            height: 340rpx;
            image{
                width: 100%;
            }
        }
    }
    .index_cate{
        display: flex;
        // background-color: #73b7ff;
        a{
            padding: 20rpx;
            flex: 1;
            display: flex;
            // flex-direction:  row-revers;
            flex-wrap: wrap;
            align-items: center;
            justify-content: center;
            image{
                width: 80%;
            }
            span{
                color: #469DF8;
                font-size: 28rpx;
            }
        }
    }
}
</style>
