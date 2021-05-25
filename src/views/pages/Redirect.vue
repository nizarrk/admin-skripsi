<template>
  <div>
      Redirecting ...
  </div>
</template>

<script>
export default {
  name: 'Redirect',
  data() {
      return {

      }
  },
  created() {
      let load = window.open(`lapordishub://`, "_self");
      window.onload = load;
      
      setTimeout(() => {
          window.open('https://play.google.com/store/apps/', "_self");
      }, 1000);
  }
}
</script>
