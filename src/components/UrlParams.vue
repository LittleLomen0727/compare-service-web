<template>
  <div>
    <FormItem label="API:">
      <Input v-model="currentUrl"></Input>
    </FormItem>
    <div v-show="!!urlObj.endpoint">
      <FormItem label="Endpoint:">
        <Input v-model="urlObj.endpoint"></Input>
      </FormItem>
      <FormItem :label="'Param ' + (index + 1)"
                v-for="(param, index) in urlObj.params"
                :key="index">
        <Row>
          <Col span="11">
          <Input v-model="param.paramName"></Input>
          </Col>
          <Col span="2"
               style="text-align: center">=</Col>
          <Col span="11">
          <Input v-model="param.paramValue"></Input>
          </Col>
        </Row>
      </FormItem>
    </div>
  </div>
</template>

<script>
const queryString = require('query-string')
export default {
  name: 'url-params',
  props: {
    url: {
      type: String,
      default: ''
    }
  },
  model: {
    prop: 'url',
    event: 'update'
  },
  data () {
    return {
      currentUrl: this.url,
      urlObj: this.extractParams(this.url)
    }
  },
  watch: {
    url (newVal) {
      this.currentUrl = newVal
    },
    urlObj: {
      handler (newVal) {
        this.currentUrl = this.contactParamsToUrl(newVal)
      },
      deep: true
    },
    currentUrl (newVal) {
      this.urlObj = this.extractParams(newVal)
      this.$emit('update', newVal)
    }
  },
  methods: {
    extractParams (url) {
      const urlObj = {
        endpoint: '',
        params: []
      }
      var o = queryString.parseUrl(url)
      urlObj.endpoint = o.url
      if (!o.query) {
        return urlObj
      }
      Object.keys(o.query).forEach((key) => {
        urlObj.params.push({
          paramName: key,
          paramValue: o.query[key]
        })
      })
      return urlObj
    },
    contactParamsToUrl (urlObj) {
      let paramStrArr = urlObj.params.map((e) => {
        return e.paramName + '=' + e.paramValue
      })
      let paramStr = paramStrArr.join('&')
      return urlObj.endpoint + (!paramStr ? '' : '?') + paramStr
    }
  }
}
</script>
