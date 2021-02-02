<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-text-field
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
        <upload-project-data v-model="parsedData"></upload-project-data>
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
import ProjectsAPI from "@/services/api/ProjectsAPI";
import UploadProjectData from "@/components/project/upload/UploadProjectData";

export default {
  name: "NewProject",
  props: {
    step: Number
  },
  components: {
    UploadProjectData
  },
  data() {
    return {
      projectName: "",
      parsedData: null,
      excelUploading: false
    };
  },
  methods: {
    async handleSaveProject() {
      this.excelUploading = true;
      try {
        const newProject = {
          ...this.parsedData,
          name: this.projectName
        };
        delete newProject.dataErrors;
        const { data } = await ProjectsAPI.saveProject(newProject);
        console.log("[NewProject].handleSaveProject data:", data);
        if (data) {
          this.projectId = data;
          this.$router.push({
            name: "project-configure",
            params: { id: this.projectId }
          });
        }
      } catch (e) {
        console.error("[NewProject].handleSaveProject error:", e);
        await Vue.$toast.open({
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
  computed: {
    isSaveAllowed() {
      return (
        this.projectName &&
        !this.excelUploading &&
        this.parsedData &&
        this.parsedData.dataErrors.length === 0
      );
    }
  }
};
</script>

<style scoped></style>
