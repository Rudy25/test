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
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="itemData.address"
              label="Address"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="itemData.reference"
              label="Reference"
              required
            ></v-text-field>
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

    <v-data-table
      :class="$colorMode.preference == 'dark' ? 'elevation-4' : ''"
      :headers="headers"
      :items="items"
      :items-per-page="filter.size"
      :server-items-length.sync="filter.totalItems"
      :loading="$fetchState.pending"
      :options.sync="options"
    >
      <template #[`item.greenhouses`]="{ item }">
        <v-btn
          v-if="item.greenhouses"
          fab
          x-small
          depressed
          color="primary"
          size="30"
          to="/greenhouses"
        >
          <span class="text-body-2">{{ item.greenhouses.length }}</span>
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
                address: item.address,
                reference: item.reference,
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
    headers: [
      {
        text: 'Name',
        align: 'start',
        sortable: true,
        value: 'name',
      },
      { text: 'Address', value: 'address' },
      { text: 'Ref', value: 'reference' },
      {
        text: 'Greenhouses',
        value: 'greenhouses',
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
      return 'locations'
    },
  },
}
</script>
