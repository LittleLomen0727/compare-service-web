<template>
  <div id="app">
    <div v-html="html"></div>
  </div>
</template>

<script>
import { createPatch } from 'diff'
import { Diff2Html } from 'diff2html'
import hljs from 'highlight.js'
import 'highlight.js/styles/googlecode.css'
import 'diff2html/dist/diff2html.min.css'
// import DiffMatchPatch from 'diff-match-patch'

import store from '../store'
import { UPDATE_SHOW_COMPARING } from '@/store/types/mutation-types'

export default {
  name: 'code-diff',
  props: {
    oldString: {
      type: String,
      default: ''
    },
    newString: {
      type: String,
      default: ''
    },
    context: {
      type: Number,
      default: 5
    },
    outputFormat: {
      type: String,
      default: 'line-by-line'
    }
  },
  directives: {
    highlight: function (el) {
      let blocks = el.querySelectorAll('code')
      blocks.forEach((block) => {
        hljs.highlightBlock(block)
      })
    }
  },
  computed: {
    html () {
      store.commit(UPDATE_SHOW_COMPARING, true)
      return this.createdHtml(this.oldString, this.newString, this.context, this.outputFormat)
    }
  },
  methods: {
    createdHtml (oldString, newString, context, outputFormat) {
      let args = ['', oldString, newString, '', '', { context: context }]
      let dd = createPatch(...args)
      let outStr = Diff2Html.getJsonFromDiff(dd, { inputFormat: 'diff', outputFormat: outputFormat, showFiles: false, matching: 'none' })
      let html = Diff2Html.getPrettyHtml(outStr, { inputFormat: 'json', outputFormat: outputFormat, showFiles: false, matching: 'none', maxLineLengthHighlight: 100, matchingMaxComparisons: 100 })
      // const dmp = new DiffMatchPatch()
      // const diff = dmp.diff_main(oldString, newString)
      // let html = dmp.diff_prettyHtml(diff)

      store.commit(UPDATE_SHOW_COMPARING, false)
      return html
    }
  }
}
</script>

<style scoped>
.hljs {
  display: inline-block;
  padding: 0;
  background: transparent;
  vertical-align: middle;
}
.d2h-file-header {
  display: none;
}
</style>
