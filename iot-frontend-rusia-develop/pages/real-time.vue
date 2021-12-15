<template>
  <v-row>
    <template v-for="device in devices">
      <v-col
        v-for="rule in device.rules"
        :key="rule.id"
        cols="12"
        sm="6"
        md="4"
        xl="3"
      >
        <DeviceItemRealTime
          :topic="rule.topic"
          :enabled="rule.enabled"
          :greenhouse="device.greenhouse"
          :sensor-model="device.sensorModel"
          :name="device.name"
          :code="device.code"
          :element="setElement(device.sensorModel.elements, rule)"
        />
      </v-col>
    </template>
  </v-row>
</template>
<script>
import DeviceItemRealTime from '@/components/DeviceItemRealTime'
export default {
  components: {
    DeviceItemRealTime,
  },
  layout: 'dashboard',
  data: () => ({
    devices: [],
  }),
  async fetch() {
    await this.getItems()
  },
  methods: {
    setElement(elements = [], rule = {}) {
      const el = elements.find((x) => x.id === rule.elementId)
      return el || {}
    },
    async getItems() {
      await this.$axios
        .get(`devices`)
        .then((x) => {
          this.devices = x.data.results || []
        })
        .catch(() => ({}))
    },
  },
}
</script>
