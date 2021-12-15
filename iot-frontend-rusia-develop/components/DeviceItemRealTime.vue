<template>
  <v-card flat>
    <v-card-text>
      <div>{{ code }} - {{ sensorModel.name }}</div>
      <p class="text-h4 font-weight-bold accent--text text-center py-2">
        {{ value || '-' }} {{ element.um }}
      </p>
      <p class="my-0">{{ name }}</p>
      <div class="text--primary">
        {{ greenhouse.name }} - {{ greenhouse.reference }},<br />
        {{ greenhouse.location.name }}
      </div>
    </v-card-text>
    <v-card-actions>
      <v-btn small text :color="enabled ? 'green' : 'error'">
        {{ enabled ? 'enabled' : 'disabled' }}
      </v-btn>
      <v-spacer></v-spacer>
      <v-chip small label :color="enabled ? 'primary' : 'error'">
        {{ element.name }}
        <!-- {{ enabled ? 'enabled' : 'disabled' }} -->
      </v-chip>
    </v-card-actions>
  </v-card>
</template>
<script>
export default {
  props: {
    topic: {
      type: String,
      require: true,
      default: '',
    },
    element: {
      type: Object,
      default: () => ({}),
    },
    greenhouse: {
      type: Object,
      default: () => ({}),
    },
    sensorModel: {
      type: Object,
      default: () => ({}),
    },
    name: {
      type: String,
      default: '',
    },
    code: {
      type: String,
      default: '',
    },
    enabled: {
      type: Boolean,
      default: false,
    },
  },

  data: () => ({
    value: null,
  }),
  mounted() {
    if (this.enabled) {
      this.$nuxt.$on(this.topic, ({ value }) => {
        this.value = value
      })
    }
  },

  destroyed() {
    this.$nuxt.$off(this.topic)
  },
}
</script>
