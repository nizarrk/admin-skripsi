<template>
  <div class="app">
    <AppHeader fixed>
      <SidebarToggler class="d-lg-none" display="md" mobile />
      <b-link class="navbar-brand" to="#">
        <img class="navbar-brand-full" src="img/dishub.png" width="150" alt="CoreUI Logo">
      </b-link>
      <SidebarToggler class="d-md-down-none" display="lg" />
      <b-navbar-nav class="ml-auto">
        <b-nav-item class="d-md-down-none">
          <b-dropdown size="lg"  variant="link" toggle-class="text-decoration-none" no-caret>
            <template slot="button-content">
              <i class="icon-bell"></i>
              <b-badge v-show="count > 0" pill variant="danger">{{count}}</b-badge>
            </template>
            <div style="width: 400px;">
              <b-dropdown-item 
              v-for="(item, index) in items" :key="index" 
              :style="item.status_notifikasi == 'Aktif' ? 'background-color:#E5E9F2' : ''"
              @click="updateStatus(item.id_notifikasi, item.tipe_notifikasi == 'Laporan Keluhan' ? 'lapor' : 'izin')">
                <div class="flex-column align-items-start">
                  <div class="d-flex w-100 justify-content-between">
                    <h5 class="mb-1">{{item.tipe_notifikasi}}</h5>
                    <small>{{timeDifference(item.tgl_notifikasi)}}</small>
                  </div>
                  <p class="mb-1">
                    Pemberitahuan baru dari <b>{{item.nama_user_notifikator}}</b>.
                  </p>
                  <small>{{item.desk_notifikasi}}</small>
                </div>
              </b-dropdown-item>
              <b-link id="all" @click="getAll">
                Lihat Semua
              </b-link>
              <!-- <b-list-group v-for="(item, index) in items" :key="index">
                <b-list-group-item href="#/layanan/keluhan/data" class="flex-column align-items-start" :style="item.status_notifikasi == 'Aktif' ? 'background-color:#E5E9F2' : ''">
                  <div class="d-flex w-100 justify-content-between">
                    <h5 class="mb-1">{{item.tipe_notifikasi}}</h5>
                    <small>{{timeDifference(item.tgl_notifikasi)}}</small>
                  </div>
                  <p class="mb-1">
                    Pemberitahuan baru dari <b>{{item.nama_user_notifikator}}</b>.
                  </p>
                  <small>{{item.desk_notifikasi}}</small>
                </b-list-group-item>
              </b-list-group> -->
              <!-- <b-button block variant="primary">Lihat Semua</b-button> -->
              </div>
          </b-dropdown>
        </b-nav-item>
        <DefaultHeaderDropdownAccnt/>
      </b-navbar-nav>
      <!--<AsideToggler class="d-lg-none" mobile />-->
    </AppHeader>
    <div class="app-body">
      <AppSidebar fixed>
        <SidebarHeader/>
        <SidebarForm/>
        <SidebarNav :navItems="nav"></SidebarNav>
        <SidebarFooter/>
        <SidebarMinimizer/>
      </AppSidebar>
      <main class="main">
        <Breadcrumb :list="list"/>
        <div class="container-fluid">
          <router-view></router-view>
        </div>
      </main>
    </div>
    <TheFooter>
      <!--footer-->
      <div>
        <a href="https://github.com/nizarrk">NRK</a>
        <span class="ml-1">&copy; 2019</span>
      </div>
      <div class="ml-auto">
        <span class="mr-1">Powered by</span>
        <a href="https://coreui.io">CoreUI for Vue</a>
      </div>
    </TheFooter>
  </div>
</template>

<script>
import nav from '@/_nav'
import { Header as AppHeader, SidebarToggler, Sidebar as AppSidebar, SidebarFooter, SidebarForm, SidebarHeader, SidebarMinimizer, SidebarNav, Aside as AppAside, AsideToggler, Footer as TheFooter, Breadcrumb } from '@coreui/vue'
import DefaultAside from './DefaultAside'
import DefaultHeaderDropdownAccnt from './DefaultHeaderDropdownAccnt'
import axios from '@/config/axiosConfig';
import date from '@/mixins/dateConfig';

export default {
  name: 'DefaultContainer',
  components: {
    AsideToggler,
    AppHeader,
    AppSidebar,
    AppAside,
    TheFooter,
    Breadcrumb,
    DefaultAside,
    DefaultHeaderDropdownAccnt,
    SidebarForm,
    SidebarFooter,
    SidebarToggler,
    SidebarHeader,
    SidebarNav,
    SidebarMinimizer
  },
  data () {
    return {
      nav: nav.items,
      items: [],
      count: 0
    }
  },
  computed: {
    name () {
      return this.$route.name
    },
    list () {
      return this.$route.matched.filter((route) => route.name || route.meta.label )
    }
  },
  async created() {
    try {
      this.getData();
      this.getCount();
      console.log(this.items);
      
    } catch (error) {
      console.log(error);
    }
  },
  methods: {
    async updateStatus(id, type) {
      try {
        if (type == 'lapor') {
          this.$router.push('/layanan/keluhan/data');
        } else if (type == 'izin') {
          this.$router.push('/layanan/izin');
        }

        await axios().put('/notif/' + id, {
          status: 'Tidak Aktif'
        });

        this.getData();
        this.getCount();
      } catch (error) {
        console.log(error.message);
      }
    },
    async getData() {
      let result = await axios().get('/notif/limit');
      this.items = result.data.values;
    },
    async getAll() {
      let result = await axios().get('/notif/');
      this.items = result.data.values;
      document.getElementById('all').style.display = 'none';
    },
    async getCount() {
      let count = await axios().get('notif/count');
      this.count = count.data.values[0].count;
    }
  },
  mixins: [date]
}
</script>
