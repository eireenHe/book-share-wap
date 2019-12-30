<template lang="jade">
  .warp
    .info
      img(src="/static/images/shark.png")
      p 鲨鱼书院邀您完成微信授权以继续使用
    .operat
      button(open-type="getUserInfo" @getuserinfo="bindgetuserinfo") 授权微信用户信息
</template>

<script>
  export default {
    methods: {
      bindgetuserinfo (e) {
        if (e.mp.detail.userInfo) {
          let wxAccount = e.mp.detail.userInfo
          wxAccount.signature = e.mp.detail.signature
          this.$store.commit('setWxAccount', wxAccount)
          wx.navigateTo({ url: '/pages/login/main' })
        } else {
          // 用户按了拒绝按钮
          console.log('用户按了拒绝按钮')
        }
      }
    }
  }
</script>

<style lang="less">
  .warp {
    position: relative;
    .info {
      background: #BEE4E8;
      text-align: center;
      img {
        width: 140px;
        height: 175px;
        margin-top: 40px;
      }
      p {
        width: 200px;
        margin: 20px auto;
        padding-bottom: 40px;
        color: #fff;
        font-size: 18px;
        font-weight: 600;
      }
    }
    .operat {
      text-align: center;
      margin-top: 75px;
      button {
        background: #62b3c5;
        height: 55px;
        line-height: 55px;
        width: 90%;
        border: none;
        border-radius: 10px;
        color: #fff;
        font-size: 18px;
      }
    }
  }

</style>
