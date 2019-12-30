<template>
  <div class="page">
    <div class="page__bd">
      <div class="weui-cells weui-cells_form">
        <div class="weui-cell weui-cell_input">
          <div class="weui-cell__hd"><label class="weui-label">公司名称</label></div>
          <div class="weui-cell__bd">
            <input class="weui-input" v-model="mechanism.corporate_name" placeholder="请输入公司名称">
          </div>
        </div>
        <div class="weui-cell weui-cell_input">
          <div class="weui-cell__hd">
            <label class="weui-label">公司邮箱后缀</label>
          </div>
          <div class="weui-cell__bd">
            <input class="weui-input" v-model="mechanism.corporate_email" placeholder="请输入公司邮箱后缀">
          </div>
        </div>
        <div class="weui-cell weui-cell_input">
          <div class="weui-cell__hd"><label class="weui-label">主管理员姓名</label></div>
          <div class="weui-cell__bd">
            <input class="weui-input" v-model="mechanism.admin_name" type="email" placeholder="请输入主管理员姓名">
          </div>
        </div>
        <div class="weui-cell weui-cell_input">
          <div class="weui-cell__hd"><label class="weui-label">主管理员工号</label></div>
          <div class="weui-cell__bd">
            <input class="weui-input" v-model="mechanism.admin_num" type="email" placeholder="请输入主管理员工号">
          </div>
        </div>
        <div class="weui-cell weui-cell_input">
          <div class="weui-cell__hd"><label class="weui-label">主管理员邮箱</label></div>
          <div class="weui-cell__bd">
            <input class="weui-input" v-model="mechanism.admin_email" type="email" placeholder="请输入主管理员邮箱">
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

  export default {
    name: 'index',
    components: {
      mpButton
    },
    data () {
      return {
        title: '',
        mechanism: {
          id: '',
          corporate_name: '',
          corporate_email: '',
          admin_name: '',
          admin_num: '',
          admin_email: ''
        }
      }
    },
    methods: {
      save () {
        if (!this.mechanism.admin_email.includes(this.mechanism.corporate_email)) {
          wx.showToast({
            icon: 'none',
            title: '邮箱后缀需统一'
          })
          return false
        }
        if (this.mechanism.id) {
          this.$http.post('https://sharkbook.mljr.com/mechanism/update', this.mechanism)
            .then(res => {
              console.log('11111')
              console.log(res)
              if (res.status === 200) {
                wx.navigateTo({ url: '/pages/my/mechanism/main' })
              }
            })
            .catch(function (error) {
              console.log(error)
            })
        } else {
          this.$http.post('https://sharkbook.mljr.com/mechanism/add', this.mechanism)
            .then(res => {
              if (res.status === 200) {
                wx.navigateTo({ url: '/pages/my/mechanism/main' })
              }
            })
            .catch(function (error) {
              console.log(error)
            })
        }
      },
      getMechanismById (id) {
        this.$http.get('https://sharkbook.mljr.com/mechanism/' + id, {})
          .then(res => {
            if (res.status === 200) {
              this.mechanism = res.data[0]
            }
          })
          .catch(function (error) {
            console.log(error)
          })
      }
    },
    mounted () {
      if (Object.keys(this.$root.$mp.query).length === 0) {
        wx.setNavigationBarTitle({title: '新增机构账户'})
        this.mechanism = {
          id: '',
          corporate_name: '',
          corporate_email: '',
          admin_name: '',
          admin_num: '',
          admin_email: ''
        }
      } else {
        wx.setNavigationBarTitle({title: '编辑机构账户'})
        this.getMechanismById(this.$root.$mp.query.id)
      }
    }
  }
</script>

<style lang="less">
  .weui-label {
    display: block;
    width: 110px;
  }
</style>
