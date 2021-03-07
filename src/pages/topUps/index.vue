<template>
  <div class="index">
    <div class="title">在线充值</div>
    <div class="box">
      <div class="top">
        <div class="item" @click="topUps(10)">10元</div>
        <div class="item middleItems" @click="topUps(20)">20元</div>
        <div class="item" @click="topUps(50)">50元</div>
        <div class="item" @click="topUps(100)">100元</div>
        <div class="item middleItems" @click="topUps(200)">200元</div>
        <div class="item" @click="topUps(500)">500元</div>
      </div>
      <div class="middle">
        <div class="item">
          <div class="input">
            <input class="weui-input" type="number" placeholder="自定义充值" v-model="topUpsMoney" />
          </div>
          <div class="btn" @click="topUpsDiy">充值</div>
          <button class="btn"  open-type="getUserInfo" @getuserinfo="login">充值</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      topUpsMoney: 0
    }
  },
  methods: {
    //   自定义充值金额
    topUpsDiy () {
      const topUpsMoney = this.topUpsMoney
      if (topUpsMoney <= 0) {
        return wx.showToast({
          title: '请输入合法数据',
          icon: 'none',
          image: '',
          duration: 1500,
          mask: true
        })
      }
      wx.showModal({
        title: '充值确认',
        content: `您充值的金额：${this.topUpsMoney}元`,
        showCancel: true,
        cancelText: '取消',
        cancelColor: '#000000',
        confirmText: '确定',
        confirmColor: '#3CC51F',
        success: (result) => {
          if (result.confirm) {
            console.log(topUpsMoney)
          }
        }
      })
    },

    // 按规格充值
    topUps (topUpsMoney) {
      wx.showModal({
        title: '充值确认',
        content: `您充值的金额：${topUpsMoney}元`,
        showCancel: true,
        cancelText: '取消',
        cancelColor: '#000000',
        confirmText: '确定',
        confirmColor: '#3CC51F',
        success: (result) => {
          if (result.confirm) {
            console.log(topUpsMoney)
          }
        }
      })
    },
    login () {
      wx.getUserInfo({
        complete: (res) => {
          console.log(res)
        }
      })
    }
  }
}
</script>

<style lang="less">
.index {
  padding: 10rpx;
  .title {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #0f4c81;
    border-radius: 8rpx;
    color: #fff;
    margin-bottom: 8rpx;
    height: 70rpx;
    font-weight: 600;
    font-size: 30rpx;
    letter-spacing: 4rpx;
  }
  .box {
    background-color: #0f4c81;
    border-radius: 8rpx;
    margin-bottom: 8rpx;
    .top {
      height: 460rpx;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      align-items: center;
      padding: 8rpx;
      .item {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 31.8%;
        height: 49%;
        // margin-right: 10rpx;
        background-color: #fff;
        margin-bottom: 10rpx;
        border-radius: 8rpx;
        font-weight: 600;
        font-size: 38rpx;
        color: #0f4c81;
      }
      .middleItems {
        margin-left: 8rpx;
        margin-right: 8rpx;
      }
    }
    .middle {
      padding: 8rpx;
      .item {
        display: flex;
        background-color: #fff;
        border-radius: 8rpx;
        .input {
          flex: 3;
          border-right: #0f4c81 8rpx solid;
          // border-radius: 8rpx;
          input {
            height: 70rpx;
            font-weight: 600;
            font-size: 30rpx;
            color: #0f4c81;
          }
        }
        .btn {
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 8rpx;
          flex: 1;
          // border-left: #0f4c81 5rpx solid;
          color: #0f4c81;
          font-weight: 600;
        }
      }
    }
  }
}
</style>
