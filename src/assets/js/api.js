import axios from 'axios'

const prevHandler = ({data}) => {
  return data
};
// window.WebUserMessage = function WebUserMessage(id,token,phone){
//   console.log(id,token,phone)
//   Session.set('ai_user_id', id);
//   Session.set('ai_user_token', token)
//   Session.set('ai_user_phone', phone)
// }
const prevErrHandler = ({response}) => {
  switch (response.status) {
    case 404:
      break;
    case 401:
      location.reload();
      break;
    case 500:
      break;
    default:
  }
  throw new Error('System exception');
};

export const createAxios = (_url) => {
  const _instance = axios.create({
    baseURL: _url,
    timeout: 10000,
    headers: {
      'Content-Type': "application/json;charset=utf-8"
    }
  });
  _instance.interceptors.response.use(prevHandler,prevErrHandler);
  _instance.interceptors.request.use(
    config => {
      return config;
    },
    err => {
      return Promise.reject(err);
    }
  );
  return _instance;
}

let _apiUrl = 'https://adserver.magics-ad.com';
const apiInstance = createAxios(_apiUrl);
export const requestServices = {
  uploadUrl:  _apiUrl+"/common_server/client/upload",
  // 智能导购平台接口
  // 验证该用户是否存在
  // judgeUsers: (params) => apiInstance.post(`/user_server/client/get_user_details`, params),
  getCaptcha: (params) => apiInstance.post(`/common_server/client/get_captcha`, params),
  login: (params) => apiInstance.post(`/guide_shopping/client/login`, params),
  // 忘记密码
  // forgetPsw: (params) => apiInstance.post(`/guide_shopping/client/forget_password`, params),
  // 获取节目列表
  getAllPrograms: (params) => apiInstance.post(`/guide_shopping/client/get_programs`, params),
  // 节目排序
  sortPrograms: (params) => apiInstance.post(`/guide_shopping/client/gs_sort`, params),
  // 关联节目与剧本
  addScriptToPrograms: (params) => apiInstance.post(`/guide_shopping/client/related_gs_program`, params),
  // 解除节目与剧本关联
  delScriptInPrograms: (params) => apiInstance.post(`/guide_shopping/client/delete_gs_program`, params),
// 设置关联节目的剧本
  updateGsProgram: (params) => apiInstance.post(`guide_shopping/client/update_gs_program`, params),

  // 获取剧本列表
  getAllScripts: (params) => apiInstance.post(`/guide_shopping/client/get_guide_shopping`, params),
  // 添加剧本
  addScript: (param) => apiInstance.post(`/guide_shopping/client/add_guide_shopping`, param),
  // 编辑剧本
  editScript: (param) => apiInstance.post(`/guide_shopping/client/edit_guide_shopping`, param),
  // 删除剧本
  delScript: (param) => apiInstance.post(`/guide_shopping/client/delete_guide_shopping`, param),

  // 获取商品出现次数
  getScriptIdInChat: (param) => apiInstance.post(`/guide_shopping/client/get_commodity_count`, param),


  //获取精灵数据
  getAllAvatars:(params)=>apiInstance.get(`/guide_shopping/client/get_avatars`,{params:params},),

  //编辑快捷键
  editShortcutJson:(params)=>apiInstance.post(`/guide_shopping/client/edit_shortcut_json`,params),

  //临时话术
  getTempList :(params) => apiInstance.post(`/guide_shopping/client/get_gs_words`, params),
  addTemp:(params)=>apiInstance.post(`/guide_shopping/client/add_gs_word`,params),

  // 获取话术列表
  getWords: (params)=>apiInstance.post(`/guide_shopping/client/get_words`,params),
  // 获取弹幕消息
  getChat: (params) => apiInstance.post(`autosay/client//DKAutoSay_GetTask2`, params),

  // 新增话术
  addWords: (params)=>apiInstance.post(`/guide_shopping/client/add_gs_word`,params),

  // 编辑/删除话术/修改话术状态
  editWrods: (params)=>apiInstance.post(`/guide_shopping/client/edit_gs_word`,params),

  // //获取弹幕中商品出现次数
  // getCommodityCount: (params)=>apiInstance.post(`/guide_shopping/client/get_commodity_count`,params),


  // 获取互动模式
  getInacType: (params)=>apiInstance.post(`/guide_shopping/client/get_interaction`,params),
  // 添加互动模式
  addInac: (params)=>apiInstance.post(`/guide_shopping/client/add_interaction`,params),
  // 编辑互动模式
  editInac: (params)=>apiInstance.post(`/guide_shopping/client/edit_interaction`,params),
  // 删除互动模式
  delInac: (params)=>apiInstance.post(`/guide_shopping/client/delete_interaction`,params),

  // 查看紧急联系人
  getMonitoringPhone: (params)=>apiInstance.post(`/guide_shopping/client/get_monitoring_phone`,params),
  // 添加紧急联系人
  addMonitoringPhone: (params)=>apiInstance.post(`/guide_shopping/client/add_monitoring_phone`,params),

}
