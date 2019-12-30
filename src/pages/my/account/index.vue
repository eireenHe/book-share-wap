<template>
  <div class="page">
    <img @tap="handleAdd" src="/static/images/add.svg"/>
    <div class="page__bd">
      <div class="weui-cells">
        <li class="weui-cell weui-cell_access" @tap="handleEdit(al)" v-for="al in userList" :key="al.id" >
          <div class="weui-cell__bd">
            <p>{{ al.user_name }}</p>
          </div>
          <div class="weui-cell__ft weui-cell__ft_in-access">{{ al.email }}</div>
        </li>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        userList: []
      }
    },
    methods: {
      getUserByMechanism () {
        this.$store.dispatch('getManagers')
          .then((d) => {
            this.userList = d
          })
          .catch(err => {
            console.log(err.status, err.message)
          })
      },
      handleAdd () {
        wx.navigateTo({ url: '/pages/my/account/edit/main' })
      },
      handleEdit (user) {
        wx.navigateTo({ url: '/pages/my/account/edit/main?id=' + user.id })
      }
    },
    mounted () {
      wx.setNavigationBarTitle({title: '管理账户'})
    },
    onLoad () {
      this.getUserByMechanism()
    }
  }
</script>

<style lang="less">
  .page {
    img {
      position: absolute;
      right: 30px;
      bottom: 50px;
      width: 40px;
      height: 40px;
    }
    .weui-cells {
      &:before, &:after {
        border: none;
      }
      .weui-cell:before {
        transform: scaleY(.5);
      }
    }
  }
</style>
