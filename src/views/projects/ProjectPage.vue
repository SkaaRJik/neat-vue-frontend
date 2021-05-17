<template>
  <v-container>
    <template v-if="!loading">
      <v-row justify="center" align="center">
        <v-col style="text-align: center;">
          <span>{{ $t(this.projectStatus) }}</span>
        </v-col>
      </v-row>
      <v-row
        v-if="
          (projectStatus === 'VERIFIED' ||
            projectStatus === 'VERIFICATION_ERROR') &&
            projectInfo.verificationInfo
        "
      >
        <v-col v-if="projectInfo.verificationInfo" style="text-align: center;">
          <VerificationInfo
            :info="projectInfo.verificationInfo"
          ></VerificationInfo>
        </v-col>
      </v-row>
      <v-row
        v-if="
          (projectStatus === 'VERIFIED' ||
            projectStatus === 'VERIFICATION_ERROR') &&
            projectInfo.verificationErrors
        "
      >
        <v-col style="text-align: center;">
          <VerificationErrors
            :errors="projectInfo.verificationErrors"
          ></VerificationErrors>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="mr-auto" cols="auto" xs="12">
          <v-btn
            @click="redirectToSourceUploadPage"
            style="margin-left: auto"
            >{{ $t("SEND_DATA_AGAIN") }}</v-btn
          >
        </v-col>
        <v-col cols="auto" xs="12" v-if="projectStatus === 'VERIFIED'">
          <v-btn @click="redirectToExperiment">{{ $t("Continue") }}</v-btn>
        </v-col>
      </v-row>
    </template>
    <template v-if="loading">
      <v-row justify="center" align="center">
        <v-col style="text-align: center;"> </v-col>
      </v-row>
    </template>
  </v-container>
</template>

<script>
import ProjectsAPI from "@/services/api/ProjectsAPI";
import VerificationErrors from "@/components/project/verification/VerificationErrors";
import VerificationInfo from "@/components/project/verification/VerificationInfo";

export default {
  name: "ProjectPage",
  components: { VerificationInfo, VerificationErrors },
  props: { projectId: Number, project: Object },
  data() {
    return {
      loading: false,
      projectStatus: "",
      experimentId: null,
      projectInfo: {
        id: null,
        verificationErrors: null,
        verificationInfo: null,
        status: "",
        lastActiveExperiment: {
          id: null
        }
      }
    };
  },
  methods: {
    configureProject() {
      this.$router.push({
        name: "project-configure",
        params: { id: this.projectId }
      });
    },

    async loadProjectInfo() {
      this.loading = true;
      try {
        const data = await this.$store.dispatch(
          "project/GET_PROJECT",
          this.projectId
        );
        this.projectInfo = data;
        this.projectStatus = this.projectInfo.status;
        this.experimentId = this.projectInfo?.lastActiveExperiment?.id;
        if (this.projectInfo?.lastActiveExperiment?.id) {
          await this.$router.push({
            name: "experiment-page",
            params: {
              projectId: this.projectId,
              experimentId: this.experimentId
            }
          });
        }
      } catch (e) {
        console.error("[ProjectPageVue].loadProjectInfo e:", e);
      } finally {
        this.loading = false;
      }
    },
    redirectToSourceUploadPage() {
      this.$router.push({
        name: "update-project",
        params: {
          projectId: this.projectId
        }
      });
    },
    async redirectToExperiment() {
      console.log(
        "[ProjectPage].redirectToExperiment this.experimentId:",
        this.experimentId
      );
      if (!this.experimentId) {
        try {
          this.loading = true;
          const { data } = await ProjectsAPI.createExperiment({
            projectId: this.projectId
          });
          this.experimentId = data?.id;
        } catch (e) {
          console.log("[ProjectPageVue].loadProjectInfo e:", e);
        } finally {
          this.loading = false;
        }
      }
      if (this.experimentId) {
        await this.$router.push({
          name: "experiment-page",
          params: {
            projectId: this.projectId,
            experimentId: this.experimentId
          }
        });
      } else {
        console.error(
          "[ProjectPage].redirectToExperiment experimentId === null:"
        );
      }
    }
  },
  mounted() {
    this.loadProjectInfo();
  },
  watch: {
    projectId: function() {
      this.loadProjectInfo();
    }
  }
};
</script>

<style scoped></style>
