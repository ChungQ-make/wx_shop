<template>
  <div class="indexContainer">
    <!-- <button open-type="getUserInfo" @getuserinfo="login" :hidden="isShow">
      登陆
    </button> -->
    <!-- wx.getUserInfo 接口调整 改用 wx.getUserProfile 替代 -->
    <button class="btn" @click="login" :hidden="isShow">登录</button>
    <view class="user_info_wrap">
      <view class="user_wrap" :hidden="!isShow">
        <image class="user_bg" :src="userInfo.avatarUrl" mode="widthFix" />
        <view class="user_info">
          <navigator
            :url="'/pages/myShop/main?openid=' + userInfo.openid"
            class="avatarBox"
            ><image :src="userInfo.avatarUrl"
          /></navigator>
          <view class="user_name">{{ userInfo.nickName }}</view>
        </view>
      </view>
    </view>
    <!-- 下部分内容器 -->
    <view class="user_content">
      <view class="user_main">
        <view class="history_wrap">
          <navigator url="/pages/seller/main">
            <view class="his_num">0</view>
            <view class="his_name">收藏的店铺</view>
          </navigator>
          <navigator url="/pages/collect/main">
            <view class="his_num">{{ collectionsNum }}</view>
            <view class="his_name">收藏的商品</view>
          </navigator>
          <navigator :hidden="!isShow" url="/pages/myGoods/main">
            <view class="his_num">{{ myGoodsNum }}</view>
            <view class="his_name">发布的商品</view>
          </navigator>
        </view>

        <!-- 我的钱包 -->
        <view class="orders_wrap" :hidden="!isShow">
          <view class="orders_title">我的钱包</view>
          <view class="orders_content">
            <navigator url="javacript:">
              <view class="order_name balance">￥{{ userInfo.money }}</view>
            </navigator>
            <navigator url="/pages/topUps/main">
              <view class="order_name">充值</view>
            </navigator>
          </view>
        </view>
        <!-- 我的订单 -->
        <view class="orders_wrap" :hidden="!isShow">
          <view class="orders_title">我的订单</view>
          <view class="orders_content">
            <navigator url="/pages/order_list/main?type=1">
              <view class="iconfont icon-dingdan-"></view>
              <view class="order_name">全部订单</view>
            </navigator>
            <navigator url="/pages/order_list/main?type=2">
              <view class="iconfont icon-daifukuan01"></view>
              <view class="order_name">已支付</view>
            </navigator>
            <navigator url="/pages/order_list/main?type=3">
              <view class="iconfont icon-daishouhuo-"></view>
              <view class="order_name">待收货</view>
            </navigator>
            <navigator url="/pages/order_list/main?type=4">
              <view class="iconfont icon-tuihuo"></view>
              <view class="order_name">退款/退货</view>
            </navigator>
          </view>
        </view>
        <!-- 发布我的商品 -->
        <view class="orders_wrap" :hidden="!isShow">
          <navigator
            :url="'/pages/myShop/main?openid=' + userInfo.openid"
          >
            <view class="orders_title">我的商品</view>
          </navigator>
          <view class="orders_content">
            <navigator url="/pages/release/main">
              <view class="order_name">发布商品</view>
            </navigator>
            <navigator url="/pages/myGoods/main">
              <view class="order_name">管理商品</view>
            </navigator>
            <navigator url="/pages/order_manage/main">
              <view class="order_name">管理订单</view>
            </navigator>
            <navigator url="/pages/return/main">
              <view class="order_name">退货管理</view>
            </navigator>
          </view>
        </view>
        <!-- 收货地址管理 -->
        <view class="address_wrap" @click="handleChooseAdress"
          >收货地址管理</view
        >
        <!-- 应用信息相关 -->
        <view class="app_info_wrap">
          <view class="app_info_item app_info_contact">
            <text>联系客服</text>
            <text>15170161280</text>
          </view>
          <navigator url="/pages/feedback/main" class="app_info_item">
            意见/客服反馈
          </navigator>
          <view class="app_info_item">关于我们</view>
        </view>
        <!-- 推荐 -->
        <view class="recommend_wrap" @click="share">分享本应用</view>
        <view class="recommend_wrap sw2" v-show="isShow" @click="logout"
          >退出</view
        >
      </view>
    </view>
  </div>
</template>

<script>
export default {
  data () {
    return {
      isShow: true,
      userInfo: {},
      collectionsNum: 0,
      myGoodsNum: 0
    }
  },
  methods: {
    //   登录操作
    login (e) {
      wx.getUserProfile({
        desc: '获取用户信息',
        success: (res) => {
          const { userInfo } = res
          wx.login({
            success: async (res1) => {
              const { code } = res1
              const data = await this.$fly.post('/user/login', {
                code,
                userInfo
              })
              const { userInfos, token } = data.data.data
              wx.setStorageSync('token', token)
              wx.setStorageSync('userInfos', userInfos)
              this.userInfo = userInfos
              this.isShow = true
            }
          })
        }
      })

      //   ! 由于小程序接口调整 改用新的Api（wx.getUserProfile）获取用户数据
      //  * 以下为原来的获取方式 （wx.getUserInfo）
      /*  if (e.target.userInfo) {
        wx.getUserProfile({
          desc: '获取用户信息',
          complete: (res) => {
            console.log(res)
          }
        })
        wx.login({
          success: async (res1) => {
            const { code } = res1
            wx.getUserInfo({
              success: async (res2) => {
                const { userInfo } = res2
                const data = await this.$fly.post('/user/login', {
                  code,
                  userInfo
                })
                const { userInfos, token } = data.data.data
                wx.setStorageSync('token', token)
                wx.setStorageSync('userInfos', userInfos)
                this.userInfo = userInfos
                this.isShow = true
              }
            })
          }
        })
      } */
    },
    // 页面加载时读取缓存数据 没有则显示登陆按钮
    async getUserInfos () {
      const userInfos = wx.getStorageSync('userInfos')
      if (userInfos.openid) {
        this.isShow = true
        // 这里改成获取最新数据
        const { data } = await this.$fly.post('/user/getUerinfo', {
          openid: userInfos.openid
        })
        this.userInfo = data.data
        wx.setStorageSync('userInfos', this.userInfo)
      } else {
        this.isShow = false
      }
    },
    // 获取缓存中的收藏数据(个数)
    getCollectionsCount () {
      this.collectionsNum = wx.getStorageSync('collect').length
    },
    //   获取地址信息
    handleChooseAdress () {
      wx.chooseAddress({
        success: (res) => {
          this.address = res
          wx.setStorageSync('address', res)
        }
      })
    },
    // 注销登陆事件
    logout () {
      this.userInfo = {}
      this.isShow = false
      wx.setStorageSync('userInfos', this.userInfo)
    },
    // 分享事件
    share () {
      wx.showToast({
        title: '请点击右上方分享按钮',
        icon: 'none',
        image: '',
        duration: 1500,
        mask: true,
        success: (result) => {},
        fail: () => {},
        complete: () => {}
      })
    },
    // 获取缓存中的发布成功商品数
    getMyGoodsNum () {
      this.myGoodsNum = wx.getStorageSync('myGoodsNum')
    }
  },
  onShow () {
    this.getUserInfos()
    this.getCollectionsCount()
    this.getMyGoodsNum()
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
  },
  onShareAppMessage: function () {
    // wx.showShareMenu({
    //   withShareTicket: true,
    //   menus: ['shareAppMessage', 'shareTimeline']
    // })
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
  onShareTimeline: function () {}
}
</script>

<style lang="less">
page {
  background-color: #ecf5ff;
  font-size: 28rpx;
}

.indexContainer {
  .user_info_wrap {
    height: 45vh;
    overflow: hidden;
    background-color: var(--themeColor);
    position: relative;
    .user_wrap {
      position: relative;
      .user_bg {
        height: 50vh;
        filter: blur(10rpx);
      }
      .user_info {
        position: absolute;
        left: 50%;
        // 水平居中
        transform: translateX(-50%);
        top: 20%;
        text-align: center;

        .avatarBox {
          // flex: 1;
          border: 1px solid #eee;
          border-radius: 50%; //圆形
          padding: 8px;
          box-shadow: 0 0 10px #ddd; //阴
          background-color: #fff;
          width: 180rpx;
          height: 180rpx;
          image {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background-color: #eee;
          }
        }
        .user_name {
          color: white;
          margin-top: 40rpx;
          // font-size: 40rpx;
        }
      }
    }
  }

  .user_content {
    position: relative;
    .user_main {
      position: absolute;
      width: 90%;
      left: 50%;
      transform: translateX(-50%);
      top: -40rpx;
      .history_wrap {
        border-radius: 8rpx;
        background-color: #fff;
        display: flex;
        navigator {
          flex: 1;
          text-align: center;
          padding: 10rpx 0;
          .his_num {
            color: var(--themeColor);
          }
        }
      }
      .orders_wrap {
        border-radius: 8rpx;
        background-color: #fff;
        margin-top: 30rpx;
        .orders_title {
          padding: 20rpx;
          border-bottom: 1rpx solid #ccc;
        }
        .orders_content {
          display: flex;
          navigator {
            flex: 1;
            text-align: center;
            justify-content: center;
            padding: 15rpx 0;
            .iconfont {
              font-size: 40rpx;
              color: var(--themeColor);
            }
          }
        }
        .balance {
          color: var(--themeColor);
          font-size: 36rpx;
          font-family: "Franklin Gothic Medium", "Arial Narrow", Arial,
            sans-serif;
        }
      }
      .address_wrap {
        border-radius: 8rpx;
        margin-top: 30rpx;
        background-color: #fff;
        padding: 20rpx;
      }
      .app_info_wrap {
        border-radius: 8rpx;
        margin-top: 30rpx;
        background-color: #fff;
        .app_info_item {
          padding: 20rpx;
          border-bottom: 1rpx solid #eee;
        }
        .app_info_contact {
          display: flex;
          justify-content: space-between;
        }
      }
      .recommend_wrap {
        color: #fff;
        border-radius: 8rpx;
        margin-top: 30rpx;
        background-color: #67c23a;
        padding: 20rpx;
        text-align: center;
      }
      .sw2 {
        background-color: #f56c6c;
        border-top: 1px solid #eee;
        margin-top: 0rpx;
      }
    }
  }
}

page,
view,
text,
swiper,
swper-item,
imgage,
navigator {
  padding: 0;
  margin: 0;
  /* 重要 */
  box-sizing: border-box;
}

image {
  width: 100%;
}
</style>
