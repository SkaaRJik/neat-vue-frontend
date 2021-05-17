import AuthAPI from "@/services/api/AuthAPI";
import Ucavatar from "ucavatar";
import axios from "axios";

const initialState = {
  user: JSON.parse(localStorage.getItem("user"))
};

const AuthModule = {
  namespaced: true,
  state: initialState,
  getters: {
    isLoggedIn: state => {
      return !!state.user;
    },
    shortUsername: state => {
      return `${state.user.firstname[0]} ${state.user.lastname[0]}`;
    }
  },
  mutations: {
    MUTATION_SET_USER(state, payload) {
      if (payload) {
        const newUserState = { ...state.user, ...payload };
        if (!newUserState.avatar) {
          const canvas = document.querySelector("#avatar");
          Ucavatar.Ucavatar(canvas, newUserState.username, 200);
          newUserState.avatar = canvas.toDataURL();
        }
        const AUTH_TOKEN = newUserState.tokens.accessToken;
        axios.defaults.headers.common["Authorization"] = AUTH_TOKEN;
        localStorage.setItem("user", JSON.stringify(newUserState));
      } else {
        localStorage.removeItem("user");
      }
      state.user = payload;
    }
  },
  actions: {
    LOGOUT({ commit }) {
      console.log("[auth.module.].LOGOUT logout:");
      commit("MUTATION_SET_USER", null);
    },
    async REGISTER(
      state,
      { email, username, password, firstName, lastName, avatar }
    ) {
      try {
        const { data } = await AuthAPI.signUp({
          email,
          username,
          password,
          firstName,
          lastName,
          avatar
        });
        return Promise.resolve(data);
      } catch (error) {
        console.error("[auth.module.].REGISTER error:", error);
        return Promise.reject(error);
      }
    },
    async LOGIN({ commit }, { username, password }) {
      try {
        const { data } = await AuthAPI.signIn({ username, password });
        commit("MUTATION_SET_USER", data);
        return Promise.resolve(data);
      } catch (error) {
        console.error("[auth.module.].LOGIN error:", error);
        return Promise.reject(error);
      }
    },
    async REFRESH_TOKEN({ commit, state }) {
      console.log("[auth.module.].REFRESH_TOKEN START:");
      if (state.user) {
        console.log("[auth.module.].REFRESH_TOKEN START:");
        try {
          const { data, status } = await AuthAPI.refreshTokens(
            state.user.tokens.refreshToken
          );
          commit("MUTATION_SET_USER", { tokens: data });
          console.log("[auth.module.].TOKEN REFRESHED:");
          return Promise.resolve({ data, status });
        } catch (e) {
          return Promise.reject(e);
        }
      }
      return Promise.reject("You are not logged in");
    }
  }
};

export default AuthModule;
