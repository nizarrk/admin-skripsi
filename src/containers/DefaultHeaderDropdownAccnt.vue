<template>
  <AppHeaderDropdown right no-caret>
    <template slot="header">
      <img
        :src="baseURL + profile.foto_user"
        class="img-avatar"
        alt="admin" />
    </template>\
    <template slot="dropdown">
      <b-dropdown-header
        tag="div"
        class="text-center">
        <strong>Settings</strong>
      </b-dropdown-header>
      <b-dropdown-item><i class="fa fa-user" /> Profile</b-dropdown-item>
      <b-dropdown-item><i class="fa fa-wrench" /> Settings</b-dropdown-item>
      <b-dropdown-divider />
      <b-dropdown-item @click="logOut"><i class="fa fa-lock" /> Logout</b-dropdown-item>
    </template>
  </AppHeaderDropdown>
</template>

<script>
import { HeaderDropdown as AppHeaderDropdown } from '@coreui/vue'
import axios from '@/config/axiosConfig';
export default {
  name: 'DefaultHeaderDropdownAccnt',
  components: {
    AppHeaderDropdown
  },
  data: () => {
    return {
      baseURL: '',
      profile: [] 
      }
  },
  async created() {
    let baseURL = await axios().request();
    this.baseURL = baseURL.config.baseURL;
    let result = await axios().get('user/profile');
    this.profile = result.data.values[0];
  },
  methods: {
    logOut() {
      localStorage.removeItem('jwt');
      this.$router.push('/pages/login');
    }
  }
}
</script>
