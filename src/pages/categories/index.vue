<template>
  <div class="cates">
    <!-- 搜索栏 -->
     <SearchInput /> 
     <div class="cates_container" >
          <!-- 左侧菜单区 -->
          <scroll-view class="left_menu" scroll-y="true" >
           <div :class="currentIndex===index?'menu_item active':'menu_item'" v-for="(item,index) in leftMenuList" :key="index" @click="handleItemTap(index)">{{ item }}</div>      
        </scroll-view>
        <!-- 右侧内容区 -->
        <scroll-view class="right_content" scroll-y="true">
                <a :href="'/pages/goods_detail/main?goods_id='+item.goods_id" class="weui-media-box weui-media-box_appmsg" v-for="(item, index) in rightContent" :key="index">
                    <div class="weui-media-box__hd">
                        <img class="weui-media-box__thumb" :src="item.goods_imgUrl[0]?item.goods_imgUrl[0]:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAB4CAMAAAAOusbgAAAAeFBMVEUAwAD///+U5ZTc9twOww7G8MYwzDCH4YcfyR9x23Hw+/DY9dhm2WZG0kbT9NP0/PTL8sux7LFe115T1VM+zz7i+OIXxhes6qxr2mvA8MCe6J6M4oz6/frr+us5zjn2/fa67rqB4IF13XWn6ad83nxa1loqyirn+eccHxx4AAAC/klEQVRo3u2W2ZKiQBBF8wpCNSCyLwri7v//4bRIFVXoTBBB+DAReV5sG6lTXDITiGEYhmEYhmEYhmEYhmEY5v9i5fsZGRx9PyGDne8f6K9cfd+mKXe1yNG/0CcqYE86AkBMBh66f20deBc7wA/1WFiTwvSEpBMA2JJOBsSLxe/4QEEaJRrASP8EVF8Q74GbmevKg0saa0B8QbwBdjRyADYxIhqxAZ++IKYtciPXLQVG+imw+oo4Bu56rjEJ4GYsvPmKOAB+xlz7L5aevqUXuePWVhvWJ4eWiwUQ67mK51qPj4dFDMlRLBZTqF3SDvmr4BwtkECu5gHWPkmDfQh02WLxXuvbvC8ku8F57GsI5e0CmUwLz1kq3kD17R1In5816rGvQ5VMk5FEtIiWislTffuDpl/k/PzscdQsv8r9qWq4LRWX6tQYtTxvI3XyrwdyQxChXioOngH3dLgOFjk0all56XRi/wDFQrGQU3Os5t0wJu1GNtNKHdPqYaGYQuRDfbfDf26AGLYSyGS3ZAK4S8XuoAlxGSdYMKwqZKM9XJMtyqXi7HX/CiAZS6d8bSVUz5J36mEMFDTlAFQzxOT1dzLRljjB6+++ejFqka+mXIe6F59mw22OuOw1F4T6lg/9VjL1rLDoI9Xzl1MSYDNHnPQnt3D1EE7PrXjye/3pVpr1Z45hMUdcACc5NVQI0bOdS1WA0wuz73e7/5TNqBPhQXPEFGJNV2zNqWI7QKBd2Gn6AiBko02zuAOXeWIXjV0jNqdKegaE/kJQ6Bfs4aju04lMLkA2T5wBSYPKDGF3RKhFYEa6A1L1LG2yacmsaZ6YPOSAMKNsO+N5dNTfkc5Aqe26uxHpx7ZirvgCwJpWq/lmX1hA7LyabQ34tt5RiJKXSwQ+0KU0V5xg+hZrd4Bn1n4EID+WkQdgLfRNtvil9SPfwy+WQ7PFBWQz6dGWZBLkeJFXZGCfLUjCgGgqXo5TuSu3cugdcTv/HjqnBTEMwzAMwzAMwzAMwzAMw/zf/AFbXiOA6frlMAAAAABJRU5ErkJggg=='" alt="">
                    </div>
                    <div class="weui-media-box__bd">
                        <h4 class="weui-media-box__title">【<span style="color: red;">￥{{ item.goods_price }}</span>】{{ item.goods_name }}</h4>
                        <p class="weui-media-box__desc">{{ item.description }}</p>
                    </div>
                </a>                
        </scroll-view>
     </div>
  </div>
</template>

<script>
import SearchInput from '../components/SearchInput'
export default {
  data () {
    return {
      leftMenuList: [],
      rightContent: [],
      // 被选中的菜单项
      currentIndex: 0,
      categoriesData: []
    }
  },
  methods: {
    async getCategoriesInfo () {
      const {data} = await this.$fly.get('/categories')
      this.categoriesData = data.data
      this.leftMenuList = this.categoriesData.map(value => value.sort_name)
      this.rightContent = this.categoriesData[0].children
      //  关闭下拉刷新窗口
      wx.stopPullDownRefresh()
    },
    handleItemTap (index) {
      this.currentIndex = index
      this.rightContent = this.categoriesData[index].children
    }
  },
  onShow () {
    this.getCategoriesInfo()
  },
  // 下拉刷新事件 重置数据 页码
  onPullDownRefresh () {
    this.currentIndex = 0
    this.getCategoriesInfo()
  },
  components: {SearchInput}
}
</script>

<style lang="less">
.cates{
    height: 100%;
    .cates_container{
         /* less 使用calc要注意 这里不要让表达式进行运算(加引号) */
        height: ~'calc( 100vh - 90rpx )';
        display: flex;
        .left_menu{
            flex: 2;
            .menu_item{
                height: 100rpx;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 30rpx;
            }
            .active{
                color: #469DF8;
                border-left: 7rpx solid currentColor;
            }
        }
        .right_content{
            flex: 6;
            overflow: hidden;
        }
    }
}
</style>
