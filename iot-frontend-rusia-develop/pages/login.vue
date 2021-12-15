<template>
  <v-card
    class="pa-5"
    :class="$colorMode.preference == 'dark' ? 'elevation-16' : 'elevation-0'"
    width="360"
  >
    <v-card-title class="d-block text-center text-h4"> Sign In </v-card-title>

    <v-divider class="mx-4 mb-8"></v-divider>
    <v-text-field
      v-model="user.email"
      label="Email"
      solo-inverted
      flat
    ></v-text-field>
    <v-text-field
      v-model="user.password"
      label="Password"
      flat
      :type="show ? 'text' : 'password'"
      solo-inverted
      :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
      @click:append="show = !show"
    ></v-text-field>
    <v-divider class="mx-10 mb-8"></v-divider>

    <div class="d-flex justify-space-around align-center">
      <v-btn :loading="loading" color="primary" @click="userLogin">LOGIN</v-btn>
      <nuxt-link to="/reset-password">Reset password</nuxt-link>
    </div>
  </v-card>
</template>
<script>
export default {
  layout: 'login',

  data: () => ({
    loading: false,
    show: false,
    user: {
      email: 'germancvdev@gmail.com',
      password: 'dev123321',
    },
  }),

  head: () => ({
    title: 'Login',
    meta: [
      {
        hid: 'description',
        name: 'description',
        content: 'Login Page',
      },
    ],
  }),
  methods: {
    async userLogin() {
      this.loading = true
      try {
        await this.$auth.loginWith('local', {
          data: this.user,
        })
      } catch (_) {}
      this.loading = false
    },
  },
}
</script>
