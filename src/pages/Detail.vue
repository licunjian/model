<template>
	<div>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/list' }">列表</el-breadcrumb-item>
			<el-breadcrumb-item>详情</el-breadcrumb-item>
		</el-breadcrumb>
		<div>
			<el-col>
				<ul class="detail-list">
					<li><span>会议ID：</span>{{data.meetingId}}</li>
					<li><span>会议主题：</span>{{data.meetingTopic}}</li>
					<li><span>开会时间：</span>{{data.meetingBeginDtStr}}</li>
					<li><span>结会时间：</span>{{data.meetingEndDtStr}}</li>
					<li><span>电话号码：</span>{{12345678910 | passPhone}}</li>
					<li><span>邮箱：</span>123456@qq.com</li>
					<li><span>数字：</span>123456</li>
					<li><span>文件：</span><i class="iconfont icon-doc"></i>这是文件.doc</li>
					<li>
						<span>开关：</span>
						<el-switch disabled v-model="switchValue" active-color="#13ce66"></el-switch>
					</li>
					<li><span>会议状态：</span><i :class="data.meetingStatusCode">{{data.meetingStatusCode | status}}</i></li>
					<li>
						<span>音频：</span>
						<audio controls ref="audio" style="margin-top:4px;">
								<source src="../assets/images/audio.mp3" type="audio/mpeg">
						</audio>
					</li>
					<li>
						<span>视频：</span>
						<video width="500" height="240" controls ref="video">
								<source src="../assets/images/movie.mp4" type="video/mp4">
						</video>
					</li>
					<li>
						<span>会议地址：</span>{{data.localGps?data.localGps:'广州科学城总部经济区'}}
						<baidu-map class="bm-view" :center="{lng: 113.46466, lat: 23.178076}" :zoom="19" ak="tGtrBb54ZCSAd91zVdjFvnn6I6ZVD7zy" :scroll-wheel-zoom="true">
								<bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
								<bm-marker :position="markerPoint" :dragging="true" @click="infoWindowOpen">
									<bm-info-window :show="show" @close="infoWindowClose" @open="infoWindowOpen"></bm-info-window>
								</bm-marker>
						</baidu-map>
					</li>	
					<li><span>会议图片：</span>
						<img src="../assets/images/img.jpg" alt="" width="100px" v-preview>
					</li>			
					<li><span>二维码：</span>
						<img src="../assets/images/erweima.jpg" alt="" width="100px" v-preview>
					</li>		
					<li class="content"><span>会议内容：</span>{{data.contentStr}}</li>
				</ul>
			</el-col>
		</div>
	</div>
</template>

<script>
import utils from '../util/utils';
import api from '../axios/url';
import preview from '../directives/preview';
import {BaiduMap,BmNavigation,BmMarker,BmInfoWindow} from 'vue-baidu-map';
export default {
	data () {
		return {
			data:'',
			show:false,
			switchValue:true,
			markerPoint:{lng: 113.484873, lat: 22.568277}
		}
	},
	directives:{
		preview
	},
	components: {
		BaiduMap,BmNavigation,BmMarker,BmInfoWindow
	},
	mixins:[utils],
	created(){
		api.toDetail({meetingId:this.$route.params.meetingId}).then(res =>{
			console.log(res);
			if(res.resultMap.resultCode=='SUCCESS'){
				this.data=res.resultMap.data;
			}
		},res=>{
			console.log(res);
			this.$message.error(res.message);
		})
	},
	methods:{
		infoWindowClose () {
			this.show = false
		},
		infoWindowOpen () {
			this.show = true
		}
	}
}
</script>

<style scoped>
@import '../assets/icon/iconfont.css';
.detail-list{margin-top:20px;}
.detail-list li{
	position: relative;
	line-height:40px;
	min-height:40px;
	padding-left:80px;
	border-bottom:1px dashed #ddd;
}
.detail-list li img{
	margin-top:10px;
	cursor:zoom-in;
}
.detail-list span{
	position: absolute;
	text-align:right;
	width:80px;
	left:0;
	top:0;
	bottom:0;
}
.detail-list i{
	font-style: normal;
}
li .el-icon-document{
	color:#409EFF;
	font-size:16px;
}
/* 地图样式 */
.bm-view{
	width:760px;
	height:300px;
}
</style>
