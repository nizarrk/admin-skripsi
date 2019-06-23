<template>
<div class="animated fadeIn">
    <b-container fluid>
        <b-card title="Laporan Keluhan">
            <div class="float-right" style="margin-top: -40px;">
                <b-form inline>
                    <span
                    @click="clearSearch"
                    v-show="search != ''"
                    class="fa fa-close" 
                    style="cursor: pointer; color: #F86C6B;  position: absolute;right: 75px; top: 28px;"
                    ></span>
                    <b-input
                    v-model="search"
                    id="inline-form-input-cari"
                    class="mb-2 mr-sm-2 mb-sm-0"
                    placeholder="Cari lokasi atau wilayah"
                    ></b-input>

                    <b-button variant="primary" @click="cari"><i class="fa fa-search"></i></b-button>
                </b-form>
            </div>
        <!-- <b-button class="float-right" variant="danger" @click="deleteAll">Hapus Semua Survey</b-button><br> -->
            <!-- Main table element -->
            <b-table
            style="padding-top: 10px"
            responsive 
            show-empty
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

            <template slot="foto_lapor" slot-scope="row">
                <b-img 
                @click="modalImg(baseURL + row.value, row.item.desk_lapor)" 
                id="myImg" 
                :src="baseURL + row.value" 
                style="max-height: 100px; max-width:100px;"
                >
                </b-img>
            </template>

            <template slot="total_komentar" slot-scope="row">
                <b-link @click="openModal('komentar', row.item.id_lapor )">Lihat<b-badge variant="light">({{row.value}})</b-badge></b-link>
            </template>

            <template slot="status_lapor" slot-scope="row">
                <b-badge v-show="row.value == 'Menunggu'" variant="warning">{{row.value}}</b-badge>
                <b-badge v-show="row.value == 'Proses'" variant="primary">{{row.value}}</b-badge>
                <b-badge v-show="row.value == 'Selesai'" variant="success">{{row.value}}</b-badge>
                <b-badge v-show="row.value == 'Ditolak'" variant="danger">{{row.value}}</b-badge>
            </template>

            <template slot="tgl_lapor" slot-scope="row">
                {{formatTglFull(row.value)}}
            </template>

            <template slot="actions" slot-scope="row">
                <div class="mt-3" v-show="row.item.status_lapor == 'Menunggu'">
                    <b-button-group>
                        <b-button 
                        v-b-tooltip.hover 
                        title="Terima" 
                        class="fa fa-check" 
                        variant="success" 
                        @click="openModal('terima', row.item.id_lapor)"
                        >
                        </b-button>
                        <b-button 
                        v-b-tooltip.hover 
                        title="Tolak" 
                        class="fa fa-close" 
                        variant="danger" 
                        @click="openModal('tolak', row.item.id_lapor)"
                        >
                        </b-button>
                    </b-button-group>
                </div>
                <div class="mt-3" v-show="row.item.status_lapor == 'Proses'">
                    <b-button-group>
                        <b-button 
                        v-b-tooltip.hover 
                        title="Selesai" 
                        class="fa fa-check-circle" 
                        variant="success" 
                        @click="openModal('selesai', row.item.id_lapor)"
                        >
                        </b-button>
                    </b-button-group>
                </div>
                <div class="mt-3" v-show="row.item.status_lapor == 'Ditolak'">
                    <b-button-group>
                        <b-button 
                        v-b-tooltip.hover 
                        title="Hapus" 
                        class="fa fa-trash" 
                        variant="danger" 
                        @click="openModal('hapus', row.item.id_lapor)"
                        >
                        </b-button>
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
            <div style="padding-top: 10px;">
                <center>
                <table cellpadding="0" cellspacing="0" border="0">
                    <tbody>
                        <tr>      
                            <td><b-badge variant="light">Jumlah Laporan Keluhan</b-badge></td>      
                            <td width="30" align="center"><b>:</b></td>      
                            <td width="60"><b-badge variant="warning">Menunggu</b-badge></td>      
                            <td width="60"><b>:</b> <b-badge variant="default">{{totalMenunggu}}</b-badge></td>      
                            <td width="60"><b-badge variant="primary">Proses</b-badge></td>      
                            <td width="50"><b>:</b> <b-badge variant="default">{{totalProses}}</b-badge></td>      
                            <td width="60"><b-badge variant="success">Selesai</b-badge></td>      
                            <td width="40"><b>:</b> <b-badge variant="default">{{totalSelesai}}</b-badge></td>
                            <td width="60"><b-badge variant="danger">Ditolak</b-badge></td>      
                            <td width="40"><b>:</b> <b-badge variant="default">{{totalDitolak}}</b-badge></td>
                        </tr>
                        <tr>      
                            <td><b-badge variant="light">Total Laporan Keluhan</b-badge></td>      
                            <td align="center"><b>:</b></td>
                            <td><b-badge variant="default">{{totalRows}}</b-badge></td>
                        </tr>
                    </tbody>
                </table>
                </center>
            </div>
        </b-card>
    </b-container>
    <b-modal id="modal-1" title="Komentar" ref="modal" @ok="postComment">
        <div style="overflow-y: scroll; height:300px;">
            <div v-for="(item, index) in komentar" :key="index">
                <div v-if="item.id_user != admin" class="container">
                    <b-button-group size="sm" class="float-right">
                        <b-button 
                        v-b-tooltip.hover 
                        title="Hapus" 
                        class="fa fa-trash" 
                        variant="light"
                        @click="openModal('hapus komentar', form.id, item.id_komentar)" 
                        >
                        </b-button>
                    </b-button-group>
                    <img :src="baseURL + item.foto_user" alt="Avatar">
                    <p><b>{{item.nama_user}}</b><br>{{item.desk_komentar}}</p>
                    <span class="time-right">{{timeDifference(item.tgl_komentar)}}</span>
                </div>

                <div v-else class="container darker">
                    <img :src="baseURL + item.foto_user" alt="Avatar" class="right">
                    <p>{{item.desk_komentar}}</p>
                    <span class="time-left">
                        {{timeDifference(item.tgl_komentar)}}
                        <b-button-group size="sm">
                            <b-button 
                            v-b-tooltip.hover 
                            title="Edit" 
                            class="fa fa-edit" 
                            variant="default"
                            @click="setEditKomentar(item.id_komentar, item.desk_komentar)" 
                            >
                            </b-button>
                            <b-button 
                            v-b-tooltip.hover 
                            title="Hapus" 
                            class="fa fa-trash" 
                            variant="default"
                            @click="openModal('hapus komentar', form.id, item.id_komentar)" 
                            >
                            </b-button>
                        </b-button-group>
                    </span>
                </div>
            </div>
        </div>
        <div style="padding-top: 10px;">
            <span
            @click="clearEditKomentar"
            v-show="form.act == 'edit komentar'"
            class="fa fa-close" 
            style="cursor: pointer; color: #F86C6B;  position: absolute;right: 25px; top: 330px;"
            ></span>
            <b-form-textarea
            id="textarea-komentar"
            placeholder="Ketik Komentar"
            v-model="msg"
            required
            ></b-form-textarea>
        </div>
    </b-modal>
    <!-- Modal Actions -->
    <b-modal :size="form.act == 'menghapus komentar' ? 'sm' : ''" okTitle='Ya' cancelTitle='Tidak' okVariant='danger' id="modal-action" title="Konfirmasi" @ok="handleOk">
        <p v-if="form.act == 'menghapus komentar'" class="my-4">Apakah anda yakin {{form.act}} {{idkomen}}?</p>
        <p v-else class="my-4">Apakah anda yakin {{form.act}} {{form.kode}}?</p>
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
    <!-- Modal Img -->
    <div id="myModal" class="modal">
        <span class="close">&times;</span>
        <img class="modal-content" id="img01">
        <div id="caption"></div>
    </div>
</div>
</template>
<script>
import axios from '@/config/axiosConfig';
import date from '@/mixins/dateConfig';
import { log } from 'util';
export default {
    data() {
        return {
            baseURL: '',
            items: [],
            fields: [
                { key: 'no', label: 'No.', sortDirection: 'desc' },
                { key: 'kode_lapor', label: 'Kode' },
                { key: 'nama_user', label: 'Nama User' },
                { key: 'alamat_user', label: 'Alamat User'},
                { key: 'telp_user', label: 'Telepon'},
                { key: 'kat_lapor', label: 'Kategori'},
                { key: 'desk_lapor', label: 'Deskripsi'},
                { key: 'lokasi_lapor', label: 'Lokasi'},
                { key: 'lokasi_kec_lapor', label: 'Wilayah'},
                { key: 'foto_lapor', label: 'Foto'},
                { key: 'total_komentar', label: 'Komentar'},
                { key: 'total_vote', label: 'Vote'},
                { key: 'status_lapor', label: 'Status'},
                { key: 'tgl_lapor', label: 'Tanggal Lapor'},
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

            form: {
                id: '',
                user: '',
                kode: '',
                status: '',
                act: '',
                msg: null
            },

            search: '',
            img: null,

            // komentar
            idkomen: null,
            msg: '',
            admin: '',
            komentar: [],

            // count
            totalDitolak: 0,
            totalMenunggu: 0,
            totalProses: 0,
            totalSelesai: 0,

        }
    },
    async created() {
        try {
            
            let baseURL = await axios().request();
            this.baseURL = baseURL.config.baseURL;
            let decode = this.$jwt.decode();
            this.admin = decode.userId;
            console.log(this.admin);
            
            this.getData();
        } catch (error) {
            console.log(error.mmessage);
            this.makeToast(error.message, 'Terjadi Kesalahan', 'danger');
        }
    },
    methods: {
        async getData() {
            try {
                let result = await axios().get('/lapor/getall');
                this.items = result.data.values;
                // Set the initial number of items
                this.totalRows = this.items.length;
                this.totalMenunggu = result.data.values[0].total_menunggu;
                this.totalProses = result.data.values[0].total_proses;
                this.totalSelesai = result.data.values[0].total_selesai;
                this.totalDitolak = result.data.values[0].total_ditolak;
                
            } catch (error) {
                console.log(error.message);
                this.makeToast(error.message, 'Terjadi Kesalahan', 'danger');
            }
        },
        async getComment(id) {
            try {
                let result = await axios().get('/komentar/' + id);
                this.komentar = result.data.values;
                console.log('get comment called');
                console.log(this.komentar);
                
                
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
        async openModal(type, id, idkomen) {
            try {
                let getid = await axios().get('/lapor/getid/' + id);
                this.form.id = getid.data.values[0].id_lapor;
                this.form.kode = getid.data.values[0].kode_lapor;
                this.form.user = getid.data.values[0].id_user_lapor;
                
                
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
                } else if (type == 'komentar') {
                    this.getComment(this.form.id);
                    this.$bvModal.show('modal-1');         
                } else if (type == 'hapus komentar') {
                    this.idkomen = idkomen;
                    
                    this.form.act = 'menghapus komentar';
                    this.$bvModal.show('modal-action');         
                }       
            } catch (error) {
            console.log(error.message);
            this.makeToast(error.message, 'Terjadi Kesalahan', 'danger');
            
            }
        },
        async handleOk(e) {
          try {
              if (document.getElementById('msg-input').checkValidity() == false) {
                  document.getElementById('msg-input').classList.add('is-invalid')
                  e.preventDefault();
              } else {
                  if (this.form.act == 'menghapus komentar') {
                      await axios().delete('/komentar/' + this.idkomen);
                      this.makeToast(`Berhasil ${this.form.act} ${this.idkomen}`, 'Berhasil', 'success');
                      this.getComment(this.form.id);
                      this.getData();
                      this.msg = '';
                      this.idkomen = null;
                      console.log('delete');
                  } else {
                      let result = await axios().put('/lapor/status/' + this.form.id, {
                        status: this.form.status,
                        pesan: this.form.msg
                      });
                      this.form.msg = '';
                      this.makeToast(`Berhasil ${this.form.act} ${this.form.kode}`, 'Berhasil', 'success');
                      this.getData();

                      let notif = await axios().post('/notif/', {
                            id: this.admin,
                            user: this.form.user,
                            lapor: this.form.id,
                            tipe: 'Laporan Keluhan',
                            desk:  `Laporan ${this.form.kode} telah ${this.form.status == 'Proses' ? 'Diproses' : this.form.status}`,
                            status: 'Aktif'
                        });
                  }
              }
          } catch (error) {
              this.makeToast(error.message, 'Terjadi Kesalahan', 'danger');
          }
        },
        async cari() {
            try {
                console.log(this.search);
                
                if (this.search == '') {
                    this.getData();
                } else {
                    let result = await axios().get('/lapor/searchloc/' + this.search);
                    this.items = result.data.values;
                    console.log(result.data.values);
                    // Set the initial number of items
                    this.totalRows = this.items.length
                }
            } catch (error) {
                console.log(error.message);
                
            }
        },
        modalImg(img, desk) {
            this.img = img;
            // Get the modal
            var modal = document.getElementById("myModal");

            // Get the image and insert it inside the modal - use its "alt" text as a caption
            let modalImg = document.getElementById("img01");
            let captionText = document.getElementById("caption");

            modal.style.display = "block";
            modalImg.src = this.img;
            captionText.innerHTML = desk;
            

            // Get the <span> element that closes the modal
            var span = document.getElementsByClassName("close")[0];

            // When the user clicks on <span> (x), close the modal
            span.onclick = function() { 
                modal.style.display = "none";
            }
        },
        async postComment(e) {
            try {
                if (document.getElementById('textarea-komentar').checkValidity() == false) {
                    e.preventDefault();
                    document.getElementById('textarea-komentar').classList.add('is-invalid')
                } else {
                    e.preventDefault();
                    if (this.idkomen == null) {
                        console.log('post');
                        let comment = await axios().post('/komentar', {
                            idlapor: this.form.id,
                            desk: this.msg
                        });
                        this.getComment(this.form.id);
                        this.msg = '';
                        this.makeToast('Berhasil menambahkan komentar', 'Berhasil', 'success');

                        let notif = await axios().post('/notif/', {
                            id: this.admin,
                            user: this.komentar[0].id_user_lapor,
                            lapor: this.form.id,
                            tipe: 'Komentar',
                            desk:  `Anda mendapat komentar baru pada laporan ${this.form.kode}`,
                            status: 'Aktif'
                        }); 
                    } else {
                        this.form.act = '';
                        console.log('put');
                        let update = await axios().put('/komentar', {
                            desk: this.msg,
                            id: this.idkomen
                        });
                        this.getComment(this.form.id);
                        this.msg = '';
                        this.idkomen = null;
                        this.makeToast('Berhasil mengubah komentar', 'Berhasil', 'success');
                    }
                }
            } catch (error) {
                console.log(error.message);
                this.makeToast(error.message, 'Terjadi Kesalahan', 'danger');
                
            }
        },
        setEditKomentar(id, desk) {
            this.form.act = 'edit komentar';
            this.idkomen = id;
            this.msg = desk;
        },
        clearEditKomentar() {
            this.form.act = '';
            this.idkomen = null;
            this.msg = '';
        },
        clearSearch() {
            this.search = '';
            this.getData();
        }
    },
    mixins: [date]
}
</script>
<style scoped>
.container {
  border: 2px solid #dedede;
  background-color: #f1f1f1;
  border-radius: 5px;
  padding: 10px;
  margin: 10px 0;
}

.darker {
  border-color: #ccc;
  background-color: #ddd;
}

.container::after {
  content: "";
  clear: both;
  display: table;
}

.container img {
  float: left;
  width: 50px;
  height: 50px;
  object-fit: cover;
  margin-right: 20px;
  border-radius: 50%;
}

.container img.right {
  float: right;
  margin-left: 20px;
  margin-right:0;
}

.time-right {
  float: right;
  color: #aaa;
}

.time-left {
  float: left;
  color: #999;
}

#myImg {
  border-radius: 5px;
  cursor: pointer;
  transition: 0.3s;
}

#myImg:hover {opacity: 0.7;}

/* The Modal (background) */
.modal {
  display: none; /* Hidden by default */
  position: fixed; /* Stay in place */
  z-index: 1; /* Sit on top */
  padding-top: 100px; /* Location of the box */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  background-color: rgb(0,0,0); /* Fallback color */
  background-color: rgba(0,0,0,0.9); /* Black w/ opacity */
}

/* Modal Content (image) */
.modal-content {
  margin: auto;
  display: block;
  width: 80%;
  max-width: 500px;
}

/* Caption of Modal Image */
#caption {
  margin: auto;
  display: block;
  width: 80%;
  max-width: 700px;
  text-align: center;
  color: #ccc;
  padding: 10px 0;
  height: 150px;
}

/* Add Animation */
.modal-content, #caption {  
  -webkit-animation-name: zoom;
  -webkit-animation-duration: 0.6s;
  animation-name: zoom;
  animation-duration: 0.6s;
}

@-webkit-keyframes zoom {
  from {-webkit-transform:scale(0)} 
  to {-webkit-transform:scale(1)}
}

@keyframes zoom {
  from {transform:scale(0)} 
  to {transform:scale(1)}
}

/* The Close Button */
.close {
  position: absolute;
  top: 60px;
  right: 35px;
  color: #f1f1f1;
  font-size: 40px;
  font-weight: bold;
  transition: 0.3s;
}

.close:hover,
.close:focus {
  color: #bbb;
  text-decoration: none;
  cursor: pointer;
}

/* 100% Image Width on Smaller Screens */
@media only screen and (max-width: 700px){
  .modal-content {
    width: 100%;
  }
}
</style>


