<template>
  <v-menu bottom left v-if="isLoggedIn">
    <template v-slot:activator="{ on }">
      <v-btn icon class="d-block text-center mx-auto mt-4" v-on="on">
        <v-avatar color="grey darken-1" size="48">
          <img :src="user.avatar" />
        </v-avatar>
      </v-btn>
    </template>

    <v-list>
      <v-list>
        <v-list-item>
          <v-list-item-avatar>
            <v-avatar color="grey darken-1">
              <img :src="user.avatar" />
            </v-avatar>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title class="title"
              >{{ user.firstname }}
              {{ user.lastname }}
            </v-list-item-title>
            <v-list-item-subtitle>{{ user.username }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <template v-for="(item, i) in items">
        <v-divider :key="`divider-${i}`"></v-divider>
        <v-list dense nav :key="`list-${i}`">
          <v-list-item-group color="primary">
            <v-list-item
              :key="`list-item-item-${i}-${j}`"
              v-for="(section, j) in item"
            >
              <v-list-item-icon>
                <v-icon v-text="section.icon"></v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title
                  @click="section.action"
                  v-text="$t(section.text)"
                ></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </template>
    </v-list>
  </v-menu>
  <v-dialog v-else v-model="dialog" width="500px">
    <template v-slot:activator="{ on }">
      <v-avatar
        color="indigo"
        v-on="on"
        class="d-block text-center mx-auto mt-4"
        size="48"
      >
        <v-icon dark>mdi-login</v-icon>
      </v-avatar>
    </template>
    <authorization-form @close="closeAuthDialog"></authorization-form>
    <!--    <auth @close="closeAuthDialog"></auth>-->
  </v-dialog>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import AuthorizationForm from "@/components/authorization/AuthorizationForm";

export default {
  name: "Avatar",
  components: {
    AuthorizationForm
  },
  data: () => ({
    dialog: false,
    src: ""
  }),
  computed: {
    ...mapState({
      user: state => state.auth.user
    }),
    ...mapGetters({
      isLoggedIn: "auth/isLoggedIn",
      shortUsername: "auth/shortUsername"
    }),
    items() {
      return [
        [{ text: "Profile", icon: "mdi-account", action: () => {} }],
        [{ text: "Logout", icon: "mdi-logout", action: this.logout }]
      ];
    }
  },
  methods: {
    logout() {
      console.log("[Avatar].closeAuthDialog this.user:", this.user);
      this.$store.dispatch("auth/LOGOUT");
      if (!this.isLoggedIn && this.$router.currentRoute.path !== "/") {
        this.$router.push("/");
      }
    },
    closeAuthDialog() {
      this.dialog = false;
    }
  }
};
</script>

<style scoped></style>
