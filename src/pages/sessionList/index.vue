<template>
  <div class="index">
    <div class="top">我的会话列表</div>
    <div class="search">
      <input
        v-model="inputValue"
        placeholder="输入用户名搜索用户"
        @input="handleInput"
      />
      <div class="btn1" @click="handleCancel">取消</div>
    </div>
    <div class="box" :hidden="isHidden">
            <a
        :href="'/pages/session/main?seller_id='+ searchData.openid"
        class="weui-media-box weui-media-box_appmsg searchItem"
      >
        <div class="weui-media-box__hd">
          <img class="weui-media-box__thumb" :src="searchData.avatarUrl" alt="" />
        </div>
        <!-- <span class="weui-badge">8</span> -->
        <div class="weui-media-box__bd">
          <h4 class="weui-media-box__title">{{searchData.nickName}}</h4>
          <p class="weui-media-box__desc">
            {{searchData.gender===0?'女': '男'}}
          </p>
        </div>
      </a>
    </div>
    <div class="box" v-for="(item, index) in contactsList" :key="index">
      <a
        :href="'/pages/session/main?seller_id=' + item.openid"
        class="weui-media-box weui-media-box_appmsg"
      >
        <div class="weui-media-box__hd">
          <img class="weui-media-box__thumb" :src="item.avatarUrl" alt="" />
        </div>
        <!-- <span class="weui-badge">8</span> -->
        <div class="weui-media-box__bd">
          <h4 class="weui-media-box__title">{{ item.nickName }}</h4>
          <p class="weui-media-box__desc">
            {{ item.newComment }}
          </p>
        </div>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      contactsList: [],
      inputValue: '',
      searchData: {
        gender: 0,
        nickName: '',
        avatarUrl: '',
        openid: ''
      },
      isHidden: true
    }
  },
  methods: {
    async getContacts () {
      const openid = this.$root.$mp.query.openid
      const { data } = await this.$fly.post('/comment/contacts', { openid })
      if (data.meta.status !== 200) {
        return wx.showToast({
          title: '获取会话列表失败！',
          icon: 'none',
          image: '',
          duration: 1500,
          mask: true
        })
      }
      this.contactsList = data.data
      // 存储一下消息条数 用于判断新消息条数
    //   let oldCount = []
    //   this.contactsList.forEach((item, index) => {
    //     oldCount.push({ count: item.count, openid: item.openid })
    //   })
    //   oldCount.forEach((item1) => {
    //     console.log(item1)
    //   })
    },
    handleCancel () {
      this.inputValue = ''
      this.searchData = {
        gender: 0,
        nickName: '',
        avatarUrl: '',
        openid: ''
      }
      this.isHidden = true
    },
    handleInput () {
      // 检验合法性
      if (!this.inputValue.trim()) {
        // 值不合法
        this.isHidden = true
        return 0
      }
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.getQueryData(this.inputValue.trim())
      }, 1000)
    },
    async getQueryData (query) {
      const {data} = await this.$fly.get(`/user/query?query=${query}`)
      if (data.meta.status !== 200) {
        return
      }
      if (data.data) {
        this.searchData = data.data
        this.isHidden = false
        return 0
      }
      this.isHidden = true
    },
    // 下拉刷新事件 重置数据 页码
    onPullDownRefresh () {
      this.getContacts()
    }
  },
  onShow () {
    this.getContacts()
  },
  onUnload () {
    this.inputValue = ''
    this.isHidden = true
  }
}
</script>

<style  lang="less">
page {
  background-color: #ecf5ff;
  font-size: 28rpx;
}
.index {
  //   background-color: #ecf5ff;
  padding: 10rpx;
  .search {
    margin-top: 8rpx;
    height: 60rpx;
    display: flex;
    input {
      border-radius: 8rpx;
      background-color: #fff;
      flex: 3;
      height: 100%;
      // padding-left: 30rpx;
    }
    .btn1 {
      border-radius: 8rpx;
      background-color: #fff;
      flex: 1;
      height: 100%;
      margin-left: 10rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 26rpx;
    }
  }
  .top {
    height: 70rpx;
    background-color: var(--themeColor);
    color: #fff;
    font-family: serif;
    font-size: 30rpx;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8rpx;
  }
  .box {
    margin-top: 20rpx;
    background-color: #fff;
    border-radius: 8rpx;
  }
}
.weui-badge {
  position: absolute;
  //   float: right;
  margin-left: 104rpx;
  margin-top: -110rpx;
}
.weui-media-box {
  position: relative;
}
.searchItem{
    background-color: #FFFAF0;
    border-radius: 8rpx;
}
</style>
