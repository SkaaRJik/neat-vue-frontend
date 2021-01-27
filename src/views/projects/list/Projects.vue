<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div>
    <!-- Full screen template       -->
    <div class="d-none d-sm-block">
      <projects-desktop-view :load-data="apiCallback" />
    </div>
    <!-- Mobile version  -->
    <div class="d-sm-none">
      <projects-mobile-view />
    </div>
  </div>
</template>

<script>
import ProjectsMobileView from "@/views/projects/list/ProjectsMobileView";
import ProjectsDesktopView from "@/views/projects/list/ProjectsDesktopView";

export default {
  name: "Projects",
  components: { ProjectsMobileView, ProjectsDesktopView },
  props: {
    apiCallback: Function
  },
  methods: {},
  data() {
    return {};
  }
};
</script>

<style scoped></style>
