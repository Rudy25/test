<template>
  <v-container class="fill-height">
    <v-row justify="center" align="center">
      <v-col v-if="view == 'expired' || view == 'ivalid'" cols="12">
        <v-alert
          class="mx-auto"
          :value="true"
          outlined
          max-width="400"
          title="dsajdsah"
          type="error"
          prominent
          border="left"
        >
          <p class="easy-title">
            {{
              view == 'expired'
                ? 'Reset your password'
                : 'The time to reset the password has expired, please make your request again.'
            }}
          </p>
          <span>{{
            view == 'expired'
              ? 'The provided token is invalid, please make your request again.'
              : 'The time to reset the password has expired, please make your request again.'
          }}</span>

          <br />
          <v-btn class="mt-2" color="error" text href="/reset-password">
            <span>Try again</span>
          </v-btn>
        </v-alert>
      </v-col>
      <v-col v-else-if="view == 'change'" cols="12">
        <v-card class="mx-auto px-2 py-3" max-width="400" elevation="1">
          <h1 class="text-center primary--text my-2">
            {{
              show_success_password
                ? 'Password Updated!'
                : 'Reset your password'
            }}
          </h1>

          <v-alert v-if="show_success_password" type="success">
            <small> Your IASE Password has been successfully updated. </small>
          </v-alert>
          <p v-if="!show_success_password" class="text-center">
            Please enter a new password for your
            <strong>IASE</strong> account
          </p>
          <v-text-field
            v-if="!show_success_password"
            v-model="password"
            :append-icon="show ? 'mdi-eye-off' : 'mdi-eye'"
            :type="show ? 'text' : 'password'"
            label="Password"
            outlined
            @click:append="show = !show"
          ></v-text-field>
          <!-- hint="Must contain at least 1 upper case, 1 lower case, 1 number and 1 character" -->
          <v-card-text v-if="false">
            <v-chip
              class="ma-2"
              :color="r.upper(password) ? 'success' : 'error'"
              text-color="white"
            >
              Upper
              <v-avatar v-if="r.upper(password)" right>
                <v-icon>mdi-checkbox-marked-circle</v-icon>
              </v-avatar>
            </v-chip>
            <v-chip
              class="ma-2"
              :color="r.lower(password) ? 'success' : 'error'"
              text-color="white"
            >
              Lower
              <v-avatar v-if="r.lower(password)" right>
                <v-icon>mdi-checkbox-marked-circle</v-icon>
              </v-avatar>
            </v-chip>
            <v-chip
              class="ma-2"
              :color="r.numbers(password) ? 'success' : 'error'"
              text-color="white"
            >
              Numbers
              <v-avatar v-if="r.numbers(password)" right>
                <v-icon>mdi-checkbox-marked-circle</v-icon>
              </v-avatar>
            </v-chip>
            <v-chip
              class="ma-2"
              :color="r.special(password) ? 'success' : 'error'"
              text-color="white"
            >
              Special chars
              <v-avatar v-if="r.special" right>
                <v-icon>mdi-checkbox-marked-circle</v-icon>
              </v-avatar>
            </v-chip>
            <v-chip
              class="ma-2"
              :color="r.min(password) ? 'success' : 'error'"
              text-color="white"
            >
              <v-avatar>
                <v-icon>mdi-checkbox-marked-circle</v-icon>
              </v-avatar>
            </v-chip>
          </v-card-text>
          <v-card-actions>
            <v-btn
              v-if="!show_success_password"
              class="mx-auto px-4 py-2 rounded-lg"
              color="primary"
              depressed
              :disabled="!password"
              :loading="password_loading"
              @click="sendNewPassword({ token: query.token, password })"
            >
              <!-- !r.min(password) ||
                !r.lower(password) ||
                !r.upper(password) ||
                !r.numbers(password) ||
                !r.special(password) -->
              <span>Save new password</span>
            </v-btn>

            <v-btn
              v-else
              class="mx-auto rounded-lg"
              color="primary"
              :to="localePath('/')"
              text
            >
              <span>Continue to LogIn</span>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col v-else-if="view == 'email'" cols="12">
        <v-card class="mx-auto px-3 py-3" max-width="420" elevation="1">
          <h1 class="text-center primary--text text-h4 mt-2 mb-4">
            {{ show_success_email ? 'Email sent' : 'Reset your password' }}
          </h1>
          <v-alert v-if="show_success_email" type="success">
            <small>
              Check your email for a message with a link to update your
              password. This link will expire in 2 hours.
            </small>
          </v-alert>
          <p v-if="!show_success_email" class="text-center mt-6 mb-6">
            Enter your email address to reset your password.
          </p>
          <v-text-field
            v-if="!show_success_email"
            v-model="email"
            label="Email"
            :rules="[r.email(email, 'Email must be valid'), r.required]"
            solo-inverted
            flat
            :hide-details="typeof r.email(email) === 'boolean'"
          >
            <!-- @blur="
              typeof r.email(email) == 'boolean'
                ? checkEmail(email)
                : SET_CHECK_EMAIL(false)
            " -->
          </v-text-field>
          <transition name="fade">
            <v-alert
              v-if="show_ivalid_email"
              class="mt-1"
              dense
              type="error"
              outlined
            >
              <small>This email is not registered</small>
            </v-alert>
          </transition>
          <v-card-actions class="mt-3 d-flex justify-space-around align-center">
            <v-btn
              v-if="!show_success_email"
              :loading="email_loading"
              color="primary"
              @click="sendEmail(email)"
            >
              <span>Send reset email</span>
            </v-btn>
            <nuxt-link to="/login">Sign In</nuxt-link>
            <!-- <v-btn
              v-else
              class="mx-auto rounded-lg"
              color="primary"
              to="/"
              text
            >
              <span >Continue to Log In</span>
            </v-btn> -->
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
export default {
  layout: 'login',
  middleware: 'login',
  async asyncData({ query, $axios }) {
    let view = 'email'
    if (query.token) {
      await $axios
        .post('auth/reset_password/validate_token/', {
          token: query.token,
        })
        .then(() => {
          view = 'change'
        })
        .catch((e) => {
          if (e.response) {
            view = e.response.statusText === 'Not Found' ? 'ivalid' : 'expired'
          }
        })
    }
    return {
      view,
      query,
    }
  },
  data: () => ({
    view: 'email', // change, expired
    reset: false,
    query: '',
    show: false,
    password: '',
    email: '',
    loading: false,
    focus: false,
    r: {
      password: (v) =>
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#])(?=.{8,})/.test(v) ||
        'Must contain at least 1 upper case, 1 lower case, 1 number and 1 character',
      lower: (v) => /([a-z])/.test(v),
      upper: (v) => /([A-Z])/.test(v),
      numbers: (v) => /([0-9])/.test(v),
      special: (v) => /([!@#])/.test(v),
      min: (v) => v.length >= 8,
      email: (v, text) => /.+@.+\..+/.test(v) || text,
      required: (value) => !!value || 'This field is required.',
    },
  }),
  head: () => ({
    title: 'Reset Password',
    meta: [
      {
        hid: 'description',
        name: 'description',
        content: 'Reset Password page',
      },
    ],
  }),
  computed: {
    ...mapState({
      show_ivalid_email: (state) => state['reset-password'].show_ivalid_email,
      email_loading: (state) => state['reset-password'].email_loading,
      password_loading: (state) => state['reset-password'].password_loading,
      show_success_email: (state) => state['reset-password'].show_success_email,
      show_success_password: (state) =>
        state['reset-password'].show_success_password,
    }),
  },

  methods: {
    ...mapMutations('reset-password', ['SET_CHECK_EMAIL']),
    ...mapActions('reset-password', [
      'checkEmail',
      'sendEmail',
      'sendNewPassword',
    ]),
  },
}
</script>
