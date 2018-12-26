<template>
  <div>
    <div class="service-header">
      <h2 id="title">Service Compare</h2>
      <div id="compare-form">
        <Form :label-width="80"
              @submit.native.prevent>
          <Row :gutter="16">
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

          <Row :gutter="16"
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

    <div id="compare-result"
         v-show="!!originResponse & !!comparedResponse"
         class="demo-split">
      <Split>
        <div slot="left"
             class="demo-split-pane">
          <Row>
            <Col offset="22"
                 span="2">
            <Button data-clipboard-target="#originResponse" class="copy" @click="copyXml">Copy</Button>
            </Col>
          </Row>
          <pre id="originResponse" style="text-align: left">{{originResponse}}</pre>
        </div>
        <div slot="right"
             class="demo-split-pane">
          <Row>
            <Col offset="22"
                 span="2">
            <Button data-clipboard-target="#comparedResponse" class="copy" @click="copyXml">Copy</Button>
            </Col>
          </Row>
          <pre id="comparedResponse" style="text-align: left">{{comparedResponse}}</pre>
        </div>
      </Split>
    </div>
  </div>
</template>

<script>

import service from '@/service'
import Clipboard from 'clipboard'
import UrlParams from './UrlParams'
export default {
  name: 'HelloWorld',
  components: {
    UrlParams
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
</style>
