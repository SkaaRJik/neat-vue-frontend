<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-row align="center" justify="center">
          <v-btn class="ma-3" color="primary">
            <v-icon left>mdi-arrow-down-bold</v-icon>
            {{ $t("Template") }}
          </v-btn>
          <v-btn class="ma-3">
            <v-icon left>mdi-arrow-down-bold</v-icon>
            {{ $t("Example", { number: 1 }) }}
          </v-btn>
          <v-btn class="ma-3">
            <v-icon left>mdi-arrow-down-bold</v-icon>
            {{ $t("Example", { number: 2 }) }}
          </v-btn>
        </v-row>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-file-input
          :placeholder="$t('Select_File')"
          :show-size="1000"
          accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          class="py-2"
          counter
          outlined
          prepend-icon="mdi-paperclip"
          @change="setFile"
        >
          <template v-slot:selection="{ index, text }">
            <v-chip color="deep-purple accent-4" label small>
              {{ text }}
            </v-chip>
          </template>
        </v-file-input>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "UploadProjectData",
  props: ["value"],
  data: () => {
    return {
      file: null
    };
  },
  methods: {
    async setFile(file) {
      this.file = file;
      this.$emit("input", this.file);
    }
  }
};
</script>

<style scoped></style>
