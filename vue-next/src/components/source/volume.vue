<script lang="ts" setup>
import { onMounted } from 'vue';
import { ref, watch } from 'vue'
const emits = defineEmits(['change', 'mutedToggle', 'modelValue'])
const props = defineProps({
  modelValue: { type: Number, default: 100 },
  isMuted: { type: Boolean, default: false }
})
const progressRef = ref()
const isDraging = ref(false)
const level = ref(2)
const volume = ref(props.modelValue || 100)
const currentMuted = ref(props.isMuted || false)

watch(() => props.isMuted, (newVal) => {
  currentMuted.value = newVal
}, { deep: true })

onMounted(() => {
  getVolumeLevel(props.modelValue)
})

const handleProgressMouseMove = (event: MouseEvent) => {
  const percent = getPercent(event)
  if (isDraging.value) {
    handlePresetProgress(percent)
  }
}
const handleProgressMouseDown = () => {
  isDraging.value = true
}

// 在一切地方抬起鼠标都触发
document.addEventListener('mousemove', (event: MouseEvent) => {
  isDraging.value && handleProgressMouseMove(event)

})
document.addEventListener('mouseup', () => {
  const buffer = isDraging.value
  isDraging.value = false
  buffer && callbackSetProgress()
})

const handlePresetProgress = (percent: number) => {
  volume.value = percent
  getVolumeLevel(percent)
  emits('change', { value: percent })
  if (percent > 0 && currentMuted.value) {
    emits('mutedToggle', false)
    currentMuted.value = false
  }
}

const handleMuteToggle = () => {
  const next = !currentMuted.value
  currentMuted.value = next
  emits('mutedToggle', next)
}

const callbackSetProgress = () => {
  // emits('change', { value: percent })
}

const getPercent = (event: MouseEvent) => {
  const rect = progressRef.value.getBoundingClientRect()
  const width = rect.width
  const x = event.clientX - rect.left
  const val = (x / width) * 100
  return val <= 0 ? 0 : val >= 100 ? 100 : val
}

const getVolumeLevel = (vol: number) => {
  if (vol <= 30) level.value = 0
  if (vol > 30 && vol <= 65) level.value = 1
  if (vol > 65) level.value = 2
}
</script>
<template>
  <div :class="['volume-container', isDraging ? 'volume-isdraging' : '']">
    <div class="volume-button" @click="handleMuteToggle">
      <ap-icon v-if="currentMuted || volume <= 0" name="volume-mute" color="#FFFFFF" />
      <ap-icon v-else :name="`volume-${level}`" color="#FFFFFF" />
    </div>
    <div class="volume-value-container"
      ref="progressRef"
      @mousemove="handleProgressMouseMove"
      @mousedown="handleProgressMouseDown"
      @click="(event) => {
        handlePresetProgress(getPercent(event))
      }">
      <div class="volume-value">
        <div class="real-volume-value" :style="`width: ${currentMuted ? 0 : volume}%`"></div>
      </div>
    </div>
    <div class="volume-text">
      {{ currentMuted ? 0 : parseInt(volume.toString()) }}%
    </div>
  </div>
</template>
<style lang="less" scoped>
.volume-container {
  padding: 0 7px;
  height: 30px;
  width: 30px;
  overflow: hidden;
  border-radius: 15px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  transition: all, 300ms;
  transition-delay: 0;
  &:hover {
    width: 140px;
    background: #393939;
  }
  &:not(:hover) {
    transition-delay: 1000ms;
  }
  .volume-button {
    cursor: pointer;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .volume-value-container {
    width: 80px;
    cursor: pointer;
    margin: 0 10px;
    .volume-value {
      width: 100%;
      height: 4px;
      background: rgba(255, 255, 255, .3);
      border-radius: 2px;
      position: relative;
      .real-volume-value {
        height: 100%;
        background: #FFFFFF;
        border-radius: 2px;
      }
    }
  }
  
  .volume-text {
    font-size: 12px;
    width: 34px;
    text-align: right;
    color: #999999;
    cursor: default;
  }
}
.volume-isdraging {
  width: 140px;
}
</style>