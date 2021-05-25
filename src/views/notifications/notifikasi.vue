<template>
<div>
  <b-button variant="warning" class="mb-2" v-b-modal.modal-confirm> <span class="fa fa-check"></span>Tandai semua</b-button>
  <div v-for="(item, index) in items" :key="index">
    <b-card 
      :class="item.status == 0 ? 'notif-new' : ''" 
      :style="item.status == 0 ? 'background-color:#E5E9F2' : ''" 
      :title="item.type" 
      :sub-title="formatTgl(item.created_at)">

      <b-card-text>
        Pemberitahuan baru dari <b>{{item.originator.name}}</b>.
      </b-card-text>

      <b-card-text>{{item.description}}</b-card-text>

      <!-- <a href="#" class="card-link">Card link</a> -->
      <b-link v-show="item.status == 0" @click="updateStatus(item.id)" class="card-link"><span class="fa fa-check"></span> Tandai sudah baca</b-link>
    </b-card>
  </div>
  <div>
    <center>
          <b-button 
            v-show="showButton" 
            class="mb-2" 
            variant="primary" 
            @click="loadMore">
              Load More <b-badge variant="light">{{total}}</b-badge>
          </b-button>
    </center>
  </div>
  <div v-show="showPreloader" class="text-center">
    <b-spinner label="Spinning"></b-spinner>
  </div>
  <!-- Modal Confirm -->
  <b-modal okTitle='Ya' cancelTitle='Tidak' okVariant='danger' id="modal-confirm" title="Konfirmasi" @ok="updateStatusAll">
    <p class="my-4">Apakah anda yakin tandai sudah baca semua?</p>
  </b-modal>
</div>
</template>

<script>
import axios from '@/config/axiosConfig';
import date from '@/mixins/dateConfig';

export default {
  name: 'Register',
  data () {
    return {
      items: [],
      total: 0,
      count: 0,
      page: 1, // pagination,

      // infinite scroll
      allowInfinite: true,
      showButton: true,
      showPreloader: false,

      //state
      state: ''
    }
  },
  created() {
    try {
      this.getData();

      // add badge new notif
        // let html = `&nbsp<span class="badge badge-danger" style="font-size: 12px;">Baru</span>`
        // setTimeout(() => {
        //   let selected = document.querySelectorAll('div.notif-new div.card-body h4');
          
        //   selected.forEach(x => {
        //     x.innerHTML += html
        //   });
        // }, 500);
    } catch (error) {
      console.log(error);
    }
  },
  methods: {
    async getData() {
      try {
        let result = await axios().get(`/notification/get?limit=20&page=${this.page}&order_by=id&order_direction=desc`);
        // this.page = result.data.data.nextPage;
        console.log(result.data.data);
        this.items = result.data.data.data;
        this.total = result.data.data.total;
      } catch (error) {
        console.log(error.response);
        this.makeToast(error.response.data.message, 'Terjadi Kesalahan', 'danger');
      }
    },

    async updateStatus(id) {
      try {
        await axios().put('/notification/status/' + id, {
          status: 1
        });

        this.state = 'markasread' + new Date().getTime();

        this.makeToast('Berhasil', 'Berhasil', 'success');

        this.getCount();
      } catch (error) {
        console.log(error.response);
        this.makeToast(error.response.data.message, 'Terjadi Kesalahan', 'danger');
      }
    },

    async updateStatusAll() {
      try {
        await axios().put('/notification/status', {
          status: 1
        });

        this.state = 'markasread' + new Date().getTime();

        this.makeToast('Berhasil', 'Berhasil', 'success');

        this.getCount();
      } catch (error) {
        console.log(error.response);
        this.makeToast(error.response.data.message, 'Terjadi Kesalahan', 'danger');
      }
    },

    loadMore() {
      console.log('masuk loadmore');
      console.log(this.items);
      const self = this;
      if (!self.allowInfinite) return;
      self.showPreloader = true;
      self.showButton = false;

      setTimeout(async () => {
        if (self.items.length >= self.total) {
          self.showButton = false;
          self.showPreloader = false;
          return;
        }
        self.page = self.page + 1;

        let result = await axios().get(`/notification/get?limit=20&page=${self.page}&order_by=id&order_direction=desc`);


        result.data.data.data.forEach(x => {
          self.items.push(x);
        });

        self.showPreloader = false;
        self.showButton = true;
      }, 1000);
    },

    async getCount() {
      let count = await axios().get('notification/count');
      this.count = count.data.data;
    },

    makeToast(text, title, variant = null) {
        this.$bvToast.toast(text, {
          title: title,
          variant: variant,
          solid: true
        })
    },
  },
  watch: {
    state: {
      async handler () {
        console.log(this.state);

        let limit = this.items.length;
        let result = await axios().get(`/notification/get?limit=${this.page > 1 ? limit : 20}&page=1&order_by=id&order_direction=desc`);
        // this.page = result.data.data.nextPage;
        console.log(result.data.data);
        this.items = result.data.data.data;
        this.total = result.data.data.total;
        this.getCount();
        
        let selected = document.querySelector('span.badge');

        selected.innerText = this.count;
      }
    }
  },
  mixins: [date]
}
</script>
