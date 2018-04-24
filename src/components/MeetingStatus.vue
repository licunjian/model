<template>
  <el-select v-model="value" placeholder="请选择" @change="getStatus(value)">
    <el-option v-for="item in options" :key="item.name" :label="item.label" :value="item.name"></el-option>
  </el-select>
</template>

<script>
import api from '../axios/url';
export default {
  data () {
    return {
      options:[
        {'label':'全部','name':''}
      ],
      value:''
    }
  },
  props:['postStatus'],
  components: {

  },
  created(){
    api.getMeetingStatus({'codetypeId':'meetingStatus'}).then(res =>{
      console.log(res);
      let meetingTemp = res.resultMap.data.viewList;
      for(let item of meetingTemp){
        this.options.push({
          'label':item.codeDesc,
          'name':item.codeId
        })
      }
    },res=>{
      console.log(res);
      this.$message.error(res.resultMap.message);
    })
  },
  methods:{
    getStatus(value){
      console.log(value)
      this.$emit('getStatusCode',this.value);
    }
  },
  watch:{
    postStatus(){
      this.value=this.postStatus;
    }
  }
}
</script>

<style scoped>

</style>
