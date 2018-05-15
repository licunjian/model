// 数字校验
var isNumber = (rule, value, callback) => {
  var reg = /^[0-9]*$/;
  if (reg.test(value)==false) {
    callback(new Error('只能输入数字'));
  }else{
    callback();
  }
}
// 英文校验
var isLetter = (rule, value, callback) => {
  var reg = /^[a-zA-Z]+$/;
  if (reg.test(value)==false) {
    callback(new Error('只能输入英文'));
  }else{
    callback();
  }
}
// 电话号码校验
var isPhone = (rule, value, callback) => {
  var reg = /^(((13[0-9]{1})|(14[0-9]{1})|(17[0-9]{1})|(15[0-3]{1})|(15[5-9]{1})|(18[0-9]{1})|(16[6-7]{1})|(19[8-9]{1}))+\d{8})$/;
  if (reg.test(value)==false) {
    callback(new Error('手机号码格式错误'));
  }else{
    callback();
  }
}
// 邮箱校验
var isEmail = (rule, value, callback) => {
  var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
  if (reg.test(value)==false) {
    callback(new Error('邮箱格式错误'));
  }else{
    callback();
  } 
}
// 身份证校验 
var isIdcard = (rule, value, callback) => {
  var reg = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
  if (reg.test(value)==false) {
    callback(new Error('身份证号码格式错误'));
  }else{
    callback();
  }
}

export{
  isNumber,isLetter,isPhone,isEmail,isIdcard
}