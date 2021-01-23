import AuthAPI from "@/services/api/AuthAPI";

const user = JSON.parse(localStorage.getItem("user"));

const initialState = user ? { user } : { user: undefined };

const AuthModule = {
  namespaced: true,
  state: initialState,
  getters: {
    isLoggedIn: state => {
      return !!state.user;
    }
  },
  mutations: {
    MUTATION_LOGOUT(state) {
      state.user = undefined;
    }
  },
  actions: {
    LOGOUT({ commit }) {
      commit("MUTATION_LOGOUT");
    },
    async REGISTER({ commit }, user) {
      try {
        const { data } = await AuthAPI.signUp(user);
        commit("registerSuccess");
        return Promise.resolve(data);
      } catch (error) {
        console.error("[auth.module.].REGISTER error:", error);
        return Promise.reject(error);
      }
    }
  }
};

export default AuthModule;
