import Cookies from 'js-cookie';
import { createAxios } from '../../assets/js/api'

const baseUrl = "https://adserver.magics-ad.com"
const alitts = createAxios(baseUrl);

export const ALITTSAPI = {
  fetchToken: () => alitts.get(`/autoSay/client/get_tts_token`)
}



const state = {
    ali_tts_token: ''|| Cookies.get('ali_tts_token'), // 阿里 tts token
    ali_token_expires: '' || Cookies.get('ali_token_expires'), // 过期时间
}

//获取数据 getters
const getters = {
    ali_tts_token       : state => state.ali_tts_token,
    ali_token_expires   : state => state.ali_token_expires,
}

const mutations = {
    set_ali_tts_token (state, data) {
        state.ali_tts_token = data;
    },
    set_ali_token_expires (state, data) {
        state.ali_token_expires = data;
    }
}

const actions = {
    async fetchSoundToken({ commit, dispatch }, param={}) {
      switch(param.type) {
        // case 'db': // 标贝
        //   await dispatch('dbToken');
        //   break;
        case 'ali': // 阿里
          await dispatch('aliToken');
          break;
      }
    },
    async aliToken({ commit }) {
        console.log('aliToken')
        await ALITTSAPI.fetchToken().then(res => {
            // console.log(res)
            let _nexpires = new Date(res.ExpireTime * 1000),
                _expires = _nexpires.getTime()-3600000;

            commit('set_ali_tts_token', res.Id);
            commit('set_ali_token_expires', _expires);

            Cookies.set('ali_tts_token', res.Id, {
                expires: _expires
              });
            Cookies.set('ali_token_expires', _expires)
        })
    }
}

export default {
    state,
    getters,
    mutations,
    actions
}
