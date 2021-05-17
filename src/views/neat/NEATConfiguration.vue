<template>
  <page-loading v-if="loading"></page-loading>
  <v-stepper :alt-labels="true" v-model="step" v-else>
    <v-stepper-header>
      <v-stepper-step :complete="step > 1" step="1">{{
        $t("Data_Normalization")
      }}</v-stepper-step>

      <v-divider></v-divider>

      <v-stepper-step :complete="step > 2" step="2">{{
        $t("Data_Separation")
      }}</v-stepper-step>

      <v-divider></v-divider>

      <v-stepper-step :complete="step > 3" step="3">{{
        $t("Choose_Params")
      }}</v-stepper-step>

      <v-divider></v-divider>

      <v-stepper-step :complete="step > 4" step="4">{{
        $t("AI_Config")
      }}</v-stepper-step>

      <v-divider></v-divider>

      <v-stepper-step :complete="step > 5" step="5">{{
        $t("Prediction_Params")
      }}</v-stepper-step>
    </v-stepper-header>

    <v-stepper-items>
      <v-stepper-content step="1">
        <v-container>
          <data-normalization
            :parsed-data="parsedData"
            :normalization-service-data="normalizationServiceData"
            v-model="columns"
          />
          <v-row>
            <v-col class="mr-auto" cols="auto" xs="12">
              <v-btn @click="redirectToProjectsPage" class="ma-3" text
                >{{ $t("Cancel") }}
              </v-btn>
            </v-col>
            <v-col cols="auto" xs="12">
              <v-btn
                :disabled="!isDataSeparationAllowed"
                @click="goToStep(2)"
                class="ma-3"
                color="primary"
              >
                {{ $t("Continue") }}
                <v-icon> mdi-arrow-right</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-stepper-content>

      <v-stepper-content step="2">
        <v-container>
          <data-separation
            v-if="isDataSeparationAllowed"
            v-model="dataIndexes"
            :data-length="columns.columnsData[0].data.length"
          />
          <v-row>
            <v-col class="mr-auto" cols="auto" xs="12">
              <v-btn @click="redirectToProjectsPage" class="ma-3" text
                >{{ $t("Cancel") }}
              </v-btn>
            </v-col>
            <v-col cols="auto" xs="12">
              <v-card-actions>
                <v-btn @click="back" class="ma-3">
                  <v-icon left> mdi-arrow-left</v-icon>
                  {{ $t("Back") }}
                </v-btn>
                <v-btn
                  @click="goToStep(3)"
                  :disabled="!isColumnChooserAllowed"
                  class="ma-3"
                  color="primary"
                >
                  {{ $t("Continue") }}
                  <v-icon> mdi-arrow-right</v-icon>
                </v-btn>
              </v-card-actions>
            </v-col>
          </v-row>
        </v-container>
      </v-stepper-content>

      <v-stepper-content step="3">
        <v-container>
          <columns-chooser v-model="columns" v-if="isColumnChooserAllowed">
          </columns-chooser>
          <v-row>
            <v-col class="mr-auto" cols="auto" xs="12">
              <v-btn @click="redirectToProjectsPage" class="ma-3" text
                >{{ $t("Cancel") }}
              </v-btn>
            </v-col>
            <v-col cols="auto" xs="12">
              <v-card-actions>
                <v-btn @click="back" class="ma-3">
                  <v-icon left> mdi-arrow-left</v-icon>
                  {{ $t("Back") }}
                </v-btn>
                <v-btn
                  @click="goToStep(4)"
                  :disabled="!isAiParamsChooseAllowed"
                  class="ma-3"
                  color="primary"
                >
                  {{ $t("Continue") }}
                  <v-icon> mdi-arrow-right</v-icon>
                </v-btn>
              </v-card-actions>
            </v-col>
          </v-row>
        </v-container>
      </v-stepper-content>

      <v-stepper-content step="4">
        <v-container>
          <ai-params
            v-model="settings"
            :inputs="columns.inputs"
            :outputs="columns.outputs"
            v-if="isAiParamsChooseAllowed"
          >
          </ai-params>
          <v-row>
            <v-col class="mr-auto" cols="auto" xs="12">
              <v-btn @click="redirectToProjectsPage" class="ma-3" text
                >{{ $t("Cancel") }}
              </v-btn>
            </v-col>
            <v-col cols="auto" xs="12">
              <v-card-actions>
                <v-btn @click="back" class="ma-3">
                  <v-icon left> mdi-arrow-left</v-icon>
                  {{ $t("Back") }}
                </v-btn>
                <v-btn
                  :disabled="!settings"
                  class="ma-3"
                  color="primary"
                  @click="goToStep(5)"
                >
                  {{ $t("Continue") }}
                  <v-icon> mdi-arrow-right</v-icon>
                </v-btn>
              </v-card-actions>
            </v-col>
          </v-row>
        </v-container>
      </v-stepper-content>

      <v-stepper-content step="5">
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-row align="center" justify="center">
                <v-text-field
                  :label="$t('Window_Size')"
                  class="ma-3"
                  v-model="windowSize"
                ></v-text-field>

                <v-text-field
                  :label="$t('Prediction_Period')"
                  class="ma-3"
                  v-model="predictionPeriod"
                ></v-text-field>
              </v-row>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="mr-auto" cols="auto" xs="12">
              <v-btn @click="redirectToProjectsPage" class="ma-3" text
                >{{ $t("Cancel") }}
              </v-btn>
            </v-col>
            <v-col cols="auto" xs="12">
              <v-card-actions>
                <v-btn @click="back" class="ma-3">
                  <v-icon left> mdi-arrow-left</v-icon>
                  {{ $t("Back") }}
                </v-btn>
                <v-btn
                  :disabled="!settings"
                  class="ma-3"
                  color="primary"
                  @click="saveConfig"
                >
                  {{ $t("Continue") }}
                  <v-icon> mdi-arrow-right</v-icon>
                </v-btn>
              </v-card-actions>
            </v-col>
          </v-row>
        </v-container>
      </v-stepper-content>
    </v-stepper-items>
  </v-stepper>
</template>

<script>
import ProjectsAPI from "@/services/api/ProjectsAPI";
import DataNormalization from "@/components/project/configurator/DataNormalization";
import DataSeparation from "@/components/project/configurator/DataSeparation";
import ColumnsChooser from "@/components/project/configurator/ColumnsChooser";
import AiParams from "@/components/project/configurator/AiParams";
import PageLoading from "@/views/loading/PageLoading";

export default {
  name: "NEATConfiguration",
  components: {
    AiParams,
    ColumnsChooser,
    DataNormalization,
    DataSeparation,
    PageLoading
  },
  props: {
    projectId: Number,
    step: Number
  },
  data() {
    return {
      loading: false,
      parsedData: null,
      columns: { inputs: 0, outputs: 0, columnsData: [] },
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

        this.columns = {
          ...this.columns,
          columnsData: this.parsedData.headers.map((value, index) => {
            return {
              data: [],
              // eslint-disable-next-line no-undef
              columnName: value,
              columnType:
                index <= this.parsedData.headers.length - 2
                  ? "Input"
                  : "Output",
              minValue: 0,
              maxValue: 0
            };
          })
        };
      } catch (e) {
        console.error("[ProjectConfiguration.vue].loadProjectData error:", e);
      } finally {
        this.loading = false;
      }
      if (!(this.columns.columnsData.length === 0 && this.step === 1)) {
        return this.$router.replace({
          name: "project-configure",
          params: { id: this.$route.params.id },
          query: { step: 1 }
        });
      }
    },
    async saveConfig() {
      const config = {
        normalizedData: {
          normalizationServiceData: this.normalizationServiceData,
          columns: this.columns.columnsData,
          trainEndIndex: this.dataIndexes.trainEndIndex,
          testEndIndex: this.dataIndexes.testEndIndex
        },
        settings: this.settings,
        windowSize: this.windowSize,
        predictionPeriod: this.predictionPeriod
      };
      console.log("[NEATConfiguration].saveConfig config:", config);
      try {
        await ProjectsAPI.saveProjectConfiguration(this.projectId, config);
        this.$router.push({ name: "projects" });
      } catch (e) {
        console.error("[ProjectConfiguration].saveConfig e:", e);
      }
    },
    redirectToProjectsPage() {
      this.$router.push({ name: "projects" });
    },
    goToStep(step) {
      this.$router.replace({
        name: "project-configure",
        query: { step },
        params: { id: this.projectId }
      });
      window.scrollTo(0, 0);
    },
    back() {
      this.$router.replace({
        name: "project-configure",
        query: { step: this.step - 1 },
        params: { id: this.projectId }
      });
      window.scrollTo(0, 0);
    },
    onNewErrors(isErrorCaught) {
      console.log(
        "[NEATConfiguration].onNetworkParamsChange networkNodes:",
        isErrorCaught
      );
      this.networkParamsError = isErrorCaught;
    }
  },
  mounted() {
    this.loadProjectData();
  },
  computed: {
    isDataSeparationAllowed() {
      return this.columns?.columnsData[0]?.data?.length > 0;
    },
    isColumnChooserAllowed() {
      return this.dataIndexes?.trainEndIndex && this.dataIndexes?.testEndIndex;
    },
    isAiParamsChooseAllowed() {
      return this.columns?.inputs > 0 && this.columns?.outputs > 0;
    }
  },
  watch: {
    projectId: function(newVal) {
      if (newVal) {
        this.loadProjectData();
      }
    },
    step: function(newVal, oldVal) {
      if (newVal === oldVal) {
        return;
      }

      if (!newVal) {
        return this.$router.replace({
          name: "project-configure",
          query: { step: 1 },
          params: { id: this.projectId }
        });
      }

      if (newVal === 2) {
        if (!this.isDataSeparationAllowed) {
          return this.$router.replace({
            name: "project-configure",
            params: { id: this.$route.params.id },
            query: { step: 1 }
          });
        }
      }

      if (newVal === 3) {
        if (!this.isColumnChooserAllowed) {
          return this.$router.replace({
            name: "project-configure",
            params: { id: this.$route.params.id },
            query: { step: 2 }
          });
        }
      }

      if (newVal === 4) {
        if (!this.isAiParamsChooseAllowed) {
          return this.$router.replace({
            name: "project-configure",
            params: { id: this.$route.params.id },
            query: { step: 3 }
          });
        }
      }

      if (newVal === 5) {
        if (!this.settings) {
          return this.$router.replace({
            name: "project-configure",
            params: { id: this.$route.params.id },
            query: { step: 4 }
          });
        }
      }
    }
  }
};
</script>

<style scoped></style>
