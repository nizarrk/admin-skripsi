<template>
<div class="animated fadeIn">
    <b-container fluid>
        <b-card title="Laporan Keluhan">
            <div>
                <b-row>
                    <b-col>
                        <div class="mb-2 mr-sm-2 mb-sm-0">
                            <b-button-group>
                            <b-button 
                            class="fa fa-file-excel" 
                            variant="success" 
                            v-b-tooltip.hover 
                            title="Excel"
                            @click="exportExcel"
                            ></b-button>
                            <b-button 
                            class="fa fa-file-pdf" 
                            variant="danger" 
                            v-b-tooltip.hover 
                            title="PDF"
                            @click="exportPdf"
                            ></b-button>
                            </b-button-group>
                        </div>
                    </b-col>
                    <b-col cols="10">
                        <b-form inline class="float-right">
                            <b-form-select
                            class="mb-2 mr-sm-2 mb-sm-0"
                                v-model="search.selected"
                                :options="search.opt"
                                required
                            ></b-form-select>

                            <b-input
                                v-show="search.selected == 'Lokasi'"
                                v-model="search.query"
                                id="inline-form-input-cari"
                                class="mb-2 mr-sm-2 mb-sm-0"
                                placeholder="Cari"
                                required
                            ></b-input>

                            <b-form-select
                                v-show="search.selected == 'Jenis'"
                                class="mb-2 mr-sm-2 mb-sm-0"
                                v-model="search.jenis.selected"
                                :options="search.jenis.opt"
                                required
                            ></b-form-select>

                            <b-form-select
                                v-show="search.selected == 'Status'"
                                class="mb-2 mr-sm-2 mb-sm-0"
                                v-model="search.status.selected"
                                :options="search.status.opt"
                                required
                            ></b-form-select>

                            <b-form-datepicker id="start-datepicker" v-show="search.selected == 'Tanggal'" v-model="search.dates.start" class="mb-2 mr-sm-2 mb-sm-0"></b-form-datepicker>
                            <div v-show="search.selected == 'Tanggal'" class="mb-2 mr-sm-2 mb-sm-0"> - </div> 
                            <b-form-datepicker id="end-datepicker" v-show="search.selected == 'Tanggal'" v-model="search.dates.end" class="mb-2 mr-sm-2 mb-sm-0"></b-form-datepicker>

                            <b-button variant="primary" @click="cari"><i class="fa fa-search"></i></b-button>
                            <b-button class="ml-1" v-show="showDismissibleAlert == true" variant="danger" @click="clearSearch"><i class="fa fa-times"></i></b-button>
                        </b-form>
                    </b-col>
                </b-row>
                <b-alert 
                    :variant="search.found > 0 ? 'success' : 'warning'"   
                    :show="showDismissibleAlert"
                    dismissible
                    fade
                    @dismissed="showDismissibleAlert=false"
                    style="margin-top: 10px;"
                >
                        Ditemukan <b>{{search.found}}</b> laporan keluhan
                </b-alert>
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
            <!-- <template slot="no" slot-scope="row">
                {{ row.index + 1}}
            </template> -->

            <!-- <template #cell(description)="row">
                {{row.value | limitToDisplay(row.value)}}
            </template> -->

            <template #cell(image)="row">
                <b-img 
                @click="modalImg(baseURL + row.value, row.item.description)" 
                id="myImg" 
                :src="baseURL + row.value" 
                style="max-height: 100px; max-width:100px;"
                >
                </b-img>
            </template>

            <template #cell(total_comments)="row">
                <b-link @click="openModal('komentar', row.item.id )">Lihat<b-badge variant="light">({{row.value}})</b-badge></b-link>
            </template>
            

            <template #cell(status)="row">
                <b-badge v-show="row.value == 0" variant="warning">Pending</b-badge>
                <b-badge v-show="row.value == 1" variant="primary">Proses</b-badge>
                <b-badge v-show="row.value == 2" variant="success">Selesai</b-badge>
                <b-badge v-show="row.value == 3" variant="danger">Ditolak</b-badge>
            </template>

            <template #cell(created_at)="row">
                {{formatTglFull(row.value)}}
            </template>

            <template #cell(actions)="row">
                <div class="mt-3" v-show="row.item.status == 0">
                    <b-button-group>
                        <b-button 
                        v-b-tooltip.hover 
                        title="Detail" 
                        class="fa fa-eye" 
                        variant="primary" 
                        @click="openModal('lihat', row.item.id)"
                        >
                        </b-button>
                        <b-button 
                        v-b-tooltip.hover 
                        title="Terima" 
                        class="fa fa-check" 
                        variant="success" 
                        @click="openModal('terima', row.item.id)"
                        >
                        </b-button>
                        <b-button 
                        v-b-tooltip.hover 
                        title="Tolak" 
                        class="fa fa-close" 
                        variant="danger" 
                        @click="openModal('tolak', row.item.id)"
                        >
                        </b-button>
                    </b-button-group>
                </div>
                <div class="mt-3" v-show="row.item.status == 1">
                    <b-button-group>
                        <b-button 
                        v-b-tooltip.hover 
                        title="Detail" 
                        class="fa fa-eye" 
                        variant="primary" 
                        @click="openModal('lihat', row.item.id)"
                        >
                        </b-button>
                        <b-button 
                        v-b-tooltip.hover 
                        title="Selesai" 
                        class="fa fa-check-circle" 
                        variant="success" 
                        @click="openModal('selesai', row.item.id)"
                        >
                        </b-button>
                    </b-button-group>
                </div>
                <div class="mt-3" v-show="row.item.status == 2">
                    <b-button-group>
                        <b-button 
                        v-b-tooltip.hover 
                        title="Detail" 
                        class="fa fa-eye" 
                        variant="primary" 
                        @click="openModal('lihat', row.item.id)"
                        >
                        </b-button>
                        <!-- <b-button 
                        v-b-tooltip.hover 
                        title="Hapus" 
                        class="fa fa-trash" 
                        variant="danger" 
                        @click="openModal('hapus', row.item.id)"
                        >
                        </b-button> -->
                    </b-button-group>
                </div>
                <div class="mt-3" v-show="row.item.status == 3">
                    <b-button-group>
                        <b-button 
                        v-b-tooltip.hover 
                        title="Detail" 
                        class="fa fa-eye" 
                        variant="primary" 
                        @click="openModal('lihat', row.item.id)"
                        >
                        </b-button>
                        <!-- <b-button 
                        v-b-tooltip.hover 
                        title="Hapus" 
                        class="fa fa-trash" 
                        variant="danger" 
                        @click="openModal('hapus', row.item.id)"
                        >
                        </b-button> -->
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
            <b-row class="text-center mt-2">
                <b-col style="text-align: right" cols="4">
                    <b-badge variant="light">Total</b-badge>
                    <b>:</b> <b-badge variant="default">{{totalRows}}</b-badge>
                </b-col>
                <b-col>
                    <b-badge variant="warning">Pending</b-badge>      
                    <b>:</b> <b-badge variant="default">{{totalMenunggu}}</b-badge> 
                </b-col>
                <b-col>
                     <b-badge variant="primary">Proses</b-badge>      
                     <b>:</b> <b-badge variant="default">{{totalProses}}</b-badge>      
                </b-col>
                <b-col>
                    <b-badge variant="success">Selesai</b-badge>      
                    <b>:</b> <b-badge variant="default">{{totalSelesai}}</b-badge>
                </b-col>
                <b-col style="text-align:left" cols="4">
                    <b-badge variant="danger">Ditolak</b-badge>      
                    <b>:</b> <b-badge variant="default">{{totalDitolak}}</b-badge>
                </b-col>
            </b-row>
        </b-card>
    </b-container>
    <!-- Modal Comment  -->
    <b-modal id="modal-1" title="Komentar" ref="modal" @ok="postComment">
        <div style="overflow-y: scroll; height:300px;">
            <div v-for="(item, index) in komentar" :key="index">
                <div v-if="item.user_id !== admin" class="container">
                    <b-button-group size="sm" class="float-right">
                        <b-button 
                        v-b-tooltip.hover 
                        title="Hapus" 
                        class="fa fa-trash" 
                        variant="light"
                        @click="openModal('hapus komentar', form.id, item.id)" 
                        >
                        </b-button>
                    </b-button-group>
                    <img :src="baseURL + item.user.picture" alt="Avatar">
                    <p><b>{{item.user.name}}</b><br>{{item.description}}</p>
                    <span class="time-right">{{timeDifference(item.created_at)}}</span>
                </div>

                <div v-else class="container darker">
                    <img :src="baseURL + item.user.picture" alt="Avatar" class="right">
                    <p>{{item.description}}</p>
                    <span class="time-left">
                        {{timeDifference(item.created_at)}}
                        <b-button-group size="sm">
                            <b-button 
                            v-b-tooltip.hover 
                            title="Edit" 
                            class="fa fa-edit" 
                            variant="default"
                            @click="setEditKomentar(item.id, item.description)" 
                            >
                            </b-button>
                            <b-button 
                            v-b-tooltip.hover 
                            title="Hapus" 
                            class="fa fa-trash" 
                            variant="default"
                            @click="openModal('hapus komentar', form.id, item.id)" 
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
    <b-modal :size="form.act == 'menghapus komentar' ? 'sm' : ''" okTitle='Ya' cancelTitle='Tidak' okVariant='primary' id="modal-action" title="Konfirmasi" @ok="handleOk">
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
        <b-form-group v-show="form.act == 'menerima'" label="Jenis Kerusakan">
            <b-form-select
                id="level-input"
                v-model="form.level.selected"
                :options="form.level.opt"
                required
            ></b-form-select>
        </b-form-group>
    </b-modal>
    <!-- Modal Lihat -->
    <b-modal size="lg" id="modal-lihat" hide-footer title="Detail Lapor">
        <div>
            <b-tabs content-class="mt-3">
                <b-tab title="Detail" active>
                    <b-card style="border: 0px;">
                        <b-row>
                            <b-col col="5">
                                <div class="project-info-box mt-0">
                                    <h5>Deskripsi</h5>
                                    <p class="mb-0">{{lapor.description}}</p>
                                </div><!-- / project-info-box -->

                                <div class="project-info-box">
                                    <p><b>Oleh:</b> {{lapor.name}}</p>
                                    <p><b>Tanggal Lapor:</b> {{formatTglFull(lapor.created_at)}}</p>
                                    <p><b>Lokasi:</b> {{lapor.location}}</p>
                                    <p><b>Wilayah:</b> {{lapor.district}}</p>
                                    <p v-show="lapor.status == 1">
                                        <b>Jenis Kerusakan:</b> 
                                        {{lapor.level_note == 0 ? 'Ringan' : lapor.level_note == 1 ? 'Sedang' : 'Berat'}}
                                    </p>
                                    <p v-show="lapor.status == 3" style="color: red"><b>Penolakan:</b> {{lapor.reject_note}}</p>
                                </div><!-- / project-info-box -->

                            </b-col>
                            <b-col col="7">
                                <img :src="baseURL + lapor.image" alt="project-image" class="rounded">
                                <div class="project-info-box">
                                    <p><b>Kategori:</b> {{lapor.category}}</p>
                                    <p>
                                        <b>Status:</b> 
                                        <b-badge 
                                            :variant="lapor.status == 0 ? 'warning' 
                                            : lapor.status == 1 ? 'primary' 
                                            : lapor.status == 2 ? 'success' 
                                            : 'danger'">
                                                {{lapor.status == 0 ? 'Pending' 
                                                : lapor.status == 1 ? 'Proses' 
                                                : lapor.status == 2 ? 'Selesai' 
                                                : 'Ditolak' }}
                                        </b-badge>
                                    </p>
                                </div><!-- / project-info-box -->
                            </b-col>
                        </b-row>
                    </b-card>
                </b-tab>
                <b-tab title="User">
                      <b-card no-body class="overflow-hidden" style="border: 0px;">
                        <b-row no-gutters>
                            <b-col md="6">
                                <b-card-img :src="baseURL + lapor.picture" alt="Image" class="rounded-0"></b-card-img>
                            </b-col>
                            <b-col md="6">
                                <b-card-body :title="lapor.name" :sub-title="lapor.phone">
                                <b-card-text>
                                    {{ lapor.address }}
                                </b-card-text>
                                </b-card-body>
                            </b-col>
                        </b-row>
                    </b-card>
                </b-tab>
            </b-tabs>
        </div>
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
import moment from 'moment';
// Excel
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
// PDF
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import { log } from 'util';
export default {
    data() {
        return {
            baseURL: '',
            items: [],
            fields: [
                // { key: 'no', label: 'No.', sortDirection: 'desc' },
                { key: 'code', label: 'Kode' },
                { key: 'name', label: 'Nama User' },
                { key: 'category', label: 'Kategori'},
                { key: 'district', label: 'Wilayah'},
                { key: 'image', label: 'Foto'},
                { key: 'total_comments', label: 'Komentar'},
                { key: 'total_votes', label: 'Vote'},
                { key: 'status', label: 'Status'},
                { key: 'created_at', label: 'Tanggal Lapor'},
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
                msg: null,
                level: {
                    selected: 0,
                    opt: [{ text: 'Ringan', value: '0' }, { text: 'Sedang', value: 1 }, { text: 'Berat', value: 2 }]
                }
            },

            lapor: {},

            // search box
            search: {
                query: '',
                found: 0,
                selected: 'Lokasi',
                opt: ['Lokasi', 'Jenis', 'Status', 'Tanggal'],
                dates: {
                    start: new Date(),
                    end: new Date()
                },
                jenis: {
                    selected: 'Penerangan Jalan Umum (PJU)',
                    opt: ['Penerangan Jalan Umum (PJU)', 'Traffic Light', 'Rambu Lalu Lintas', 'Marka Jalan', 'Cermin Tikungan', 'Perlengkapan JKalan Lainnya']
                },
                status: {
                    selected: '0',
                    opt: [{ text: 'Pending', value: '0' }, { text: 'Proses', value: 1 }, { text: 'Selesai', value: 2 }, { text: 'Ditolak', value: 3 }]

                }
            },

            showDismissibleAlert: false,

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
            this.admin = decode.id;
            console.log(this.admin);
            
            this.getData();
        } catch (error) {
            console.log(error.response);
            this.makeToast(error.response.data.message, 'Terjadi Kesalahan', 'danger');
        }
    },
    methods: {
        async getData() {
            try {
                let result = await axios().get('/report/get');
                console.log(result.data.data);
                this.items = result.data.data;
                // Set the initial number of items
                this.totalRows = this.items.length;
                this.totalMenunggu = result.data.data[0].total_menunggu;
                this.totalProses = result.data.data[0].total_proses;
                this.totalSelesai = result.data.data[0].total_selesai;
                this.totalDitolak = result.data.data[0].total_ditolak;
                
            } catch (error) {
            console.log(error.response);
            this.makeToast(error.response.data.message, 'Terjadi Kesalahan', 'danger');
            }
        },

        async getComment(id) {
            try {
                let result = await axios().get('/comment/' + id);
                this.komentar = result.data.data;
                console.log('get comment called');
                console.log(this.admin);
                console.log(this.komentar);
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
            })
        },

        async openModal(type, id, idkomen) {
            try {
                let getid = await axios().get('/report/id/' + id);
                this.lapor = getid.data.data;
                this.form.id = getid.data.data.id;
                this.form.kode = getid.data.data.code;
                this.form.user = getid.data.data.user_id;
                
                
                if (type == 'terima') {
                    this.form.status = 1;
                    this.form.act = 'menerima';
                    this.$bvModal.show('modal-action');
                } else if (type == 'tolak') {
                    this.form.status = 3;
                    this.form.act = 'menolak'
                    this.$bvModal.show('modal-action');
                } else if (type == 'selesai') {
                    this.form.status = 2;
                    this.form.act = 'menyelesaikan'
                    this.$bvModal.show('modal-action');
                } else if (type == 'komentar') {
                    this.getComment(this.form.id);
                    this.$bvModal.show('modal-1');         
                } else if (type == 'hapus komentar') {
                    this.idkomen = idkomen;
                    
                    this.form.act = 'menghapus komentar';
                    this.$bvModal.show('modal-action');         
                } else if (type == 'lihat') {
                    this.form.act = 'melihat';
                    this.$bvModal.show('modal-lihat'); 
                }  
            } catch (error) {
            console.log(error.response);
            this.makeToast(error.response.data.message, 'Terjadi Kesalahan', 'danger');
            
            }
        },

        async handleOk(e) {
          try {
              if (document.getElementById('msg-input').checkValidity() == false || document.getElementById('level-input').checkValidity() == false) {
                  document.getElementById('msg-input').classList.add('is-invalid');
                  document.getElementById('level-input').classList.add('is-invalid');
                  e.preventDefault();
              } else {
                  if (this.form.act == 'menghapus komentar') {
                      await axios().put('/comment/remove/' + this.idkomen);
                      this.makeToast(`Berhasil ${this.form.act} ${this.idkomen}`, 'Berhasil', 'success');
                      this.getComment(this.form.id);
                      this.getData();
                      this.msg = '';
                      this.idkomen = null;
                      console.log('delete');
                  } else {
                      console.log(this.form.status);
                      let result = await axios().put('/report/status/' + this.form.id, {
                        status: this.form.status,
                        pesan: this.form.msg,
                        level: this.form.level.selected
                      });
                      this.form.msg = '';
                      this.makeToast(`Berhasil ${this.form.act} ${this.form.kode}`, 'Berhasil', 'success');
                      this.getData();

                      let notif = await axios().post('/notification/add', {
                            recipient_id: this.form.user,
                            report_id: this.form.id,
                            type: 'Laporan Keluhan',
                            desc:  `Laporan ${this.form.kode} telah ${this.form.status == 1 ? 'Diproses' : this.form.status == 2 ? 'Selesai' : this.form.status == 3 ? 'Ditolak' : ''}`
                        });
                  }
              }
          } catch (error) {
                console.log(error.response);
                this.makeToast(error.response.data.message, 'Terjadi Kesalahan', 'danger');this.makeToast(error.message, 'Terjadi Kesalahan', 'danger');
          }
        },

        async cari() {
            try {
                if (this.search.selected == 'Tanggal') this.search.query =  moment(this.search.dates.start).format('YYYY-MM-DD') + ',' + moment(this.search.dates.end).format('YYYY-MM-DD');
                if (this.search.selected == 'Jenis') this.search.query = this.search.jenis.selected;
                if (this.search.selected == 'Status') this.search.query = this.search.status.selected;
                
                if (this.search.query == '') {
                    this.showDismissibleAlert = false;
                    this.getData();
                } else {
                    this.showDismissibleAlert = true;

                    let result = await axios().get(`/report/search/?type=${this.search.selected}&q=${this.search.query}`);
                    this.items = result.data.data;
                    console.log(result.data.data);
                    // Set the initial number of items
                    this.search.found = this.items.length
                }
            } catch (error) {
                console.log(error);
                this.makeToast(error.response.data.message, 'Terjadi Kesalahan', 'danger');     
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
                        let comment = await axios().post('/comment/add', {
                            idlapor: this.form.id,
                            desk: this.msg
                        });
                        this.getComment(this.form.id);
                        this.msg = '';
                        this.makeToast('Berhasil menambahkan komentar', 'Berhasil', 'success');

                        let notif = await axios().post('/notification/add', {
                            user_id: this.comment.data.data.user_id,
                            report_id: this.form.id,
                            type: 'Komentar',
                            desc:  `Anda mendapat komentar baru pada laporan ${this.form.kode}`
                        }); 
                    } else {
                        this.form.act = '';
                        console.log('put');
                        let update = await axios().put('/comment/edit/' + this.idkomen, {
                            desk: this.msg
                        });
                        this.getComment(this.form.id);
                        this.msg = '';
                        this.idkomen = null;
                        this.makeToast('Berhasil mengubah komentar', 'Berhasil', 'success');
                    }
                }
            } catch (error) {
                console.log(error.response);
                this.makeToast(error.response.data.message, 'Terjadi Kesalahan', 'danger');
                
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
            this.showDismissibleAlert = false;
            this.search.query = '';
            this.getData();
        },

        exportExcel() {
            let data = this.items;
            const workbook = new ExcelJS.Workbook();
            let sheet = workbook.addWorksheet('Laporan Keluhan');

            let columnWidth = [10, 20, 20, 20, 30, 30, 10, 10, 20, 20];

            let alignCenter = {
                vertical: 'middle',
                'horizontal': 'center'
            };

            let border = {
                top: {
                    style: 'thin'
                },
                left: {
                    style: 'thin'
                },
                bottom: {
                    style: 'thin'
                },
                right: {
                    style: 'thin'
                }
            };

            let boldCell = function(cells) {
                cells.forEach(el => {
                    sheet.getCell(el).font = {
                        bold: true
                    }
                });
                return;
            }

            let row = 2;

            // header
            sheet.getCell("A1").value = "Kode";
            sheet.getCell("B1").value = "Nama User";
            sheet.getCell("C1").value = "Kategori";
            sheet.getCell("D1").value = "Wilayah";
            sheet.getCell("E1").value = "Lokasi";
            sheet.getCell("F1").value = "Foto";
            sheet.getCell("G1").value = "Komentar";
            sheet.getCell("H1").value = "Vote";
            sheet.getCell("I1").value = "Status";
            sheet.getCell("J1").value = "Tanggal Lapor";
            boldCell(["A1", "B1", "C1", "D1", "E1", "F1", "G1", "H1", "I1", "J1"]);
            // sheet.getRow(1).alignment = alignCenter;

            data.forEach(el => {
                sheet.getCell("A" + row).value = el.code;
                sheet.getCell("B" + row).value = el.name;
                sheet.getCell("C" + row).value = el.category;
                sheet.getCell("D" + row).value = el.district;
                sheet.getCell("E" + row).value = el.location;
                sheet.getCell("F" + row).value = el.image;
                sheet.getCell("G" + row).value = el.total_comments;
                sheet.getCell("H" + row).value = el.total_votes;
                sheet.getCell("I" + row).value = el.status == 0 ? 'Pending' : el.status == 1 ? 'Proses' : el.status == 2 ? 'Selesai' : 'Ditolak';
                sheet.getCell("J" + row).value = moment(el.created_at).format('DD-MM-YYYY HH:mm:ss');

                row++;
            });

            // Adjust column width
            sheet.columns.forEach((col, index) => {
                if (columnWidth[index]) {
                    col.width = columnWidth[index];
                }
            });

            // exporting
            let nameFile = "LaporanKeluhan_";
            workbook.xlsx.writeBuffer().then(function(datas) {
                var blob = new Blob([datas], {
                    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                });

                let currentTime = new Date().getDate().toString().padStart(2, "0") + (Number(new Date().getMonth()) + 1).toString().padStart(2, "0") + new Date().getFullYear();
                // saveAs(blob, "MasterDataDepartment_" + currentTime + ".xlsx");
                saveAs(blob, nameFile + currentTime + ".xlsx");
            })
            .catch(err => {
                console.log(err);
            })
        },

        exportPdf() {
            let doc = new jsPDF();
            let col = ["Kode","Nama User", "Kategori", "Wilayah", 
                        "Lokasi", "Foto", "Komentar", 
                        "Vote", "Status", "Tanggal Lapor"];
            // let col1 = ["Details", "Values"];
            let rows = [];
            // let rows1 = [];

            this.items.forEach(el => {      
                var temp = [el.code, el.name, el.category, el.district, el.location, 
                            el.image, el.total_comments, el.total_votes, 
                            el.status == 0 ? 'Pending' : el.status == 1 ? 'Proses' : el.status == 2 ? 'Selesai' : 'Ditolak', 
                            el.created_at];
                // var temp1 = [element.id,element.name];
                rows.push(temp);
                // rows1.push(temp1);

            });        

            doc.autoTable(col, rows, { startY: 10 });

            // doc.autoTable(col1, rows1, { startY: 60 });
            let currentTime = new Date().getDate().toString().padStart(2, "0") + (Number(new Date().getMonth()) + 1).toString().padStart(2, "0") + new Date().getFullYear();
            let nameFile = "LaporanKeluhan_" + currentTime + '.pdf';
            doc.save(nameFile);
        }
    },
    filters: {
        limitToDisplay(text) {
          if (text.length < 100) {
            return text;
          } else {
            return text.substring(0, 100) + ' ....';
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

/*Modal Lihat*/
.project-info-box {
  margin: 15px 0;
  background-color: #fff;
  /* padding: 30px 40px; */
  border-radius: 5px;
}

.project-info-box p {
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid #d5dadb;
}

.project-info-box p:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}
img {
    width: 100%;
    max-width: 100%;
    height: auto;
    -webkit-backface-visibility: hidden;
}
.rounded {
    border-radius: 5px !important;
}

/* 100% Image Width on Smaller Screens */
@media only screen and (max-width: 700px){
  .modal-content {
    width: 100%;
  }
}
</style>


