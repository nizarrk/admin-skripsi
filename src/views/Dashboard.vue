<template>
  <div class="animated fadeIn">
    <b-card bg-variant="light">
      <h4>Laporan Keluhan <b-badge>{{lapor.all}}</b-badge></h4>
      <b-row>
        <b-col sm="6" lg="3">
          <b-card no-body class="bg-warning">
            <b-card-body class="pb-0">
              <i class="fa fa-ticket float-right"></i>
              <h4 class="mb-0">{{lapor.menunggu}}</h4>
              <p>Menunggu</p>
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

    <b-card bg-variant="light">
      <h4>Izin Penggunaan Jalan <b-badge>{{izin.all}}</b-badge></h4>
      <b-row>
        <b-col sm="6" lg="3">
          <b-card no-body class="bg-warning">
            <b-card-body class="pb-0">
              <i class="fa fa-ticket float-right"></i>
              <h4 class="mb-0">{{izin.menunggu}}</h4>
              <p>Menunggu</p>
            </b-card-body>
          </b-card>
        </b-col>
        <b-col sm="6" lg="3">
          <b-card no-body class="bg-primary">
            <b-card-body class="pb-0">
              <i class="fa fa-spinner float-right"></i>
              <h4 class="mb-0">{{izin.proses}}</h4>
              <p>Proses</p>
            </b-card-body>
          </b-card>
        </b-col>
        <b-col sm="6" lg="3">
          <b-card no-body class="bg-success">
            <b-card-body class="pb-0">
              <i class="fa fa-check-square float-right"></i>
              <h4 class="mb-0">{{izin.selesai}}</h4>
              <p>Selesai</p>
            </b-card-body>
          </b-card>
        </b-col>
        <b-col sm="6" lg="3">
          <b-card no-body class="bg-danger">
            <b-card-body class="pb-0">
              <i class="fa fa-window-close float-right"></i>
              <h4 class="mb-0">{{izin.ditolak}}</h4>
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
        menunggu: 0,
        proses: 0,
        selesai: 0,
        ditolak: 0
      },
      izin: {
        all: 0,
        menunggu: 0,
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
      let lapor0 = await axios().get('/dashboard/lapor');
      this.lapor.all = lapor0.data.values[0].total;
      
      let lapor1 = await axios().get('/dashboard/lapor/menunggu');
      this.lapor.menunggu = lapor1.data.values[0].menunggu;
      let lapor2 = await axios().get('/dashboard/lapor/proses');
      this.lapor.proses = lapor2.data.values[0].proses;
      let lapor3 = await axios().get('/dashboard/lapor/selesai');
      this.lapor.selesai = lapor3.data.values[0].selesai;
      let lapor4 = await axios().get('/dashboard/lapor/ditolak');
      this.lapor.ditolak = lapor4.data.values[0].ditolak;

      // count izin
      let izin0 = await axios().get('/dashboard/izin');
      this.izin.all = izin0.data.values[0].total;
      let izin1 = await axios().get('/dashboard/izin/menunggu');
      this.izin.menunggu = izin1.data.values[0].menunggu;
      let izin2 = await axios().get('/dashboard/izin/proses');
      this.izin.proses = izin2.data.values[0].proses;
      let izin3 = await axios().get('/dashboard/izin/selesai');
      this.izin.selesai = izin3.data.values[0].selesai;
      let izin4 = await axios().get('/dashboard/izin/ditolak');
      this.izin.ditolak = izin4.data.values[0].ditolak;

      // count survey
      let survey = await axios().get('/dashboard/survey');
      this.survey = survey.data.values.length;

      // count kritik
      let kritik = await axios().get('/dashboard/kritik');
      this.kritik = kritik.data.values[0].total;
    } catch (error) {
      console.log(error.message);
      
    }
  },
  methods: {
  }
}
</script>