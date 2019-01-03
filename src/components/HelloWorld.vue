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

          <Row :gutter="32">
            <Col span="6">
            <span :class="{'swtich-label':!compareOutputFormat}">Side-By-Side</span>
            <Switch v-model="compareOutputFormat" />
            <span :class="{'swtich-label':compareOutputFormat}">Line-By-Line</span>
            </Col>
            <Col span="6">
            Differentiation Range
            <InputNumber v-model="context"
                         :min="1" />
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

    <div class="diff-checker"
         v-show="!!originResponse && !!comparedResponse">
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
                       :context="context"
                       :outputFormat="compareOutputFormat?'line-by-line':'side-by-side'" />
      </div>
    </div>

  </div>
</template>

<script>
import axios from 'axios'
import service from '@/service'
import Clipboard from 'clipboard'
import UrlParams from './UrlParams'
import vueCodeDiff from './CodeDiff'
var format = require('pretty-data').pd
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
      axios.all([service.requestDirectXML(this.originUrl), service.requestDirectXML(this.comparedUrl)])
        .then(axios.spread((originResponse, comparedResponse) => {
          console.info(originResponse)
          console.info(comparedResponse)
          this.originResponse = format.xml(originResponse.data)
          this.comparedResponse = format.xml(comparedResponse.data)
        })).catch((e) => {
          this.$Message.error('oops! couldn\'t get the response from the api')
          console.info(e)
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
      compareOutputFormat: false,
      context: 10,
      originUrl: 'https://www.servicesus.ford.com/products/ModelSlices?make=Ford&model=Mustang&year=2018&modelSliceDefiners=NGB_Nameplate_ModelDefiners&showConfigData=true',
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
.diff-checker {
  padding: 0 20px;
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
.swtich-label {
  color: #2d8cf0;
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
