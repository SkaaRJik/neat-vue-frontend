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

  parseExcelFile: file => {
    const formData = new FormData();
    formData.append("file", file, file.name);

    return Vue.axios.post(`${controllerPath}/parse`, formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
  },

  saveProject: projectDetails => {
    return Vue.axios.post(`${controllerPath}`, projectDetails);
  },

  getMyProjects: (page, itemsPerPage) => {
    return Vue.axios.get(`${controllerPath}`, {
      params: { page, itemsPerPage, projectBelongsTo: "my" }
    });
  },

  getProjectDetails: id => {
    return Vue.axios.get(`${controllerPath}/${id}`);
  },

  getProjectData: id => {
    return Vue.axios.get(`${controllerPath}/${id}/data`);
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
