<template>
  <v-navigation-drawer v-model="drawer" app mini-variant>
    <avatar></avatar>

    <v-divider class="mx-3 my-5"></v-divider>

    <router-link
      v-for="(item, i) in renderedItems"
      :key="i"
      :to="{ ...item.link }"
      v-slot="{ href, route, navigate, isActive, isExactActive }"
    >
      <v-tooltip right>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            @click="navigate"
            rounded
            :color="(isExactActive && 'grey darken-2') || ''"
            v-bind="attrs"
            v-on="on"
            class="mb-2"
          >
            <v-avatar size="36">
              <v-icon v-text="item.icon"></v-icon>
            </v-avatar>
          </v-btn>
        </template>
        <span>{{ $t(item.text) }}</span>
      </v-tooltip>
    </router-link>
  </v-navigation-drawer>
</template>

<script>
import Avatar from "@/components/navigation/Avatar";
import { mapState } from "vuex";
export default {
  name: "Navigation",
  components: { Avatar },
  data: () => {
    return {
      drawer: null,
      items: [
        {
          text: "My_Projects",
          icon: "mdi-folder",
          link: { name: "Projects" },
          requiresAuth: true
        },
        {
          text: "Shared_with_me",
          icon: "mdi-account-multiple",
          link: { name: "SharedProjects" },
          requiresAuth: true,
          requiresAdmin: false
        },
        {
          text: "Recent",
          icon: "mdi-history",
          link: { name: "Projects" },
          requiresAuth: true
        }
      ]
    };
  },
  computed: {
    ...mapState({
      user: state => state.auth.user
    }),
    renderedItems() {
      const isLoggedIn = !!this.user;
      let isAdmin = false;

      if (isLoggedIn) {
        isAdmin = this.user.roles.includes("ROLE_ADMIN");
      }

      const renderableItems = [];

      this.items.forEach(value => {
        if (!value.requiresAuth) {
          renderableItems.push(value);
        } else if (value.requiresAuth && isLoggedIn) {
          renderableItems.push(value);
        } else if (value.requiresAdmin && isAdmin) {
          renderableItems.push(value);
        }
      });

      console.log("[Navigation].renderedItems :");

      return renderableItems;
    }
  }
};
</script>

<style scoped></style>
