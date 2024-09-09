<script lang="ts" setup>
import { ref } from 'vue'
import MediaProgress from './source/progress.vue'
import MediaVolume from './source/volume.vue'
import { secondsToTimeFormat } from './source/time-parse'
defineOptions({
  name: 'ApAudio'
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
  mini: {
    type: Boolean,
    default: false
  },
  buttons: {
    type: Array<any>,
    default: []
  },
  nextCallback: {
    type: Function || null,
    default: null
  }
})

const audioRef = ref()
const currentAudioUrl = ref('')
const currentaudioIndex = ref(0)
const audioList = ref([])
const isSingleaudio = ref(true)
const audioVolume = ref(props.volume || 100)
const isNowPlaying = ref(props.autoplay || false)
const audioDuration = ref(0)
const audioCurrentAt = ref(0)

const init = (index: number) => {
  // 设置第一个要播放的视频
  const source = props.source
  // source 是 字符串
  if (typeof source === 'string') {
    // 单视频模式
    currentAudioUrl.value = source
    isSingleaudio.value = true
    return
  }
  // source 为数组
  if (source.length === 1 && typeof source[0] === 'string') {
    // 单视频模式
    currentAudioUrl.value = source[0]
    isSingleaudio.value = true
    return
  }
  audioList.value = source
  currentAudioUrl.value = source[0].url
  isSingleaudio.value = false
}

init()

// 播放状态切换
const setPlayingToggle = () => {
  const nextPlayingStatus = !isNowPlaying.value
  isNowPlaying.value = nextPlayingStatus
  nextPlayingStatus ? audioRef.value.play() : audioRef.value.pause()
}

const loadAudioMeta = () => {
  // 获取视频参数
  audioDuration.value = audioRef.value.duration
  audioCurrentAt.value = audioRef.value.currentTime
}

// 进度条更新播放位置
const changeCurrentTime = (next: number) => {
  audioCurrentAt.value = next
  audioRef.value.currentTime = next
}

const handleVolumeChange = ({ value }: any) => {
  audioRef.value.volume = value / 100
  audioVolume.value = value
}
const handleaudioMuteToggle = (next: boolean) => {
  audioRef.value.muted = next
}
const onaudioPlayEnd = () => {
  isNowPlaying.value = props.autoplay || false
}
const handlePlayNext = () => {
  // 播放下一个
}
document.addEventListener('keydown', ({ key }) => {
  if (key === ' ') setPlayingToggle() // 用空格控制播放和暂停
})
</script>

<template>
  <div :class="['apron-audio', mini ? 'apron-mini-audio' : '', isNowPlaying ? 'apron-playing-audio' : 'apron-pausing-audio']" @dblclick="handleFullScreenToggle">
    <audio
      ref="audioRef"
      :src="currentAudioUrl"
      :style="{
        objectFit: mode
      }"
      :playsinline="playsinline"
      :muted="muted"
      :autoplay="autoplay"
      :poster="poster"
      @ended="onaudioPlayEnd"
      @loadedmetadata="loadAudioMeta"
      @timeupdate="loadAudioMeta"
      controlslist="nodownload"
      style="display: none;"
    />
    <div class="mini-controls-container" v-if="mini">
      <div class="audio-control">
        <div class="element button" @click="setPlayingToggle">
          <ap-icon v-if="isNowPlaying" name="pause" color="#FFFFFF" :size="20" />
          <ap-icon v-else name="play" color="#FFFFFF" :size="20" />
        </div>
      </div>
      <div class="time-inspector">
        <div class="current">{{ secondsToTimeFormat(audioCurrentAt) }}</div>
        <div class="total">{{ secondsToTimeFormat(audioDuration) }}</div>
      </div>
    </div>
    <div class="controls-container" v-else>
      <media-progress
        style="margin-bottom: 10px;"
        :current="audioCurrentAt"
        :total="audioDuration"
        @change="changeCurrentTime"
        />
      <div class="audio-control">
        <div class="element">
          {{ secondsToTimeFormat(audioCurrentAt) }}/{{ secondsToTimeFormat(audioDuration) }}
        </div>
        <div class="main-controls">
          <div class="element button" @click="setPlayingToggle">
            <ap-icon v-if="isNowPlaying" name="pause" color="#FFFFFF" />
            <ap-icon v-else name="play" color="#FFFFFF" />
          </div>
        </div>
        <div class="append-controls">
          <div class="element" v-for="item,index in buttons" :key="`audio-button-${index}`">
            <div v-if="(item.hasOwnProperty('icon') || item.hasOwnProperty('image')) && item.hasOwnProperty('callback')" class=" button" @click="item.callback">
              <img v-if="item.image" :src="item.image" />
              <ap-icon v-else-if="item.icon" :name="item.icon" color="#FFFFFF" />
              <ap-icon v-else name="flame" color="#FFFFFF" />
            </div>
          </div>
          <media-volume :is-muted="muted" v-model="audioVolume" @change="handleVolumeChange" @muted-toggle="handleaudioMuteToggle" class="element" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.apron-audio {
  background: #393939;
  padding: 15px 10px;
  border-radius: 8px;
  .controls-container {
    transition: all, 150ms;
    .audio-control {
      position: relative;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      .main-controls {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
      .element {
        margin: 0 5px;
        color: #FFFFFF;
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
        background: rgba(0, 0, 0, .2);
        img {
          width: 20px;
          height: 20px;
        }
        &:hover {
          background: rgba(255, 255, 255, .1);
        }
      }
      div {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
      }
    }
  }
}
.apron-mini-audio {
  height: 60px;
  max-width: 300px;
  min-width: 100px;
  border-radius: 30px;
  padding: 10px 20px 10px 10px;
  .mini-controls-container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    .button {
      width: 40px;
      height: 40px;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      transition: all, 150ms;
      border-radius: 50%;
      transition: all, 150ms;
      background: rgba(255, 255, 255, .2);
      &:hover {
        background: rgba(255, 255, 255, .1);
      }
    }
    .time-inspector {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-end;
      .current {
        color: #FFFFFF;
        font-size: 20px;
        line-height: 20px;
      }
      .total {
        color: #888888;
        font-size: 12px;
        line-height: 12px;
        margin-top: 5px;
      }
    }
  }
}
</style>