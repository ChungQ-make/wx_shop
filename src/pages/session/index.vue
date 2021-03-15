<template>
  <div class="index">
    <div class="title">与用户 [{{ recipientInfos.nickName }}] 对话中</div>
    <div class="box">
      <scroll-view
        class="left_menu"
        scroll-y="true"
        :scroll-with-animation="true"
        :scroll-into-view="bottomID"
      >
        <div v-for="(item, index) in commentsList" :key="index">
          <div
            class="item_left"
            v-if="recipientInfos.openid !== item.recipient_id"
            :id="'item'+index"
          >
            <img :src="recipientInfos.avatarUrl" alt="" mode="widthFix" @click="toMyShop(recipientInfos.openid)"/>
            <div class="content">
              {{
                item.content
              }}
            </div>
          </div>
          <div class="item_right" v-else :id="'item'+index">
            <img :src="userInfos.avatarUrl" alt="" mode="widthFix" @click="toMyShop(userInfos.openid)"/>
            <div class="content">
              {{ item.content }}
            </div>
          </div>
        </div>
      </scroll-view>
    </div>
    <div class="send">
      <div class="input">
        <input type="text" placeholder="输入新的消息" v-model="inputValue" />
        <span class="btn" @click="createComment">发送</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      recipientInfos: {},
      commentsList: {},
      inputValue: '',
      userInfos: {},
      bottomID: ''
    }
  },
  methods: {
    //   获取接收方的个人信息
    async getUerInfos () {
      const openid = this.$root.$mp.query.seller_id
      const { data } = await this.$fly.post('/user/getUerinfo', { openid })
      if (data.meta.status !== 200) {
        return wx.showToast({
          title: '该用户未注册！',
          icon: 'none',
          image: '',
          duration: 1500,
          mask: true,
          success: (result) => {
            setTimeout(() => {
              wx.navigateBack()
            }, 2000)
          }
        })
      }
      this.recipientInfos = data.data
      //   同时拿一下缓存里面自己用户信息
      const userInfos = wx.getStorageSync('userInfos')
      this.userInfos = userInfos
    },
    // 获取所有对话信息
    async getCommentsList () {
      const recipientID = this.$root.$mp.query.seller_id
      const { openid } = wx.getStorageSync('userInfos')
      const { data } = await this.$fly.post('/comment/uerSession ', {
        sender_id: openid,
        recipient_id: recipientID
      })
      if (data.meta.status !== 200) {
        return wx.showToast({
          title: '获取会话信息失败！',
          icon: 'none',
          image: '',
          duration: 1500,
          mask: true,
          timer: -1
        })
      }
      this.commentsList = data.data
      //   设置触底元素ID 以便scroll-view 组件定位触底
      this.bottomID = `item${this.commentsList.length - 1}`
    },
    // 发送新的会话信息
    async createComment () {
      if (!this.inputValue.trim()) {
        // 值不合法
        return wx.showToast({
          title: '请不要发送空数据',
          icon: 'none',
          image: '',
          duration: 1500,
          mask: true,
          success: (result) => {
            this.inputValue = ''
          }
        })
      }
      const content = this.inputValue.trim()
      const recipientID = this.$root.$mp.query.seller_id
      const { openid, nickName } = wx.getStorageSync('userInfos')
      const { data } = await this.$fly.post('/comment/create', {
        content,
        sender_id: openid,
        recipient_id: recipientID,
        sender: nickName,
        recipient: this.recipientInfos.nickName
      })
      //   console.log(data)
      if (data.meta.status !== 201) {
        return wx.showToast({
          title: '发送消息失败！',
          icon: 'none',
          image: '',
          duration: 1500,
          mask: true
        })
      }
      this.inputValue = ''
      this.getCommentsList()
    },

    // 点击头像跳转个人商城事件
    toMyShop (openid) {
      wx.navigateTo({
        url: `/pages/myShop/main?openid=${openid}`
      })
    },
    // 设置定时器 更新会话数据
    updateSession () {
      clearInterval(this.timer)
      this.timer = setInterval(() => {
        this.getCommentsList()
      }, 25000)
    }
  },
  onShow () {
    this.getUerInfos()
    this.getCommentsList()
    this.updateSession()
  },
  onUnload () {
    //   页面卸载 清除定时器
    clearInterval(this.timer)
  }
}
</script>

<style  lang="less">
page {
  background-color: #ecf5ff;
  font-size: 28rpx;
}
.index {
  .title {
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    background-color: #ff6a6a;
  }
  .box {
    padding: 10rpx;
    margin-top: 10rpx;
    background-color: #fff;
    border-radius: 8rpx;
    .left_menu {
      height: 1000rpx;
      .item_left {
        padding: 10rpx;
        display: flex;
        background-color: #fff;
        margin-top: 15rpx;
        flex-wrap: wrap;
        align-items: center;
        .content {
          margin-left: 20rpx;
          padding: 15rpx;
          box-sizing: border-box;
          display: flex;
          flex-wrap: wrap;
          // width: 580rpx;
        //   这里换成设置最大宽度 美化界面
          max-width: 580rpx;
          word-break: break-all;
          border-radius: 8rpx;
          background-color: #8470ff;
          color: #fff;
        }
      }
      .item_right {
        padding: 10rpx;
        box-sizing: border-box;
        display: flex;
        flex-wrap: wrap;
        flex-direction: row-reverse;
        margin-top: 15rpx;
        background-color: #fff;
        align-items: center;
        .content {
          margin-right: 20rpx;
          padding: 15rpx;
          box-sizing: border-box;
          display: flex;
          flex-wrap: wrap;
          flex-direction: row-reverse;
          // width: 580rpx;
          max-width: 580rpx;
          word-break: break-all;
          border-radius: 8rpx;
          background-color: #f4a460;
          color: #fff;
        }
      }
      img {
        width: 90rpx;
        // padding: 10rpx;
        border-radius: 50%;
        background-color: #eee;
      }
    }
  }
  .send {
    margin-top: 10rpx;
    .input {
      display: flex;
      padding: 10rpx;
      box-sizing: border-box;
      input {
        flex: 2;
        border-radius: 8rpx 0 0 8rpx;
        background-color: #fff;
        height: 70rpx;
      }
      .btn {
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: seagreen;
        font-weight: 600;
        color: #fff;
        // margin-left: 10rpx;
        border-radius: 0 8rpx 8rpx 0;
        flex: 1;
        height: 70rpx;
      }
    }
  }
}
</style>
