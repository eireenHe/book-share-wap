<template>
  <div class="page">
    <div class="image-box">
      <img :src="wxAccount.avatarUrl">
      <p class="name">{{wxAccount.nickName}}</p>
      <p class="role" v-if="account.role_id == 1">超级管理员</p>
      <p class="role" v-if="account.role_id == 2">普通管理员</p>
      <div class="switch" @tap="changeSwitch">
        <img src="/static/images/switch.png" v-if="account.old_role === 1 || account.old_role === 2">
      </div>
    </div>
    <div class="page__bd">
      <div class="weui-cells" style="border: 0">
        <li class="weui-cell weui-cell_access" @tap="myStatistics" v-if="account.role_id == 1 || account.role_id == 2">
          <div class="weui-cell__bd">
            <img src="/static/images/statistics.svg">
            <p>借阅统计</p>
          </div>
          <div class="weui-cell__ft_in-access"></div>
        </li>
        <li class="weui-cell weui-cell_access" @tap="myEntry" v-if="account.role_id == 1 || account.role_id == 2">
          <div class="weui-cell__bd">
            <img src="/static/images/books.png">
            <p>我的录入</p>
          </div>
          <div class="weui-cell__ft_in-access"></div>
        </li>
        <li class="weui-cell weui-cell_access" @tap="staff" v-if="account.role_id == 1 || account.role_id == 2">
          <div class="weui-cell__bd">
            <img src="/static/images/staff.png">
            <p>办公地点员工</p>
          </div>
          <div class="weui-cell__ft_in-access"></div>
        </li>
        <li class="weui-cell weui-cell_access" @tap="storageLocation" v-if="account.role_id == 1 || account.role_id == 2">
          <div class="weui-cell__bd">
            <img src="/static/images/category.png">
            <p>书籍类目及存放地点</p>
          </div>
          <div class="weui-cell__ft_in-access"></div>
        </li>
        <li class="weui-cell weui-cell_access" @tap="goAccount" v-if="account.role_id == 1">
          <div class="weui-cell__bd" style="border: 0">
            <img src="/static/images/admin.png">
            <p>管理员账户</p>
          </div>
          <div class="weui-cell__ft_in-access"></div>
        </li>
        <li class="weui-cell weui-cell_access" @tap="officeLocation" v-if="account.role_id == 1">
          <div class="weui-cell__bd">
            <img src="/static/images/place.png">
            <p>办公地点</p>
          </div>
          <div class="weui-cell__ft_in-access"></div>
        </li>
        <li class="weui-cell weui-cell_access" @tap="myBorrow" v-if="account.role_id == 3">
          <div class="weui-cell__bd">
            <img src="/static/images/books.png">
            <p>我的借阅</p>
          </div>
          <div class="weui-cell__ft_in-access"></div>
        </li>
        <li class="weui-cell weui-cell_access" @tap="goMechanism" v-if="account.role_id == 10">
          <div class="weui-cell__bd">
            <img src="/static/images/mechanism.png">
            <p>机构账户管理</p>
          </div>
          <div class="weui-cell__ft_in-access"></div>
        </li>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        account: {},
        wxAccount: {}
      }
    },
    computed: {
    },
    methods: {
      officeLocation () {
        wx.navigateTo({ url: '/pages/my/office/main' })
      },
      goAccount () {
        wx.navigateTo({ url: '/pages/my/account/main' })
      },
      storageLocation () {
        wx.navigateTo({ url: '/pages/my/storage/main' })
      },
      staff () {
        wx.navigateTo({ url: '/pages/my/staff/main' })
      },
      myEntry () {
        wx.navigateTo({ url: '/pages/my/entry/main' })
      },
      goMechanism () {
        wx.navigateTo({ url: '/pages/my/mechanism/main' })
      },
      myBorrow () {
        wx.navigateTo({ url: '/pages/my/borrow/main' })
      },
      myStatistics () {
        wx.navigateTo({ url: '/pages/my/statistics/main' })
      },
      changeSwitch () {
        let user = this.$store.state.account
        const roleId = user.role_id
        const alternateRole = user.alternate_role
        user.role_id = alternateRole
        user.alternate_role = roleId
        this.$store.commit('setAccount', user)
      }
    },
    onShow () {
      this.account = this.$store.state.account
      this.wxAccount = this.$store.state.wxAccount
    }
  }
</script>

<style lang="less">
  page {
    background: #f5f7fa;
  }
  .image-box {
    background: #fff;
    overflow: hidden;
    padding: 15px 10px 35px 10px;
    img {
      float: left;
      width: 80px;
      height: 80px;
      border-radius: 5px;
    }
    p {
      margin-left: 90px;
      font-size: 24px;
      color: #363537;
      &.name {
        font-weight: bolder;
      }
      &.role {
        margin-top: 8px;
        font-size: 16px;
        color: #818082;
      }
    }
    .switch {
      position:absolute;
      top: 0;
      right: 10px;
      padding: 10px;
      img {
        width: 30px;
        height: 30px;
      }
    }
  }
  .page {
    .page__bd {
      .weui-cell_access {
        border: 0;
        line-height: 40px;
      }
      .weui-cells {
        &:before, &:after {
          border: none;
        }
        .weui-cell:before {
          transform: scaleY(.5);
        }
      }
      .weui-cell__bd img {
        float: left;
        width: 20px;
        height: 20px;
        margin: 10px 10px 0 0;
      }
    }
  }
</style>
