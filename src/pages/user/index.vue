<template>
  <div class="indexContainer">
    <button open-type="getUserInfo" @getuserinfo="login" :hidden="isShow">
      登陆
    </button>
    <view class="user_info_wrap">
      <view class="user_wrap" :hidden="!isShow">
        <image class="user_bg" :src="userInfo.avatarUrl" mode="widthFix" />
        <view class="user_info">
          <image class="user_icon" :src="userInfo.avatarUrl" />
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
          <navigator :hidden="!isShow">
            <view class="his_num">0</view>
            <view class="his_name">发布的商品</view>
          </navigator>
          <!-- <navigator>
                <view class="his_num">0</view>
                <view class="his_name">发布新商品</view>
            </navigator> -->
        </view>
        <!-- 我的订单 -->
        <view class="orders_wrap" :hidden="!isShow">
          <view class="orders_title">我的订单</view>
          <view class="orders_content">
            <navigator url="/pages/order/index?type=1">
              <view class="iconfont icon-dingdan-"></view>
              <view class="order_name">全部订单</view>
            </navigator>
            <navigator url="/pages/order/index?type=2">
              <view class="iconfont icon-daifukuan01"></view>
              <view class="order_name">已支付</view>
            </navigator>
            <navigator url="/pages/order/index?type=3">
              <view class="iconfont icon-daishouhuo-"></view>
              <view class="order_name">待收货</view>
            </navigator>
            <navigator>
              <view class="iconfont icon-tuihuo"></view>
              <view class="order_name">退款/退货</view>
            </navigator>
          </view>
        </view>
        <!-- 我的钱包 -->
        <view class="orders_wrap" :hidden="!isShow">
          <view class="orders_title">我的钱包</view>
          <view class="orders_content">
            <navigator url="javacript:">
              <view class="order_name balance">余额：{{ userInfo.money }}</view>
            </navigator>
            <navigator url="/pages/recharge/main">
              <view class="order_name">充值</view>
            </navigator>
          </view>
        </view>
        <!-- 发布我的商品 -->
        <view class="address_wrap" :hidden="!isShow">
          <navigator url="javacript:">
            <view class="showMyGoods">发布我的商品</view>
          </navigator>
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
      collectionsNum: 0
    }
  },
  methods: {
    //   登录操作
    login (e) {
      // console.log(e)
      // 判断用户是否授权
      if (e.target.userInfo) {
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
      }
    },
    // 页面加载时读取缓存数据 没有则显示登陆按钮
    getUserInfos () {
      const userInfos = wx.getStorageSync('userInfos')
      if (userInfos.openid) {
        this.isShow = true
        this.userInfo = userInfos
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
    }
  },
  onShow () {
    this.getUserInfos()
    this.getCollectionsCount()
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
  }
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
        .user_icon {
          width: 150rpx;
          height: 150rpx;
          border-radius: 50%;
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
        .showMyGoods {
          color: var(--themeColor);
        }
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
