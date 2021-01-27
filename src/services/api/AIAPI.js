import Vue from "vue";

const controllerPath = "/api/trainer";
export default {
  getDefaultConfig: () => {
    return Vue.axios.get(`${controllerPath}/default-config`);
  },

  getActivationFunctions: () => {
    return Vue.axios.get(`${controllerPath}/activation-functions`);
  }
};
