<template>
  <v-sheet>
    <v-app-bar dense>
      <v-toolbar-title>{{ $t("Project") }}: {{ projectName }}</v-toolbar-title>

      <v-spacer></v-spacer>
      <v-tooltip bottom v-if="isExperimentResultReady">
        <template
          v-slot:activator="// eslint-disable-next-line vue/no-unused-vars
          { on, attrs }"
        >
          <v-btn
            color="primary"
            elevation="2"
            fab
            x-small
            class="mx-1"
            @click="redirectToPredictionResultPage"
            ><v-icon>
              bar_chart
            </v-icon></v-btn
          >
        </template>
        <span>{{ $t("Configure_Experiment") }}</span>
      </v-tooltip>
    </v-app-bar>
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-text-field
            v-model="experimentName"
            :label="$t('Experiment_name')"
            :placeholder="$t('Experiment_name')"
          >
            <template v-slot:append-outer>
              <v-btn
                :disabled="canSaveExperimentName"
                class="mx-2"
                fab
                dark
                small
                color="primary"
                @click="saveExperimentName"
              >
                <v-icon dark>
                  mdi-content-save
                </v-icon>
              </v-btn>
            </template>
          </v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <DataNormalization
            :project-id="projectId"
            :experiment="experiment"
            :disable-log-transform="!canLogTransform"
          ></DataNormalization>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <DataSeparation
            v-model="separationIndexes"
            :experiment="experiment"
            :project-id="projectId"
            :legend="project.legend"
            :rows="project.rows"
          >
          </DataSeparation>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <ColumnsChooser v-model="headers"></ColumnsChooser>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <AiParams v-model="neatConfig"></AiParams>
        </v-col>
      </v-row>
      <v-row>
        <v-col sm="12" xs="12" md="6" lg="6" xl="6">
          <v-text-field
            :label="$t('Window_Size')"
            class="ma-3"
            v-model="windowSize"
            type="number"
            min="3"
            :max="maxWindowSize"
          ></v-text-field>
        </v-col>

        <v-col sm="12" xs="12" md="6" lg="6" xl="6">
          <v-text-field
            :label="$t('Prediction_Period')"
            class="ma-3"
            v-model="predictionPeriod"
            type="number"
            min="3"
            max="100"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" class="text-center">
          <v-btn
            @click="predict"
            color="primary"
            :disabled="isPredictionDisbaled"
            >{{ $t("Predict") }}</v-btn
          >
        </v-col>
      </v-row>
    </v-container>
  </v-sheet>
</template>

<script>
import DataNormalization from "@/components/project/configurator/DataNormalization";
import { mapState } from "vuex";
import DataSeparation from "@/components/project/configurator/DataSeparation";
import ColumnsChooser from "@/components/project/configurator/ColumnsChooser";
import AiParams from "@/components/project/configurator/AiParams";

export default {
  name: "ExperimentConfig",
  components: {
    AiParams,
    ColumnsChooser,
    DataSeparation,
    DataNormalization
  },
  props: {
    projectId: Number,
    experimentId: Number
  },
  data() {
    return {
      loading: false,
      experimentName: "",
      projectName: "",
      rows: 0,
      canLogTransform: false,
      separationIndexes: {
        trainEndIndex: null,
        testEndIndex: null
      },
      headers: [],
      neatConfig: null,
      windowSize: 3,
      predictionPeriod: 10
    };
  },
  methods: {
    async saveExperimentName() {
      try {
        await this.$store.dispatch("project/UPDATE_EXPERIMENT", {
          projectId: this.projectId,
          experimentId: this.experimentId,
          name: this.experimentName
        });
      } catch (e) {
        this.$toast.open({
          message: `${this.$t(e)}`,
          type: "error",
          position: "top-right",
          dismissible: true
        });
      }
    },

    async loadProjectInfo() {
      this.loading = true;
      try {
        const project = await this.$store.dispatch(
          "project/GET_PROJECT",
          this.projectId
        );
        this.projectName = project?.name;
        this.canLogTransform = project?.logIsAllowed;
        this.rows = project?.rows;
        this.initHeaders(project?.headers || []);

        const experiment = await this.$store.dispatch(
          "project/GET_EXPERIMENT",
          {
            projectId: this.projectId,
            experimentId: this.experimentId
          }
        );
        this.experimentName = experiment?.name;
      } catch (e) {
        this.$toast.open({
          message: `${this.$t(e)}`,
          type: "error",
          position: "top-right",
          dismissible: true
        });
      }
      this.loading = false;
    },

    async predict() {
      this.loading = true;

      try {
        let inputs = 0;
        let outputs = 0;
        this.headers?.forEach(column => {
          if (column.columnType === "Input") {
            inputs++;
          } else if (column.columnType === "Output") {
            outputs++;
          }
        });

        let nodeSection = this.neatConfig?.filter(
          section => section.header === "NODE.COUNTERS"
        )[0]?.params;

        nodeSection?.forEach(param => {
          if (param.name === "INPUT.NODES") {
            param.value = inputs;
          } else if (param.name === "OUTPUT.NODES") {
            param.value = outputs;
          }
        });

        await this.$store.dispatch("project/PREDICT_DATA", {
          experimentId: this.experiment.id,
          projectId: this.projectId,
          columns: this.headers,
          trainEndIndex: this.separationIndexes.trainEndIndex,
          testEndIndex: this.separationIndexes.testEndIndex,
          neatSettings: this.neatConfig,
          predictionWindowSize: this.windowSize,
          predictionPeriod: this.predictionPeriod
        });

        await this.redirectToPredictionResultPage();
      } catch (e) {
        this.$toast.open({
          message: `${this.$t(e)}`,
          type: "error",
          position: "top-right",
          dismissible: true
        });
      }

      this.loading = false;
    },

    initHeaders(headers) {
      this.headers = [];

      for (let i = 0; i < headers.length; i++) {
        this.headers.push({
          columnName: headers[i],
          columnType: i >= headers.length - 1 ? "Output" : "Input"
        });
      }
    },

    async redirectToPredictionResultPage() {
      await this.$router.push({
        name: "experiment-page",
        params: {
          projectId: this.projectId,
          experimentId: this.experimentId
        }
      });
    }
  },
  mounted() {
    this.loadProjectInfo();
  },
  created() {},
  computed: {
    maxWindowSize() {
      return this.rows - 3;
    },

    canSaveExperimentName() {
      return this.experiment?.name === this.experimentName;
    },
    isPredictionDisbaled() {
      return !(
        this.separationIndexes?.trainEndIndex &&
        this.separationIndexes?.testEndIndex &&
        this.headers?.length === this.project?.headers?.length &&
        this.neatConfig?.length > 0 &&
        this.predictionPeriod >= 3 &&
        this.predictionPeriod <= 100 &&
        this.windowSize >= 3 &&
        this.windowSize <= this.maxWindowSize &&
        !this.loading
      );
    },
    isExperimentResultReady() {
      return !!this.experiment?.experimentResult;
    },
    factorSigns() {
      return (
        this.experiment?.columns
          ?.filter(value => value.columnType === "Input")
          .map(value => {
            return value.columnName;
          }) || []
      );
    },
    targetIndicators() {
      return (
        this.experiment?.columns
          ?.filter(value => value.columnType === "Output")
          .map(value => {
            return value.columnName;
          }) || []
      );
    },
    ...mapState({
      experiment: state => state.project.experiment,
      project: state => state.project.project
    })
  },
  watch: {
    projectId: function() {
      this.loadProjectInfo();
    },
    experiment: function(newVal) {
      this.experimentName = newVal.name;
    },
    project: function(newVal) {
      this.canLogTransform = newVal.logIsAllowed;
      this.projectName = newVal.name;
      this.initHeaders(newVal?.headers || []);
    }
  }
};
</script>

<style scoped></style>
