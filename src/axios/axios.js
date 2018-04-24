//to fixed promise undefined in IEs
// import 'babel-polyfill';
// 引用axios
import axios from 'axios';
import { Message  } from 'element-ui';
import Vue from 'vue';
//引入弹窗
// import msg from '@/components/MessageBox/';

//API接口地址配置
// import urlConfig from '../../config/url.config.js';

var dataType = 'application/x-www-form-urlencoded',
    defaultTimeout = 5000;
axios.defaults.timeout = defaultTimeout; //响应时间
// axios.defaults.baseURL = urlConfig.baseUrl;
axios.defaults.headers.post['Content-Type'] = dataType; //
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
//开发环境才配置
// if (urlConfig.isDevEnv) {
//   axios.defaults.withCredentials = true; //可配置cookie
// }

//对象转字符串 TODO deep
function objToStr(obj, flag1, flag2, fitlerNull) {
  flag1 = flag1 || '=';
  flag2 = flag2 || '&';
  var result = '';
  for (var item in obj) {
    if (obj[item] === '' || obj[item] === null || obj[item] === undefined) continue;
    result += item + flag1 + obj[item] + flag2;
  }
  return result.slice(0);
}

//POST传参序列化(添加请求拦截器)
var requestInterceptSuc = function (config) {
  if(config.data){
    config.data=Object.assign(config.data,{ticket:'c6a2babf-9e42-48d6-8984-93be71dc15c9',service:'http://www.baidu.com'});    
  } else if(config.params){
    config.params=Object.assign(config.params,{ticket:'c6a2babf-9e42-48d6-8984-93be71dc15c9',service:'http://www.baidu.com'});  
  }
  // 在发送请求之前做某件事
  if(typeof config.data === 'object' && config.method  === 'post' && config.headers.post['Content-Type'] === dataType){
    config.data = objToStr(config.data, '=', '&', true);
  }
  //过滤空值
  if (config.headers.post['Content-Type'] === 'application/json') {
    for (var item in config.data) {
      if (config.data[item] === '' || config.data[item] === null || config.data[item] === undefined) {
        delete config.data[item];
      }
    }
  }
  //加载loading图 TODO

  return config;
}
var requestInterceptErr = function (error) {
  //提示弹窗
  showMessage({
    message: error.message
  });
  console.log("错误的传参", 'fail');
  return Promise.reject(error);
};
axios.interceptors.request.use(requestInterceptSuc, requestInterceptErr);

//返回状态判断(添加响应拦截器)
var responseInterceptSuc = function (res) {
  console.log(res)
  var flag = res.data.resultMap.resultCode,
      popMsg = ['FAIL', // 操作失败
                'NO_AUTH', //权限不够
                'SYSTEM_ERROR', //系统出错
                'DUPLICATION', //数据重复、重复操作
                'NO_EXISTS',//数据不存在
                'REMOTE_LOGIN'//异地登录，被挤下线
                ];     

  //其他不成功情况
  if (flag !== 'SUCCESS') {
    return Promise.reject(res.data);
  }
  return res;
};
var responseInterceptErr = function (error) {
  console.log(error)
  // 提示弹窗
  console.log("网络异常", error);
  if (error && error.response) {
    switch (error.response.status) {
      case 400:
        error.message = '错误请求'
        break;
      case 401:
        error.message = '未授权，请重新登录'
        break;
      case 403:
        error.message = '拒绝访问'
        break;
      case 404:
        error.message = '请求错误,未找到该资源'
        break;
      case 405:
        error.message = '请求方法未允许'
        break;
      case 408:
        error.message = '请求超时'
        break;
      case 500:
        error.message = '服务器端出错'
        break;
      case 501:
        error.message = '网络未实现'
        break;
      case 502:
        error.message = '网络错误'
        break;
      case 503:
        error.message = '服务不可用'
        break;
      case 504:
        error.message = '网络超时'
        break;
      case 505:
        error.message = 'http版本不支持该请求'
        break;
      default:
        error.message = `连接错误${error.response.status}`
    }
  } else {
    error.message = "连接到服务器失败"
  }
  return Promise.reject(error);
};
axios.interceptors.response.use(responseInterceptSuc, responseInterceptErr);

//返回一个Promise(发送post请求)
export default {
  get: function (url, params, timeout) {
    if (timeout === undefined) {
      timeout = defaultTimeout;
    }
    return new Promise(function(resolve, reject) {
      axios.get(url, {params:params}, {timeout: timeout})
        .then(function (response) {
          resolve(response.data);
        }, function (err) {
          reject(err);
        })
        .catch(function (err) {
          reject(error);
        });
    });
  },
  post: function (url, params, timeout) {
    if (timeout === undefined) {
      timeout = defaultTimeout;
    }
    return new Promise(function(resolve, reject) {
      axios.post(url, params, {timeout: timeout})
        .then(function (response) {
          resolve(response.data);
        }, function (err) {
          reject(err);
        })
        .catch(function (err) {
          reject(error);
        });
    });
  },
  //JSON格式
  postJson: function (url, params, timeout) {
    if (timeout === undefined) {
      timeout = defaultTimeout;
    }
    return new Promise(function(resolve, reject) {
      var inst = axios.create({
        headers: {
          post: {'Content-Type': 'application/json'}
        }
      });

      inst.interceptors.request.use(requestInterceptSuc, requestInterceptErr);
      inst.interceptors.response.use(responseInterceptSuc, responseInterceptErr);

      inst.post(url, params, {timeout: timeout})
      .then(function (response) {
        resolve(response.data);
      }, function (err) {
        reject(err);
      })
      .catch(function (err) {
        reject(error);
      });

    });
  },
  //formData格式
  postFormData: function (url, params, timeout) {
    if (timeout === undefined) {
      timeout = defaultTimeout;
    }
    console.log(typeof params)
    return new Promise(function(resolve, reject) {
      var inst = axios.create({
        headers: {
          post: {'Content-Type': 'multipart/form-data'}
        }
      });

      inst.interceptors.request.use(requestInterceptSuc, requestInterceptErr);
      inst.interceptors.response.use(responseInterceptSuc, responseInterceptErr);

      inst.post(url, params, {timeout: timeout})
      .then(function (response) {
        resolve(response.data);
      }, function (err) {
        reject(err);
      })
      .catch(function (err) {
        reject(error);
      });

    });
  },
  originAxios: axios
};
