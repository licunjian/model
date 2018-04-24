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
					<li><span>会议状态：</span>{{data.meetingStatusCode | status}}</li>
					<li><span>会议地址：</span>{{data.localGps?data.localGps:'广州科学城总部经济区'}}</li>					
					<li class="content"><span>会议内容：</span>{{data.contentStr}}</li>
				</ul>
			</el-col>
		</div>
	</div>
</template>

<script>
import utils from '../util/utils';
import api from '../axios/url';
export default {
	data () {
		return {
			data:''
		}
	},
	components: {

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
	}
}
</script>

<style scoped>
.detail-list{margin-top:20px;}
.detail-list li{
	position: relative;
	line-height:40px;
	min-height:40px;
	padding-left:80px;
	border-bottom:1px dashed #ddd;
}

.detail-list span{
	position: absolute;
	text-align:right;
	width:80px;
	left:0;
	top:0;
	bottom:0;
}
</style>
