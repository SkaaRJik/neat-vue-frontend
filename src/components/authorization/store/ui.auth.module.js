const initialState = {
  email: "",
  username: "",
  password: "",
  firstName: "",
  lastName: "",
  avatar: undefined
};

const UiAuthModule = {
  namespaced: true,
  state: initialState,
  getters: {},
  mutations: {
    MUTATE_USER_DATA(state, user) {
      state = user;
    }
  },
  actions: {
    SET_USER_DATA(
      { commit },
      { email, username, password, firstName, lastName, avatar }
    ) {
      commit("MUTATE_USER_DATA", {
        email,
        username,
        password,
        firstName,
        lastName,
        avatar
      });
    },
    CLEAN_USER_DATA({ commit }) {
      commit("MUTATE_USER_DATA", initialState);
    }
  }
};

export default UiAuthModule;
