<template>
  <v-expansion-panels v-model="panel" multiple>
    <v-expansion-panel>
      <v-expansion-panel-header>
        {{ $t("Data_Separation") }}
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-container>
          <v-row align="center" justify="center">
            <v-col sm="12" xs="12" md="6" lg="6" xl="6">
              <v-text-field
                v-model="trainPercentage"
                @change="testPercentage = 100 - trainPercentage"
                min="1"
                max="99"
                :label="$t('Train_Percentage')"
                suffix="%"
                class="ma-3"
                type="number"
              />
            </v-col>
            <v-col sm="12" xs="12" md="6" lg="6" xl="6">
              <v-text-field
                v-model="testPercentage"
                :label="$t('Test_Percentage')"
                class="ma-3"
                type="number"
                suffix="%"
                min="1"
                max="99"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" class="text-center">
              <v-btn @click="calculatePercentage">{{ $t("Submit") }}</v-btn>
            </v-col>
          </v-row>
          <v-row
            align="center"
            justify="center"
            v-if="!!trainEndIndex && !!testEndIndex"
          >
            <v-col cols="auto">
              <span
                >{{ $t("Train_Elements", { elements: trainLegend }) }}
                {{ legend.header }}</span
              >
            </v-col>
            <v-col cols="auto">
              <span
                >{{ $t("Test_Elements", { elements: testLegend }) }}
                {{ legend.header }}</span
              >
            </v-col>
            <v-col cols="auto">
              <span>{{
                $t("Total", {
                  elements: rows
                })
              }}</span>
            </v-col>
          </v-row>
        </v-container>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
export default {
  name: "DataSeparation",
  props: {
    projectId: Number,
    experiment: Object,
    rows: Number,
    legend: Object,
    value: Object
  },
  data: () => {
    return {
      trainPercentage: 70,
      testPercentage: 30,
      trainEndIndex: null,
      testEndIndex: null,
      trainLegend: "",
      testLegend: "",
      panel: [0]
    };
  },
  created() {
    this.setPercentage(
      this.experiment?.trainEndIndex,
      this.experiment?.testEndIndex
    );
  },
  methods: {
    setPercentage(trainEndIndex, testEndIndex) {
      if (trainEndIndex && testEndIndex) {
        this.trainEndIndex = trainEndIndex;
        this.testEndIndex = testEndIndex;

        this.trainPercentage = Math.round((trainEndIndex / this.rows) * 100);
        this.testPercentage = Math.round(
          ((testEndIndex - trainEndIndex) / this.rows) * 100
        );

        const newValue = {
          trainEndIndex,
          testEndIndex
        };

        this.trainLegend = `${this.legend?.data[0]} - ${
          this.legend?.data[testEndIndex - 1]
        }`;

        this.testLegend = `${this.legend?.data[trainEndIndex]} - ${
          this.legend?.data[testEndIndex - 1]
        }`;

        this.$emit("input", newValue);
      }
    },

    calculatePercentage() {
      this.trainPercentage = Number(this.trainPercentage);
      this.testPercentage = Number(this.testPercentage);

      if (this.trainPercentage + this.testPercentage > 100) {
        this.$toast.open({
          message: `${this.$t("ERROR_SUM_OF_PERCENTAGE_GREATER_100")}`,
          type: "error",
          position: "bottom-right",
          duration: 5000
        });
      }
      if (this.trainPercentage + this.testPercentage <= 0) {
        this.$toast.open({
          message: `${this.$t("ERROR_SUM_OF_PERCENTAGE_LESS_OR_EQUAL_0")}`,
          type: "error",
          position: "bottom-right",
          duration: 5000
        });
      }

      this.trainEndIndex = Math.round(this.rows * (this.trainPercentage / 100));
      this.testEndIndex = Math.floor(this.rows * (this.testPercentage / 100));
      const newValue = {
        trainEndIndex: this.trainEndIndex,
        testEndIndex: this.trainEndIndex + this.testEndIndex
      };

      this.trainLegend = `${this.legend?.data[0]} - ${
        this.legend?.data[newValue.trainEndIndex - 1]
      }`;
      this.testLegend = `${this.legend?.data[newValue.trainEndIndex]} - ${
        this.legend?.data[newValue.testEndIndex - 1]
      }`;

      this.$emit("input", newValue);
    }
  },
  watch: {
    experiment(newVal, oldVal) {
      if (
        newVal.trainEndIndex !== oldVal.trainEndIndex &&
        newVal.testEndIndex !== oldVal.testEndIndex
      ) {
        this.setPercentage(newVal.trainEndIndex, newVal.testEndIndex);
      }
    }
  }
};
</script>

<style scoped></style>
