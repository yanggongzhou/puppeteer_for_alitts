import Vue from 'vue';
import Vuex from 'vuex';
import sToken from './modules/sToken'
Vue.use(Vuex);
export default new Vuex.Store({
  modules: {
    sToken,
  }
})

