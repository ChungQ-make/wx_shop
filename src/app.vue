<script>
export default {
  onlauch () {
    //   * 解决微信小程序日志报错警告
    //    log appendFile err fs_appendFile:fail no such file or directory, open "http://usr/miniprogramLog/log"
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
  }
}
</script>

<style>
/* 定义全局样式 */
page{
    /* 定义主题颜色 */
    --themeColor: #469DF8;
}
</style>
