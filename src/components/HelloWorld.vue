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
            <div v-show="!!originUrlObj.endpoint">
              <FormItem label="Endpoint:">
                <Input v-model="originUrlObj.endpoint"></Input>
              </FormItem>
              <FormItem label="Param 2">
                <Row>
                  <Col span="11">
                  <Input></Input>
                  </Col>
                  <Col span="2"
                       style="text-align: center">=</Col>
                  <Col span="11">
                  <Input></Input>
                  </Col>
                </Row>
              </FormItem>
            </div>
            </Col>
            <Col span="12">
            <div v-show="!!comparedUrlObj.endpoint">
              <FormItem label="Endpoint:">
                <Input v-model="comparedUrlObj.endpoint"></Input>
              </FormItem>
              <FormItem label="Param 1">
                <Row>
                  <Col span="11">
                  <Input></Input>
                  </Col>
                  <Col span="2"
                       style="text-align: center">=</Col>
                  <Col span="11">
                  <Input></Input>
                  </Col>
                </Row>
              </FormItem>
            </div>
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

    <div id="compare-result">
      <Split>
        <div slot="left"
             class="demo-split-pane">
          Left Pane
        </div>
        <div slot="right"
             class="demo-split-pane">
          Right Pane
        </div>
      </Split>
    </div>
  </div>
</template>

<script>

import service from '@/service'

export default {
  name: 'HelloWorld',
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
    }
  },
  data () {
    return {
      originUrl: 'https://wwwqa.servicesus.ford.com/products/ModelSlices?make=Ford&model=Mustang&year=2018&modelSliceDefiners=NGB_Nameplate_ModelDefiners&showConfigData=true',
      comparedUrl: 'https://wwwqaalt2.servicesus.ford.com/products/ModelSlices?make=Ford&model=Mustang&year=2018&modelSliceDefiners=NGB_Nameplate_ModelDefiners&showConfigData=true'
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
</style>
