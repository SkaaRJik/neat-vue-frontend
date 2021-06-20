<template>
  <v-container>
    <template v-if="!loading">
      <v-row align="center" justify="center">
        <v-col cols="12" align="center">
          <span>{{ $t("Status") }}: {{ $t(projectInfo.status) }}</span>
        </v-col>
      </v-row>

      <v-row v-if="projectStatus === 'VERIFIED'">
        <v-col cols="12">
          <v-card>
            <v-card-title>
              {{ $t("Identified_signs") }}
            </v-card-title>
            <v-card-text>
              <v-data-table
                :headers="headers"
                :items="identifiedSigns"
                item-key="value"
              >
              </v-data-table>
            </v-card-text>
          </v-card>
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
          <v-btn color="primary" @click="redirectToExperiment">{{
            $t("Continue")
          }}</v-btn>
        </v-col>
      </v-row>
    </template>
    <template v-if="loading">
      <v-row justify="center" align="center">
        <v-col style="text-align: center;">
          <v-skeleton-loader
            v-bind="!loading"
            type="card-avatar, article, actions"
          ></v-skeleton-loader>
        </v-col>
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
      headers: [
        {
          text: "№",
          value: "index",
          sortable: false
        },
        {
          text: this.$t("Name"),
          value: "value",
          sortable: false
        }
      ],
      experimentId: null,
      projectInfo: {
        id: null,
        headers: [],
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
        this.$toast.open({
          message: this.$t(e),
          type: "error",
          position: "top-right",
          dismissible: true
        });
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
          console.error("[ProjectPageVue].loadProjectInfo e:", e);
          this.$toast.open({
            message: `${(e.response?.data?.message &&
              this.$t(e.response.data.message)) ||
              e}`,
            type: "error",
            position: "top-right",
            dismissible: true
          });
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
  computed: {
    identifiedSigns() {
      const comp =
        this.projectInfo?.headers?.map((value, index) => {
          return {
            index: index + 1,
            value: value
          };
        }) || [];

      console.log("[ProjectPage].identifiedSigns comp:", comp);

      return comp;
    }
  },
  watch: {
    projectId: function() {
      this.loadProjectInfo();
    }
  }
};
</script>

<style scoped></style>
