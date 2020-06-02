const user = {
  state: {
    name: '',
    password: ''
  },

  mutations: {
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_PASSWORD: (state, password) => {
      state.password = password
    }
  },

  actions: {
    setName: ({commit}, name) => commit('SET_NAME', name),
    setPassword: ({commit}, password) => commit('SET_PASSWORD', password)
  }
}

export default user
