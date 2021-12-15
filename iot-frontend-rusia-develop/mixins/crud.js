import { totalPage, totalSkip } from '../utils/paginate'

export default {
  async fetch() {
    this.filter.skip = totalSkip(this.filter.page, this.filter.size)
    const { results, count } = await this.getItems()
    this.items = results
    this.filter.total = totalPage(count, this.filter.size)
    this.filter.totalItems = count
    if (this.filter.size === -1) {
      return
    }
    if (this.filter.total !== 0 && this.filter.page > this.filter.total) {
      this.filter.page = this.filter.page > 1 ? this.filter.page - 1 : 1
      if (!this.query) {
        setTimeout(() => {
          this.$fetch()
        }, 10)
      }
    }
    // loading.close()
  },
  fetchOnServer: false,
  data: () => ({
    isRequired: (v) => !!v || 'Field is required',
    isRequiredMultiple: (v) => !!v.length || 'Field is required',
    options: {},
    showForm: false,
    valid: true,
    search: '',
    idClear: true,
    items: [],
    itemData: {},
    loading: false,
    dialog: false,
    filter: {
      page: 1,
      size: 5,
      total: 0,
      skip: 0,
      totalItems: 0,
      order: '',
    },
  }),

  watch: {
    '$route.query': '$fetch',
    options(v) {
      const { sortBy, sortDesc, page, itemsPerPage } = v
      if (sortBy.length && sortDesc.length) {
        this.filter.order = `${sortBy[0]} ${sortDesc[0] ? 'DESC' : 'ASC'}`
      } else {
        this.filter.order = ''
      }

      this.filter.page = page
      this.filter.size = itemsPerPage

      setTimeout(() => {
        this.$fetch()
      }, 100)
    },
    search(v) {
      if (this.query) {
        if (v.length) {
          this.$router.push({
            query: { search: v, page: 1, size: this.size },
          })
        } else {
          this.$router.push({ query: { page: 1 } })
        }
      } else {
        this.filter.page = 1
        this.$fetch()
      }
    },
  },

  methods: {
    async getItems() {
      const { size, skip, order } = this.filter
      return await this.$axios
        .get(
          `${this.path}/?filter[skip]=${skip}${
            size !== -1 ? '&filter[limit]=' + size : ''
          }&filter[order]=${order}&search=${this.search ?? ''}${
            this.otherFilters || ''
          }`
        )
        .then((x) => ({
          ...x.data,
        }))
        .catch(() => ({}))
    },
    async saveItem() {
      if (this.$refs.form.validate()) {
        this.loading = true
        if (this.itemData.id) {
          return await this.$axios
            .put(`${this.path}/${this.itemData.id}`, this.itemData)
            .then((x) => {
              this.clear()
              return x.data
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          return await this.$axios
            .post(`${this.path}`, this.itemData)
            .then((x) => {
              this.clear()
              return x.data
            })
            .catch(() => {
              this.loading = false
            })
        }
      }
    },

    async deleteItem(id) {
      this.loading = true
      await this.$axios
        .delete(`${this.path}/${id}`)
        .then(() => {
          this.clear()
        })
        .catch(() => {})
      this.loading = false
    },

    clear() {
      this.$fetch()
      this.popup = false
      if (this.idClear) {
        this.itemData = {}
        if (this.$refs.form) {
          this.$refs.form.reset()
        }
      }
      this.loading = false
      this.dialog = false
      this.showForm = false
    },

    reset() {
      this.itemData = {}
      if (this.$refs.form) {
        this.$refs.form.reset()
      }
      this.dialog = false
      this.showForm = false
    },
  },
}
