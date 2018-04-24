import axios from './axios';

export default {
  //获取列表
  getList (params) {
    return axios.get('http://192.168.10.174:8200/system/meeting/ptMeetingInfo/ptListMeetingInfo', params,3000);
    // return axios.get('http://192.168.13.238:8083/iHF/meetingInfo/ptmeetinginfo/ptviewList.yh', params,3000);
  },
  // 删除列表数据
  delList (params) {
    return axios.get('http://192.168.10.174:8200/system/meeting/ptMeetingInfo/ptDeleteMeetingInfo', params,3000);
    // return axios.get('http://192.168.13.238:8083/iHF/meetingInfo/ptmeetinginfo/ptdelete.yh', params,3000);
  },
  // 增加列表
  addList (params) {
    return axios.get('http://192.168.10.174:8200/system/meeting/ptMeetingInfo/ptAddMeetingInfo', params);
    // return axios.get('http://192.168.13.238:8083/iHF/meetingInfo/ptmeetinginfo/ptaddOne.yh', params);
  },
  // 查看详情
  toDetail (params) {
    return axios.get('http://192.168.10.174:8200/system/meeting/ptMeetingInfo/ptGetMeetingInfo', params);
    // return axios.get('http://192.168.13.238:8083/iHF/meetingInfo/ptmeetinginfo/ptviewOne.yh', params);
  },
  // 修改详情
  saveDetail (params) {
    return axios.get('http://192.168.10.174:8200/system/meeting/ptMeetingInfo/ptUpdateMeetingInfo', params);
    // return axios.get('http://192.168.13.238:8083/iHF/meetingInfo/ptmeetinginfo/ptsaveOne.yh', params);
  },
  // 判断登录是否过期
  judgeTicket (params) {
    return axios.post('http://192.168.13.238:8083/iHF/baseInfo/proxyValidateJson.yh', params);
  },
  //获取状态值的参数
  getMeetingStatus(params){
    return axios.post('http://192.168.10.174:8200/system/code/ptCodeInt/ptListCodeInt', params);
  }
}