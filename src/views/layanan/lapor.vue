<template>
<div class="animated fadeIn">
    <b-container fluid>
        <b-card title="Laporan Keluhan">
            <div class="float-right" style="margin-top: -40px;">
                <b-form inline>
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
                <b-img @click="modalImg(baseURL + row.value)" id="myImg" :src="baseURL + row.value" style="max-height: 100px; max-width:100px;"></b-img>
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
                        <b-button v-b-tooltip.hover title="Terima" class="fa fa-check" variant="success" @click="openModal('terima', row.item.id_lapor)"></b-button>
                        <b-button v-b-tooltip.hover title="Tolak" class="fa fa-close" variant="danger" @click="openModal('tolak', row.item.id_lapor)"></b-button>
                    </b-button-group>
                </div>
                <div class="mt-3" v-show="row.item.status_lapor == 'Proses'">
                    <b-button-group>
                        <b-button v-b-tooltip.hover title="Selesai" class="fa fa-check-circle" variant="success" @click="openModal('selesai', row.item.id_lapor)"></b-button>
                    </b-button-group>
                </div>
                <div class="mt-3" v-show="row.item.status_lapor == 'Ditolak'">
                    <b-button-group>
                        <b-button v-b-tooltip.hover title="Hapus" class="fa fa-trash" variant="danger" @click="openModal('hapus', row.item.id_lapor)"></b-button>
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
    <b-modal id="modal-1" title="Komentar" ref="modal">
        <div style="overflow-y: scroll; height:300px;">
            <div v-for="(item, index) in komentar" :key="index">
                <div class="container">
                    <img :src="baseURL + item.foto_user" alt="Avatar">
                    <p>{{item.desk_komentar}}</p>
                    <span class="time-right">{{timeDifference(item.tgl_komentar)}}</span>
                </div>

                <!-- <div class="container darker">
                    <img src="/w3images/avatar_g2.jpg" alt="Avatar" class="right">
                    <p>Hey! I'm fine. Thanks for asking!</p>
                    <span class="time-left">11:01</span>
                </div> -->
            </div>
        </div>
        <div style="padding-top: 10px;">
            <b-form-textarea
            id="textarea"
            placeholder="Enter something..."
            ></b-form-textarea>
        </div>
    </b-modal>
    <!-- Modal Actions -->
    <b-modal okTitle='Ya' cancelTitle='Tidak' okVariant='danger' id="modal-action" title="Konfirmasi" @ok="handleOk">
        <p class="my-4">Apakah anda yakin {{form.act}} laporan keluhan {{form.kode}}?</p>
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
            perPage: 10,
            pageOptions: [5, 10, 15],
            sortBy: null,
            sortDesc: false,
            sortDirection: 'asc',
            filter: null,

            form: {
                id: '',
                kode: '',
                status: '',
                act: '',
                msg: null
            },

            search: '',
            img: null,

            komentar: []

        }
    },
    async created() {
        try {
            let baseURL = await axios().request();
            this.baseURL = baseURL.config.baseURL;
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
                console.log(result.data.values);
                // Set the initial number of items
                this.totalRows = this.items.length
                
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
        async openModal(type, id) {
            try {
                let getid = await axios().get('/lapor/getid/' + id);
                this.form.id = getid.data.values[0].id_lapor;
                
                
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
                    let result = await axios().get('/komentar/getkomen/' + id);
                    this.komentar = result.data.values
                    
                    this.$bvModal.show('modal-1');         
                }          
            } catch (error) {
            console.log(error.message);
            this.makeToast(error.message, 'Terjadi Kesalahan', 'danger');
            
            }
        },
        async handleOk(e) {
          try {
              if (document.getElementById('msg-input').checkValidity() == false) {
                  this.makeToast('Tulis pesan penolakan', 'Terjadi Kesalahan', 'danger');
                  e.preventDefault();
              } else {
                  let result = await axios().put('/lapor/status/' + this.form.id, {
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
        modalImg(img) {
            this.img = img;
            // Get the modal
            var modal = document.getElementById("myModal");

            // Get the image and insert it inside the modal - use its "alt" text as a caption
            var img = document.getElementById("myImg");
            var modalImg = document.getElementById("img01");
            var captionText = document.getElementById("caption");

            modal.style.display = "block";
            modalImg.src = this.img;
            captionText.innerHTML = 'this.alt';
            

            // Get the <span> element that closes the modal
            var span = document.getElementsByClassName("close")[0];

            // When the user clicks on <span> (x), close the modal
            span.onclick = function() { 
                modal.style.display = "none";
            }
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


