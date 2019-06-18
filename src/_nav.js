export default {
  items: [
    {
      name: 'Dashboard',
      url: '/dashboard',
      icon: 'icon-speedometer',
      badge: {
        variant: 'primary',
        text: 'NEW'
      }
    },
    {
      title: true,
      name: 'Layanan',
      class: '',
      wrapper: {
        element: '',
        attributes: {}
      }
    },
    {
      name: 'Laporan Keluhan',
      url: '/layanan/keluhan',
      icon: 'fa fa-tasks',
      children: [
        {
          name: 'Data',
          url: '/layanan/keluhan/data',
          icon: 'icon-cursor'
        },
        {
          name: 'Map',
          url: '/layanan/keluhan/map',
          icon: 'icon-cursor'
        }
      ]
    },
    {
      name: 'Izin Penggunaan Jalan',
      url: '/layanan/izin',
      icon: 'fa fa-archive'
    },
    {
      title: true,
      name: 'Informasi',
      class: '',
      wrapper: {
        element: '',
        attributes: {}
      }
    },
    {
      name: 'Berita',
      url: '/info/berita',
      icon: 'fa fa-newspaper-o',
    },
    {
      name: 'Trayek',
      url: '/info/trayek',
      icon: 'fa fa-bus',
    },
    {
      name: 'Perparkiran',
      url: '/info/parkir',
      icon: 'fa fa-car'
    },
    {
      divider: true
    },
    {
      title: true,
      name: 'Lainnya'
    },
    {
      name: 'Survey Kepuasan',
      url: '/survey',
      icon: 'fa fa-file-archive-o',
      children: [
        {
          name: 'Master',
          url: '/survey/master',
          icon: 'icon-cursor'
        },
        {
          name: 'Survey',
          url: '/survey/data',
          icon: 'icon-cursor'
        },
        {
          name: 'Hasil',
          url: '/survey/hasil',
          icon: 'icon-cursor'
        }
      ]
    },
    {
      name: 'Kritik & Saran',
      url: '/kritik',
      icon: 'fa fa-smile-o',
      badge: {
        variant: 'secondary',
        text: 'NEW'
      }
    },
    {
      title: true,
      name: 'Bootstraps',
      class: '',
      wrapper: {
        element: '',
        attributes: {}
      }
    },
    {
      name: 'Icons',
      url: '/icons',
      icon: 'icon-star',
      children: [
        {
          name: 'CoreUI Icons',
          url: '/icons/coreui-icons',
          icon: 'icon-star',
          badge: {
            variant: 'info',
            text: 'NEW'
          }
        },
        {
          name: 'Flags',
          url: '/icons/flags',
          icon: 'icon-star'
        },
        {
          name: 'Font Awesome',
          url: '/icons/font-awesome',
          icon: 'icon-star',
          badge: {
            variant: 'secondary',
            text: '4.7'
          }
        },
        {
          name: 'Simple Line Icons',
          url: '/icons/simple-line-icons',
          icon: 'icon-star'
        }
      ]
    },
    {
      name: 'Base',
      url: '/base',
      icon: 'icon-puzzle',
      children: [
        {
          name: 'Breadcrumbs',
          url: '/base/breadcrumbs',
          icon: 'icon-puzzle'
        },
        {
          name: 'Cards',
          url: '/base/cards',
          icon: 'icon-puzzle'
        },
        {
          name: 'Carousels',
          url: '/base/carousels',
          icon: 'icon-puzzle'
        },
        {
          name: 'Collapses',
          url: '/base/collapses',
          icon: 'icon-puzzle'
        },
        {
          name: 'Forms',
          url: '/base/forms',
          icon: 'icon-puzzle'
        },
        {
          name: 'Jumbotrons',
          url: '/base/jumbotrons',
          icon: 'icon-puzzle'
        },
        {
          name: 'List Groups',
          url: '/base/list-groups',
          icon: 'icon-puzzle'
        },
        {
          name: 'Navs',
          url: '/base/navs',
          icon: 'icon-puzzle'
        },
        {
          name: 'Navbars',
          url: '/base/navbars',
          icon: 'icon-puzzle'
        },
        {
          name: 'Paginations',
          url: '/base/paginations',
          icon: 'icon-puzzle'
        },
        {
          name: 'Popovers',
          url: '/base/popovers',
          icon: 'icon-puzzle'
        },
        {
          name: 'Progress Bars',
          url: '/base/progress-bars',
          icon: 'icon-puzzle'
        },
        {
          name: 'Switches',
          url: '/base/switches',
          icon: 'icon-puzzle'
        },
        {
          name: 'Tables',
          url: '/base/tables',
          icon: 'icon-puzzle'
        },
        {
          name: 'Tabs',
          url: '/base/tabs',
          icon: 'icon-puzzle'
        },
        {
          name: 'Tooltips',
          url: '/base/tooltips',
          icon: 'icon-puzzle'
        }
      ]
    },
    {
      name: 'Buttons',
      url: '/buttons',
      icon: 'icon-cursor',
      children: [
        {
          name: 'Buttons',
          url: '/buttons/standard-buttons',
          icon: 'icon-cursor'
        },
        {
          name: 'Button Dropdowns',
          url: '/buttons/dropdowns',
          icon: 'icon-cursor'
        },
        {
          name: 'Button Groups',
          url: '/buttons/button-groups',
          icon: 'icon-cursor'
        },
        {
          name: 'Brand Buttons',
          url: '/buttons/brand-buttons',
          icon: 'icon-cursor'
        }
      ]
    },
  ]
}
