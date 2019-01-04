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
        urlObj.params.push({
          paramName: pair[0],
          paramValue: pair[1]
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
