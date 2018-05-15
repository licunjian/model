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
				<el-form-item label="电话号码" prop="contactPhonenum">
					<el-input v-model="formData.contactPhonenum"></el-input>
				</el-form-item>
				<el-form-item label="邮箱" prop="contactEmail">
					<el-input v-model="formData.contactEmail"></el-input>
				</el-form-item>
				<el-form-item label="开关" prop="switch">
					<el-switch v-model="formData.switch" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
				</el-form-item>
				<el-form-item label="文件">
					<el-upload class="upload-demo" ref="upload" action="http://192.168.10.67:8400/uploadFileIO" :on-preview="handlePreview" :on-remove="handleRemove" :file-list="fileList" :auto-upload="false">
						<el-button slot="trigger" size="small" type="primary">选取文件</el-button>
					</el-upload>
				</el-form-item>
				<el-form-item label="视频">
					<el-upload class="upload-demo" ref="upload" action="http://192.168.10.67:8400/uploadFileIO" :on-preview="handlePreview" :on-remove="handleRemove" :file-list="videoList" :auto-upload="false">
						<el-button slot="trigger" size="small" type="primary">选取文件</el-button>
					</el-upload>
				</el-form-item>
				<el-form-item label="音频">
					<el-upload class="upload-demo" ref="upload" action="http://192.168.10.67:8400/uploadFileIO" :on-preview="handlePreview" :on-remove="handleRemove" :file-list="audioList" :auto-upload="false">
						<el-button slot="trigger" size="small" type="primary">选取文件</el-button>
					</el-upload>
				</el-form-item>
				<el-form-item label="会议状态" prop="meetingStatusCode">
					<meeting-status class="width100" @getStatusCode="getStatus" :postStatus="formData.meetingStatusCode"></meeting-status>        
				</el-form-item>   
				<el-form-item label="开会时间" prop="date">
					<el-date-picker class="width100" v-model="formData.date" value-format="yyyy-MM-dd HH:mm:ss" type="datetimerange" start-placeholder="开会时间" end-placeholder="结会时间" :picker-options="pickTime"></el-date-picker>
				</el-form-item>
				<el-form-item label="会议地址" prop="localGps">
					<el-input v-model="formData.localGps"><el-button slot="append" icon="el-icon-search" @click="mapSearch"></el-button></el-input>
					<baidu-map class="bm-view" :center="{lng: 113.46466, lat: 23.178076}" :zoom="19" ak="tGtrBb54ZCSAd91zVdjFvnn6I6ZVD7zy" :scroll-wheel-zoom="true" ref="baidumap">
							<bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
							<bm-geolocation anchor="BMAP_ANCHOR_BOTTOM_RIGHT"></bm-geolocation>
							<bm-marker :position="markerPoint" :dragging="true" @click="infoWindowOpen">
								<bm-info-window :show="show" @close="infoWindowClose" @open="infoWindowOpen"></bm-info-window>
							</bm-marker>
							<bm-local-search :panel="false" :keyword="keyword" :auto-viewport="true" :location="location"></bm-local-search>
					</baidu-map>
				</el-form-item>
				<el-button type="primary" class="ml80" size="medium" @click="submit('formData')">发布</el-button>
			</el-col>
		</el-form>
		</div>
	</div>
</template>

<script>
import api from '../axios/url';
import MeetingStatus from '../components/MeetingStatus.vue';
import {isNumber,isLetter,isPhone,isEmail,isIdcard} from '../util/validate';
import {BaiduMap,BmNavigation,BmMarker,BmInfoWindow,BmGeolocation,BmLocalSearch} from 'vue-baidu-map';
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
				localGps:'科学城总部经济区',
				contactPhonenum:'',
				contactEmail:'',
				participantsNum:'',
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
			show:false,
			fileList:[
				{name:'picture',url:'../assets/images/img.jpg'}
			],
			videoList:[
				{name:'video',url:'../assets/images/movie.mp4'}
			],
			audioList:[
				{name:'audio',url:'../assets/images/audio.mp3'}
			],
			location: '',
      keyword: '',
			markerPoint:{lng: 113.484873, lat: 22.568277},
			rules:{
				meetingTopic: [
					{ required: true, message: '请输入会议主题', trigger: 'blur' },
					{ max:30, message: '最多可输入30个字', trigger: 'blur' }
				],
				content: [
					{ required: true, message: '请输入会议内容', trigger: 'blur' },
					{ max:200, message: '最多可输入200个字', trigger: 'blur' }
				],
				contactPhonenum: [
					{ required: true, message: '请输入电话号码', trigger: 'blur' },
					{ validator: isPhone, trigger: 'blur'}
				],
				contactEmail:[
					{ required: true, message: '请输入邮箱', trigger: 'blur' },
					{ validator: isEmail, trigger: 'blur'}
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
		MeetingStatus,BaiduMap,BmNavigation,BmMarker,BmInfoWindow,BmGeolocation,BmLocalSearch
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
		handleRemove(file, fileList) {
			console.log(file, fileList);
		},
		handlePreview(file) {
			console.log(file);
		},
		//  视频上传
		beforeVideoUpload(file) {                
			var testmsg=file.name.substring(file.name.lastIndexOf('.')+1)                 
			const extension = testmsg === 'mp4'  
			const extension2 = testmsg === 'avi'  
			const extension3 = testmsg === 'rm'  
			const extension4 = testmsg === 'rmvb'  
			if(!extension && !extension2 && !extension3&& !extension4) {  
				this.$message({  
					message: '上传文件只能是视频格式!',  
					type: 'warning'  
				});  
			}  
			return extension || extension2 || extension3 || extension4  
		},
		// 音频上传
		beforeAudioUpload(file){
			var testmsg=file.name.substring(file.name.lastIndexOf('.')+1)                 
			const extension = testmsg === 'mp3'  
			if(!extension) {  
				this.$message({  
					message: '上传文件只能是音频格式!',  
					type: 'warning'  
				});  
			}  
			return extension
		},
		// 地图
		infoWindowClose () {
			this.show = false
		},
		infoWindowOpen () {
			this.show = true
		},
		// 地图搜索
		mapSearch(e){
			this.keyword=this.formData.localGps;
			console.log(this.$refs.baidumap.map.gf)
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
.bm-view{
	width:760px;
	height:300px;
	margin-top:10px;
}
</style>
