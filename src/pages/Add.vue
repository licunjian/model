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
				<el-form-item label="电话号码" prop="contactPhonenum">
					<el-input v-model="formData.contactPhonenum"></el-input>
				</el-form-item>
				<el-form-item label="邮箱" prop="contactEmail">
					<el-input v-model="formData.contactEmail"></el-input>
				</el-form-item>
				<el-form-item label="是否">
					<el-radio v-model="formData.radio" label="1">是</el-radio>
  				<el-radio v-model="formData.radio" label="2">否</el-radio>
				</el-form-item>
				<el-form-item label="文件">
					<el-upload class="upload-demo" ref="upload" action="http://192.168.10.67:8400/uploadFileIO" :on-preview="handlePreview" :on-remove="handleRemove" :file-list="fileList" :on-success="fileSuccess">
						<el-button slot="trigger" size="small" type="primary">选择文件</el-button>
					</el-upload>
				</el-form-item>
				<el-form-item label="视频">
					<el-upload class="upload-demo" ref="upload" action="http://192.168.10.67:8400/uploadFileIO" :on-preview="handlePreview" :on-remove="handleRemove" :file-list="videoList" :beforeUpload="beforeVideoUpload">
						<el-button slot="trigger" size="small" type="primary">选择视频</el-button>
					</el-upload>
				</el-form-item>
				<el-form-item label="音频">
					<el-upload class="upload-demo" ref="upload" action="http://192.168.10.67:8400/uploadFileIO" :on-preview="handlePreview" :on-remove="handleRemove" :file-list="audioList" :beforeUpload="beforeAudioUpload">
						<el-button slot="trigger" size="small" type="primary">选择音频</el-button>
					</el-upload>
				</el-form-item>
				<el-form-item label="会议状态" prop="meetingStatusCode">
					<meeting-status class="width100" @getStatusCode="getStatus"></meeting-status>
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
</template>

<script>
import api from '../axios/url';
import {isNumber,isLetter,isPhone,isEmail,isIdcard} from '../util/validate';
import MeetingStatus from '../components/MeetingStatus.vue';
import {BaiduMap,BmNavigation,BmMarker,BmInfoWindow,BmGeolocation,BmLocalSearch} from 'vue-baidu-map';
export default{
	data(){
		return{
			formData:{
				meetingTopic:'',
				date:'',
				radio:'1',
				contactPhonenum:'',
				contactEmail:'',
				meetingBeginDt:'',
				meetingEndDt:'',
        content:'',
				isOpening:'1',
				participantsNum:10,
				imagePath:'1',
				payment:10,
				meetingStatusCode:'',
				localGps:''
			},
			pickTime: {
				disabledDate(time) {
					return time.getTime() < Date.now();
				}
			},
			show:false,
			fileList:[],
			videoList:[],
			audioList:[],
			location: '',
      keyword: '',
			markerPoint:{lng: 113.484873, lat: 22.568277},
			rules:{
				meetingTopic: [
					{ required: true, message: '请输入会议主题', trigger: 'blur' },
					{ max:30, message: '最多可输入30个字', trigger: 'blur' },
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
	components:{MeetingStatus,BaiduMap,BmNavigation,BmMarker,BmInfoWindow,BmGeolocation,BmLocalSearch},
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
		fileSuccess(response,file){
			console.log(response.resultMap.data)
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
.bm-view{
	width:760px;
	height:300px;
	margin-top:10px;
}
</style>

