<template>
  <div>
    <div class="service-header">
      <h2 id="title">Service Compare</h2>
      <div id="compare-form">
        <Form :label-width="80"
              @submit.native.prevent>
          <Row :gutter="32">
            <Col span="12">
            <FormItem label="API 1:">
              <Input v-model="originUrl"></Input>
            </FormItem>
            </Col>
            <Col span="12">
            <FormItem label="API 2:">
              <Input v-model="comparedUrl"></Input>
            </FormItem>
            </Col>
          </Row>

          <Row :gutter="32"
               type="flex">
            <Col span="12">
            <url-params :url-obj="originUrlObj" />
            </Col>
            <Col span="12">
            <url-params :url-obj="comparedUrlObj" />
            </Col>
          </Row>

          <Row>
            <Col span="24">
            <Button type="primary"
                    @click="compare">Compare</Button>
            </Col>
          </Row>
        </Form>
      </div>
    </div>

    <div class="diff-checker" v-show="!!originResponse & !!comparedResponse">
      <div class="diff-toolbar">
        <div class="diff-toolbar-stats-and-toggles">
          <Row style="width:100%"
               :gutter="32">
            <Col offset="11"
                 span="1"><Button :data-clipboard-text="originResponse"
                    class="copy"
                    @click="copyXml">Copy</Button></Col>
            <Col offset="11"
                 span="1"><Button :data-clipboard-text="comparedResponse"
                    class="copy"
                    @click="copyXml">Copy</Button></Col>
          </Row>
        </div>
      </div>

      <div class="diff-output-container">
        <vue-code-diff :old-string="originResponse"
                       :new-string="comparedResponse"
                       :context="50"
                       outputFormat="side-by-side" />
      </div>
    </div>

  </div>
</template>

<script>

import service from '@/service'
import Clipboard from 'clipboard'
import UrlParams from './UrlParams'
import vueCodeDiff from 'vue-code-diff'
export default {
  name: 'HelloWorld',
  components: {
    UrlParams,
    vueCodeDiff
  },
  mounted () {

  },
  computed: {
    originUrlObj: function () {
      return this.extractParams(this.originUrl)
    },
    comparedUrlObj: function () {
      return this.extractParams(this.comparedUrl)
    }
  },
  methods: {
    compare () {
      const request = {
        originUrl: this.originUrl,
        comparedUrl: this.comparedUrl
      }
      service.compare(request).then((response) => {
        this.originResponse = this.formatXml(response.data.originResult)
        this.comparedResponse = this.formatXml(response.data.comparedResult)
      }).catch((e) => {

      })
    },
    extractParams (url) {
      const urlObj = {
        endpoint: '',
        params: {}
      }

      var RegUrl = new RegExp()
      RegUrl.compile('^[A-Za-z]+://[A-Za-z0-9-_]+\\.[A-Za-z0-9-_%&\\?\\/.=]+$')
      if (!RegUrl.test(url)) {
        return urlObj
      }
      if (url.indexOf('?') === -1) {
        return urlObj
      }
      urlObj.endpoint = url.substr(0, url.indexOf('?'))
      const paramsArray = url.substr(url.indexOf('?') + 1).split('&')
      paramsArray.forEach(e => {
        const pair = e.split('=')
        urlObj.params[pair[0]] = pair[1]
      })
      return urlObj
    },
    formatXml (text) {
      text = '\n' + text.replace(/(<\w+)(\s.*?>)/g, ($0, name, props) => {
        return name + ' ' + props.replace(/\s+(\w+=)/g, ' $1')
      }).replace(/>\s*?</g, '>\n<')
      text = text.replace(/\n/g, '\r').replace(/<!--(.+?)-->/g, ($0, text) => {
        var ret = '<!--' + escape(text) + '-->'
        return ret
      }).replace(/\r/g, '\n')
      var rgx = /\n(<(([^?]).+?)(?:\s|\s*?>|\s*?(\/)>)(?:.*?(?:(?:(\/)>)|(?:<(\/)\2>)))?)/mg
      var nodeStack = []
      var output = text.replace(rgx, ($0, all, name, isBegin, isCloseFull1, isCloseFull2, isFull1, isFull2) => {
        var isClosed = (isCloseFull1 === '/') || (isCloseFull2 === '/') || (isFull1 === '/') || (isFull2 === '/')
        var prefix = ''
        if (isBegin === '!') {
          prefix = this.getPrefix(nodeStack.length)
        } else {
          if (isBegin !== '/') {
            prefix = this.getPrefix(nodeStack.length)
            if (!isClosed) {
              nodeStack.push(name)
            }
          } else {
            nodeStack.pop()
            prefix = this.getPrefix(nodeStack.length)
          }
        }
        var ret = '\n' + prefix + all
        return ret
      })
      var outputText = output.substring(1)
      outputText = outputText.replace(/\n/g, '\r').replace(/(\s*)<!--(.+?)-->/g, function ($0, prefix, text) {
        if (prefix.charAt(0) === '\r') {
          prefix = prefix.substring(1)
        }
        text = unescape(text).replace(/\r/g, '\n')
        var ret = '\n' + prefix + '<!--' + text.replace(/^\s*/mg, prefix) + '-->'
        return ret
      })

      return outputText.replace(/\s+$/g, '').replace(/\r/g, '\r\n')
    },
    getPrefix (prefixIndex) {
      var span = '  '
      var output = []
      for (var i = 0; i < prefixIndex; ++i) {
        output.push(span)
      }
      return output.join('')
    },
    copyXml () {
      let clipboard = new Clipboard('.copy')
      clipboard.on('success', e => {
        this.$Message.success('Copy successful')
        clipboard.destroy()
      })
      clipboard.on('error', e => {
        this.$Message.error('Copy error')
        clipboard.destroy()
      })
    }
  },
  data () {
    return {
      originUrl: 'https://wwwqa.servicesus.ford.com/products/ModelSlices?make=Ford&model=Mustang&year=2018&modelSliceDefiners=NGB_Nameplate_ModelDefiners&showConfigData=true',
      comparedUrl: 'https://wwwqaalt2.servicesus.ford.com/products/ModelSlices?make=Ford&model=Mustang&year=2018&modelSliceDefiners=NGB_Nameplate_ModelDefiners&showConfigData=true',
      originResponse: '',
      comparedResponse: ''
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.service-header {
  padding: 0 20px;
}
#compare-form {
  margin-top: 30px;
}
#compare-result {
  margin-top: 30px;
}
.demo-split {
  height: auto;
  padding: 0 50px;
}
.demo-split-pane {
  padding: 10px;
  border: 1px solid #dcdee2;
}
.diff-checker {
  margin-top: 20px;
  width: 100%;
}
.diff-toolbar {
  width: 100%;
  -webkit-box-pack: center;
  -moz-box-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  -moz-box-align: center;
  align-items: center;
  padding: 0px 10px;
  background: rgb(237, 237, 237);
}
.exchange-outer-container {
  position: absolute;
  left: 50%;
  display: flex;
  -webkit-box-align: center;
  -moz-box-align: center;
  align-items: center;
  height: 100%;
}
.exchange-container {
  position: relative;
  z-index: 201;
  margin-left: -30px;
  cursor: pointer;
  font-size: 24px;
  color: rgb(119, 119, 119);
}
.diff-toolbar-stats-and-toggles {
  -webkit-box-align: center;
  -moz-box-align: center;
  align-items: center;
  display: flex;
  height: 50px;
  position: relative;
  -webkit-box-pack: justify;
  -moz-box-pack: justify;
  justify-content: space-between;
}
.diff-table {
  background: #fff;
  width: 100%;
  border: 20px solid white;
}
.diff-line-number {
  color: rgb(153, 153, 153);
  min-width: 33px;
  text-align: right;
  padding: 0px 8px 0px 5px;
}
.diff-line {
  text-align: left;
  position: relative;
  width: 50%;
  white-space: pre-wrap;
  word-break: break-all;
  line-height: 1rem;
  margin: 0px 1px;
  border-right: 20px solid white;
}
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
