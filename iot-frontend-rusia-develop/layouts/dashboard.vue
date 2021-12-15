<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      class="elevation-0"
      :mini-variant="false"
      fixed
      app
    >
      <v-list>
        <v-card class="mb-8 mt-5" flat color="transparent">
          <v-img
            :src="require('@/assets/svg/logo.svg')"
            contain
            width="100%"
            height="60"
          ></v-img>
        </v-card>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          exact
          link
          active-class="primary--text"
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar fixed app flat>
      <!-- <v-app-bar-nav-icon @click.stop="drawer = !drawer" /> -->

      <v-toolbar-title>
        {{ menuActive($route.path).title }}
      </v-toolbar-title>
      <v-spacer />
      <Theme />
      <v-menu open-on-hover top offset-y>
        <template #activator="{ on, attrs }">
          <v-avatar size="40" v-bind="attrs" v-on="on">
            <img src="https://cdn.vuetifyjs.com/images/john.jpg" alt="John" />
          </v-avatar>
        </template>
        <v-list>
          <v-list-item to="/profile">
            <v-list-item-title>Profile</v-list-item-title>
          </v-list-item>
          <v-list-item @click="logout()">
            <v-list-item-title>Log Out</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import mqtt from 'mqtt'
export default {
  middleware: ['auth', 'theme'],

  data: () => ({
    clipped: false,
    drawer: true,
    client: null,
  }),

  computed: {
    ...mapState(['items', 'title', 'logo']),
    ...mapGetters(['menuActive']),
  },
  mounted() {
    this.nuxtInitClient()
  },

  destroyed() {
    this.client.end()
  },
  methods: {
    async logout() {
      await this.$auth.logout()
    },

    nuxtInitClient() {
      const state = this.$store.state
      const options = {
        host: 'localhost',
        port: 8083,
        endpoints: '/mqtt',
        clientId: `web_${state.auth.user}_${Math.floor(
          Math.random() * 1000000 + 1
        )}`,
      }

      const connectUrl = `ws://${options.host}:${options.port}${options.endpoints}`
      const topic = `+/+/+/save`
      this.client = mqtt.connect(connectUrl, options)
      this.client.on('connect', () => {
        this.client.subscribe(topic, { qos: 0 }, (_) => {})
      })

      this.client.on('message', (topic, message) => {
        this.$nuxt.$emit(topic, JSON.parse(message.toString()))
      })
    },
  },
}
</script>
