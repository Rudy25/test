<template>
  <v-app dark>
    <v-app-bar fixed app flat color="transparent">
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
    <v-container class="fill-height d-flex justify-center align-center">
      <Nuxt />
    </v-container>
  </v-app>
</template>

<script>
export default {
  middleware: ['login', 'theme'],
}
</script>
