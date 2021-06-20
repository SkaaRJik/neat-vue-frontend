<template>
  <v-expansion-panels v-model="panel" multiple>
    <v-expansion-panel>
      <v-expansion-panel-header>
        {{ $t("Data_Normalization") }}
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-container>
          <v-row align="center" justify="center">
            <v-col cols="auto">
              <v-select
                :items="normalizationMethods"
                :label="$t('Normalization_Method')"
                v-model="normalizationMethod"
                class="ma-3"
              >
                <template v-slot:selection="{ item }">
                  <span>{{ $t(item) }}</span>
                </template>
                <template v-slot:item="{ item }">
                  <span>{{ $t(item) }}</span>
                </template>
              </v-select>
            </v-col>
            <v-col cols="auto">
              <v-switch
                :disabled="disableLogTransform"
                v-model="allowLogTransform"
                :label="$t('EnableLogTransform')"
              ></v-switch>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <div class="text-center">
                <v-btn :disabled="disabled" @click="normalize" class="ma-3">{{
                  $t("Normalize")
                }}</v-btn>
              </div>
            </v-col>
          </v-row>
          <v-row align="center" justify="center" v-if="chartData.length > 0">
            <v-col cols="12">
              <reactive-chart
                :data="chartData"
                :layout="chartLayout"
              ></reactive-chart>
            </v-col>
          </v-row>
        </v-container>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
import ReactiveChart from "../../charts/ReactiveChart";

export default {
  name: "DataNormalization",
  components: { ReactiveChart },
  props: {
    disableLogTransform: Boolean,
    projectId: Number,
    experiment: Object
  },
  data() {
    return {
      normalizationMethods: ["minMax"],
      normalizationMethod: "",
      chartData: [],
      panel: [0],
      chartLayout: {
        title: {
          text: this.$t("Chart_Distribution"),
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
          title: this.$t("Range")
        },
        yaxis: {
          title: this.$t("Spread_percent")
        }
      },
      allowLogTransform: false
    };
  },
  methods: {
    normalize: async function() {
      this.loading = true;

      try {
        await this.$store.dispatch("project/NORMALIZE_DATA", {
          experimentId: this.experiment.id,
          projectId: this.projectId,
          enableLogTransform: this.allowLogTransform,
          normalizationMethod: this.normalizationMethod
        });
        this.$toast.open({
          message: `${this.$t("Normalization_Started")}`,
          type: "success",
          position: "bottom-right",
          dismissible: true
        });
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
    initState(experiment) {
      this.normalizationMethod = experiment?.normalizationMethod || "";
      this.allowLogTransform = experiment?.enableLogTransform || false;
      if (experiment?.normalizationStatistic) {
        this.chartData = [
          {
            x: Object.keys(experiment.normalizationStatistic),
            y: Object.values(experiment.normalizationStatistic),
            type: "bar"
          }
        ];
      }
    }
  },
  created() {
    this.initState(this.experiment);
    if (
      !!this.experiment?.normalizationStatistic &&
      !this.experiment?.columns
    ) {
      this.panel = [0];
    } else if (!this.experiment?.normalizationStatistic) {
      this.panel = [0];
    } else {
      this.panel = [];
    }
  },
  computed: {
    disabled() {
      return !(this.experiment?.id && this.normalizationMethod);
    }
  },
  watch: {
    experiment(newValue) {
      this.initState(newValue);
    }
  }
};
</script>

<style scoped></style>
