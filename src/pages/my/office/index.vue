<template>
  <div class="page">
    <img @tap="handleAdd" src="/static/images/add.svg"/>
    <div class="page__bd">
      <div class="weui-cells">
        <li class="weui-cell weui-cell_access" @tap="handleEdit(al)" v-for="al in officeList" :key="al.id" >
          <div class="weui-cell__bd">
            <p>{{ al.location }}</p>
          </div>
          <!--<div class="weui-cell__ft" @tap="delOffice(al)">-->
            <!--<p>删除</p>-->
          <!--</div>-->
        </li>
      </div>
    </div>
    <modal title="请输入" v-if="showDialog" confirm-text="保存" cancel-text="取消" @cancel="cancel" @confirm="saveOffice">
      <input v-model="office.location" placeholder="请输入办公地点" auto-focus/>
    </modal>
  </div>
</template>

<script>
  import { addLocation, updateLocation, delLocation, updateUser } from '../../../utils/http'

  export default {
    data () {
      return {
        officeList: [],
        bClose: false,
        showDialog: false,
        show: true,
        office: {
          id: 0,
          location: '',
          mechanism_id: 0
        }
      }
    },
    methods: {
      getAllOffice () {
        this.$store.dispatch('getLocations')
          .then((d) => {
            this.officeList = d
          })
      },
      handleAdd () {
        this.office = {
          id: 0,
          location: ''
        }
        this.showDialog = true
      },
      handleEdit (office) {
        this.office = office
        this.showDialog = true
      },
      cancel () {
        this.showDialog = false
      },
      saveOffice () {
        if (this.office.id) {
          updateLocation({
            id: this.office.id,
            location: this.office.location
          }).then(() => {
            this.showDialog = false
          })
        } else {
          addLocation({
            location: this.office.location,
            mechanism_id: this.$store.state.account.mechanism_id
          }).then(res => {
            this.officeList.push({
              id: res.insertId,
              location: this.office.location,
              mechanism_id: this.$store.state.account.mechanism_id
            })
            if (this.officeList.length === 1) {
              let user = this.$store.state.account
              user.office_id = res.insertId
              updateUser(user)
                .then(res => {
                  console.log('res', res)
                  this.$store.commit('setAccount', user)
                })
                .catch(() => {
                  this.loading = false
                })
            }
            this.showDialog = false
          })
        }
      },
      isClose () {
        this.bClose = true
      },
      delOffice (office) {
        this.bClose = false
        delLocation({
          id: office.id
        }).then(res => {
          let index = this.officeList.indexOf(office)
          if (index > -1) {
            this.officeList.splice(index, 1)
            this.bClose = false
          }
        })
      }
    },
    mounted () {
      wx.setNavigationBarTitle({title: '办公地点'})
    },
    onShow () {
      this.getAllOffice()
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
