<template>
  <v-card class="ma-6">
    <v-card-title>{{ $t("Choose_Params") }}</v-card-title>
    <v-card-text>
      <v-container>
        <v-row align="center" justify="space-between">
          <template v-for="(item, index) in value.columnsData">
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
                @change="handleDataType(item, $event)"
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
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "ColumnsChooser",
  props: {
    value: {
      columnsData: Array,
      inputs: Number,
      outputs: Number
    }
  },
  data: () => {
    return {
      outputsIndex: [],
      inputs: 0,
      outputs: 0,
      nodeTypes: ["Input", "Output", "Unused"]
    };
  },
  methods: {
    handleDataType(item, newValue) {
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

        this.value.inputs = this.inputs;
        this.value.outputs = this.outputs;
        this.$emit("input", this.value);
      }
    },
    initHeaders(headers) {
      this.inputs = 0;
      this.outputs = 0;
      headers.forEach(val => {
        this.inputs += val.columnType === "Input" ? 1 : 0;
        this.outputs += val.columnType === "Output" ? 1 : 0;
      });
      this.value.inputs = this.inputs;
      this.value.outputs = this.outputs;
      this.$emit("input", this.value);
    }
  },
  mounted() {
    this.initHeaders(this.value.columnsData);
  },
  watch: {
    value: function(newValue, oldValue) {
      if (newValue) {
        if (newValue !== oldValue) {
          this.initHeaders(newValue.columnsData);
        }
      }
    }
  }
};
</script>

<style scoped></style>
