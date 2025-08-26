import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';
import MemberBooks from './MemberBooks.vue';

import MembersList from './MembersList.vue';

const routes = [
  { path: '/', component: App },
  { path: '/members', component: MembersList },
  { path: '/member/:id', component: MemberBooks }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
