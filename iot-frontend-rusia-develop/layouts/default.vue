<template>
  <v-app>
    <v-app-bar fixed app flat>
      <div>
        <v-img
          :src="require('@/assets/svg/logo.svg')"
          contain
          width="150"
          height="50"
        ></v-img>
      </div>

      <v-spacer />
      <Theme />
    </v-app-bar>
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { mapState } from 'vuex'
export default {
  middleware: ['theme'],
  computed: {
    ...mapState(['title']),
  },
}
</script>
