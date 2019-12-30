import Vue from 'vue'
import Vuex from 'vuex'
import { getLocations, getManagers, getUser, getMechanisms } from './http'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    locations: null,
    managers: null,
    mechanisms: null,
    // account: {},
    account: {
      id: 0,
      user_name: '',
      work_num: '',
      email: '',
      code: '',
      old_role: 0,
      role_id: 0,
      alternate_role: 0,
      office_id: 0,
      mechanism_id: 0,
      signature: ''
    },
    loadedSize: 0,
    wxAccount: {}
  },
  mutations: {
    setAccount (state, account) {
      state.account = account
    },
    setWxAccount (state, account) {
      state.wxAccount = account
    }
  },
  actions: {
    getLocations ({ state }, force = true) {
      if (!force && this.state.locations !== null) {
        return new Promise(resolve => {
          resolve(this.state.locations)
        })
      } else {
        return getLocations({ id: state.account.mechanism_id }).then(data => {
          this.state.locations = data
          return data
        })
      }
    },
    getMechanisms ({ state }, force = true) {
      if (!force && this.state.mechanisms !== null) {
        return new Promise(resolve => {
          resolve(this.state.mechanisms)
        })
      } else {
        return getMechanisms().then(data => {
          this.state.mechanisms = data
          return data
        })
      }
    },
    getManagers ({ state }, force = true) {
      if (!force && this.state.managers !== null) {
        return new Promise(resolve => {
          resolve(this.state.managers)
        })
      } else {
        return getManagers({ id: state.account.mechanism_id }).then(data => {
          this.state.managers = data
          return data
        })
      }
    },
    getManager ({ state }, id) {
      if (this.state.managers !== null) {
        let result = null
        this.state.managers.forEach(manager => {
          if (manager.id === id) {
            result = manager
            return false
          }
        })
        if (result) {
          return new Promise(resolve => {
            resolve(result)
          })
        } else {
          return getUser({ id }).then(data => data[0])
        }
      } else {
        return getUser({ id }).then(data => data[0])
      }
    }
  }
})
