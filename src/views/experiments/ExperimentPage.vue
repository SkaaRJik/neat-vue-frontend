<template>
  <v-sheet>
    <v-app-bar dense>
      <v-toolbar-title
        >{{ $t("Experiment") }}: {{ experiment.name }}</v-toolbar-title
      >

      <v-spacer></v-spacer>
      <v-tooltip bottom>
        <template
          v-slot:activator="// eslint-disable-next-line vue/no-unused-vars
          { on, attrs }"
        >
          <v-btn
            color="black"
            elevation="2"
            icon
            small
            class="mx-1"
            @click="redirectToConfigurateExperiment"
            ><v-icon dark>
              settings
            </v-icon></v-btn
          >
        </template>
        <span>{{ $t("Configure_Experiment") }}</span>
      </v-tooltip>
      <v-tooltip bottom>
        <template
          v-slot:activator="// eslint-disable-next-line vue/no-unused-vars
          { on, attrs }"
        >
          <v-btn
            color="black"
            elevation="2"
            icon
            small
            class="mx-1"
            @click="copyAndConfigurateExperiment"
            ><v-icon dark>
              mdi-content-copy
            </v-icon></v-btn
          >
        </template>
        <span>{{ $t("Copy_Configure_Experiment") }}</span>
      </v-tooltip>
      <v-tooltip bottom>
        <template
          v-slot:activator="// eslint-disable-next-line vue/no-unused-vars
          { on, attrs }"
        >
          <v-btn
            color="black"
            elevation="2"
            icon
            small
            class="mx-1"
            @click="downloadReport"
            ><v-icon dark>
              mdi-file-chart
            </v-icon></v-btn
          >
        </template>
        <span>{{ $t("Download_Report") }}</span>
      </v-tooltip>
    </v-app-bar>
    <v-container>
      <template v-if="shouldRenderResults">
        <v-row>
          <v-col cols="12" class="text-center">
            <h2>{{ $t("Predicted") }}</h2>
          </v-col>
        </v-row>
        <v-row align="center" justify="center">
          <v-col cols="auto">
            {{ $t("Train_Error") }}:
            {{
              experiment.experimentResult.trainErrors[
                experiment.experimentResult.trainErrors.length - 1
              ]
            }}
          </v-col>
          <v-col cols="auto">
            {{ $t("Test_Error") }}:
            {{
              experiment.experimentResult.testErrors[
                experiment.experimentResult.testErrors.length - 1
              ]
            }}
          </v-col>
          <v-col cols="auto">
            {{ $t("Prediction_Error") }}:
            {{ experiment.experimentResult.predictionError }}
          </v-col>
        </v-row>
        <v-row>
          <template v-for="(item, i) in predictionCharts">
            <v-col cols="12" :key="i">
              <ReactiveChart
                :data="item.data"
                :layout="item.layout"
              ></ReactiveChart>
            </v-col>
            <v-col cols="12" :key="`expansion-${i}`">
              <v-expansion-panels>
                <v-expansion-panel>
                  <v-expansion-panel-header>
                    {{ $t("Data") }}
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <v-data-table
                      :sort-by.sync="sortBy"
                      :sort-desc.sync="descSort"
                      :headers="predictionHeaders"
                      :items="item.predictionData"
                      item-key="legend"
                      class="elevation-1"
                    >
                    </v-data-table>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-col>
          </template>
        </v-row>
      </template>
      <v-row v-if="experiment.experimentResult">
        <v-col cols="12">
          <v-expansion-panels>
            <v-expansion-panel>
              <v-expansion-panel-header>
                {{ $t("Network") }}
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <NetworkChart v-model="experiment.experimentResult.model">
                </NetworkChart>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" class="text-center">
          <h2>{{ $t("Train_info") }}</h2>
        </v-col>
      </v-row>
      <v-row>
        <v-col xs="12" sm="12" md="6" lg="6" xl="6">
          <div class="v-text-field--full-width">
            <ReactiveChart
              v-if="trainChart.data.length > 0"
              :data="trainChart.data"
              :layout="trainChart.chartLayout"
            >
            </ReactiveChart>
          </div>
        </v-col>
        <v-col xs="12" sm="12" md="6" lg="6" xl="6">
          <div class="v-text-field--full-width">
            <ReactiveChart
              v-if="testChart.data.length > 0"
              :data="testChart.data"
              :layout="testChart.chartLayout"
            >
            </ReactiveChart>
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" class="text-center my-2">
          <h2>{{ $t("Target_sign_train_info") }}</h2>
        </v-col>
        <v-col cols="12">
          <v-data-table
            :headers="headers"
            :items="windowTrainStatistic"
            hide-default-footer
            item-key="name"
            class="elevation-1"
            :items-per-page="windowTrainStatistic.length"
          >
          </v-data-table>
        </v-col>
      </v-row>
    </v-container>
  </v-sheet>
</template>

<script>
import ReactiveChart from "@/components/charts/ReactiveChart";
import NetworkChart from "@/components/charts/NetworkChart";
import ProjectsAPI from "@/services/api/ProjectsAPI";
export default {
  name: "ExperimentPage",
  components: { NetworkChart, ReactiveChart },
  props: {
    projectId: Number,
    experimentId: Number
  },
  data() {
    return {
      loading: false,
      descSort: true,
      sortBy: "legend",
      predictionHeaders: [],
      predictionData: [],
      experiment: {
        id: null,
        enableLogTransform: false,
        neatSettings: [],
        normalizationMethod: "",
        normalizationStatistic: {},
        predictionPeriod: 0,
        predictionWindowSize: 0,
        testEndIndex: 0,
        trainEndIndex: 0,
        experimentResult: null
      },
      headers: [
        {
          text: this.$t("Target_sign"),
          align: "start",
          value: "name",
          sortable: false
        },
        {
          text: this.$t("Train_Error"),
          value: "trainError",
          sortable: false
        },
        {
          text: this.$t("Test_Error"),
          value: "testError",
          sortable: false
        }
      ],
      windowTrainStatistic: [],
      epochs: [],
      predictionCharts: [],
      testChart: {
        data: [],
        chartLayout: {
          title: {
            text: this.$t("Test_Error"),
            font: {
              family: "Roboto, monospace",
              size: 24
            },
            xref: "paper",
            x: 0.5,
            xanchor: "center",
            y: 0.98,
            yanchor: "top"
          },
          xaxis: {
            title: this.$t("Epoch")
          },
          yaxis: {
            title: this.$t("Error")
          }
        }
      },
      trainChart: {
        data: [],
        chartLayout: {
          title: {
            text: this.$t("Train_Error"),
            font: {
              family: "Roboto, monospace",
              size: 24
            },
            xref: "paper",
            x: 0.5,
            xanchor: "center",
            y: 0.98,
            yanchor: "top"
          },
          xaxis: {
            title: this.$t("Epoch")
          },
          yaxis: {
            title: this.$t("Error")
          }
        }
      }
    };
  },
  methods: {
    async loadExperimentInfo() {
      this.loading = true;

      try {
        const data = await this.$store.dispatch("project/GET_EXPERIMENT", {
          projectId: this.projectId,
          experimentId: this.experimentId
        });
        this.experiment = data;
        if (this.experiment.experimentResult === null) {
          await this.$router.push({
            name: "experiment-config",
            params: {
              projectId: this.projectId,
              experimentId: this.experimentId
            }
          });
        }
      } catch (e) {
        this.$toast.open({
          message: `${this.$t(e)}`,
          type: "error",
          position: "top-right",
          dismissible: true
        });
      }

      try {
        this.initChartsAndTablesData(this.experiment?.experimentResult);
      } catch (e) {
        console.error(e);
      }

      this.loading = false;
    },

    initEpochs(totalEpochs) {
      if (this.epochs.length != totalEpochs) {
        const epochs = [];
        for (let i = 0; i < totalEpochs; i++) {
          epochs.push(i + 1);
        }
        this.epochs = epochs;
      }
    },

    setWindowTrainStatistic(trainStatistic) {
      this.windowTrainStatistic = trainStatistic?.map(sign => ({
        name: sign.name,
        trainError: sign.trainError,
        testError: sign.testError
      }));
    },

    setTestErrorChartData(testErrors) {
      this.initEpochs(testErrors.length);
      const chartData = [
        {
          x: this.epochs,
          y: testErrors,
          type: "scatter"
        }
      ];

      this.testChart = {
        data: chartData,
        chartLayout: this.testChart.chartLayout
      };
    },

    setTrainErrorChartData(trainErrors) {
      this.initEpochs(trainErrors.length);
      const chartData = [
        {
          x: this.epochs,
          y: trainErrors,
          type: "scatter"
        }
      ];

      this.trainChart = {
        data: chartData,
        chartLayout: this.trainChart.chartLayout
      };
    },

    setPredictionChartsData(predictionResult) {
      if (!predictionResult) {
        return;
      }

      this.predictionHeaders = [
        {
          text: predictionResult?.legend_label,
          align: "start",
          value: "legend"
        },
        {
          text: this.$t("Fact"),
          value: "fact",
          sortable: false
        },
        {
          text: this.$t("Predicted"),
          value: "predicted",
          sortable: false
        },

        this.$t("Fact"),
        this.$t("Predicted")
      ];

      const charts = [];

      console.log(
        "[ExperimentPage].setPredictionChartsData predictionResult:",
        predictionResult
      );

      predictionResult?.values?.forEach(target => {
        const predictionData = [];
        for (let i = 0; i < predictionResult.legend?.length; i++) {
          const fact = target?.fact_values[i] || NaN;
          const predict = target?.predicted_values[i] || NaN;

          predictionData.push({
            legend: predictionResult.legend[i],
            fact: fact,
            predicted: predict
          });
        }

        const chartData = [
          {
            x: predictionResult?.legend || [],
            y: target.fact_values || [],
            name: this.$t("Fact"),
            type: "scatter"
          },
          {
            x: predictionResult?.legend || [],
            y: target.predicted_values || [],
            name: this.$t("Predicted"),
            type: "scatter"
          }
        ];

        const chartLayout = {
          title: {
            text: target.name,
            font: {
              family: "Roboto, monospace",
              size: 24
            },
            xref: "paper",
            x: 0.5,
            xanchor: "center",
            y: 0.98,
            yanchor: "top"
          },
          xaxis: {
            title: predictionResult?.legend_label || ""
          },
          yaxis: {
            title: this.$t("Values")
          }
        };
        charts.push({
          name: target.name,
          predictionData: predictionData,
          data: chartData,
          layout: chartLayout
        });
      });
      this.predictionCharts = charts;
    },

    initChartsAndTablesData(experimentResult) {
      this.setTestErrorChartData(experimentResult?.testErrors || []);
      this.setTrainErrorChartData(experimentResult?.trainErrors || []);
      this.setWindowTrainStatistic(
        experimentResult?.windowTrainStatistic?.factorSigns || []
      );
      this.setPredictionChartsData(experimentResult?.predictionResult);
    },

    async redirectToConfigurateExperiment() {
      await this.$router.push({
        name: "experiment-config",
        params: {
          projectId: this.projectId,
          experimentId: this.experimentId
        }
      });
    },

    async copyAndConfigurateExperiment() {
      try {
        const newExperimentId = await this.$store.dispatch(
          "project/COPY_EXPERIMENT",
          {
            projectId: this.projectId,
            experimentId: this.experimentId
          }
        );
        await this.$router.push({
          name: "experiment-config",
          params: {
            projectId: this.projectId,
            experimentId: newExperimentId
          }
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

    async downloadReport() {
      const res = await ProjectsAPI.downloadReportFile(
        this.projectId,
        this.experimentId
      );
      console.log("[ExperimentPage].downloadReport res:", res);
      const downloadFile = (blob, fileName) => {
        /*const link = document.createElement('a');
        // create a blobURI pointing to our Blob
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        // some browser needs the anchor to be in the doc
        document.body.append(link);
        link.click();
        link.remove();
        // in case the Blob uses a lot of memory
        setTimeout(() => URL.revokeObjectURL(link.href), 7000);*/

        const link = document.createElement("a");
        link.style.display = "none";
        link.download = fileName;
        link.href = window.URL.createObjectURL(blob);
        link.click();
      };

      downloadFile(
        new Blob([res.data], { type: res.headers["content-type"] }),
        "report.xlsx"
      );
    }
  },
  computed: {
    shouldRenderResults() {
      return !!this.experiment?.experimentResult?.predictionResult;
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
