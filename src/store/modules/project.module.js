import ProjectsAPI from "@/services/api/ProjectsAPI";

const ProjectModule = {
  namespaced: true,
  state: {
    projectId: null,
    experimentId: null,
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
    experiment: null
  },
  mutations: {
    MUTATION_SET_PROJECT(state, project) {
      state.project = project;
    },
    MUTATION_SET_PROJECT_ID(state, projectId) {
      state.projectId = projectId;
    },
    MUTATION_SET_EXPERIMENT(state, experiment) {
      state.experiment = experiment;
    },
    MUTATION_SET_EXPERIMENT_ID(state, experimentId) {
      state.experimentId = experimentId;
    }
  },
  actions: {
    GET_PROJECT: async ({ state, commit }, projectId) => {
      console.log("[project.module].GET_PROJECT projectId:", projectId);
      if (state.projectId !== projectId) {
        try {
          const { data } = await ProjectsAPI.getProjectData(projectId);
          commit("MUTATION_SET_PROJECT_ID", projectId);
          commit("MUTATION_SET_PROJECT", data);
        } catch (e) {
          console.error("[ProjectModule.vuex].GET_PROJECT e:", e);
          return Promise.reject(e);
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
        if (state.experimentId !== experimentId) {
          const { data } = await ProjectsAPI.getExperiment({
            projectId,
            experimentId
          });
          commit("MUTATION_SET_EXPERIMENT_ID", experimentId);
          commit("MUTATION_SET_EXPERIMENT", data);
        }
        return Promise.resolve(state.experiment);
      } catch (e) {
        console.error("[project.module].GET_EXPERIMENT e:", e);
        return Promise.reject(e);
      }
    }
  },
  modules: {}
};

export default ProjectModule;
