<template>
  <div class="page">
    <div class="page__bd">
      <div class="weui-cells weui-cells_form">
        <div class="weui-cell weui-cell_input weui-cell_vcode">
          <div class="weui-cell__hd"><label class="weui-label">办公地点</label></div>
          <div class="weui-cell__bd">
            <picker @change="bindPickerChange" class="weui-select weui-select_in-select-after" :value="officeModel" mode="selector" :range="officeOptions" range-key="location">
              <div class="weui-input">{{officeOptions[officeModel].location}}</div>
            </picker>
          </div>
        </div>
        <div class="weui-cell weui-cell_input">
          <div class="weui-cell__hd"><label class="weui-label">姓名</label></div>
          <div class="weui-cell__bd">
            <input class="weui-input" v-model="user.user_name" placeholder="请输入管理员姓名">
          </div>
        </div>
        <div class="weui-cell weui-cell_input">
          <div class="weui-cell__hd">
            <label class="weui-label">工号</label>
          </div>
          <div class="weui-cell__bd">
            <input class="weui-input" v-model="user.work_num" placeholder="请输入管理员工号">
          </div>
        </div>
        <div class="weui-cell weui-cell_input">
          <div class="weui-cell__hd"><label class="weui-label">邮箱</label></div>
          <div class="weui-cell__bd">
            <input class="weui-input" v-model="user.email" type="email" placeholder="请输入管理员邮箱">
          </div>
        </div>
      </div>
      <div class="weui-btn-area">
        <mp-button type="primary" :loading="loading" size="large" @click="save">保存</mp-button>
      </div>
    </div>
  </div>
</template>

<script>
  import mpButton from 'mpvue-weui/src/button'
  import { updateUser, addUser, existByEmail } from '@/utils/http'

  export default {
    components: {
      mpButton
    },
    data () {
      return {
        title: '',
        user: {
          id: '',
          user_name: '',
          work_num: '',
          email: '',
          role_id: 2,
          alternate_role: 3,
          office_id: -1
        },
        officeModel: 0,
        officeOptions: [
          {
            id: '',
            location: '',
            mechanism_id: 0
          }
        ],
        loading: false
      }
    },
    methods: {
      save () {
        let currentEmail = this.user.email
        let currentSuffix = currentEmail.substring(currentEmail.indexOf('@'), currentEmail.length)
        let oldEmail = this.$store.state.account.email
        let oldSuffix = oldEmail.substring(oldEmail.indexOf('@'), oldEmail.length)
        if (currentSuffix !== oldSuffix) {
          wx.showToast({
            icon: 'none',
            title: '邮箱后缀有误'
          })
          return false
        }
        if (this.user.user_name === '') {
          wx.showToast({
            icon: 'none',
            title: '姓名不能为空'
          })
          return false
        }
        if (this.user.work_num === '') {
          wx.showToast({
            icon: 'none',
            title: '工号不能为空'
          })
          return false
        }
        if (this.user.email === '') {
          wx.showToast({
            icon: 'none',
            title: '邮箱不能为空'
          })
          return false
        }
        // 判断该邮箱数据库里是否存在
        const u = {
          user_name: this.user.user_name,
          user_email: this.user.email
        }
        existByEmail(u)
          .then(res => {
            console.log('res', res)
            if (res.length > 0 && res[0].count === 0) {
              this.loading = true
              if (this.user.id) {
                console.log('update')
                updateUser(this.user)
                  .then(res => {
                    console.log(res)
                    this.loading = false
                    this.resetAccount()
                    wx.navigateTo({ url: '/pages/my/account/main' })
                  })
                  .catch(() => {
                    this.loading = false
                  })
              } else {
                console.log('this.user', this.user)
                addUser(this.user)
                  .then(res => {
                    console.log(res)
                    this.loading = false
                    this.resetAccount()
                    wx.navigateTo({ url: '/pages/my/account/main' })
                  })
                  .catch(() => {
                    this.loading = false
                  })
              }
            } else {
              wx.showToast({
                icon: 'none',
                title: '此邮箱已被占用'
              })
            }
          })
          .catch(() => {
            this.loading = false
          })
      },
      bindPickerChange (e) {
        this.officeModel = e.target.value
        this.user.office_id = this.officeOptions[this.officeModel].id
      },
      getAllOfficeByMechanism () {
        this.$store.dispatch('getLocations')
          .then(res => {
            console.log('res', res)
            if (this.user.office_id) {
              this.officeOptions = res.map((option, index) => {
                if (option.id === this.user.office_id) {
                  this.officeModel = index
                }
                return option
              })
            } else {
              this.officeOptions = res
              this.user.office_id = res[0].id
            }
          })
      },
      resetAccount () {
        let account = this.$store.state.account
        account.office_id = this.user.office_id
        this.$store.commit('setAccount', account)
      }
    },
    onShow () {
      if (Object.keys(this.$root.$mp.query).length === 0) {
        wx.setNavigationBarTitle({title: '新增账户'})
        this.user = {
          id: '',
          user_name: '',
          work_num: '',
          email: '',
          role_id: 2,
          alternate_role: 3
        }
      } else {
        wx.setNavigationBarTitle({title: '编辑账户'})
        this.$store.dispatch('getManager', parseInt(this.$root.$mp.query.id)).then(user => {
          this.user = user
        })
      }
      this.getAllOfficeByMechanism()
    },
    onUnload: function () {
      // 页面关闭
      var pages = getCurrentPages()
      var prevPage = pages[pages.length - 2]
      prevPage.onLoad()
    }
  }
</script>

<style lang="less">
  .weui-label {
    display: block;
    width: 95px;
  }
  .weui-cells {
    &:before, &:after {
      border: none;
    }
    .weui-cell:before {
      transform: scaleY(.5);
    }
  }
</style>
