<template lang="jade">
  .page
    .page__hd
      .img_bg
        img(:src="wxAccount.avatarUrl")
      .info
        img(:src="wxAccount.avatarUrl")
        p
          span(v-if="wxAccount.gender === 1") 男 ·
          span(v-if="wxAccount.gender === 2") 女 ·
          span {{wxAccount.province}}
    .page__bd(v-if="step === 1")
      div(class="weui-cells weui-cells_after-title weui-cells_form")
        div(class="weui-cell weui-cell_input")
          .weui-cell__hd
            label.weui-label 邮箱
          .weui-cell__bd
            input.weui-input(v-model="user.email" type="email" placeholder="请输入公司邮箱")
        div(class="weui-cell weui-cell_input weui-cell_vcode")
          .weui-cell__hd
            label.weui-label 验证码
          .weui-cell__bd
            input(class="weui-input code" v-model="user.code" type="email" placeholder="请输入验证码" style="color: #133344;")
          .weui-cell__ft
            mp-button(:disabled="timer" btn-class="weui-vcode-btn" type="primary" size="large" @click="sendCode", :plain="true") {{ timer ? timer + '秒后重发' : '获取验证码' }}
      .weui-btn-area
        mp-button(type="primary" size="large" @click="valid") 下一步
    .page__bd(v-else)
      div(class="weui-cells weui-cells_after-title weui-cells_form")
        div(class="weui-cell weui-cell_input weui-cell_vcode")
          .weui-cell__hd
            label.weui-label 机构
          .weui-cell__bd
            input.weui-input(v-model="user.mechanism_name" placeholder="请输入机构" disabled="disabled")
        div(class="weui-cell weui-cell_input weui-cell_vcode" v-if="locations.length")
          .weui-cell__hd
            label.weui-label 办公地点
          .weui-cell__bd
            picker(@change="bindChangeLocation" class="weui-select weui-select_in-select-after", :value="locationModel" mode="selector", :range="locations" range-key="location")
              .weui-input {{locations[locationModel].location}}
        div(class="weui-cell weui-cell_input")
          .weui-cell__hd
            label.weui-label 姓名
          .weui-cell__bd
            input.weui-input(v-model="user.user_name" placeholder="请输入姓名")
        div(class="weui-cell weui-cell_input")
          .weui-cell__hd
            label.weui-label 工号
          .weui-cell__bd
            input.weui-input(v-model="user.work_num" placeholder="请输入工号")
    div(class="page__bd weui-btn-area" v-show="step === 2")
      mp-button(type="primary" size="large" @click="handleSave") 保存
</template>

<script>
  import mpButton from 'mpvue-weui/src/button'
  import filters from '@/filters'
  import { sendCode, getUserDetail, addUser, getLocations, getMechanismByEmail, updateUserBySignature } from '../../utils/http'
  const app = getApp()

  export default {
    components: {
      mpButton
    },
    filters: filters,
    data () {
      return {
        step: 1,
        user: {
          user_name: '',
          work_num: '',
          email: '',
          code: '',
          role_id: 3,
          alternate_role: 3,
          office_id: 0,
          mechanism_id: 0,
          mechanism_name: '',
          signature: ''
        },
        mechanisms: [],
        mechanismModel: 0,
        locations: [],
        locationModel: 0,
        wxAccount: {},
        timer: 0,
        timer2: 0
      }
    },
    methods: {
      sendCode () {
        if (this.timer > 0) {
          return
        }
        if (this.user.email.indexOf('@') === -1) {
          wx.showToast({
            icon: 'none',
            title: '邮箱格式不正确'
          })
          return false
        }
        // 查询当前这个格式在数据库是否存在
        const email = this.user.email
        getMechanismByEmail({
          corporate_email: email.substring(email.indexOf('@'), email.length)
        }).then(res => {
          if (res.length === 0) {
            wx.showToast({
              icon: 'none',
              title: '邮箱后缀不存在'
            })
          } else {
            sendCode({
              email: this.user.email
            }).then(res => {
              this.timer = 30
              this.timer2 = setInterval(() => {
                this.timer--
                if (this.timer === 0) {
                  clearInterval(this.timer2)
                }
              }, 1000)
            })
          }
        })
      },
      handleSave () {
        this.user.signature = this.$store.state.wxAccount.signature
        if (this.user.user_name === '') {
          wx.showToast({
            icon: 'none',
            title: '请输入姓名'
          })
          return false
        }
        if (this.user.work_num === '') {
          wx.showToast({
            icon: 'none',
            title: '请输入工号'
          })
          return false
        }
        addUser(this.user).then(res => {
          this.user.id = res.insertId
          this.$store.commit('setAccount', this.user)
          console.log('this.$store.state.account', this.$store.state.account)
          wx.switchTab({ url: '/pages/index/main' })
        })
      },
      valid () {
        // 先查询用户详情，看用户是否存在
        getUserDetail({
          email: this.user.email,
          code: this.user.code
        }).then(data => {
          if (data.length > 0) {
            data[0].old_role = data[0].role_id
            updateUserBySignature({
              email: this.user.email,
              signature: this.$store.state.wxAccount.signature
            }).then(data => {
              if (data.changedRows === 1) {
                this.$store.commit('setAccount', data[0])
                const wxAccount = this.$store.state.wxAccount
                app.aldstat.sendEvent('校验登录', {
                  '地理位置': wxAccount.province,
                  '昵称': wxAccount.nickName,
                  '邮箱': this.user.email,
                  'openId': wxAccount.signature,
                  '时间': filters.fixTimeStamp(new Date())
                })
                wx.switchTab({ url: '/pages/index/main' })
              } else {
                wx.showToast({
                  icon: 'none',
                  title: '用户签名更新失败'
                })
              }
            })
          } else {
            this.step = 2
            this.getMechanismByEmail()
          }
        })
      },
      getMechanisms () {
        this.$store.dispatch('getMechanisms').then(data => {
          this.mechanisms = data
          this.bindChangeMechanism({ target: { value: 0 } })
        })
      },
      getMechanismByEmail () {
        let email = this.user.email
        getMechanismByEmail({
          corporate_email: email.substring(email.indexOf('@'), email.length)
        }).then(data => {
          if (data.length > 0) {
            this.user.mechanism_id = data[0].id
            this.user.mechanism_name = data[0].corporate_name
            this.getLocations()
          }
        })
      },
      bindChangeMechanism (e) {
        this.mechanismModel = e.target.value
        this.locationModel = 0
        this.user.mechanism_id = this.mechanisms[this.mechanismModel].id
        this.getLocations()
      },
      getLocations () {
        getLocations({
          id: this.user.mechanism_id
        }).then(data => {
          this.locations = data
          this.bindChangeLocation({ target: { value: 0 } })
        })
      },
      bindChangeLocation (e) {
        this.locationModel = e.target.value
        this.user.office_id = this.locations[this.locationModel].id
      }
    },
    mounted () {
      this.wxAccount = this.$store.state.wxAccount
      wx.setNavigationBarTitle({title: this.wxAccount.nickName})
    }
  }
</script>

<style lang="less">
  .page {
    .page__hd {
      background: #BEE4E8;
      position: relative;
      .img_bg {
        width:100%;
        height:270px;
        img {
          width:100%;
          height:270px;
          -webkit-filter: blur(60px);
          filter:blur(60px);
        }
      }
      .info {
        position:absolute;
        top: 12%;
        left: 50%;
        margin-left: -50px;
        img {
          width: 100px;
          height: 100px;
          margin-top: 40px;
          border-radius: 50%;
          border: 1px solid #fff;
        }
        p {
          width: 200px;
          margin: 10px auto 0;
          padding-bottom: 20px;
          color: #fff;
          font-size: 18px;
          font-weight: 600;
        }
      }
    }
    .page__bd {
      .weui-cells {
        &:before, &:after {
          border: none;
        }
        .weui-cell:before {
          transform: scaleY(.5);
        }
      }
      .weui-label {
        display: block;
        width: 90px;
        font-weight: bolder;
        color: #333;
      }
      .weui-cell_input {
        line-height: 60px;
      }
      .weui-btn-large {
        background: #62b3c5;
        line-height: 55px;
        height: 55px;
        margin-top: 5px;
      }
      .weui-vcode-btn {
        background-color: transparent;
        border: none;
        outline: 0;
        border-radius: 0;
        border-left-color: #d9d9d9;
        color: #133344;
      }
    }
  }
</style>
