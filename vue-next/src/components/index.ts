import Video from './video.vue'
import Audio from './audio.vue'

const components = [
  Audio,
  Video
]

const install = function (Vue) {
  if (install.installed) {
    return false
  }
  components.map(component => Vue.component(component.name, component))
}

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export default {
  install,
  Audio,
  Video
}