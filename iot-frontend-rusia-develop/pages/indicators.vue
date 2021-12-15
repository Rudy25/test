<template>
  <div>
    <v-card class="pb-4 px-3" flat>
      <v-row class="mb-1" align="center">
        <v-col cols="3">
          <v-select
            v-model="periodKey"
            :items="periods"
            item-text="label"
            item-value="id"
            label="Period"
            solo-inverted
            flat
            dense
            hide-details
            :disabled="$fetchState.pending"
          ></v-select>
        </v-col>

        <v-col v-if="periodKey === 'month'" cols="3" md="2">
          <v-menu
            ref="menu"
            v-model="menu"
            class="elevation-0"
            elevation-1
            transition="scale-transition"
            :close-on-content-click="false"
            open-on-hover
            max-width="290px"
            min-width="auto"
          >
            <template #activator="{ on, attrs }">
              <v-text-field
                v-model="date"
                prepend-icon="mdi-calendar"
                solo-inverted
                flat
                readonly
                hide-details
                dense
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="date"
              type="month"
              no-title
              scrollable
              :max="new Date().toISOString().substr(0, 7)"
              @input="menu = false"
            >
            </v-date-picker>
          </v-menu>
        </v-col>

        <v-col v-if="periodKey === 'date'" cols="4" md="2">
          <v-menu
            v-model="menu2"
            :close-on-content-click="false"
            max-width="290px"
            min-width="auto"
            transition="scale-transition"
            open-on-hover
          >
            <template #activator="{ on, attrs }">
              <v-text-field
                v-model="day"
                prepend-icon="mdi-calendar"
                solo-inverted
                flat
                readonly
                hide-details
                dense
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="day"
              no-title
              :max="
                new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
                  .toISOString()
                  .substr(0, 10)
              "
              @input="menu2 = false"
            ></v-date-picker>
          </v-menu>
        </v-col>
        <v-spacer> </v-spacer>

        <v-menu open-on-hover offset-y>
          <template #activator="{ on, attrs }">
            <v-btn
              class="mr-4"
              depressed
              v-bind="attrs"
              v-on="on"
              :disabled="!historydata.length || $fetchState.pending"
            >
              <v-icon>bx bx-cloud-download</v-icon>
            </v-btn>
          </template>

          <v-list>
            <v-list-item
              v-for="item in [
                { text: 'Different pages', value: 'pages' },
                { text: 'One page', value: 'page' },
              ]"
              :key="item.value"
              dense
              @click="download(item.value)"
            >
              <v-list-item-title>{{ item.text }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-row>
      <v-divider></v-divider>
      <v-progress-linear
        :active="$fetchState.pending"
        indeterminate
        absolute
        bottom
        color="primary"
      ></v-progress-linear>

      <v-expansion-panels v-model="showDevice" focusable flat>
        <v-expansion-panel>
          <v-expansion-panel-header>
            Devices ({{ selectedDevices.length }})
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-row no-gutters align="center">
              <v-col class="my-3" cols="12">
                <v-row align="center">
                  <v-col cols="4" md="2" xl="1">
                    <v-checkbox
                      v-model="selectAll"
                      class="py-0 my-0"
                      label="Select All"
                      hide-details
                      dense
                      :disabled="$fetchState.pending"
                    ></v-checkbox>
                  </v-col>
                  <v-col cols="8" md="4" lg="3">
                    <v-select
                      v-model="greenhouseId"
                      :items="greenhouses"
                      scrollable
                      solo-inverted
                      flat
                      dense
                      label="Greenhouse"
                      item-value="id"
                      item-text="name"
                      hide-details
                      single-line
                      :disabled="$fetchState.pending"
                      clearable
                    >
                      <template #selection="{ item }">
                        <span> {{ item.name }} {{ item.location.name }} </span>
                      </template>

                      <template #item="{ item }">
                        <span> {{ item.name }} {{ item.location.name }} </span>
                      </template>
                    </v-select>
                  </v-col>
                  <v-col cols="12" sm="6" md="4" lg="3">
                    <v-select
                      v-model="sensorModelId"
                      :items="sensorModels"
                      label="Sensor Model"
                      item-value="id"
                      item-text="name"
                      scrollable
                      solo-inverted
                      flat
                      dense
                      clearable
                      hide-details
                      :disabled="$fetchState.pending"
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
                </v-row>
                <v-divider class="mt-2"></v-divider>
              </v-col>
              <v-col
                v-for="d in items"
                :key="d.id"
                cols="12"
                sm="6"
                md="4"
                lg="3"
                xl="2"
              >
                <v-checkbox
                  v-model="selectedDevices"
                  :label="`${d.name}`"
                  :value="d.id"
                  hide-details
                  dense
                  :disabled="$fetchState.pending"
                >
                  <template #label>
                    <div>
                      <small>
                        {{ d.greenhouse.name }} <b>{{ d.code }}</b>
                      </small>

                      <v-chip
                        v-for="e in d.sensorModel.elements"
                        :key="e.id"
                        class="px-1"
                        label
                        outlined
                        x-small
                        color="grey"
                      >
                        {{ e.um }}
                      </v-chip>
                    </div>
                  </template>
                </v-checkbox>
              </v-col>
              <!-- (${d.element.um}) -->
              <v-col class="d-flex justify-center" cols="12">
                <v-btn
                  class="mt-5"
                  small
                  depressed
                  color="primary"
                  :disabled="$fetchState.pending"
                  @click="$fetch()"
                >
                  Apply
                </v-btn>
              </v-col>
            </v-row>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card>
    <v-card class="mt-6" flat>
      <div v-for="d in historydata" :id="`${d.id}`" :key="d.id">
        <div
          v-for="e in d.sensorModel.elements"
          :id="`${d.id}${e.name}`"
          :key="e.id"
          class="chartdiv"
        ></div>
      </div>
    </v-card>
  </div>
</template>
<script>
import XLSX from 'xlsx'

import { dispose, Series } from '@/utils/chart'
export default {
  layout: 'dashboard',

  data: () => ({
    date: new Date().toISOString().substr(0, 7),
    day: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10),
    menu: false,
    menu2: false,
    selectAll: false,
    modal: false,
    sensorModelId: '',
    greenhouseId: '',
    devices: [],
    selectedDevices: [],
    sensorModels: [],
    historydata: [],
    greenhouses: [],
    periods: [
      {
        id: 'today',
        label: 'Today',
      },
      {
        id: 'last24',
        label: 'Last 24 hours',
      },
      {
        id: 'yesterday',
        label: 'Yesterday',
      },
      {
        id: 'current_week',
        label: 'Current Week',
      },
      {
        id: 'last_week',
        label: 'Last Week',
      },
      {
        id: 'current_month',
        label: 'Current Month ',
      },
      {
        id: 'last_month',
        label: 'Last Month',
      },
      {
        id: 'month',
        label: 'By Month',
      },
      {
        id: 'date',
        label: 'By Date',
      },
    ],
    showDevice: false,
    periodKey: 'today',
  }),
  fetchOnServer: false,
  async fetch() {
    dispose()
    this.showDevice = false
    await this.getAllData()
  },

  computed: {
    items() {
      if (this.greenhouseId && this.sensorModelId) {
        return this.devices.filter(
          (x) =>
            x.greenhouseId === this.greenhouseId &&
            x.sensorModelId === this.sensorModelId
        )
      }
      if (this.greenhouseId) {
        return this.devices.filter((x) => x.greenhouseId === this.greenhouseId)
      }

      if (this.sensorModelId) {
        return this.devices.filter(
          (x) => x.sensorModelId === this.sensorModelId
        )
      }
      return this.devices
    },
  },
  watch: {
    sensorModelId() {
      this.selectedDevices = []
      this.selectAll = false
    },
    greenhouseId() {
      this.selectedDevices = []
      this.selectAll = false
    },
    selectAll(v) {
      if (v) {
        this.selectedDevices = this.items.map((x) => x.id)
      } else {
        this.selectedDevices = []
      }
    },

    periodKey(v) {
      this.$fetch()
    },
    date() {
      this.$fetch()
    },
    day() {
      this.$fetch()
    },
    '$colorMode.preference'(v) {
      this.$fetch()
    },
  },

  mounted() {
    this.getDevices()
    this.getSensorModels()
    this.getGreenhouses()
  },

  methods: {
    async getAllData() {
      this.historydata = []
      for (let index = 0; index < this.selectedDevices.length; index++) {
        const device = this.selectedDevices[index]

        this.historydata[index] = {
          ...this.devices.find((x) => x.id === device),
        }
      }

      for (let index = 0; index < this.historydata.length; index++) {
        const d = this.historydata[index]

        for (let indexE = 0; indexE < d.sensorModel.elements.length; indexE++) {
          const element = d.sensorModel.elements[indexE]
          let items = []
          switch (element.name) {
            case 'TEMPERATURE':
              items = await this.getDeviceTemperature(d.id)
              this.series(`${d.id}${element.name}`, items, d, element)
              break
            case 'HUMIDITY':
              items = await this.getDeviceHumidity(d.id)
              this.series(`${d.id}${element.name}`, items, d, element)

              break
            case 'CO2':
              items = await this.getDeviceCo2(d.id)
              this.series(`${d.id}${element.name}`, items, d, element)
              break
            default:
              break
          }

          d.items = [...items]
          d.element = { ...element }
        }
      }
    },
    async getDeviceTemperature(device) {
      return await this.$axios
        .get(
          `devices-temperature/?device=${device}&period=${
            this.periodKey
          }&date=${this.periodKey === 'month' ? this.date : this.day}`
        )
        .then((x) => x.data)
        .catch(() => [])
    },
    async getDeviceHumidity(device) {
      return await this.$axios
        .get(
          `devices-humidity/?device=${device}&period=${this.periodKey}&date=${
            this.periodKey === 'month' ? this.date : this.day
          }`
        )
        .then((x) => x.data)
        .catch(() => [])
    },
    async getDeviceCo2(device) {
      return await this.$axios
        .get(
          `devices-co2/?device=${device}&period=${this.periodKey}&date=${
            this.periodKey === 'month' ? this.date : this.day
          }`
        )
        .then((x) => x.data)
        .catch(() => [])
    },

    series(id, items, device, element) {
      Series(
        id,
        items.map((x) => ({
          ...x,
          date: new Date(x.date),
        })),
        device,
        element
      )
    },

    async getDevices() {
      await this.$axios
        .get(`devices`)
        .then((x) => {
          this.devices = x.data.results
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

    async getSensorModels() {
      return await this.$axios
        .get(`sensor-models`)
        .then((x) => {
          this.sensorModels = x.data.results || []
        })
        .catch(() => ({}))
    },
    download(mode) {
      const headers = [
        'Nº',
        'Code',
        'Name',
        'Location',
        'Greenhouse',
        'Reference',
        'Value',
        'Date',
        'Element',
        'um',
        'Sensor',
        'Limits',
      ]
      const wb = XLSX.utils.book_new()
      if (mode === 'pages') {
        for (let index = 0; index < this.historydata.length; index++) {
          const { code, name, items, greenhouse, element, sensorModel } =
            this.historydata[index]
          const _tests = [
            ...items.map(({ date, value }, index) => [
              index + 1,
              code,
              name,
              greenhouse.location.name,
              greenhouse.name,
              greenhouse.reference,
              value,
              date,
              element.name,
              element.um,
              sensorModel.name,
              sensorModel.limits,
            ]),
          ]

          const data = [headers, ..._tests]
          const ws = XLSX.utils.aoa_to_sheet(data)
          XLSX.utils.book_append_sheet(
            wb,
            ws,
            `${code}-${name.replaceAll('/', '-')}`
          )
        }
      } else {
        let _tests = []
        let count = 0
        for (let index = 0; index < this.historydata.length; index++) {
          const { code, name, items, greenhouse, element, sensorModel } =
            this.historydata[index]
          _tests = [
            ..._tests,
            ...items.map(({ date, value }) => {
              count = count + 1
              return [
                count,
                code,
                name,
                greenhouse.location.name,
                greenhouse.name,
                greenhouse.reference,
                value,
                date,
                element.name,
                element.um,
                sensorModel.name,
                sensorModel.limits,
              ]
            }),
          ]
        }
        const data = [headers, ..._tests]

        const ws = XLSX.utils.aoa_to_sheet(data)
        XLSX.utils.book_append_sheet(wb, ws, `Page 01`)
      }

      XLSX.writeFile(wb, 'Results.xlsx')
    },
    destroyed() {
      dispose()
    },
  },
}
</script>
<style>
.chartdiv {
  height: 150px;
  width: 100%;
}
</style>
