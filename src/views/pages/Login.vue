<template>
  <div class="app flex-row align-items-center">
    <div class="container">
      <b-row class="justify-content-center">
        <b-col md="8">
          <b-card-group>
            <b-card no-body class="p-4">
              <b-card-body>
                <b-form @submit="signIn">
                  <h1>Login</h1>
                  <p class="text-muted">Sign In to your account</p>
                  <b-input-group class="mb-3">
                    <b-input-group-prepend><b-input-group-text><i class="icon-user"></i></b-input-group-text></b-input-group-prepend>
                    <b-form-input type="text" v-model="username" class="form-control" placeholder="Username" />
                  </b-input-group>
                  <b-input-group class="mb-4">
                    <b-input-group-prepend><b-input-group-text><i class="icon-lock"></i></b-input-group-text></b-input-group-prepend>
                    <b-form-input type="password" v-model="password" class="form-control" placeholder="Password" />
                  </b-input-group>
                  <b-button type="submit" variant="primary" class="px-4 float-right">Login</b-button>
                </b-form>
              </b-card-body>
            </b-card>
          </b-card-group>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import axios from '@/config/axiosConfig';
import { log } from 'util';
export default {
  name: 'Login',
  data() {
    return {
      username: '',
      password: ''
    }
  },
  created() {
    if (localStorage.getItem('jwt') != null) {
      this.$router.push('/')
      console.log('1');
    }
  },
  methods: {
    async signIn(e) {
      try {
        e.preventDefault();
        let result = await axios().post('/user/login', {
            username: this.username,
            pass: this.password
          });
          console.log(result);
          
        
        let is_admin = result.data.data.row.is_admin;
        localStorage.setItem('jwt',result.data.data.assignToken);

        if (localStorage.getItem('jwt') != null){
            if(this.$route.params.nextUrl != null){
                this.$router.push(this.$route.params.nextUrl)
                console.log('1');
                
            }
            else {
                if(is_admin == 1){
                    this.$router.push('/')
                    console.log('2');
                    
                }
            }
        }
      } catch (error) {
        if (error.response.status == 400) {
          this.makeToast('Kombinasi email dan password salah', 'Terjadi Kesalahan', 'danger');
          console.log(error.response.statusText);
          
        } else if (error.response.status == 500) {
          this.makeToast(error.response.data.message, 'Terjadi Kesalahan', 'danger');
          console.log(error.response.statusText);
          
        } else {
          this.makeToast(error.response.data.message, 'Terjadi Kesalahan', 'danger');
          console.log(error.response.statusText);
        }    
      }
    },
    makeToast(text, title, variant = null) {
            this.$bvToast.toast(text, {
            title: title,
            variant: variant,
            solid: true
            })
        },
  }
}
</script>
