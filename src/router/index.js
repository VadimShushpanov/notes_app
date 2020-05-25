import Vue from "vue";
import Router from "vue-router";
import Notes from "../components/Notes";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "Notes",
      component: Notes,
    },
    {
      path: "/edit_note/:id",
      name: "EditNote",
      component: () => import("../components/EditNote.vue"),
    },
  ],
});
