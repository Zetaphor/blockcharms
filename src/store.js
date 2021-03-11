import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  strict: debug,

  state: {
    apiUrl: 'https://icanhazdadjoke.com',
  },

  mutations: {
    ADD_JOKE (state, jokeData) {
      Vue.set(state.jokes, jokeData.id, jokeData.joke)
    }
  },

  actions: {
    getRandomJoke (context) {
      Vue.http.get(context.state.apiUrl, context.state.apiConfig).then(resp => {
        context.commit('ADD_JOKE', resp.body)
      }, error => {
        console.error(error)
      })
    }
  }
})
