<template>
  <div></div>
</template>

<script>
import ProjectsAPI from "@/services/api/ProjectsAPI";

export default {
  name: "ExperimentConfig",
  props: {
    projectId: Number,
    experimentId: Number
  },
  data() {
    return {
      loading: false,
      projectInfo: null
    };
  },
  methods: {
    configureProject() {
      this.$router.push({
        name: "project-configure",
        params: { id: this.projectId }
      });
    },

    async loadProjectInfo() {
      this.loading = true;
      const projectId = this.$route.params.id;
      console.log("[ExperimentPage].loadProjectInfo params:", projectId);
      try {
        const res = await ProjectsAPI.getProjectData(projectId);
        this.projectInfo = res.data;
        console.log(
          "[ExperimentPage].loadProjectInfo this.projectInfo:",
          this.projectInfo
        );
        // if (this.projectInfo.status === "NEW") {
        //   await this.$router.push({
        //     name: "project-configure",
        //     params: { id: this.projectId }
        //   });
        // }
      } catch (e) {
        console.log("[ProjectPageVue].loadProjectInfo e:", e);
      }
      this.loading = false;
    }
  },
  mounted() {
    this.loadProjectInfo();
  },
  watch: {
    projectId: function() {
      this.loadProjectInfo();
    }
  }
};
</script>

<style scoped></style>
