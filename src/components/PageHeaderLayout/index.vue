<style scoped>
</style>
<template>
  <div>
    <slot>12</slot>
  </div>
</template>
<script>
import store from '@/store'
export default {
  props: {
    has_back: {
      type: Boolean,
      default: false
    },
    has_refresh: {
      type: Boolean,
      default: true
    },
    has_save: {
      type: Boolean,
      default: false
    },
    has_download: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    store.dispatch('SetBack', this.has_back)
    store.dispatch('SetSave', this.has_save)
    store.dispatch('SetRefresh', this.has_refresh)
    store.dispatch('SetDownload', this.has_download)
  }
}
</script>
