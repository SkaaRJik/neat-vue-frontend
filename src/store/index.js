import Vue from "vue";
import Vuex from "vuex";
import AuthModule from "@/store/modules/auth.module.";
import UiModule from "@/store/modules/ui.module";
import ProjectModule from "@/store/modules/project.module";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    auth: AuthModule,
    ui: UiModule,
    project: ProjectModule
  }
});
