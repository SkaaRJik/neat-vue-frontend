import UiAuthModule from "@/components/authorization/store/ui.auth.module";

const UiModule = {
  namespaced: true,
  state: {},
  getters: {},
  mutations: {},
  actions: {},
  modules: {
    auth: UiAuthModule
  }
};

export default UiModule;
