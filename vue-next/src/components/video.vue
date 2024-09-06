<script lang="ts" setup>
import { ref } from 'vue'
import MediaProgress from './source/progress.vue'
import MediaVolume from './source/volume.vue'
import { secondsToTimeFormat } from './source/time-parse'
defineOptions({
  name: 'ApVideo'
})

const props = defineProps({
  source: {
    type: String || Array,
    default: ''
  },
  poster: {
    type: String || null,
    default: null
  },
  mode: {
    type: String,
    default: 'contain'
  },
  playsinline: {
    type: Boolean,
    default: false
  },
  muted: {
    type: Boolean,
    default: false
  },
  autoplay: {
    type: Boolean,
    default: false
  },
  volume: {
    type: Number,
    default: 100
  },
  buttons: {
    type: Array<any>,
    default: [
      'fullscreen'
    ]
  },
  nextCallback: {
    type: Function || null,
    default: null
  }
})
const videoRef = ref()
const viewPoster = ref(true)
const currentVideoUrl = ref('')
const currentVideoIndex = ref(0)
const videoList = ref([])
const isSingleVideo = ref(true)
const videoVolume = ref(props.volume || 100)
const isNowPlaying = ref(props.autoplay || false)
const videoDuration = ref(0)
const videoCurrentAt = ref(0)

const init = (index: number) => {
  // 设置第一个要播放的视频
  const source = props.source
  // source 是 字符串
  if (typeof source === 'string') {
    // 单视频模式
    currentVideoUrl.value = source
    isSingleVideo.value = true
    return
  }
  // source 为数组
  if (source.length === 1 && typeof source[0] === 'string') {
    // 单视频模式
    currentVideoUrl.value = source[0]
    isSingleVideo.value = true
    return
  }
  videoList.value = source
  currentVideoUrl.value = source[0].url
  isSingleVideo = false
}

init()

// 播放状态切换
const setPlayingToggle = () => {
  const nextPlayingStatus = !isNowPlaying.value
  isNowPlaying.value = nextPlayingStatus
  nextPlayingStatus ? videoRef.value.play() : videoRef.value.pause()
}

const loadVideoMeta = () => {
  // 获取视频参数
  videoDuration.value = videoRef.value.duration
  videoCurrentAt.value = videoRef.value.currentTime
}

// 进度条更新播放位置
const changeCurrentTime = (next: number) => {
  videoCurrentAt.value = next
  videoRef.value.currentTime = next
}

const handleVolumeChange = ({ value }: any) => {
  videoRef.value.volume = value / 100
  videoVolume.value = value
}
const handleVideoMuteToggle = (next: boolean) => {
  videoRef.value.muted = next
}
const onVideoPlayEnd = () => {
  isNowPlaying.value = props.autoplay || false
}
const handlePlayNext = () => {
  // 播放下一个
}
document.addEventListener('keydown', ({ key }) => {
  if (key === ' ') setPlayingToggle() // 用空格控制播放和暂停
})
// 全屏切换
const handleFullScreenToggle = () => {
  const video = videoRef.value
  if (!document.fullscreenElement) {
    if (video.requestFullscreen) {
      video.requestFullscreen();
    } else if (video.mozRequestFullScreen) {
      video.mozRequestFullScreen(); // Firefox
    } else if (video.webkitRequestFullscreen) {
      video.webkitRequestFullscreen(); // Chrome、Safari 和 Opera
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen(); // Firefox
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen(); // Chrome、Safari 和 Opera
    }
  }
}
</script>

<template>
  <div :class="['apron-video', isNowPlaying ? 'apron-playing-video' : 'apron-pausing-video']" @dblclick="handleFullScreenToggle">
    <video
      ref="videoRef"
      :src="currentVideoUrl"
      :style="{
        objectFit: mode
      }"
      :playsinline="playsinline"
      :muted="muted"
      :autoplay="autoplay"
      :poster="poster"
      @ended="onVideoPlayEnd"
      @loadedmetadata="loadVideoMeta"
      @timeupdate="loadVideoMeta"
      controlslist="nodownload"
    />
    <div class="center-play-button" :style="`opacity: ${isNowPlaying ? 0 : 1}; cursor: ${isNowPlaying ? '' : 'pointer'}`" @click="setPlayingToggle">
      <ap-icon name="play" color="#FFFFFF" :size="30" />
    </div>
    <div class="controls-container">
      <media-progress
        style="margin-bottom: 10px;"
        :current="videoCurrentAt"
        :total="videoDuration"
        @change="changeCurrentTime"
        />
      <div class="video-control">
        <div class="main-controls">
          <div class="element button" @click="setPlayingToggle">
            <ap-icon v-if="isNowPlaying" name="pause" color="#FFFFFF" />
            <ap-icon v-else name="play" color="#FFFFFF" />
          </div>
          <div v-if="nextCallback" class="element button" @click="handlePlayNext">
            <ap-icon name="next" color="#FFFFFF" />
          </div>
          <div class="element">
            {{ secondsToTimeFormat(videoCurrentAt) }}/{{ secondsToTimeFormat(videoDuration) }}
          </div>
        </div>
        <div class="append-controls">
          <media-volume :is-muted="muted" v-model="videoVolume" @change="handleVolumeChange" @muted-toggle="handleVideoMuteToggle" class="element" />
          <div class="element" v-for="item,index in buttons" :key="`video-button-${index}`">
            <div v-if="(item.hasOwnProperty('icon') || item.hasOwnProperty('image')) && item.hasOwnProperty('callback')" class=" button" @click="item.callback">
              <img v-if="item.image" :src="item.image" />
              <ap-icon v-else-if="item.icon" :name="item.icon" color="#FFFFFF" />
              <ap-icon v-else name="flame" color="#FFFFFF" />
            </div>
            <div v-if="item === 'fullscreen'" class="element button" @click="handleFullScreenToggle">
              <ap-icon name="fullscreen" color="#FFFFFF" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less">
.apron-video {
  width: 100%;
  height: 100%;
  background: #000000;
  position: relative;
  video {
    width: 100%;
    height: 100%;
  }
  .poster {
    width: 100%;
    height: 100%;
    object-fit: cover;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .center-play-button {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: #4C9EEA;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    transition: all, 150ms;
  }
  .controls-container {
    width: 100%;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, .6));
    color: #FFFFFF;
    position: absolute;
    bottom: 0;
    left: 0;
    padding: 20px;
    transition: all, 150ms;
    .video-control {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      div {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        .element {
          margin: 0 5px;
          &:first-child { margin-left: 0 }
          &:last-child { margin-right : 0 }
        }
        .button {
          width: 30px;
          height: 30px;
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          transition: all, 150ms;
          border-radius: 50%;
          transition: all, 150ms;
          img {
            width: 20px;
            height: 20px;
          }
          &:hover {
            background: #393939;
          }
        }
      }
    }
  }
}
.apron-playing-video {
  .controls-container {
    opacity: 0;
  }
  &:hover {
    .controls-container {
      opacity: 1;
    }
  }
  &:not(:hover) {
    .controls-container {
      transition-delay: 1500ms;
    }
  }
}
.apron-pausing-video {
  .controls-container {
    opacity: 1;
  }
}
</style>