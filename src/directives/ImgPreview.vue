<template>
  <div>
    <div class="layer">
      <img :src="currentImg" alt="" @click="zoomOut">
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {

    }
  },
  props:['currentImg','show'],
  components: {
    
  },
  methods:{
    zoomOut(){
      this.$emit('close');
    }
  }
}
</script>

<style scoped>
.layer{
  width: 100%;
  height:100%;
  position: fixed;
  left:0;
  top:0;
  background:rgba(0,0,0,0.5);
}
.layer img{
  position: absolute;
  left:50%;
  top:50%;
  cursor:zoom-out;
  transform:translate(-50%,-50%);
  -ms-transform:translate(-50%,-50%); 	
  -moz-transform:translate(-50%,-50%); 	
  -webkit-transform:translate(-50%,-50%); 
  -o-transform:translate(-50%,-50%);
  /* width:80%; */
}
</style>
