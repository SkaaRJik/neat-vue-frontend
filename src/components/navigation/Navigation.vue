<template>
  <v-navigation-drawer v-model="drawer" app mini-variant>
    <avatar></avatar>

    <v-divider class="mx-3 my-5"></v-divider>

    <router-link
      v-for="(item, i) in items"
      :key="i"
      :to="{ ...item.link }"
      v-slot="{ href, route, navigate, isActive }"
    >
      <v-tooltip right>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            @click="navigate"
            rounded
            :color="isActive && 'grey darken-3'"
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
export default {
  name: "Navigation",
  components: { Avatar },
  data: () => {
    return {
      drawer: null,
      items: [
        { text: "My_Projects", icon: "mdi-folder", link: { name: "projects" } },
        {
          text: "Shared_with_me",
          icon: "mdi-account-multiple",
          link: { name: "shared-projects" }
        },
        { text: "Recent", icon: "mdi-history", link: { name: "projects" } }
      ]
    };
  }
};
</script>

<style scoped></style>
