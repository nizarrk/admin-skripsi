<template>
  <div class="app flex-row align-items-center">
    <div v-if="success == false" class="container">
      <b-row class="justify-content-center">
        <b-col md="6" sm="8">
          <b-card no-body class="mx-4">
            <b-card-body class="p-4">
              <b-form @submit="onSubmit">
                <h1>Reset Password</h1>
                <p class="text-muted">Masukkan password baru</p>

                <b-input-group class="mb-3">
                  <b-input-group-prepend>
                    <b-input-group-text><i class="icon-lock"></i></b-input-group-text>
                  </b-input-group-prepend>
                  <b-form-input v-model="password" type="password" class="form-control" placeholder="Password" autocomplete="new-password" />
                </b-input-group>

                <!-- <b-input-group class="mb-4">
                  <b-input-group-prepend>
                    <b-input-group-text><i class="icon-lock"></i></b-input-group-text>
                  </b-input-group-prepend>
                  <b-form-input type="password" class="form-control" placeholder="Repeat password" autocomplete="new-password" />
                </b-input-group> -->

                <b-button type="submit" variant="success" block>Reset</b-button>
              </b-form>
            </b-card-body>
          </b-card>
        </b-col>
      </b-row>
    </div>
    <div v-else class="container">
      <b-row class="justify-content-center">
        <b-col md="6" sm="8">
          <b-card>
            <h2 style="color:#0fad00">Success</h2>
            <img src="">
            <h3>Berhasil</h3>
            <p style="font-size:20px;color:#5C5C5C;">Password berhasil direset, silahkan login menggunakan password baru anda!</p>
          </b-card>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import axios from '@/config/axiosConfig';

export default {
  name: 'Redirect',
  data() {
      return {
        id: null,
        password: null,
        success: false
      }
  },
  created() {
      console.log(this.$route);

      let decoded = this.decodeJWT(this.$route.params.id);

      this.id = decoded;


  },
  methods: {
    decodeJWT(token) {
      console.log('decoding JWT token');
      if (token !== null || token !== undefined) {
          const base64String = token.split('.')[1];
          const decodedValue = JSON.parse(Buffer.from(base64String, 'base64').toString('ascii'));
          console.log(decodedValue);
          return decodedValue;
      }
      return null;
    },

    async onSubmit(e) {
      try {
        e.preventDefault();
        await axios().put('/user/reset/password', {
          id: this.id,
          pass: this.password
        });
        this.success = true;
        this.makeToast('Berhasil melakukan reset password', 'Berhasil', 'success');
      } catch (error) {
        console.log(error.response);
        this.makeToast(error.response.data.message, 'Terjadi Kesalahan', 'danger');
      }
    },

    makeToast(text, title, variant = null) {
      this.$bvToast.toast(text, {
        title: title,
        variant: variant,
        solid: true
      });
    },
  }
}
</script>
