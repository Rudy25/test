<template>
  <v-row class="mt-2">
    <v-col
      v-for="item in items.slice(1, items.length)"
      :key="item.to"
      cols="6"
      md="4"
    >
      <v-card
        class="elevation-0 ma-2"
        :to="item.to"
        active-class="primary--text"
      >
        <div class="d-flex justify-center pt-14">
          <v-avatar size="60" tile>
            <v-icon size="60">
              {{ item.icon }}
            </v-icon>
          </v-avatar>
        </div>

        <v-card-title class="d-block text-center pb-16">
          {{ item.title }}
        </v-card-title>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { mapState } from 'vuex'
export default {
  layout: 'dashboard',
  data: () => ({
    colors: ['system', 'light', 'dark', 'sepia'],
  }),
  head: () => ({
    title: 'Dashboard',
    meta: [
      {
        hid: 'description',
        name: 'description',
        content: 'Dashboard page',
      },
    ],
  }),
  computed: {
    ...mapState(['items']),
  },
}
</script>
