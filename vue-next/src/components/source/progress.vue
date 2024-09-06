<script lang="ts" setup>
import { ref, watch } from 'vue'
const progressRef = ref()
const targetSecond = ref(0)
const props = defineProps({
  current: { type: Number, default: 0 },
  total: { type: Number, default: 0 }
})
const isDraging = ref(false)

const emits = defineEmits(['change'])

const targetProgress = ref(0)
const currentProgress = ref(0)

watch(() => props.current, (newVal) => {
  currentProgress.value = (newVal / props.total) * 100
  targetSecond.value = newVal
}, { deep: true })

const handleProgressMouseMove = (event: MouseEvent) => {
  const percent = getPercent(event)
  handleSetTargetProgress(percent)
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

const handleSetTargetProgress = (percent: number) => {
  targetProgress.value = percent
}

const handlePresetProgress = (percent: number) => {
  currentProgress.value = percent
  targetSecond.value = props.total * percent / 100
}

const callbackSetProgress = () => {
  emits('change', targetSecond.value)
}

const getPercent = (event: MouseEvent) => {
  const rect = progressRef.value.getBoundingClientRect()
  const width = rect.width
  const x = event.clientX - rect.left
  const val = (x / width) * 100
  return val <= 0 ? 0 : val >= 100 ? 100 : val
}
</script>
<template>
  <div class="progress-container"
    @mouseout="() => { targetProgress = 0 }"
    @mousedown="handleProgressMouseDown"
    @click="(event) => {
      handlePresetProgress(getPercent(event))
      callbackSetProgress()
    }"
    >
    <div class="progress" ref="progressRef">
      <div class="real-progress" :style="{ width: currentProgress + '%' }"></div>
      <div class="target-progress" :style="{ width: targetProgress + '%' }"></div>
    </div>
  </div>
</template>
<style lang="less" scoped>
.progress-container {
  padding: 5px 0;
  cursor: pointer;
}
.progress {
  height: 4px;
  background: rgba(255, 255, 255, .3);
  backdrop-filter: blur(5px);
  border-radius: 2px;
  overflow: hidden;
  position: relative;
  .real-progress {
    height: 100%;
    background: #4C9EEA;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 2;
  }
  .target-progress {
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background: rgba(255, 255, 255, .5);
    z-index: 1;
  }
}
</style>