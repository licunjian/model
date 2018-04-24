<template>
	<div>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/list' }">列表</el-breadcrumb-item>
			<el-breadcrumb-item>新增</el-breadcrumb-item>
		</el-breadcrumb>
		<el-form :label-position="'right'" label-width="80px" ref="formData" :model="formData" :rules="rules" size="small" >
			<el-col :span="8">
				<el-form-item label="会议主题" prop="meetingTopic">
					<el-input v-model="formData.meetingTopic"></el-input>
				</el-form-item>
				<el-form-item label="会议内容" prop="content">
					<el-input v-model="formData.content" type="textarea" :autosize="{minRows:3}" resize="none"></el-input>
				</el-form-item>
				<el-form-item label="会议状态" prop="meetingStatusCode">
					<meeting-status class="width100" @getStatusCode="getStatus"></meeting-status>
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
</template>

<script>
import api from '../axios/url';
import MeetingStatus from './MeetingStatus.vue';
export default{
	data(){
		return{
			formData:{
				meetingTopic:'',
				date:'',
				meetingBeginDt:'',
				meetingEndDt:'',
        content:'',
				isOpening:'1',
				participantsNum:10,
				imagePath:'1',
				payment:10,
				meetingStatusCode:'',
				localGps:'广州科学城总部经济区'
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
	components:{MeetingStatus},
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
					this.formData.meetingBeginDt=this.formData.date[0];
					this.formData.meetingEndDt=this.formData.date[1];
					delete this.formData.date;
					
					api.addList(this.formData).then(res =>{
						console.log(res);
						if(res.resultMap.resultCode=='SUCCESS'){
							this.$message.success('发布成功');
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
</style>

