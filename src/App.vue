<template>
  <v-app id="inspire">
    <navigation></navigation>

    <v-main>
      <router-view></router-view>
    </v-main>

    <v-footer app>
      <v-spacer></v-spacer>

      <span>NEAT&copy; 2019</span>
    </v-footer>
  </v-app>
</template>

<script>
import Navigation from "@/components/navigation/Navigation";
export default {
  components: { Navigation },
  data: () => ({ drawer: null })
};
</script>
