import Vue from 'vue'
import Router from 'vue-router'

// Containers
const DefaultContainer = () => import('@/containers/DefaultContainer')

// Views
const Dashboard = () => import('@/views/Dashboard')

const Colors = () => import('@/views/theme/Colors')
const Typography = () => import('@/views/theme/Typography')

const Charts = () => import('@/views/Charts')
const Widgets = () => import('@/views/Widgets')

// Views - Components
const Cards = () => import('@/views/base/Cards')
const Forms = () => import('@/views/base/Forms')
const Switches = () => import('@/views/base/Switches')
const Tables = () => import('@/views/base/Tables')
const Tabs = () => import('@/views/base/Tabs')
const Breadcrumbs = () => import('@/views/base/Breadcrumbs')
const Carousels = () => import('@/views/base/Carousels')
const Collapses = () => import('@/views/base/Collapses')
const Jumbotrons = () => import('@/views/base/Jumbotrons')
const ListGroups = () => import('@/views/base/ListGroups')
const Navs = () => import('@/views/base/Navs')
const Navbars = () => import('@/views/base/Navbars')
const Paginations = () => import('@/views/base/Paginations')
const Popovers = () => import('@/views/base/Popovers')
const ProgressBars = () => import('@/views/base/ProgressBars')
const Tooltips = () => import('@/views/base/Tooltips')

// Views - Buttons
const StandardButtons = () => import('@/views/buttons/StandardButtons')
const ButtonGroups = () => import('@/views/buttons/ButtonGroups')
const Dropdowns = () => import('@/views/buttons/Dropdowns')
const BrandButtons = () => import('@/views/buttons/BrandButtons')

// Views - Icons
const Flags = () => import('@/views/icons/Flags')
const FontAwesome = () => import('@/views/icons/FontAwesome')
const SimpleLineIcons = () => import('@/views/icons/SimpleLineIcons')
const CoreUIIcons = () => import('@/views/icons/CoreUIIcons')

// Views - Notifications
const Alerts = () => import('@/views/notifications/Alerts')
const Badges = () => import('@/views/notifications/Badges')
const Modals = () => import('@/views/notifications/Modals')

// Views - Pages
const Page404 = () => import('@/views/pages/Page404')
const Page500 = () => import('@/views/pages/Page500')
const Login = () => import('@/views/pages/Login')
const Register = () => import('@/views/pages/Register')

// Users
const Users = () => import('@/views/users/Users')
const User = () => import('@/views/users/User')

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
            {
              path: 'izin',
              name: 'Izin',
              component: Izin,
              meta: { requiresAuth: true }
            }
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
            {
              path: 'trayek',
              name: 'Trayek',
              component: Trayek,
              meta: { requiresAuth: true }
            },
            {
              path: 'parkir',
              name: 'Parkir',
              component: Parkir,
              meta: { requiresAuth: true }
            },
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
          path: 'icons',
          redirect: '/icons/font-awesome',
          name: 'Icons',
          component: {
            render (c) { return c('router-view') }
          },
          children: [
            {
              path: 'coreui-icons',
              name: 'CoreUI Icons',
              component: CoreUIIcons
            },
            {
              path: 'flags',
              name: 'Flags',
              component: Flags
            },
            {
              path: 'font-awesome',
              name: 'Font Awesome',
              component: FontAwesome
            },
            {
              path: 'simple-line-icons',
              name: 'Simple Line Icons',
              component: SimpleLineIcons
            }
          ]
        },
        {
          path: 'base',
          redirect: '/base/cards',
          name: 'Base',
          component: {
            render (c) { return c('router-view') }
          },
          children: [
            {
              path: 'cards',
              name: 'Cards',
              component: Cards
            },
            {
              path: 'forms',
              name: 'Forms',
              component: Forms
            },
            {
              path: 'switches',
              name: 'Switches',
              component: Switches
            },
            {
              path: 'tables',
              name: 'Tables',
              component: Tables
            },
            {
              path: 'tabs',
              name: 'Tabs',
              component: Tabs
            },
            {
              path: 'breadcrumbs',
              name: 'Breadcrumbs',
              component: Breadcrumbs
            },
            {
              path: 'carousels',
              name: 'Carousels',
              component: Carousels
            },
            {
              path: 'collapses',
              name: 'Collapses',
              component: Collapses
            },
            {
              path: 'jumbotrons',
              name: 'Jumbotrons',
              component: Jumbotrons
            },
            {
              path: 'list-groups',
              name: 'List Groups',
              component: ListGroups
            },
            {
              path: 'navs',
              name: 'Navs',
              component: Navs
            },
            {
              path: 'navbars',
              name: 'Navbars',
              component: Navbars
            },
            {
              path: 'paginations',
              name: 'Paginations',
              component: Paginations
            },
            {
              path: 'popovers',
              name: 'Popovers',
              component: Popovers
            },
            {
              path: 'progress-bars',
              name: 'Progress Bars',
              component: ProgressBars
            },
            {
              path: 'tooltips',
              name: 'Tooltips',
              component: Tooltips
            }
          ]
        },
        {
          path: 'buttons',
          redirect: '/buttons/standard-buttons',
          name: 'Buttons',
          component: {
            render (c) { return c('router-view') }
          },
          children: [
            {
              path: 'standard-buttons',
              name: 'Standard Buttons',
              component: StandardButtons
            },
            {
              path: 'button-groups',
              name: 'Button Groups',
              component: ButtonGroups
            },
            {
              path: 'dropdowns',
              name: 'Dropdowns',
              component: Dropdowns
            },
            {
              path: 'brand-buttons',
              name: 'Brand Buttons',
              component: BrandButtons
            }
          ]
        }
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
        }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
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
