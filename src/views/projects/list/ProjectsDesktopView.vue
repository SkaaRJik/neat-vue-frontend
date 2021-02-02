<template>
  <div>
    <v-container>
      <v-row lg md xl>
        <v-col sm="12">
          <v-card>
            <v-card-title>
              <span>{{ $t("Projects") }}</span>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    @click="newProject"
                    outlined
                    color="primary"
                    small
                    class="ml-2"
                    v-bind="attrs"
                    v-on="on"
                  >
                    <v-icon>mdi-plus</v-icon>
                  </v-btn>
                </template>
                <span>{{ $t("New_Project") }}</span>
              </v-tooltip>
              <v-spacer></v-spacer>
              <v-text-field
                :label="$t('Search')"
                append-icon="mdi-magnify"
                hide-details
                single-line
                v-model="search"
              ></v-text-field>
              <v-spacer></v-spacer>
              <v-btn-toggle
                color="primary"
                mandatory
                shaped
                v-model="itemsPerPage"
              >
                <v-btn :value="5">
                  5
                </v-btn>

                <v-btn :value="10">
                  10
                </v-btn>

                <v-btn :value="25">
                  25
                </v-btn>

                <v-btn :value="50">
                  50
                </v-btn>
              </v-btn-toggle>
            </v-card-title>
            <v-data-table
              :headers="headers"
              :items="projects"
              :items-per-page="itemsPerPage"
              :page.sync="page"
              :search="search"
              @click:row="
                value => {
                  openProject(value.id, value.status);
                }
              "
              @page-count="pageCount = $event"
              class="elevation-1"
              hide-default-footer
            >
              <template v-slot:item.trainingError="{ item }">
                <v-fab-transition>
                  <span>
                    {{ item.trainingError }}
                  </span>
                </v-fab-transition>
              </template>
              <template v-slot:item.predictionError="{ item }">
                <span>{{ item.predictionError }}</span>
              </template>
              <template v-slot:item.status="{ item }">
                <span>{{ $t(item.status) }}</span>
              </template>
            </v-data-table>
            <div class="text-center pt-2">
              <v-pagination :length="pageCount" v-model="page"></v-pagination>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  name: "DesktopProjects",
  props: {
    loadData: Function
  },
  methods: {
    clicked(value) {
      console.log("[Projects].clicked() value:", value);
    },
    async newProject() {
      await this.$router.push({ name: "new-project" });
    },
    async loadProjects() {
      const projects = await this.loadData(this.page, this.itemsPerPage);
      this.projects = projects.data.content;
      this.pageCount = projects.data.totalPages;
    },
    openProject(id, status) {
      if (status === "NEW") {
        this.$router.push({
          name: "project-configure",
          params: { id: `${id}` }
        });
      } else {
        this.$router.push({ name: "project-page", params: { id: `${id}` } });
      }
    }
  },
  data() {
    return {
      searchTimerId: null,
      search: "",
      page: 1,
      pageCount: 0,
      itemsPerPage: 10,
      headers: [
        {
          text: this.$t("Project_Name"),
          align: "start",
          value: "name",
          sortable: false
        },
        {
          text: this.$t("Training_Error"),
          value: "trainingError",
          sortable: false
        },
        {
          text: this.$t("Prediction_Error"),
          value: "predictionError",
          sortable: false
        },
        { text: this.$t("Status"), value: "status", sortable: false }
      ],
      options: {
        multiSort: false
      },
      progress: {},
      projects: []
    };
  },
  mounted() {
    this.loadProjects();
  }
};
</script>

<style scoped></style>
