<template>
  <div>
    <v-card class="pa-4 mb-6" flat>
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-row>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="itemData.name"
              :rules="[isRequired]"
              label="Name"
              required
            ></v-text-field
          ></v-col>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="itemData.reference"
              label="Ref"
              required
            ></v-text-field
          ></v-col>
          <v-col cols="12" md="4">
            <v-select
              v-model="itemData.locationId"
              :items="locations"
              :rules="[isRequired]"
              label="Location"
              item-value="id"
              item-text="name"
              required
            ></v-select>
          </v-col>
          <v-col class="d-flex justify-end" cols="12">
            <v-spacer></v-spacer>
            <v-btn class="mr-2" color="secondary" depressed @click="reset()">
              Cancel
            </v-btn>
            <v-btn
              class="mr-4"
              :disabled="!valid"
              color="primary"
              :loading="loading"
              depressed
              @click="saveItem()"
            >
              {{ itemData.id ? 'Update' : 'Add' }} Greenhouse
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-card>

    <v-data-table
      :class="$colorMode.preference == 'dark' ? 'elevation-4' : ''"
      :headers="headers"
      :items="items"
      :items-per-page="filter.size"
      :server-items-length.sync="filter.totalItems"
      :loading="$fetchState.pending"
      :options.sync="options"
    >
      <template #[`item.locationId`]="{ item }">
        <span v-if="item.location">
          {{ item.location.name }} {{ item.location.address }}
        </span>
      </template>

      <template #[`item.devices`]="{ item }">
        <v-btn
          v-if="item.devices"
          fab
          x-small
          depressed
          color="primary"
          size="30"
          to="/devices"
        >
          <span class="text-body-2">{{ item.devices.length }}</span>
        </v-btn>
      </template>
      <template #[`item.actions`]="{ item }">
        <v-btn
          class="mr-2"
          icon
          color="warning"
          @click="
            itemData = JSON.parse(
              JSON.stringify({
                id: item.id,
                name: item.name,
                reference: item.reference,
                locationId: item.locationId,
              })
            )
          "
        >
          <v-icon small> mdi-pencil </v-icon>
        </v-btn>
        <v-btn icon color="error" @click="deleteItem(item.id)">
          <v-icon small> mdi-delete </v-icon>
        </v-btn>
      </template>
      <template #no-data>
        <v-btn color="primary" @click="$fetch()"> Refresh </v-btn>
      </template>
    </v-data-table>
  </div>
</template>
<script>
import basic from '@/mixins/crud'
export default {
  mixins: [basic],
  layout: 'dashboard',
  data: () => ({
    locations: [],
    valid: true,
    headers: [
      {
        text: 'Name',
        align: 'start',
        sortable: true,
        value: 'name',
      },
      { text: 'Ref', value: 'reference' },
      { text: 'Location', value: 'locationId' },
      {
        text: 'Devices',
        value: 'devices',
        sortable: false,
        align: 'center',
      },
      {
        text: 'Actions',
        align: 'center',
        value: 'actions',
        sortable: false,
        width: 200,
      },
    ],
  }),
  computed: {
    path() {
      return 'greenhouses'
    },
  },
  mounted() {
    this.getLocations()
  },
  methods: {
    async getLocations() {
      return await this.$axios
        .get(`locations`)
        .then((x) => {
          this.locations = x.data.results || []
        })
        .catch(() => ({}))
    },
  },
}
</script>
