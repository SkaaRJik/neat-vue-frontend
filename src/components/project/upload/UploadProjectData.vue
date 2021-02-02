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
          @change="parseXLSX"
        >
          <template v-slot:selection="{ index, text }">
            <v-chip color="deep-purple accent-4" label small>
              {{ text }}
            </v-chip>
          </template>
        </v-file-input>
      </v-col>
    </v-row>
    <v-row>
      <uploaded-excel-info
        :parsed-data="parsedData"
        v-if="!!parsedData"
      ></uploaded-excel-info>
    </v-row>
  </v-container>
</template>

<script>
import parseExcel from "@/services/parser/ExcelParser";
import UploadedExcelInfo from "@/components/project/upload/UploadedExcelInfo";

export default {
  name: "UploadProjectData",
  components: { UploadedExcelInfo },
  props: ["value"],
  data: () => {
    return {
      file: null,
      parsedData: null
    };
  },
  methods: {
    async parseXLSX(file) {
      if (file) {
        this.excelUploading = true;
        try {
          this.parsedData = await parseExcel(file);
        } catch (e) {
          console.error("[NewProject].uploadXLSX() EXCEPTION:", e);
          await this.$toast.open({
            message: `${this.$t(e)}`,
            type: "error",
            position: "top-right",
            dismissible: true
          });
        } finally {
          this.excelUploading = false;
        }
      } else {
        this.parsedData = null;
      }
      this.$emit("input", this.parsedData);
    }
  }
};
</script>

<style scoped></style>
