import Vue from 'vue'
import Router from 'vue-router'

// Containers
const DefaultContainer = () => import('@/containers/DefaultContainer')

// Views
const Dashboard = () => import('@/views/Dashboard')
// Views - Pages
const Page404 = () => import('@/views/pages/Page404')
const Page500 = () => import('@/views/pages/Page500')
const Login = () => import('@/views/pages/Login')
const Register = () => import('@/views/pages/Register')

// my own route
const Lapor = () => import('@/views/layanan/lapor');
const LaporMap = () => import('@/views/layanan/lapor-map');
const Izin = () => import('@/views/layanan/izin');
const Kritik = () => import('@/views/layanan/kritik');
const Info = () => import('@/views/info/berita');
const Trayek = () => import('@/views/info/trayek');
const Parkir = () => import('@/views/info/parkir');
const Survey = () => import('@/views/survey/survey');
const SurveyMaster = () => import('@/views/survey/survey-master');
const SurveyHasil = () => import('@/views/survey/survey-hasil');
const User = () => import('@/views/user/user');
const Notifikasi = () => import('@/views/notifications/notifikasi');
const Redirect = () => import('@/views/pages/Redirect');
const ResetPassword = () => import('@/views/pages/ResetPassword');
const Verified = () => import('@/views/pages/Verified');

Vue.use(Router)

const router = new Router({
  mode: 'hash', // https://router.vuejs.org/api/#mode
  linkActiveClass: 'open active',
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    {
      path: '/',
      redirect: '/dashboard',
      name: 'Home',
      component: DefaultContainer,
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          component: Dashboard,
          meta: { requiresAuth: true }
        },
        {
          path: 'layanan',
          redirect: '/layanan/keluhan',
          name: 'Layanan',
          component: {
            render (c) { return c('router-view') }
          },
          children: [
            {
              path: 'keluhan',
              name: 'Keluhan',
              component: {
                render (c) { return c('router-view') }
              },
              children: [
                {
                  path: 'data',
                  name: 'Data',
                  component: Lapor,
                  meta: { requiresAuth: true }
                },
                {
                  path: 'map',
                  name: 'Map',
                  component: LaporMap,
                  meta: { requiresAuth: true }
                },
              ]
            },
            // {
            //   path: 'izin',
            //   name: 'Izin',
            //   component: Izin,
            //   meta: { requiresAuth: true }
            // }
          ]
        },
        {
          path: 'info',
          redirect: '/info/berita',
          name: 'Info',
          component: {
            render (c) { return c('router-view') }
          },
          children: [
            {
              path: 'berita',
              name: 'Berita',
              component: Info,
              meta: { requiresAuth: true }
            },
            // {
            //   path: 'trayek',
            //   name: 'Trayek',
            //   component: Trayek,
            //   meta: { requiresAuth: true }
            // },
            // {
            //   path: 'parkir',
            //   name: 'Parkir',
            //   component: Parkir,
            //   meta: { requiresAuth: true }
            // },
          ]
        },
        {
          path: 'pengguna',
          redirect: '/pengguna/user',
          name: 'Pengguna',
          component: {
            render (c) { return c('router-view') }
          },
          children: [
            {
              path: 'user',
              name: 'User',
              component: User,
              meta: { requiresAuth: true }
            }
            // {
            //   path: 'data',
            //   name: 'Data',
            //   component: Survey,
            //   meta: { requiresAuth: true }
            // }
          ]
        },
        {
          path: 'survey',
          redirect: '/survey/master',
          name: 'Survey',
          component: {
            render (c) { return c('router-view') }
          },
          children: [
            {
              path: 'master',
              name: 'Master',
              component: SurveyMaster,
              meta: { requiresAuth: true }
            },
            {
              path: 'data',
              name: 'Data',
              component: Survey,
              meta: { requiresAuth: true }
            },
            {
              path: 'hasil',
              name: 'Hasil',
              component: SurveyHasil,
              meta: { requiresAuth: true }
            },
          ]
        },
        {
          path: 'kritik',
          name: 'Kritik & Saran',
          component: Kritik,
          meta: { requiresAuth: true }
        },
        {
          path: 'notifikasi',
          name: 'Notifikasi',
          component: Notifikasi,
          meta: { requiresAuth: true }
        },
      ]
    },
    {
      path: '/pages',
      redirect: '/pages/404',
      name: 'Pages',
      component: {
        render (c) { return c('router-view') }
      },
      children: [
        {
          path: '404',
          name: 'Page404',
          component: Page404
        },
        {
          path: '500',
          name: 'Page500',
          component: Page500
        },
        {
          path: 'login',
          name: 'Login',
          component: Login
        },
        {
          path: 'register',
          name: 'Register',
          component: Register
        },
        {
          path: 'redirect',
          name: 'Redirect',
          component: Redirect
        },
        {
          path: 'reset-password/:id',
          name: 'Reset Password',
          component: ResetPassword
        },
        {
          path: 'verified/:id',
          name: 'Verified',
          component: Verified
        }
      ]
    },
    // default page not found
    { path: "*", component: Page404 }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth == true)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (localStorage.getItem('jwt') == null) {
      next({
        path: '/pages/login',
        query: { redirect: to.fullPath }
      })
    } else {
      // let base64Url = localStorage.getItem('jwt').split('.')[1];
      // let decodedValue = JSON.parse(window.atob(base64Url));
      next()
    }
  } else {
    next() // make sure to always call next()!
  }
})

 export default router
