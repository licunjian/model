function toDouble(obj){
  if(obj<10){
    return '0'+obj;
  }else{
    return obj;
  }
}

export default{
  filters:{
		date(msg){
      let date=new Date(msg);
      return date.getFullYear()+'-'+toDouble(date.getMonth()+1)+'-'+toDouble(date.getDate())+' '+toDouble(date.getHours())+':'+toDouble(date.getMinutes());
    },
    status(msg){
      switch(msg)
      {    
      case 'approving':
        return '审批中'
        break;
      case 'available':
        return '可用'
        break;
      case 'disable':
        return '停用'
        break;
      case 'editing':
        return '编辑中'
        break;
      case 'reject':
        return '驳回'
        break;
      default:
        return ''
      }
    },
    passPhone(msg){
      msg=msg+'';
      var temp = msg.substr(0,3)+'****'+msg.substr(7);
      return temp;
    }
  }
}