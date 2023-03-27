import { createRouter, createWebHistory } from "vue-router";
import _private from "./routes/private";
import _public from "./routes/public";
import { useEthers, useWallet } from "vue-dapp";
import { connectors } from "@/core/config/constant";

const routes = [..._private, ..._public];
const { address } = useEthers();
const { autoConnect } = useWallet();

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (to.name !== from.name) return savedPosition || { top: 0 };
  },
});

router.beforeEach(async (to, from, next) => {
  // trying to access a restricted page + not logged in
  // redirect to login page
  if (!address.value) await autoConnect(connectors);
  if (to.meta.requiresAuth && !address.value) {
    next("/login");
  } else {
    next();
  }
});

export default router;
