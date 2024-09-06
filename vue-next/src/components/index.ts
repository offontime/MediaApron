import Video from './video.vue'

const components = [
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
  Video
}