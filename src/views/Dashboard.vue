<template>
  <div class="animated fadeIn">
    <b-card bg-variant="light">
      <h4>Laporan Keluhan <b-badge>{{lapor.all}}</b-badge></h4>
      <b-row>
        <b-col sm="6" lg="3">
          <b-card no-body class="bg-warning">
            <b-card-body class="pb-0">
              <i class="fa fa-ticket float-right"></i>
              <h4 class="mb-0">{{lapor.pending}}</h4>
              <p>Pending</p>
            </b-card-body>
          </b-card>
        </b-col>
        <b-col sm="6" lg="3">
          <b-card no-body class="bg-primary">
            <b-card-body class="pb-0">
              <i class="fa fa-spinner float-right"></i>
              <h4 class="mb-0">{{lapor.proses}}</h4>
              <p>Proses</p>
            </b-card-body>
          </b-card>
        </b-col>
        <b-col sm="6" lg="3">
          <b-card no-body class="bg-success">
            <b-card-body class="pb-0">
              <i class="fa fa-check-square float-right"></i>
              <h4 class="mb-0">{{lapor.selesai}}</h4>
              <p>Selesai</p>
            </b-card-body>
          </b-card>
        </b-col>
        <b-col sm="6" lg="3">
          <b-card no-body class="bg-danger">
            <b-card-body class="pb-0">
              <i class="fa fa-window-close float-right"></i>
              <h4 class="mb-0">{{lapor.ditolak}}</h4>
              <p>Ditolak</p>
            </b-card-body>
          </b-card>
        </b-col>
      </b-row>
    </b-card>

    <b-row>
      <b-col>
        <b-card title="Survey Kepuasan Masyarakat" bg-variant="light">
          <b-card no-body class="bg-info">
            <b-card-body class="pb-0">
              <i class="icon-settings float-right"></i>
              <h4 class="mb-0">{{survey}}</h4>
              <p>Survey Masuk</p>
            </b-card-body>
          </b-card>
        </b-card>
      </b-col>
      <b-col>
        <b-card title="Kritik & Saran" bg-variant="light">
          <b-card no-body class="bg-info">
            <b-card-body class="pb-0">
              <i class="icon-settings float-right"></i>
              <h4 class="mb-0">{{kritik}}</h4>
              <p>Kritik & Saran Masuk</p>
            </b-card-body>
          </b-card>
        </b-card> 
      </b-col>
    </b-row> 
  </div>
</template>

<script>
import axios from '@/config/axiosConfig';

export default {
  name: 'dashboard',
  data: function () {
    return {
      lapor: {
        all: 0,
        pending: 0,
        proses: 0,
        selesai: 0,
        ditolak: 0
      },
      survey: 0,
      kritik: 0
    }
  },
  async created() {
    try {
      // count lapor
      let lapor = await axios().get('/dashboard/report');
      this.lapor.all = lapor.data.data.all;
      
      this.lapor.pending = lapor.data.data.waiting;
      this.lapor.proses = lapor.data.data.process;
      this.lapor.selesai = lapor.data.data.done;
      this.lapor.ditolak = lapor.data.data.rejected;

      // count survey
      let survey = await axios().get('/dashboard/survey');
      this.survey = survey.data.data.length;

      // count kritik
      let kritik = await axios().get('/dashboard/critic');
      this.kritik = kritik.data.data;
    } catch (error) {
      console.log(error.response);
      this.makeToast(error.response.data.message, 'Terjadi Kesalahan', 'danger');
    }
  },
  methods: {
    makeToast(text, title, variant = null) {
        this.$bvToast.toast(text, {
        title: title,
        variant: variant,
        solid: true
        })
    }
  }
}
</script>