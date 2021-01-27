import Vue from "vue";

const controllerPath = "";
export default {
  signIn: ({ username, password }) => {
    return Vue.axios.post(`${controllerPath}/login`, { username, password });
  },
  signUp: ({ email, username, password, firstName, lastName, avatar }) => {
    return Vue.axios.post(`${controllerPath}/signup`, {
      email,
      username,
      password,
      firstName,
      lastName,
      avatar
    });
  },
  checkEmail: email => {
    return Vue.axios.get(`${controllerPath}/email-exist?email=${email}`);
  },
  checkUsername: username => {
    return Vue.axios.get(
      `${controllerPath}/username-exist?username=${username}`
    );
  },
  refreshTokens(refreshToken) {
    return Vue.axios.get(
      `${controllerPath}/refresh-tokens?refreshToken=${refreshToken}`
    );
  },
  uploadAvatar(avatar) {
    return Vue.axios.post(`${controllerPath}/avatar`, { file: avatar });
  }
};
