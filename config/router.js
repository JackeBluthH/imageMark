
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
    ],
  },
];

export default routes;
