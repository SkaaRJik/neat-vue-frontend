<template>
  <div>
    <data-normalization
      :parsed-data="parsedData"
      :normalization-service-data="normalizationServiceData"
      v-model="columns"
    />
    <data-separation
      v-if="isDataSeparationAllowed"
      v-model="dataIndexes"
      :data-length="columns[0].data.length"
    />
    <columns-chooser
      v-model="columns"
      v-if="columns[0] && columns[0].data && columns[0].data.length > 0"
    >
    </columns-chooser>
  </div>
</template>

<script>
import ProjectsAPI from "@/services/api/ProjectsAPI";
import DataNormalization from "@/components/project/configurator/DataNormalization";
import DataSeparation from "@/components/project/configurator/DataSeparation";
import ColumnsChooser from "@/components/project/configurator/ColumnsChooser";

export default {
  name: "NEATConfiguration",
  components: {
    ColumnsChooser,
    DataNormalization,
    DataSeparation
  },
  props: {
    projectId: Number
  },
  data() {
    return {
      loading: false,
      parsedData: null,
      columns: [],
      normalizationServiceData: {},
      settings: null,
      dataIndexes: null,
      selectedColumns: null,
      windowSize: 3,
      predictionPeriod: 10
    };
  },
  methods: {
    async loadProjectData() {
      console.log("[NEATConfiguration].loadProjectData :");
      this.loading = true;
      try {
        const res = await ProjectsAPI.getProjectData(this.projectId);
        this.parsedData = res.data;
        console.log(
          "[ProjectConfiguration].loadProjectData this.parsedData:",
          this.parsedData
        );

        this.columns = this.parsedData.headers.map((value, index) => {
          return {
            data: [],
            // eslint-disable-next-line no-undef
            columnName: value,
            columnType:
              index <= this.parsedData.headers.length - 2 ? "Input" : "Output",
            minValue: 0,
            maxValue: 0
          };
        });
      } catch (e) {
        console.error("[ProjectConfiguration.vue].loadProjectData error:", e);
      } finally {
        this.loading = false;
      }
      /*if (!this.normalizedData.data && this.step !== 1) {
        return this.$router.replace({
          name: "project-configure",
          params: { id: this.$route.params.id },
          query: { step: 1 }
        });
      }*/
    }
  },
  mounted() {
    this.loadProjectData();
  },
  computed: {
    isDataSeparationAllowed() {
      return !!this.columns[0] && !!this.columns[0].data.length > 0;
    }
  },
  watch: {
    projectId: function(newVal) {
      if (newVal) {
        this.loadProjectData();
      }
    }
  }
};
</script>

<style scoped></style>
