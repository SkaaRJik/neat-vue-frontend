import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import projectRoutes from "@/router/projects.routes";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  ...projectRoutes
];

const router = new VueRouter({
  routes
});

router.beforeEach((to, fromRoute, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (localStorage.getItem("user") == null) {
      Vue.$toast.open({
        message: Vue.$t("Access_denied"),
        type: "warning"
        // all of other options may go here
      });
      next(fromRoute);
    } else {
      const user = JSON.parse(localStorage.getItem("user"));
      const roles = user.roles;
      if (to.matched.some(record => record.meta.isAdmin)) {
        if (roles.includes("ROLE_ADMIN")) {
          next();
        } else {
          Vue.$toast.open({
            message: Vue.$t("Access_denied"),
            type: "warning"
            // all of other options may go here
          });
          next(fromRoute);
        }
      } else {
        next();
      }
    }
  } else if (to.matched.some(record => record.meta.guest)) {
    if (localStorage.getItem("user") == null) {
      next();
    } else {
      Vue.$toast.open({
        message: Vue.$t("Access_denied"),
        type: "warning"
        // all of other options may go here
      });
      next(fromRoute);
    }
  } else {
    next();
  }
});

export default router;
