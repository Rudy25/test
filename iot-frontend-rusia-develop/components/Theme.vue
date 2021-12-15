<template>
  <div class="mr-2">
    <v-btn
      v-if="$colorMode.preference != 'dark'"
      icon
      @click="changeTheme('dark')"
    >
      <v-icon>bx bxs-moon</v-icon>
    </v-btn>
    <v-btn v-else icon @click="changeTheme('light')">
      <v-icon>bx bxs-sun</v-icon>
    </v-btn>
  </div>
</template>
<script>
export default {
  name: 'Theme',
  methods: {
    changeTheme(theme) {
      this.$vuetify.theme.dark = theme === 'dark'
      this.$colorMode.preference = theme
    },
  },
}
</script>
