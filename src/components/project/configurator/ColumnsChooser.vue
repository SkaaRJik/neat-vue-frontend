<template>
  <v-expansion-panels v-model="panel" multiple>
    <v-expansion-panel>
      <v-expansion-panel-header>
        {{ $t("Choose_Params") }}
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-container>
          <v-row align="center" justify="space-between">
            <template v-for="(item, index) in value">
              <v-col
                sm="12"
                xs="12"
                md="8"
                lg="8"
                xl="8"
                :key="`header-name-${index}`"
              >
                {{ item.columnName }}
              </v-col>
              <v-col
                sm="12"
                xs="12"
                md="4"
                lg="4"
                xl="4"
                :key="`header-type-${index}`"
              >
                <v-select
                  :value="item.columnType"
                  :items="nodeTypes"
                  :label="$t('Type_Node')"
                  @change="handleDataType(item, index, $event)"
                  dense
                  outlined
                  :append-icon="
                    outputs == 0 || inputs == 0 ? 'mdi-alert' : 'mdi-menu-down'
                  "
                  :error="outputs == 0 || inputs == 0"
                  :error-messages="
                    outputs == 0
                      ? $t('ERROR_OUTPUTS_NODE_CANT_BE_0')
                      : inputs == 0
                      ? $t('ERROR_INPUTS_NODE_CANT_BE_0')
                      : ''
                  "
                >
                  <template v-slot:selection="{ item: headerType }">
                    <span>{{ $t(headerType) }}</span>
                  </template>
                  <template v-slot:item="{ item: headerType }">
                    <span>{{ $t(headerType) }}</span>
                  </template>
                </v-select>
              </v-col>
              <v-col cols="12" :key="`divider-${index}`">
                <v-divider></v-divider>
              </v-col>
            </template>
          </v-row>
        </v-container>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
export default {
  name: "ColumnsChooser",
  props: {
    value: Array
  },
  data: () => {
    return {
      panel: [],
      outputsIndex: [],
      inputs: 0,
      outputs: 0,
      nodeTypes: ["Input", "Output", "Unused"]
    };
  },
  methods: {
    handleDataType(item, index, newValue) {
      if (item.columnType !== newValue) {
        if (newValue === "Input") {
          this.inputs++;
        } else if (newValue === "Output") {
          this.outputs++;
        }

        if (item.columnType === "Input") {
          this.inputs--;
        } else if (item.columnType === "Output") {
          this.outputs--;
        }

        if (this.outputs === 0) {
          this.$toast.open({
            message: `${this.$t("ERROR_OUTPUTS_NODE_CANT_BE_0")}`,
            type: "error",
            position: "bottom-right",
            duration: 3000
          });
        }

        if (this.inputs === 0) {
          this.$toast.open({
            message: `${this.$t("ERROR_INPUTS_NODE_CANT_BE_0")}`,
            type: "error",
            position: "bottom-right",
            duration: 3000
          });
        }

        item.columnType = newValue;

        this.$emit("input", [...this.value]);
      }
    },
    calculateInputsOutputs(headers) {
      this.inputs = 0;
      this.outputs = 0;
      headers?.forEach(val => {
        this.inputs += val.columnType === "Input" ? 1 : 0;
        this.outputs += val.columnType === "Output" ? 1 : 0;
      });
    }
  },
  mounted() {
    this.calculateInputsOutputs(this.columns);
  },
  watch: {
    value: function(newValue, oldValue) {
      if (newValue) {
        if (newValue !== oldValue) {
          this.calculateInputsOutputs(newValue);
        }
      }
    }
  }
};
</script>

<style scoped></style>
