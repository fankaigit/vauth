<template>
  <div id="hello">
    <section id="hello-header" class="hero is-primary is-small">
      <div class="hero-body has-text-centered">
        <p class="title">Vauth</p>
        <p class="subtitle">Demo for auth flow</p>
      </div>
    </section>

    <section id="hello-main">

      <div id="hello-user" v-if="user !== null">

        <b-notification v-if="action === 'register'">
          Welcome, you have successfully registered as <b>{{user.username}}</b> !
        </b-notification>

        <b-notification v-else>
          Welcome back, {{user.username}}!
        </b-notification>

        <b-notification>
          This application is a simple demo for user auth, so there is nothing to do here.
        </b-notification>

        <b-field class="hello-actions">
            <button class="button is-warning is-fullwidth" @click="logout()">Logout</button>
        </b-field>

      </div>

      <div id="hello-anonymous" v-else>
        <b-field label="Username"
                 :type="validUsername ? 'is-primary' : 'is-danger' "
                 :message="validUsername ? '' : 'require at least 6 characters!'">
          <b-input placeholder="Username" v-model="username"  maxlength="30" class="is-primary" />
        </b-field>

        <b-field label="Password"
                 :type="validPassword ? 'is-primary' : 'is-danger' "
                 :message="validPassword ? '' : 'require at least 6 characters!'">
          <b-input placeholder="Password" v-model="password" type="password" maxlength="30" password-reveal />
        </b-field>

        <b-field class="hello-actions columns">
          <div class="column">
            <button class="button is-primary is-fullwidth" @click="login()">Login</button>
          </div>
          <div class="column">
            <button class="button is-warning is-fullwidth" @click="register()">Register</button>
          </div>
        </b-field>

        <b-notification type='is-danger' :active.sync="notify" has-icon v-show="action === 'login' && user === null">
          Fail to login!
        </b-notification>

        <b-notification type='is-danger' :active.sync="notify" has-icon v-show="action === 'register' && user === null">
          Fail to register!
        </b-notification>

      </div>
    </section>

  </div>
</template>

<style lang="scss" scoped>

  #hello {
    margin: 0.3rem;
  }

  #hello-main {
    margin: 1rem;
  }

  #hello-main .hello-actions {
    margin-top: 1rem;
  }

</style>

<script>
import axios from 'axios'
import shajs from 'sha.js'
const log = require('../log.js')
const HOST = `${location.protocol}//${location.hostname}:${location.port}`

export default {
  name: 'Hello',
  data () {
    return {
      username: '',
      password: '',
      user: null,
      action: null,
      notify: true
    }
  },
  created: function () {
    axios.get(`${HOST}/s/status`).then(
      (response) => this.onLoggedIn(response),
      (err) => this.onNotLoggedIn(err)
    )
  },
  methods: {
    onLoggedIn: function (response) {
      this.user = response.data
      log.info('login status:', response.data)
    },
    onNotLoggedIn: function (err) {
      this.user = null
      this.notify = true
      if (err.response.status === 401) {
        log.info('not logged in')
      } else {
        log.error('fail to connect to server:', err)
      }
      log.info(this.user)
      log.info(this.action)
    },
    hashedPassword: function () {
      return shajs('sha256').update(this.password).digest('hex')
    },
    logout: function () {
      this.action = null
      axios.post(`${HOST}/s/logout`).then(
        (response) => this.onLoggedIn(response),
        (err) => this.onNotLoggedIn(err)
      )
    },
    login: function () {
      this.action = 'login'
      const data = {
        username: this.username,
        password: this.hashedPassword()
      }
      axios.post(`${HOST}/s/login`, data).then(
        (response) => this.onLoggedIn(response),
        (err) => this.onNotLoggedIn(err)
      )
    },
    register: function () {
      this.action = 'register'
      const data = {
        username: this.username,
        password: this.hashedPassword()
      }
      axios.post(`${HOST}/s/register`, data).then(
        (response) => {
          this.onLoggedIn(response)
        },
        (err) => this.onNotLoggedIn(err)
      )
    }
  },
  computed: {
    validUsername: function () {
      return this.username.length === 0 || this.username.length >= 6
    },
    validPassword: function () {
      return this.password.length === 0 || this.password.length >= 6
    }
  }
}
</script>
