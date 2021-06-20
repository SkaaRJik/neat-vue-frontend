import ProjectsAPI from "@/services/api/ProjectsAPI";

const ProjectModule = {
  namespaced: true,
  state: {
    project: {
      id: null,
      name: "",
      status: "",
      lastActiveExperiment: null,
      creationDate: null,
      updatedDate: null,
      experiments: [],
      verificationErrors: null,
      verificationInfo: null,
      legend: null,
      logIsAllowed: null,
      headers: []
    },
    experiment: {
      id: null
    }
  },
  getters: {
    // eslint-disable-next-line no-unused-vars
    experiment: (state, getters) => {
      return state.experiment;
    }
  },
  mutations: {
    MUTATION_SET_PROJECT(state, project) {
      state.project = project;
    },
    MUTATION_SET_EXPERIMENT(state, experiment) {
      state.experiment = experiment;
    },
    MUTATION_UPDATE_PROJECT(state, project) {
      if (state.project?.id === project?.id) {
        state.project = { ...state.project, ...project };
      }
    },
    MUTATION_CLEAN_EXPERIMENT(state) {
      state.experiment = { id: null };
    },
    MUTATION_UPDATE_EXPERIMENT(state, experiment) {
      if (state.experiment?.id === experiment?.id) {
        state.experiment = { ...state.experiment, ...experiment };
      }
    }
  },
  actions: {
    GET_PROJECT: async ({ state, commit }, projectId) => {
      if (state.project?.id !== projectId) {
        try {
          const { data } = await ProjectsAPI.getProjectData(projectId);
          commit("MUTATION_SET_PROJECT", data);
        } catch (e) {
          console.error("[ProjectModule.vuex].GET_PROJECT e:", e);
          return Promise.reject(e.response?.data?.message || e);
        }
      }
      return Promise.resolve(state.project);
    },

    GET_EXPERIMENT: async (
      { state, commit, dispatch },
      { projectId, experimentId }
    ) => {
      try {
        await dispatch("GET_PROJECT", projectId);
        if (state.experiment?.id !== experimentId) {
          const { data } = await ProjectsAPI.getExperiment({
            projectId,
            experimentId
          });
          commit("MUTATION_SET_EXPERIMENT", data);
        }
        return Promise.resolve(state.experiment);
      } catch (e) {
        console.error("[project.module].GET_EXPERIMENT e:", e);
        return Promise.reject(e.response?.data?.message || e);
      }
    },

    CREATE_PROJECT: async (
      // eslint-disable-next-line no-unused-vars
      { state },
      { projectName, file }
    ) => {
      try {
        const { data } = await ProjectsAPI.saveProject({
          projectName,
          file
        });
        return Promise.resolve(data);
      } catch (ex) {
        console.error("[project.module].NEW_PROJECT e:", ex);
        return Promise.reject(ex.response?.data?.message || ex);
      }
    },

    ATTACH_PROJECT_FILE: async ({ state, commit }, { projectId, file }) => {
      try {
        const { data } = await ProjectsAPI.attachSourceFile({
          projectId,
          file
        });
        commit("MUTATION_UPDATE_PROJECT", data);
      } catch (e) {
        console.error("[ProjectModule.vuex].ATTACH_PROJECT_FILE e:", e);
        return Promise.reject(e.response?.data?.message || e);
      }
      return Promise.resolve(state.project);
    },

    UPDATE_EXPERIMENT: async (
      { state, commit },
      { projectId, experimentId, name }
    ) => {
      try {
        const { data } = await ProjectsAPI.updateExperiment(
          projectId,
          experimentId,
          name
        );
        commit("MUTATION_UPDATE_EXPERIMENT", data);
      } catch (e) {
        console.error("[ProjectModule.vuex].UPDATE_EXPERIMENT e:", e);
        return Promise.reject(e.response?.data?.message || e);
      }
      return Promise.resolve(state.experiment);
    },

    COPY_EXPERIMENT: async (
      // eslint-disable-next-line no-unused-vars
      { state, commit },
      { projectId, experimentId, rewriteExperimentId }
    ) => {
      let newExperimentId = null;
      try {
        const { data } = await ProjectsAPI.copyExperiment(
          projectId,
          experimentId,
          rewriteExperimentId
        );
        commit("MUTATION_CLEAN_EXPERIMENT");
        newExperimentId = data.id;
      } catch (e) {
        console.error("[ProjectModule.vuex].UPDATE_EXPERIMENT e:", e);
        return Promise.reject(e.response?.data?.message || e);
      }
      return Promise.resolve(newExperimentId);
    },

    PREDICT_DATA: async (
      // eslint-disable-next-line no-unused-vars
      { state, commit },
      {
        projectId,
        experimentId,
        columns,
        trainEndIndex,
        testEndIndex,
        neatSettings,
        predictionWindowSize,
        predictionPeriod
      }
    ) => {
      try {
        const { data } = await ProjectsAPI.predict(
          projectId,
          experimentId,
          columns,
          trainEndIndex,
          testEndIndex,
          neatSettings,
          predictionWindowSize,
          predictionPeriod
        );
        commit("MUTATION_UPDATE_EXPERIMENT", data);
      } catch (e) {
        console.error("[ProjectModule.vuex].UPDATE_EXPERIMENT e:", e);
        return Promise.reject(e.response?.data?.message || e);
      }
      return Promise.resolve(state.experiment);
    },

    NORMALIZE_DATA: async (
      { state, commit },
      { projectId, experimentId, normalizationMethod, enableLogTransform }
    ) => {
      try {
        const { data } = await ProjectsAPI.normalizeData(
          projectId,
          experimentId,
          normalizationMethod,
          enableLogTransform
        );
        commit("MUTATION_UPDATE_EXPERIMENT", data);
      } catch (e) {
        console.error("[ProjectModule.vuex].ATTACH_PROJECT_FILE e:", e);
        return Promise.reject(e.response?.data?.message || e);
      }
      return Promise.resolve(state.project);
    },

    SET_EXPERIMENT_DATA: ({ state, commit }, experiment) => {
      try {
        commit("MUTATION_UPDATE_EXPERIMENT", experiment);
      } catch (e) {
        console.error("[ProjectModule.vuex].SET_EXPERIMENT_DATA e:", e);
        return Promise.reject(e);
      }
      return Promise.resolve(state.project);
    }
  },
  modules: {}
};

export default ProjectModule;
