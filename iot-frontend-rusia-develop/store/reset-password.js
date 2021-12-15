export const state = () => ({
  email_loading: false,
  password_loading: false,
  show_ivalid_email: false,
  show_success_email: false,
  show_success_password: false,
})
export const mutations = {
  SET_CHECK_EMAIL(state, payload) {
    state.show_ivalid_email = payload
  },
  CHANGE_EMAIL_LOADING(state, payload) {
    state.email_loading = payload
  },
  CHANGE_PASSWORD_LOADING(state, payload) {
    state.password_loading = payload
  },
  CHANGE_EMAIL_SUCCESS(state, payload) {
    state.show_success_email = payload
  },
  CHANGE_PASSWORD_SUCCESS(state, payload) {
    state.show_success_password = payload
  },
}
export const actions = {
  async checkToken({ commit }) {
    return await this.$axios(`url`)
      .then((x) => {})
      .catch((e) => {})
  },
  async sendNewPassword({ commit }, payload) {
    commit('CHANGE_PASSWORD_SUCCESS', false)
    commit('CHANGE_PASSWORD_LOADING', true)

    await this.$axios
      .post(`auth/reset_password/confirm/`, payload)
      .then(() => {
        commit('CHANGE_PASSWORD_SUCCESS', true)
        commit('CHANGE_PASSWORD_LOADING', false)
      })
      .catch(() => {
        commit('CHANGE_PASSWORD_SUCCESS', false)
        commit('CHANGE_PASSWORD_LOADING', false)
      })
  },
  async sendEmail({ commit, dispatch }, payload) {
    commit('SET_CHECK_EMAIL', false)
    commit('CHANGE_EMAIL_SUCCESS', false)
    commit('CHANGE_EMAIL_LOADING', true)

    const check = await dispatch('checkEmail', payload)
    if (check) {
      await this.$axios
        .post(`auth/reset_password/`, { email: payload })
        .then(() => {
          commit('CHANGE_EMAIL_LOADING', false)
          commit('CHANGE_EMAIL_SUCCESS', true)
        })
        .catch(() => {
          commit('CHANGE_EMAIL_LOADING', false)
        })
    }
    commit('CHANGE_EMAIL_LOADING', false)
  },
  async checkEmail({ commit }, email) {
    return await this.$axios
      .post('api/user/check/', {
        email,
        app: 1,
      })
      .then((x) => {
        commit('SET_CHECK_EMAIL', false)
        return true
      })
      .catch((e) => {
        commit('SET_CHECK_EMAIL', true)
        return false
      })
  },
}
