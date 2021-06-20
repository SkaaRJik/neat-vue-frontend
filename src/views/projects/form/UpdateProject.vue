<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-text-field
          disabled
          :label="$t('Project_Name')"
          clearable
          counter="100"
          outlined
          class="width: 300px"
          v-model.trim="projectName"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <upload-project-data v-model="file"></upload-project-data>
      </v-col>
    </v-row>
    <v-row>
      <v-spacer></v-spacer>
      <v-btn
        :disabled="!isSaveAllowed"
        @click="handleSaveProject"
        class="ma-3"
        color="primary"
      >
        {{ $t("Create") }}
        <v-progress-circular
          color="primary"
          indeterminate
          v-show="excelUploading"
        ></v-progress-circular>
        <v-icon right v-show="!excelUploading"> mdi-check</v-icon>
      </v-btn>
    </v-row>
  </v-container>
</template>

<script>
import Vue from "vue";
import UploadProjectData from "@/components/project/upload/UploadProjectData";

export default {
  name: "UpdateProject",
  components: {
    UploadProjectData
  },
  props: {
    projectId: Number
  },
  data() {
    return {
      projectName: "",
      file: null,
      excelUploading: false
    };
  },
  methods: {
    async loadProjectData() {
      this.excelUploading = true;
      console.log("[UpdateProject].loadProjectData :");
      try {
        const data = await this.$store.dispatch(
          "project/GET_PROJECT",
          this.projectId
        );
        console.log("[UpdateProject].loadProjectData data:", data);
        if (data) {
          this.projectName = data.name;
        }
      } catch (e) {
        console.error("[UpdateProject].handleSaveProject error:", e);
        Vue.$toast.open({
          message: `${this.$t(e)}`,
          type: "error",
          position: "top-right",
          dismissible: true
        });
      } finally {
        this.excelUploading = false;
      }
    },
    async handleSaveProject() {
      this.excelUploading = true;
      try {
        const data = await this.$store.dispatch("project/ATTACH_PROJECT_FILE", {
          projectId: this.projectId,
          file: this.file
        });

        console.log("[UpdateProject].handleSaveProject data:", data);
        if (data) {
          this.$router.push({
            name: "project-page",
            params: { projectId: this.projectId }
          });
        }
      } catch (e) {
        console.error("[NewProject].handleSaveProject error:", e);
        Vue.$toast.open({
          message: `${this.$t(e)}`,
          type: "error",
          position: "top-right",
          dismissible: true
        });
      } finally {
        this.excelUploading = false;
      }
    },
    redirectToProjectsPage() {
      this.$router.push({ name: "projects" });
    }
  },
  mounted() {
    this.loadProjectData();
  },
  computed: {
    isSaveAllowed() {
      return this.projectName.trim() && !this.excelUploading && this.file;
    }
  }
};
</script>

<style scoped></style>
