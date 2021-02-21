
const routes = [
  {
    path: '/',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/', redirect: '/home' },
      {
        name: 'home',
        path: '/home',
        component: './Home',
      },
      {
        name: 'mark',
        path: '/mark/:id',
        component: './Mark',
      },
      {
        name: 'task',
        path: '/dev/task',
        component: './dev/Task',
      },
      {
        name: 'api',
        path: '/dev/api',
        component: './dev/API',
      },
    ],
  },
];

export default routes;
