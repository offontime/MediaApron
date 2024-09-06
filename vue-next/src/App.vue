<script setup lang="ts">
</script>

<template>
  <div class="main">
    <ap-video
      source="https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-576p.mp4"
      poster="https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-HD.jpg"
      :volume="50"
      :buttons="[
        {
          name: '下载',
          image: 'https://ai.tideo.cn/logo.png',
          callback: () => { console.log(0) }
        },
        'fullscreen'
      ]"
      ></ap-video>
  </div>
</template>

<style lang="less">
.main {
  width: 1200px;
  height: 675px;
}
</style>