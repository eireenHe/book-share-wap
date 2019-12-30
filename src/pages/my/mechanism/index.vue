<template>
  <div class="page">
    <img @tap="handleAdd" src="/static/images/add.svg"/>
    <div class="page__bd">
      <div class="weui-cells">
        <li class="weui-cell weui-cell_access" @tap="handleEdit(ml)" v-for="ml in mechanismList" :key="ml.id" >
          <div class="weui-cell__bd">
            <p>{{ ml.corporate_name }}</p>
          </div>
          <div class="weui-cell__ft weui-cell__ft_in-access">{{ ml.admin_name }}</div>
        </li>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        mechanismList: [],
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
      getAllMechanism () {
        this.$http.get('https://sharkbook.mljr.com/mechanism', {})
          .then((d) => {
            this.mechanismList = d.data
          })
          .catch(err => {
            console.log(err.status, err.message)
          })
      },
      handleAdd () {
        wx.navigateTo({ url: '/pages/my/mechanism/edit/main' })
      },
      handleEdit (mechanism) {
        wx.navigateTo({ url: '/pages/my/mechanism/edit/main?id=' + mechanism.id })
      }
    },
    onLoad () {
      wx.setNavigationBarTitle({title: '机构管理'})
      this.getAllMechanism()
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
  }
</style>
