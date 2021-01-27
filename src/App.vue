<template>
  <v-app id="inspire">
    <navigation></navigation>

    <v-main>
      <canvas
        id="avatar"
        width="200"
        height="200"
        style="border:1px solid #000000;display: none"
      >
      </canvas>
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
