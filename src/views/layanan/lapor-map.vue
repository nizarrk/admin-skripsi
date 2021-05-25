<template>
    <div class="animated fadeIn">
        <b-container fluid>
            <div class="mb-1">
                <b-form inline>
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
                <!-- <b-alert v-show="search.status == true" class="mb-2 mr-sm-2 mb-sm-0" variant="success" show><b>{{totalRows}}</b> Laporan ditemukan!</b-alert> -->
            </div>
            <b-card>
                <b-alert 
                :variant="search.found > 0 ? 'success' : 'warning'"   
                :show="showDismissibleAlert"
                dismissible
                fade
                @dismissed="showDismissibleAlert=false"
                >
                    Ditemukan <b>{{search.found}}</b> laporan keluhan
                </b-alert>
                <l-map style="height: 500px;" id="map" ref="myMap" :zoom="zoom" :center="center">
                    <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
                    <l-marker
                    v-for="(marker, index) in markers" :key="index"
                    id="marker"
                    v-show="address" 
                    :lat-lng="marker" >
                        <l-popup>
                            <b-row>
                                <b-col cols="5">
                                    <b-img 
                                    :src="baseURL + marker.foto" 
                                    style="max-height: 120px; max-width:100px;"
                                    @click="modalImg(baseURL + marker.foto, marker.desk)"
                                    >
                                    </b-img>
                                </b-col>
                                <b-col>
                                    <span><b>Nama Pelapor:</b> {{marker.nama}}</span><br>
                                    <span><b>Alamat Pelapor:</b> {{marker.alamat}}</span><br>
                                    <span><b>Telp Pelapor:</b> {{marker.telp}}</span><br>
                                    <span><b>Kecamatan:</b> {{marker.kec}}</span><br>
                                    <span><b>Lokasi:</b> {{marker.loc}}</span><br>
                                    <span>
                                        <b>Status:</b>
                                        <b-badge v-show="marker.status == 0" variant="warning">Pending</b-badge>
                                        <b-badge v-show="marker.status == 1" variant="primary">Proses</b-badge>
                                        <b-badge v-show="marker.status == 2" variant="success">Selesai</b-badge>
                                        <b-badge v-show="marker.status == 3" variant="danger">Ditolak</b-badge>
                                    </span>
                                </b-col>
                            </b-row>
                        </l-popup>
                    </l-marker>
                </l-map>
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
            <!-- Modal Img -->
            <div id="myModal" class="modal">
                <span id="close" class="close">&times;</span>
                <img class="modal-content" id="img01">
            <div id="caption"></div>
        </div>
        </b-container>        
    </div>
</template>

<script>
import {LMap, LTileLayer, LMarker, LPopup} from 'vue2-leaflet';
import axios from '@/config/axiosConfig';
import moment from 'moment';

export default {
    components: {
      LMap,
      LTileLayer,
      LMarker,
      LPopup,
    },
    data() {
        return {
            baseURL: '',
            items: [],
            zoom:13,
            center: L.latLng(-7.470475, 112.440132),
            url:'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
            attribution:'&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
            markers: [], 
            address: null,
            totalRows: 0,
            totalDitolak: 0,
            totalMenunggu: 0,
            totalProses: 0,
            totalSelesai: 0,

            showDismissibleAlert: false,

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
            }
        }
    },
    async created() {
        try {
            let baseURL = await axios().request();
            this.baseURL = baseURL.config.baseURL;
            this.getData();
        } catch (error) {
            this.makeToast(error.message, 'Terjadi Kesalahan', 'danger');
        }
    },
    methods: {
        async getData() {
            try {
                let marker = null;
                let result = await axios().get('/report/get');
                this.totalMenunggu = result.data.data[0].total_menunggu;
                this.totalProses = result.data.data[0].total_proses;
                this.totalSelesai = result.data.data[0].total_selesai;
                this.totalDitolak = result.data.data[0].total_ditolak;
                
                this.markers = await Promise.all(
                    result.data.data.map((e, i) => {
                        marker = {
                            lat: e.latitude, 
                            lng: e.longitude, 
                            loc: e.location, 
                            kec: e.district,
                            foto: e.image, 
                            nama: e.name, 
                            alamat: e.address, 
                            telp: e.phone,
                            status: e.status,
                            desk: e.description,
                            level: e.level_note,
                            reject: e.reject_note
                        };

                            return marker;
                    })
                );

                this.totalRows = this.markers.length
                console.log(this.markers);
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
        async cari() {
            try {
                if (this.search.selected == 'Tanggal') this.search.query =  moment(this.search.dates.start).format('YYYY-MM-DD') + ',' + moment(this.search.dates.end).format('YYYY-MM-DD');
                if (this.search.selected == 'Jenis') this.search.query = this.search.jenis.selected;
                if (this.search.selected == 'Status') this.search.query = this.search.status.selected;
                
                if (this.search.query == '') {
                    this.showDismissibleAlert == false;
                    this.getData();
                } else {
                    this.showDismissibleAlert = true;
                    let result = await axios().get(`/report/search/?type=${this.search.selected}&q=${this.search.query}`);
                    this.markers = await Promise.all(
                        result.data.data.map((e, i) => {
                            let marker = {
                                lat: e.latitude, 
                                lng: e.longitude, 
                                loc: e.location, 
                                kec: e.district,
                                foto: e.image, 
                                nama: e.name, 
                                alamat: e.address, 
                                telp: e.phone,
                                status: e.status,
                                desk: e.description,
                                level: e.level_note,
                                reject: e.reject_note
                            };

                                return marker;
                        })
                    );

                    console.log(this.markers);

                    this.search.found = this.markers.length
                }
            } catch (error) {
                console.log(error);
                this.makeToast(error.response.data.message, 'Terjadi Kesalahan', 'danger');     
            }
        },
        clearSearch() {
            this.markers = [];
            this.showDismissibleAlert = false;
            this.search.query = '';
            this.getData();
        },
        modalImg(img, desk) {
            let map = document.getElementById("map");
            map.style.display = "none"
            this.img = img;
            // Get the modal
            let modal = document.getElementById("myModal");

            // Get the image and insert it inside the modal - use its "alt" text as a caption
            let modalImg = document.getElementById("img01");
            let captionText = document.getElementById("caption");

            modal.style.display = "block";
            modalImg.src = this.img;
            captionText.innerHTML = desk;
            

            // Get the <span> element that closes the modal
            let span = document.getElementById('close');
            console.log(span);
            

            // When the user clicks on <span> (x), close the modal
            span.onclick = function() { 
                modal.style.display = "none";
                map.style.display = "block";
            }
        },

    }

}
</script>

<style scoped>
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
