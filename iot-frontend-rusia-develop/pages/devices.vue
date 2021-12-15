<template>
  <div>
    <transition name="fade">
      <v-btn
        v-if="!showForm"
        class="mb-4"
        depressed
        color="primary"
        @click="showForm = true"
      >
        New Item
      </v-btn>
      <v-card v-else class="pa-4 mb-6" flat>
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
                v-model="itemData.code"
                :rules="[isRequired]"
                label="Code"
                required
              ></v-text-field
            ></v-col>
            <v-col cols="12" md="4">
              <v-select
                v-model="itemData.sensorModelId"
                :items="sensorModels"
                :rules="[isRequired]"
                label="Sensor Model"
                item-value="id"
                item-text="name"
                required
              >
                <template #selection="{ item }">
                  <span v-if="item.elements">
                    {{ item.name }}
                    <v-chip
                      v-for="e in item.elements"
                      :key="e.id"
                      color="primary"
                      small
                    >
                      <span> {{ e.um }}</span>
                    </v-chip>
                  </span>
                </template>

                <template #item="{ item }">
                  <span v-if="item.elements">
                    {{ item.name }}
                    <v-chip
                      v-for="e in item.elements"
                      :key="e.id"
                      color="primary"
                      small
                    >
                      <span> {{ e.um }}</span>
                    </v-chip>
                  </span>
                </template>
              </v-select>
            </v-col>
            <v-col cols="12" md="4">
              <v-select
                v-model="itemData.greenhouseId"
                :items="greenhouses"
                :rules="[isRequired]"
                scrollable
                label="Greenhouse"
                item-value="id"
                item-text="name"
                required
              >
                <template #selection="{ item }">
                  <span>
                    {{ item.name }}
                    {{ item.location.name }}
                    <v-chip small color="primary">{{ item.reference }}</v-chip>
                  </span>
                </template>

                <template #item="{ item }">
                  <span>
                    {{ item.name }}
                    {{ item.location.name }}
                    <v-chip small color="primary">{{ item.reference }}</v-chip>
                  </span>
                </template>
              </v-select>
            </v-col>
            <v-col class="d-flex justify-end align-center" cols="12" md="8">
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
                {{ itemData.id ? 'Update' : 'Add' }} Device
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card>
    </transition>

    <v-card flat>
      <v-card-title>
        <v-select
          v-model="greenhouseId"
          style="width: 10px"
          :items="greenhouses"
          scrollable
          solo-inverted
          flat
          label="Greenhouse"
          item-value="id"
          item-text="name"
          hide-details
          single-line
          required
          clearable
        >
          <template #selection="{ item }">
            <span> {{ item.name }} {{ item.location.name }} </span>
          </template>

          <template #item="{ item }">
            <span> {{ item.name }} {{ item.location.name }} </span>
          </template>
        </v-select>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          style="width: 0"
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
        :search.sync="search"
        :items-per-page="filter.size"
        :server-items-length.sync="filter.totalItems"
        :loading="$fetchState.pending"
        :options.sync="options"
      >
        <template #[`item.greenhouseId`]="{ item }">
          <p v-if="item.greenhouse" class="my-0">
            {{ item.greenhouse.name }}
            <span v-if="item.greenhouse.location">
              {{ item.greenhouse.location.name }}
            </span>
          </p>
        </template>
        <template #[`item.sensorModelId`]="{ item }">
          <span v-if="item.sensorModel">
            {{ item.sensorModel.name }}
          </span>
        </template>
        <template #[`item.elements`]="{ item }">
          <div flat>
            <div v-if="item.rules">
              <v-switch
                v-for="e in item.rules"
                :key="e.id"
                v-model="e.enabled"
                class="my-2 py-0"
                :label="`${e.name} (${e.um})`"
                hide-details
                dense
                @change="changeRule(e)"
              >
                <template #label>
                  <span class="text-capitalize">
                    {{ setTextElement(item.sensorModel.elements, e) }}
                  </span>
                </template>
              </v-switch>
            </div>
          </div>
        </template>
        <template #[`item.actions`]="{ item }">
          <v-btn
            class="mr-2"
            icon
            color="warning"
            @click="
              showForm = true
              itemData = JSON.parse(
                JSON.stringify({
                  id: item.id,
                  name: item.name,
                  code: item.code,
                  sensorModelId: item.sensorModelId,
                  greenhouseId: item.greenhouseId,
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

          <v-btn color="error" text @click="deleteItem(itemData.id)">
            Delete
          </v-btn>
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
    sensorModels: [],
    greenhouses: [],
    greenhouseId: '',
    valid: true,
    headers: [
      {
        text: 'Name',
        align: 'start',
        sortable: true,
        value: 'name',
      },
      { text: 'Code', value: 'code' },
      { text: 'Greenhouse', value: 'greenhouseId' },
      { text: 'Sensor Model', value: 'sensorModelId', sortable: true },
      { text: 'Elements', value: 'elements', sortable: false },
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
      return 'devices'
    },
    otherFilters() {
      return `&greenhouseId=${this.greenhouseId || ''}`
    },
  },
  watch: {
    otherFilters() {
      this.$fetch()
    },
  },
  mounted() {
    this.getSensorModels()
    this.getGreenhouses()
  },
  methods: {
    async changeRule(rule) {
      await this.$axios
        .put(`rules/${rule.id}/`, rule)
        .then(() => {})
        .catch(() => ({}))
    },
    setTextElement(elements = [], rule = {}) {
      const el = elements.find((x) => x.id === rule.elementId)
      return el ? `${el.name.toLowerCase()} (${el.um})` : 'None'
    },
    async getSensorModels() {
      return await this.$axios
        .get(`sensor-models`)
        .then((x) => {
          this.sensorModels = x.data.results || []
        })
        .catch(() => ({}))
    },
    async getGreenhouses() {
      return await this.$axios
        .get(`greenhouses`)
        .then((x) => {
          this.greenhouses = x.data.results || []
        })
        .catch(() => ({}))
    },
  },
}
</script>
