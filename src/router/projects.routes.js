import Projects from "@/views/projects/list/Projects";
import ProjectsAPI from "@/services/api/ProjectsAPI";
import ProjectPage from "@/views/projects/ProjectPage";
import NewProject from "@/views/projects/form/NewProject";
import NEATConfiguration from "@/views/neat/NEATConfiguration";

const projectRoutes = [
  {
    path: "/projects",
    name: "Projects",
    component: Projects,
    props: {
      apiCallback: ProjectsAPI.getMyProjects
    },
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/projects/shared",
    name: "SharedProjects",
    component: Projects,
    props: {
      apiCallback: ProjectsAPI.getSharedWithMeProjects
    },
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/projects/new",
    name: "new-project",
    props: route => ({ step: route.query.step ? Number(route.query.step) : 1 }),
    component: NewProject,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/project/:id",
    name: "project-page",
    component: ProjectPage,
    props: route => ({ projectId: Number(route.params.id) }),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/project/:id/configuration",
    name: "project-configure",
    component: NEATConfiguration,
    props: route => ({ projectId: Number(route.params.id) }),
    meta: {
      requiresAuth: true
    }
  }
];

export default projectRoutes;
