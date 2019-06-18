<template>
    <div class="animated fadeIn">
        <b-container fluid>
            <b-card title="Izin Penggunaan Jalan">
            <!-- <b-button class="float-right" variant="danger" @click="deleteAll">Hapus Semua Survey</b-button><br> -->
                <!-- Main table element -->
                <b-table
                show-empty
                responsive
                :items="items"
                :fields="fields"
                :current-page="currentPage"
                :per-page="perPage"
                :filter="filter"
                :sort-by.sync="sortBy"
                :sort-desc.sync="sortDesc"
                :sort-direction="sortDirection"
                >
                <template slot="no" slot-scope="row">
                    {{ row.index + 1}}
                </template>

                <template slot="tgl_mulai_izin" slot-scope="row">
                    {{ formatTgl(row.item.tgl_mulai_izin) }} - {{ formatTgl(row.item.tgl_selesai_izin) }}
                </template>

                <template slot="jam_mulai_izin" slot-scope="row">
                    {{row.item.jam_mulai_izin.substr(0, 5) }} - {{row.item.jam_selesai_izin.substr(0, 5)}}
                </template>

                <template slot="lampiran" slot-scope="row">
                    <b-link @click="openModal('lampiran', row.item.id_izin )">Lihat</b-link>
                </template>

                <template slot="status_izin" slot-scope="row">
                    <b-badge v-show="row.value == 'Menunggu'" variant="warning">{{row.value}}</b-badge>
                    <b-badge v-show="row.value == 'Proses'" variant="primary">{{row.value}}</b-badge>
                    <b-badge v-show="row.value == 'Selesai'" variant="success">{{row.value}}</b-badge>
                    <b-badge v-show="row.value == 'Ditolak'" variant="danger">{{row.value}}</b-badge>
                </template>

                <template slot="actions" slot-scope="row">
                    <div class="mt-3" v-show="row.item.status_izin == 'Menunggu'">
                        <b-button-group>
                            <b-button v-b-tooltip.hover title="Terima" class="fa fa-check" variant="success" @click="openModal('terima', row.item.id_izin)"></b-button>
                            <b-button v-b-tooltip.hover title="Tolak" class="fa fa-close" variant="danger" @click="openModal('tolak', row.item.id_izin)"></b-button>
                        </b-button-group>
                    </div>
                    <div class="mt-3" v-show="row.item.status_izin == 'Proses'">
                        <b-button-group>
                            <b-button v-b-tooltip.hover title="Selesai" class="fa fa-check-circle" variant="success" @click="openModal('selesai', row.item.id_izin)"></b-button>
                        </b-button-group>
                    </div>
                    <div class="mt-3" v-show="row.item.status_izin == 'Ditolak'">
                        <b-button-group>
                            <b-button v-b-tooltip.hover title="Hapus" class="fa fa-trash" variant="danger" @click="openModal('hapus', row.item.id_izin)"></b-button>
                        </b-button-group>
                    </div>
                    
                </template>

                </b-table>

                <b-row>
                    <b-col md="6" class="my-1">
                        <b-pagination
                        v-model="currentPage"
                        :total-rows="totalRows"
                        :per-page="perPage"
                        class="my-0"
                        ></b-pagination>
                    </b-col>
                </b-row>
            </b-card>
        </b-container>
        <!-- Modal Lampiran -->
        <b-modal id="modal-1" title="Lampiran" ref="modal">
            <b-row>
                <b-col>
                    <b-img thumbnail fluid :src="lampiran[0]" alt="Image 1"></b-img>
                    <small>Surat dari Kelurahan</small>
                </b-col>
                <b-col>
                    <b-img thumbnail fluid :src="lampiran[1]" alt="Image 2"></b-img>
                    <small>Kartu Tanda Penduduk</small>
                </b-col>
                <b-col>
                    <b-img thumbnail fluid :src="lampiran[2]" alt="Image 3"></b-img>
                    <small>Kartu Keluarga</small>
                </b-col>
            </b-row>
        </b-modal>
        <!-- Modal Actions -->
        <b-modal okTitle='Ya' cancelTitle='Tidak' okVariant='danger' id="modal-action" title="Konfirmasi" @ok="handleOk">
            <p class="my-4">Apakah anda yakin {{form.act}} izin {{form.kode}}?</p>
            <b-form-group v-show="form.act == 'menolak'">
                <b-form-input
                    id="msg-input"
                    v-model="form.msg"
                    placeholder="Alasan Penolakan"
                    :required="form.act == 'menolak'"
                >
                </b-form-input>
            </b-form-group>
        </b-modal>
   </div>
</template>
<script>
import axios from '@/config/axiosConfig';
import date from '@/mixins/dateConfig';
export default {
    data() {
        return {
            baseURL: '',
            items: [],
            fields: [
                { key: 'no', label: 'No.', sortDirection: 'desc' },
                { key: 'kode_izin', label: 'Kode' },
                { key: 'nama_user', label: 'Nama User' },
                { key: 'alamat_user', label: 'Alamat User'},
                { key: 'telp_user', label: 'Telepon'},
                { key: 'kegiatan_izin', label: 'Jenis Kegiatan'},
                { key: 'lokasi_izin', label: 'Lokasi Kegiatan'},
                { key: 'tgl_mulai_izin', label: 'Tanggal Kegiatan'},
                { key: 'jam_mulai_izin', label: 'Jam Kegiatan'},
                { key: 'lampiran', label: 'Lampiran'},
                { key: 'status_izin', label: 'Status'},
                { key: 'actions', label: 'Actions' }
            ],
            totalRows: 1,
            currentPage: 1,
            perPage: 5,
            pageOptions: [5, 10, 15],
            sortBy: null,
            sortDesc: false,
            sortDirection: 'asc',
            filter: null,

            // lampiran
            lampiran: [],

            form: {
                id: '',
                kode: '',
                status: '',
                act: '',
                msg: null
            }
        }
    },
    async created() {
        try {
            let baseURL = await axios().request();
            this.baseURL = baseURL.config.baseURL;
            this.getData()
        } catch (error) {
            console.log(error.message);
            
        }
    },
    methods: {
        async getData() {
            try {
                let result = await axios().get('/izin/getall');
                this.items = result.data.values;

                // Set the initial number of items
                this.totalRows = this.items.length
            } catch (error) {
                console.log(error.message);
                
            }
        },
        async openModal(type, id) {
            try {
                let result = await axios().get('/izin/getall/' + id);
                this.form.id = result.data.values[0].id_izin;
                this.form.kode = result.data.values[0].kode_izin;
                
                console.log(result);
                if (type == 'terima') {
                    this.form.status = 'Proses';
                    this.form.act = 'menerima';
                    this.$bvModal.show('modal-action');
                } else if (type == 'tolak') {
                    this.form.status = 'Ditolak';
                    this.form.act = 'menolak'
                    this.$bvModal.show('modal-action');
                } else if (type == 'selesai') {
                    this.form.status = 'Selesai';
                    this.form.act = 'menyelesaikan'
                    this.$bvModal.show('modal-action');
                } else if (type == 'lampiran') {
                    this.lampiran = [this.baseURL + result.data.values[0].surat_izin, this.baseURL + result.data.values[0].ktp_izin, this.baseURL + result.data.values[0].kk_izin]
                    this.$bvModal.show('modal-1');         
                }          
            } catch (error) {
            console.log(error.message);
            this.makeToast(error.message, 'Terjadi Kesalahan', 'danger');
            
            }
        },
        makeToast(text, title, variant = null) {
            this.$bvToast.toast(text, {
            title: title,
            variant: variant,
            solid: true
            })
        },
        async handleOk(e) {
          try {
              if (document.getElementById('msg-input').checkValidity() == false) {
                  this.makeToast('Tulis pesan penolakan', 'Terjadi Kesalahan', 'danger');
                  e.preventDefault();
              } else {
                  let result = await axios().put('/izin/' + this.form.id, {
                    status: this.form.status,
                    pesan: this.form.msg
                  });
                  this.form.msg = '';
                  this.makeToast(`Berhasil ${this.form.act} ${this.form.id}`, 'Berhasil', 'success');
                  this.getData();
              }
          } catch (error) {
              this.makeToast(error.message, 'Terjadi Kesalahan', 'danger');
          }
        },
    },
    mixins: [date]
    
}
</script>

