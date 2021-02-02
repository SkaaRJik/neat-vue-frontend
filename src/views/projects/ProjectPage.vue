<template>
  <div></div>
</template>

<script>
import ProjectsAPI from "@/services/api/ProjectsAPI";

export default {
  name: "ProjectPage",
  props: { projectId: String },
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
      console.log("[ProjectPageVue].loadProjectInfo params:", projectId);
      try {
        const res = await ProjectsAPI.getProjectDetails(projectId);
        this.projectInfo = res.data;
        if (this.projectInfo.status === "NEW") {
          await this.$router.push({
            name: "project-configure",
            params: { id: this.projectId }
          });
        }
      } catch (e) {
        console.log("[ProjectPageVue].loadProjectInfo e:", e);
      }
      this.loading = false;
      this.generateRandomCharts();
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
