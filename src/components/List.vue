<template>
  <div>
    <el-form ref="form" :model="form" :inline="true" size="small">
      <el-form-item label="会议主题：">
        <el-input v-model="form.meetingTopic" class="width180" maxlength="30"></el-input>
      </el-form-item>
      <el-form-item label="会议状态：">
        <meeting-status @getStatusCode="getStatus"></meeting-status>        
      </el-form-item>      
      <el-form-item label="开会时间：">
        <el-date-picker :editable=false v-model="form.meetingDate" type="date" placeholder="选择日期" value-format="yyyy-MM-dd"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
      </el-form-item>
    </el-form>
    <div class="fr">
      <el-button type="primary" icon="el-icon-plus" size="medium" @click="toAdd">添加</el-button>
      <el-button type="danger" icon="el-icon-delete" size="medium" @click="toDel">删除</el-button>
    </div>
    <div class="table">
      <el-table :data="data.viewList" tooltip-effect="dark" style="width: 100%"  border @selection-change="handleSelectionChange"  element-loading-text="加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)" @sort-change="sortChange()">
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column type="index" :index="typeIndex" label="序号" width="55" align="center"></el-table-column>
        <el-table-column prop="meetingTopic" label="会议主题" width="200"></el-table-column>
        <el-table-column prop="meetingBeginDtStr" label="开会时间" sortable="custom" width="200"></el-table-column>
        <el-table-column label="会议状态">
          <template slot-scope="scope">
            <span>{{scope.row.meetingStatusCode | status}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button size="small" type="primary" icon="el-icon-edit-outline" @click="toEdit(scope.row.meetingId,scope.row.appId
            ,scope.row.appOrgId)">编辑</el-button>
            <el-button size="small" type="primary" icon="el-icon-more" @click="toDetail(scope.row.meetingId)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="paging">
      <el-pagination background :page-sizes="[10,20,30]" :page-size="10" :total="data.count" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange"></el-pagination>
    </div>
  </div>
</template>

<script>
import api from '../axios/url';
import utils from '../util/utils';
import MeetingStatus from './MeetingStatus.vue';
export default {
  data () {
    return {
      form:{
        value:'',
        meetingTopic:"",
        meetingDate:'',
        sortJudge:false,
      },
      data: '',
      multipleSelection: [],
      params:{   //接口参数
        page:1,
        pageSize:10,
        meetingTopic:'',
        meetingBeginDtStr:'',
        meetingStatusCode:''
      }
    }
  },
  components:{MeetingStatus},
  mixins:[utils],
  created(){
    // 判断票据是否过期
    api.judgeTicket({}).then(res =>{
      console.log(res);
      this.getList();
    },res=>{
      console.log(res);
      this.$message.error('登录已过期，请重新登录');
    })
  },
  methods:{
    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log(this.multipleSelection)
    },
    handleSizeChange: function (size) {
      this.params.pageSize=size;
      this.getList();
    },
    handleCurrentChange: function(currentPage){
      this.params.page=currentPage;
      this.getList();
    },
    // 分页按找正常序列开始
    typeIndex(index){
      return index+this.params.pageSize*(this.params.page-1)+1;
    },
    // 选择状态值
    getStatus(value){
      console.log(value);
      this.form.value=value;
    },
    // 表格按时间排序
    sortChange(){
      if(this.sortJudge==false){
        this.params.orderType='Y';
      }else{
        this.params.orderType='';
      }
      this.params.sortOrder='meetingBeginDt';
      this.sortJudge=!this.sortJudge;
      this.getList();
    },
    getList(){
      api.getList(this.params).then(res =>{
        console.log(res);
        this.data = res.resultMap.data;
      },res=>{
        console.log(res);
        this.$message.error(res.message);
      })
    },
    toAdd(){
      this.$router.push({path:'add'})
    },
    search(){
      if(this.form.meetingTopic||this.form.meetingDate||this.form.value){
        this.params.page=1;
      }
      this.params.meetingTopic=this.form.meetingTopic;
      this.params.meetingBeginDtStr=this.form.meetingDate;
      this.params.meetingStatusCode=this.form.value;
      this.getList();
    },
    toDel(){
      if(this.multipleSelection.length==0){
        this.$message.error('请选择要删除的行');
      }else{
        let temp='';
        for(let i of this.multipleSelection){
          temp+=i.meetingId+',';
        }
        temp=temp.substring(0,temp.length-1);
        this.$confirm('该操作将会删除文件，是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          api.delList({deleteSelection:temp}).then(res =>{
            console.log(res);
            if(res.resultMap.resultCode=='SUCCESS'){
              this.$message.success('删除成功');
              this.getList();
            }
          },res=>{
            console.log(res);
            this.$message.error(res.resultMap.message);
          })
        })
      }
    },
    toEdit(id,id2,id3){
      this.$router.push({name:'edit',params:{meetingId:id,appId:id2?id2:'DCAMPUS',appOrgId:id3?id3:'7788'}});
    },
    toDetail(id){
      this.$router.push({name:'detail',params:{meetingId:id}});
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.width180{width:180px;}
.fr{margin:15px 0;}
.paging{
  margin:15px 0;
  text-align:center;
}
</style>
