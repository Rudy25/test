<template>
  <div>
    <v-card class="pa-4 mb-6" flat>
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-row>
          <v-col cols="12" md="3">
            <v-text-field
              v-model="itemData.name"
              :rules="[isRequired]"
              label="Name"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="itemData.limits"
              label="Limits"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="5">
            <v-select
              v-model="itemData.elementIds"
              :items="elements"
              :rules="[isRequiredMultiple]"
              multiple
              label="Elements"
              item-value="id"
              item-text="name"
              required
            >
            </v-select>
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
              {{ itemData.id ? 'Update' : 'Add' }} Location
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-card>

    <v-card flat>
      <v-card-title>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          style="max-width: 300px"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          solo-inverted
          flat
          hide-details
          clearable
        ></v-text-field>
      </v-card-title>
      <v-data-table
        :class="$colorMode.preference == 'dark' ? 'elevation-4' : ''"
        :headers="headers"
        :items="items"
        :items-per-page="filter.size"
        :server-items-length.sync="filter.totalItems"
        :loading="$fetchState.pending"
        :options.sync="options"
      >
        <template #[`item.elementsIds`]="{ item }">
          <span v-if="item.elements.length">
            <v-chip
              v-for="e in item.elements"
              :key="e.id"
              class="mr-1 my-1"
              color="primary"
              label
              small
            >
              <span class="text-capitalize">{{ e.name }} ({{ e.um }})</span>
            </v-chip>
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
                  limits: item.limits,
                  elementIds: item.elementIds,
                })
              )
            "
          >
            <v-icon small> mdi-pencil </v-icon>
          </v-btn>
          <v-btn
            icon
            color="error"
            @click="
              dialog = true
              itemData = { ...item }
            "
          >
            <v-icon small> mdi-delete </v-icon>
          </v-btn>
        </template>
        <template #no-data>
          <v-btn color="primary" @click="$fetch()"> Refresh </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog
      v-model="dialog"
      max-width="300"
      persistent
      @click:outside="reset()"
    >
      <v-card>
        <v-card-title class="text-h5 text-right">
          Are you sure to delete?
        </v-card-title>

        <v-card-text class="text-right">
          Warning! This action is irreversible
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="green darken-1" text @click="reset()"> Cancel </v-btn>

          <v-btn color="error" text @click="dialog = false"> Delete </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import basic from '@/mixins/crud'
export default {
  mixins: [basic],
  layout: 'dashboard',
  data: () => ({
    elements: [],

    headers: [
      {
        text: 'Name',
        align: 'start',
        sortable: true,
        value: 'name',
      },
      { text: 'Limist', value: 'limits' },
      { text: 'Elements', value: 'elementsIds', sortable: false },
      { text: 'Devices', value: 'devices', sortable: false, align: 'center' },

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
      return 'sensor-models'
    },
    otherFilters() {
      return '&filter[include][]=devices'
    },
  },
  mounted() {
    this.getElements()
  },
  methods: {
    async getElements() {
      return await this.$axios
        .get(`elements`)
        .then((x) => {
          this.elements = x.data
        })
        .catch(() => ({}))
    },
  },
}
</script>
