<template>
  <v-card class="ma-6">
    <v-card-title>
      {{ $t("Data_Normalization") }}
    </v-card-title>
    <v-card-text>
      <v-container>
        <v-row align="center" justify="center">
          <v-col cols="12">
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
          <v-col sm="12" xs="12" md="6" lg="6" xl="6">
            <v-text-field
              v-model="minRange"
              :label="$t('Min')"
              min="0"
              max="0.9"
              step="0.1"
              class="ma-3"
              type="number"
            />
          </v-col>
          <v-col sm="12" xs="12" md="6" lg="6" xl="6">
            <v-text-field
              v-model="maxRange"
              :label="$t('Max')"
              min="0.1"
              max="1.0"
              step="0.1"
              class="ma-3"
              type="number"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <div class="text-center">
              <v-btn
                :disabled="!normalizationMethod"
                @click="normalize"
                class="ma-3"
                >{{ $t("Normalize") }}</v-btn
              >
            </div>
          </v-col>
        </v-row>
        <v-row align="center" justify="center">
          <v-col cols="12" v-if="chartData.length > 0">
            <v-expansion-panels v-model="panel" multiple>
              <v-expansion-panel>
                <v-expansion-panel-header>
                  {{ $t("Chart_Distribution") }}
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <reactive-chart
                    :data="chartData"
                    :layout="chartLayout"
                    uuid="NormalizationChart"
                  ></reactive-chart>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script>
import NormalizationMethodsContainer from "@/services/normalization/NormalizationMethods";
import ReactiveChart from "../../charts/ReactiveChart";

export default {
  name: "DataNormalization",
  components: { ReactiveChart },
  props: {
    parsedData: Object,
    normalizationServiceData: Object,
    value: {
      columnsData: Array,
      inputs: Number,
      outputs: Number
    }
  },
  data() {
    return {
      panel: [0],
      normalizationMethods: [],
      normalizationMethod: "",
      chartData: [],
      chartLayout: {
        xaxis: {
          title: this.$t("Range")
        },
        yaxis: {
          title: this.$t("Amount")
        }
      },
      minRange: 0.3,
      maxRange: 0.7
    };
  },
  methods: {
    normalize: async function() {
      if (!this.parsedData) return [];
      if (!this.parsedData.data) return [];
      if (!this.parsedData.data[0]) return [];

      this.minRange = Number(this.minRange);
      this.maxRange = Number(this.maxRange);

      try {
        const data = await NormalizationMethodsContainer[
          this.normalizationMethod
        ](this.parsedData, this.minRange, this.maxRange);

        console.log("[DataNormalization].normalize data:", data);

        Object.keys(data.normalizationServiceData).forEach(key => {
          this.normalizationServiceData[key] =
            data.normalizationServiceData[key];
        });

        this.value.columnsData = data.columns;
        this.$emit("input", this.value);
        const chartLabels = [];

        const chartXInterval = (this.maxRange - this.minRange) / 10;

        for (
          let i = this.minRange;
          i < this.maxRange - chartXInterval;
          i += chartXInterval
        ) {
          chartLabels.push(
            `[${i.toFixed(3)}, ${(i + chartXInterval).toFixed(3)})`
          );
        }
        chartLabels.push(
          `[${(this.maxRange - chartXInterval).toFixed(3)}, ${this.maxRange}]`
        );
        chartLabels.push(`${this.minRange} < || > ${this.maxRange}`);

        this.chartData = [
          {
            x: chartLabels,
            y: data.statistic,
            type: "bar"
          }
        ];
      } catch (e) {
        console.error("[DataNormalizationVue].normalize error:", e);
      }
    }
  },
  mounted() {
    this.normalizationMethods = Object.keys(NormalizationMethodsContainer);
    this.normalizationMethod = this.normalizationMethods[0];
  }
};
</script>

<style scoped></style>
