<template>
	<div>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/list' }">列表</el-breadcrumb-item>
			<el-breadcrumb-item>编辑</el-breadcrumb-item>
		</el-breadcrumb>
		<div class="form-table">
			<el-form :label-position="'right'" label-width="80px" ref="formData" :model="formData" :rules="rules" size="small" >
			<el-col :span="8">
				<el-form-item label="会议主题" prop="meetingTopic">
					<el-input v-model="formData.meetingTopic" maxlength="30"></el-input>
				</el-form-item>
				<el-form-item label="会议内容" prop="content">
					<el-input v-model="formData.content" type="textarea" :autosize="{minRows:3}" resize="none" maxlength="200"></el-input>
				</el-form-item>
				<el-form-item label="会议状态" prop="meetingStatusCode">
					<meeting-status class="width100" @getStatusCode="getStatus" :postStatus="formData.meetingStatusCode"></meeting-status>        
				</el-form-item>   
				<el-form-item label="开会时间" prop="date">
					<el-date-picker class="width100" v-model="formData.date" value-format="yyyy-MM-dd HH:mm:ss" type="datetimerange" start-placeholder="开会时间" end-placeholder="结会时间" :picker-options="pickTime"></el-date-picker>
				</el-form-item>
				<el-form-item label="会议地址" prop="localGps">
					<el-input v-model="formData.localGps"></el-input>
				</el-form-item>
				<el-button type="primary" class="ml80" size="medium" @click="submit('formData')">发布</el-button>
			</el-col>
		</el-form>
		</div>
	</div>
</template>

<script>
import api from '../axios/url';
import MeetingStatus from './MeetingStatus.vue';
function toDouble(obj){
  if(obj<10){
    return '0'+obj;
  }else{
    return obj;
  }
}

export default {
	data () {
		return {
			data:'',
			formData:{
				date:['',''],
				meetingTopic:'',
				meetingBeginDt:'',
				meetingEndDt:'',
				content:'',
				isOpening:'1',
				imagePath:'1',
				meetingStatusCode:'',
				localGps:'',
				meetingId:this.$route.params.meetingId,
				appId:this.$route.params.appId,
				appOrgId:this.$route.params.appOrgId,
				version:''
			},
			pickTime: {
				disabledDate(time) {
					return time.getTime() < Date.now()
				}
			},
			rules:{
				meetingTopic: [
					{ required: true, message: '请输入会议主题', trigger: 'blur' },
					{ max:30, message: '最多可输入30个字', trigger: 'blur' }
				],
				content: [
					{ required: true, message: '请输入会议内容', trigger: 'blur' },
					{ max:200, message: '最多可输入200个字', trigger: 'blur' }
				],
				meetingStatusCode: [
					{ required: true, message: '请选择会议状态', trigger: 'change'},
				],
				date: [
					{ required: true, message: '请选择会议时间', trigger: 'blur'}
				],
				localGps: [
					{ required: true, message: '请输入会议地址', trigger: 'blur'}
				]
			}
		}
	},
	components: {
		MeetingStatus
	},
	created(){
		api.toDetail({meetingId:this.$route.params.meetingId}).then(res =>{
			console.log(res);
			if(res.resultMap.resultCode=='SUCCESS'){
				let data=res.resultMap.data;
				this.data=data;
				this.formData.meetingTopic=data.meetingTopic;
				this.formData.content=data.contentStr;
				this.formData.meetingStatusCode=data.meetingStatusCode;
				this.formData.version=data.version||data.iVersion;
				let date1=data.meetingBeginDt;
				let date2=data.meetingEndDt;
				if(date1.year){
					this.formData.date=[
						new Date(date1.year+1900,date1.month,date1.date,date1.hours,date1.minutes,date1.seconds),
						new Date(date2.year+1900,date2.month,date2.date,date2.hours,date2.minutes,date1.seconds)
					];
				}else{
					this.formData.date=[
						new Date(new Date(date1).getFullYear(),new Date(date1).getMonth(),new Date(date1).getDate(),new Date(date1).getHours(),new Date(date1).getMinutes(),new Date(date1).getSeconds()),
						new Date(new Date(date2).getFullYear(),new Date(date2).getMonth(),new Date(date2).getDate(),new Date(date2).getHours(),new Date(date2).getMinutes(),new Date(date2).getSeconds())
					];
				}
				this.formData.localGps=data.localGps?data.localGps:'广州科学城总部经济区';
			}
		},res=>{
			console.log(res);
			this.$message.error(res.message);
		})
	},
	methods:{
		// 选择状态值
    getStatus(value){
      console.log(value);
      this.formData.meetingStatusCode=value;
    },
		submit(formData){
			this.$refs[formData].validate((valid) => {
				if (valid) {
					console.log('success');
					let num1=new Date(this.formData.date[0]);
					let num2=new Date(this.formData.date[1]);
					this.formData.meetingBeginDt = num1.getFullYear()+'-'+(toDouble(num1.getMonth())+1)+'-'+toDouble(num1.getDate())+' '+toDouble(num1.getHours())+':'+toDouble(num1.getMinutes())+':'+toDouble(num1.getSeconds());
					this.formData.meetingEndDt = num2.getFullYear()+'-'+(toDouble(num2.getMonth())+1)+'-'+toDouble(num2.getDate())+' '+toDouble(num2.getHours())+':'+toDouble(num2.getMinutes())+':'+toDouble(num2.getSeconds());
					delete this.formData.date;

					api.saveDetail(this.formData).then(res =>{
						console.log(res);
						if(res.resultMap.resultCode=='SUCCESS'){
							this.$message.success('保存成功');
							this.$router.push({path:'/list'});
						}
					},res=>{
						console.log(res);
						this.$message.error(res.resultMap.message);
					})				
				} else {
					console.log('error submit!!');
					return false;
				}
			});
		}
	}
}
</script>

<style scoped>
.ml80{margin-left:80px;}
.width100{width:100%;}
.form-table{margin-top:20px;}
</style>
