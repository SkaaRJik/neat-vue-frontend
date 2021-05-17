<template>
  <div></div>
</template>

<script>
export default {
  name: "ExperimentPage",
  props: {
    projectId: Number,
    experimentId: Number
  },
  data() {
    return {
      loading: false,
      experimentInfo: {}
    };
  },
  methods: {
    configureProject() {
      this.$router.push({
        name: "experiment-config",
        params: { projectId: this.projectId, experimentId: this.experimentId }
      });
    },

    async loadExperimentInfo() {
      this.loading = true;

      try {
        const data = await this.$store.dispatch("project/GET_EXPERIMENT", {
          projectId: this.projectId,
          experimentId: this.experimentId
        });
        this.experimentInfo = data;
        console.log(
          "[ExperimentPage].loadExperimentInfo this.experimentInfo:",
          this.experimentInfo
        );
        // if (this.projectInfo.status === "NEW") {
        //   await this.$router.push({
        //     name: "project-configure",
        //     params: { id: this.projectId }
        //   });
        // }
      } catch (e) {
        console.log("[ExperimentPage].loadExperimentInfo e:", e);
      }
      this.loading = false;
    }
  },
  mounted() {
    this.loadExperimentInfo();
  },
  watch: {
    projectId: function() {
      this.loadExperimentInfo();
    }
  }
};
</script>

<style scoped></style>
