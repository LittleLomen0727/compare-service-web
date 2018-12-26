<template>
  <div v-show="!!urlObj.endpoint">
    <FormItem label="Endpoint:">
      <Input v-model="urlObj.endpoint"></Input>
    </FormItem>
    <FormItem :label="'Param ' + (index + 1)"
              v-for="(value, key, index) in urlObj.params"
              :key="index">
      <Row>
        <Col span="11">
        <Input :value="key"></Input>
        </Col>
        <Col span="2"
             style="text-align: center">=</Col>
        <Col span="11">
        <Input :value="value"></Input>
        </Col>
      </Row>
    </FormItem>
  </div>
</template>

<script>
export default {
  props: {
    urlObj: {
      type: Object,
      default: () => ({
        endpoint: '',
        params: []
      })
    }
  }
}
</script>
