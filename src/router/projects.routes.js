import Projects from "@/views/projects/list/Projects";
import ProjectsAPI from "@/services/api/ProjectsAPI";
import ProjectPage from "@/views/projects/ProjectPage";
import NewProject from "@/views/projects/form/NewProject";
import NEATConfiguration from "@/views/neat/NEATConfiguration";
import ExperimentPage from "@/views/experiments/ExperimentPage";
import UpdateProject from "@/views/projects/form/UpdateProject";
import ExperimentConfig from "@/views/experiments/ExperimentConfig";

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
    path: "/project/:projectId",
    name: "project-page",
    component: ProjectPage,
    props: route => ({ projectId: Number(route.params.projectId) }),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/project/:projectId/edit",
    name: "update-project",
    component: UpdateProject,
    props: route => ({ projectId: Number(route.params.projectId) }),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/project/:projectId/experiment/:experimentId",
    name: "experiment-page",
    component: ExperimentPage,
    props: route => ({
      projectId: Number(route.params.projectId),
      experimentId: Number(route.params.experimentId)
    }),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/project/:projectId/experiment/:experimentId/config",
    name: "experiment-config",
    component: ExperimentConfig,
    props: route => ({
      projectId: Number(route.params.projectId),
      experimentId: Number(route.params.experimentId)
    }),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/project/:id/configuration",
    name: "project-configure",
    component: NEATConfiguration,
    props: route => ({
      projectId: Number(route.params.id),
      step: route.query.step ? Number(route.query.step) : 1
    }),
    meta: {
      requiresAuth: true
    }
  }
];

export default projectRoutes;
