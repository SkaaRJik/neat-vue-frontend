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
  }
};
