<template>
  <v-menu bottom left v-if="isLoggedIn">
    <template v-slot:activator="{ on }">
      <v-btn icon v-on="on">
        <v-avatar
          class="d-block text-center mx-auto mt-4"
          color="grey darken-1"
          size="36"
        >
          <span class="white--text headline">{{ shortUsername }}</span>
        </v-avatar>
      </v-btn>
    </template>

    <v-list>
      <v-list>
        <v-list-item>
          <v-list-item-avatar>
            <v-avatar color="red">
              <span class="white--text headline">{{ shortUsername }}</span>
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
    <authorization-form></authorization-form>
    <!--    <auth @close="closeAuthDialog"></auth>-->
  </v-dialog>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import AuthorizationForm from "@/components/authorization/AuthorizationForm";
export default {
  name: "Avatar",
  components: {
    AuthorizationForm
  },
  data: () => ({
    dialog: false,
    items: [
      [{ text: "Profile", icon: "mdi-account", action: () => {} }],
      [{ text: "Logout", icon: "mdi-logout", action: () => {} }]
    ]
  }),
  computed: {
    ...mapState({
      user: state => state.auth.user
    }),
    ...mapGetters({
      isLoggedIn: "auth/isLoggedIn"
    })
  },
  methods: {
    logout() {
      /*this.$store.dispatch("auth/LOGOUT");
      if (!this.isLoggedIn) {
        this.$router.push("/");
      }*/
    },
    shortUsername() {
      return this.user.firstName;
    }
  }
};
</script>

<style scoped></style>
