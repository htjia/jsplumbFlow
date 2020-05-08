<template>
  <div class="json-editor">
    <textarea ref="textarea" />
  </div>
</template>
<!--https://blog.csdn.net/zhongmei121/article/details/93716106-->
<script>
import CodeMirror from 'codemirror'
import 'codemirror/addon/lint/lint.css'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/rubyblue.css'
// require('script-loader!jsonlint')
import 'codemirror/mode/javascript/javascript'
import 'codemirror/addon/lint/lint'
import 'codemirror/addon/lint/json-lint'
import 'codemirror/mode/sql/sql'

export default {
  name: 'JsonEditor',
  /* eslint-disable vue/require-prop-types */
  props: ['value', 'mode', 'type'],
  data() {
    return {
      jsonEditor: false
    }
  },
  watch: {
    value(value) {
      console.log(this.value, '---------------')
      const editorValue = this.jsonEditor.getValue()
      console.log(editorValue)
      if (value !== editorValue) {
        this.jsonEditor.setValue(this.value)
      }
      if (this.type === '1') {
        this.$emit('codeChange')
      }
    }
  },
  mounted() {
    this.jsonEditor = CodeMirror.fromTextArea(this.$refs.textarea, {
      lineNumbers: true,
      mode: this.mode,
      gutters: ['CodeMirror-lint-markers'],
      theme: 'rubyblue',
      lint: true
    })

    this.jsonEditor.setValue(JSON.stringify(this.value, null, 2))
    this.jsonEditor.on('change', cm => {
      this.$emit('changed', cm.getValue())
      this.$emit('input', cm.getValue())
    })
  },
  methods: {
    getValue() {
      return this.jsonEditor.getValue()
    }
  }
}
</script>

<style scoped>
.json-editor{
  height: 100%;
  position: relative;
}
.json-editor >>> .CodeMirror {
  height: 100%;
  /*min-height: 300px;*/
}
.json-editor >>> .CodeMirror-scroll{
  height: 100%;
  /*min-height: 300px;*/
}
.json-editor >>> .cm-s-rubyblue span.cm-string {
  color: #F08047;
}
</style>
