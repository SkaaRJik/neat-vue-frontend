import Vue from "vue";

const controllerPath = "/api/projects";
export default {
  getSharedWithMeProjects: (page, itemsPerPage) => {
    /*return Vue.axios.get(`${controllerPath}`, {
      params: { page, itemsPerPage, projectBelongsTo: "shared" }
    });*/
    return Vue.axios.get(`/api/trainer/default-config`, {
      params: { page, itemsPerPage, projectBelongsTo: "shared" }
    });
  },

  saveProject: ({ projectName, file }) => {
    const formData = new FormData();
    formData.append("projectName", projectName);
    formData.append("file", file);

    const headers = {
      "Content-Type": "multipart/form-data"
    };

    return Vue.axios.post(`${controllerPath}`, formData, headers);
  },

  attachSourceFile: ({ projectId, file }) => {
    const formData = new FormData();
    formData.append("file", file);
    return Vue.axios.post(`${controllerPath}/${projectId}/attach`, formData);
  },

  createExperiment: ({ projectId }) => {
    return Vue.axios.post(`${controllerPath}/${projectId}/experiment`);
  },

  getExperiment: ({ projectId, experimentId }) => {
    return Vue.axios.get(
      `${controllerPath}/${projectId}/experiment/${experimentId}`
    );
  },

  getMyProjects: (page, itemsPerPage) => {
    return Vue.axios.get(`${controllerPath}`, {
      params: { page, itemsPerPage, projectBelongsTo: "my" }
    });
  },

  getProjectData: id => {
    return Vue.axios.get(`${controllerPath}/${id}`);
  },

  findProject: params => {
    console.log("[ProjectsAPI.js].findProject query:", params);
    return Vue.axios.get(`${controllerPath}/find`, {
      params
    });
  },

  saveProjectConfiguration(projectId, config) {
    return Vue.axios.put(`${controllerPath}/${projectId}/config`, config);
  },

  normalizeData(
    projectId,
    experimentId,
    normalizationMethod,
    enableLogTransform
  ) {
    const body = {
      normalizationMethod,
      enableLogTransform
    };
    return Vue.axios.post(
      `${controllerPath}/${projectId}/experiment/${experimentId}/normalize`,
      body
    );
  },

  updateExperiment(projectId, experimentId, name) {
    const body = {
      name
    };

    return Vue.axios.put(
      `${controllerPath}/${projectId}/experiment/${experimentId}`,
      body
    );
  },

  predict(
    projectId,
    experimentId,
    columns,
    trainEndIndex,
    testEndIndex,
    neatSettings,
    predictionWindowSize,
    predictionPeriod
  ) {
    const body = {
      columns,
      trainEndIndex,
      testEndIndex,
      neatSettings,
      predictionWindowSize,
      predictionPeriod
    };

    return Vue.axios.post(
      `${controllerPath}/${projectId}/experiment/${experimentId}/predict`,
      body
    );
  },

  copyExperiment(project_id, experiment_id, rewrite_experiment_id) {
    if (rewrite_experiment_id) {
      return Vue.axios.post(
        `${controllerPath}/${project_id}/experiment/${experiment_id}/copy/${rewrite_experiment_id}`
      );
    } else {
      return Vue.axios.post(
        `${controllerPath}/${project_id}/experiment/${experiment_id}/copy`
      );
    }
  },

  downloadReportFile(project_id, experiment_id) {
    return Vue.axios.post(
      `${controllerPath}/${project_id}/experiment/${experiment_id}/download_report`,
      null,
      { responseType: "blob" }
    );
  }
};
