<template>
  <router-view></router-view>
</template>

<script>
export default {
  name: 'app',
  created(){
    // Return true / false - check if a JWT token is stored in cookies or local storage
      this.hastoken = this.$jwt.hasToken();
      console.log('has', this.hastoken);
      
      // Return token from cookies or local storage
      let token = this.$jwt.getToken();
      console.log('get', token);
      
      // Decode JWT token and return payload
      let decode = this.$jwt.decode();
      console.log('decode', decode);

      // if (decode == null) {
      //   this.$router.push('/pages/login');
      //   localStorage.removeItem('jwt');
      // }

      if (decode && decode.exp < Date.now() / 1000) {
        localStorage.removeItem('jwt');
        this.$router.push('/pages/login');
      } else {
        console.log('token valid');
        
      }
  }
}
</script>

<style lang="scss">
  // CoreUI Icons Set
  @import '~@coreui/icons/css/coreui-icons.min.css';
  /* Import Font Awesome Icons Set */
  $fa-font-path: '~font-awesome/fonts/';
  @import '~font-awesome/scss/font-awesome.scss';
  /* Import Simple Line Icons Set */
  $simple-line-font-path: '~simple-line-icons/fonts/';
  @import '~simple-line-icons/scss/simple-line-icons.scss';
  /* Import Flag Icons Set */
  @import '~flag-icon-css/css/flag-icon.min.css';
  /* Import Bootstrap Vue Styles */
  @import '~bootstrap-vue/dist/bootstrap-vue.css';
  // Import Main styles for this application
  @import 'assets/scss/style';
</style>
