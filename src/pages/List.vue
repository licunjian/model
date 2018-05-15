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
      <el-table :data="data.viewList" tooltip-effect="dark" style="width: 100%"  border @selection-change="handleSelectionChange"  element-loading-text="加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)" @sort-change="sortChange" @row-click="toDetail">
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column type="index" :index="typeIndex" label="序号" width="55" align="center"></el-table-column>
        <el-table-column prop="meetingTopic" label="会议主题" width="200"></el-table-column>
        <el-table-column prop="meetingBeginDt" label="开会时间" sortable="custom" width="200">
          <template slot-scope="scope">
            <span>{{scope.row.meetingBeginDt | date}}</span>
          </template>
        </el-table-column>
        <el-table-column label="开关">
          <template slot-scope="scope">
            <el-switch v-model="switchValue" active-color="#13ce66" inactive-color="#ff4949" disabled></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="电话号码" width="200">
          <template slot-scope="scope">
            {{12345678900 | passPhone}}
          </template>
        </el-table-column>
        <el-table-column label="邮箱" width="200">
          <template slot-scope="scope">
            123456@qq.com
          </template>
        </el-table-column>
        <el-table-column label="会议状态">
          <template slot-scope="scope">
            <span :class="scope.row.meetingStatusCode">{{scope.row.meetingStatusCode | status}}</span>
          </template>
        </el-table-column>
        <el-table-column label="图片" width="200">
          <template slot-scope="scope">
            <img src="../assets/images/img.jpg" alt="" width="100px" class="scope-img">
          </template>
        </el-table-column>
        <el-table-column prop="meetingBeginDt" label="音频" width="100">
          <template slot-scope="scope">
            <img v-if="!scope.row.isAudio" src="../assets/images/pause.png" width="30px" alt="" @click.stop="audioPause(scope,scope.row)">
            <img v-if="scope.row.isAudio" src="../assets/images/play.png" width="30px" alt="" @click.stop="audioPlay(scope,scope.row)">
            <audio :ref="'audio'+scope.$index" @ended="audioEnd(scope.row)">
              <source src="../assets/images/audio.mp3" type="audio/mpeg" />
            </audio>
          </template>
        </el-table-column>
        <el-table-column prop="meetingBeginDt" label="视频" width="100">
          <template slot-scope="scope">
            <img v-if="!scope.row.isVideo" src="../assets/images/pause.png" width="30px" alt="" @click.stop="videoPause(scope.row)">
            <img v-if="scope.row.isVideo" src="../assets/images/play.png" width="30px" alt="" @click.stop="videoPlay(scope.row)">
          </template>
        </el-table-column>
        <el-table-column prop="meetingBeginDt" label="GPS" width="200">
          <template slot-scope="scope">
            <span>广州科学城总部经济区</span>
          </template>
        </el-table-column>
        <el-table-column prop="meetingBeginDt" label="二维码" width="200">
          <template slot-scope="scope">
            <img src="../assets/images/erweima.jpg" alt="" width="50px">
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button size="small" type="primary" icon="el-icon-edit-outline" @click.stop="toEdit(scope.row.meetingId,scope.row.appId
            ,scope.row.appOrgId)">编辑</el-button>
            <el-button size="small" type="primary" icon="el-icon-more" @click="toDetail(scope.row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="paging">
      <el-pagination background :page-sizes="[10,20,30]" :page-size="10" :total="data.count" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange"></el-pagination>
    </div>
    <el-dialog title="视频播放" :visible.sync="dialogVisible" width="50%" @close="videoClose">
      <video width="100%" height="240" control ref="video" autoplay="true">
          <source src="../assets/images/movie.mp4" type="video/mp4">
      </video>
    </el-dialog>
  </div>
</template>

<script>
import api from '../axios/url';
import utils from '../util/utils';
import MeetingStatus from '../components/MeetingStatus.vue';
export default {
  components:{MeetingStatus},
  data () {
    return {
      form:{
        value:'',
        meetingTopic:"",
        meetingDate:'',
        sortJudge:false,
      },
      data: '',
      videoSrc:'',
      dialogVisible:false,
      switchValue:'Y'?true:false,
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
    sortChange(obj){
      console.log(obj)
      if(this.sortJudge==false){
        this.params.orderType='Y';
      }else{
        this.params.orderType='';
      }
      this.params.sortOrder=obj.prop;
      this.sortJudge=!this.sortJudge;
      this.getList();
    },
    getList(){
      api.getList(this.params).then(res =>{
        console.log(res);
        for(let i of res.resultMap.data.viewList){
          i.isAudio=false;
          i.isVideo=false;
        }
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
    toDetail(item){
      this.$router.push({name:'detail',params:{meetingId:item.meetingId}});
    },
    // 音频播放暂停
    audioPause(val,item){
      item.isAudio=true;
      this.$refs['audio'+val.$index].play();
    },
    audioPlay(val,item){
      item.isAudio=false;
      this.$refs['audio'+val.$index].pause();
    },
    audioEnd(item){
      this.$set(item,'isAudio',false);
      for(let i of this.data.viewList){
        i.isAudio=false;
      }
    },
    // 视频播放暂停
    videoPause(item){
      this.dialogVisible=true;
      item.isVideo=true;
    },
    videoPlay(item){
      
    },
    videoClose(){
      this.$refs.video.pause();
      for(let i of this.data.viewList){
        i.isVideo=false;
      }
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
/* 表格新参数样式 */
.layer-box{
  width:100%;
  height: 100%;
  position:fixed;
  top:0;
  left:0;
  z-index:99;
  background:rgba(0,0,0,0.6);
}
</style>
