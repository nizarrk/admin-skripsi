export default {
  items: [
    {
      name: 'Dashboard',
      url: '/dashboard',
      icon: 'icon-speedometer'
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
          icon: 'icon-map'
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
    // {
    //   name: 'Perparkiran',
    //   url: '/info/parkir',
    //   icon: 'fa fa-car'
    // },
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
          icon: 'fa fa-file'
        },
        {
          name: 'Hasil',
          url: '/survey/hasil',
          icon: 'fa fa-folder'
        }
      ]
    },
    {
      name: 'Kritik & Saran',
      url: '/kritik',
      icon: 'fa fa-smile-o'
    },
    
  ]
}
