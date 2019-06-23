<template>
    <div class="animated fadeIn">
        <b-container fluid>
            <div>
                <b-form inline>
                    <span
                    @click="clearSearch"
                    v-show="search != ''"
                    class="fa fa-close" 
                    style="cursor: pointer; color: #F86C6B;  position: absolute; left: 415px;"
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
            <b-card>
                <b-alert 
                variant="success"  
                :show="showDismissibleAlert"
                dismissible
                fade
                @dismissed="showDismissibleAlert=false"
                >
                    Ditemukan <b>{{totalRows}}</b> laporan keluhan
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
                                    <span><b>Lokasi:</b> {{marker.loc}}</span><br>
                                    <span>
                                        <b>Status:</b>
                                        <b-badge v-show="marker.status == 'Menunggu'" variant="warning">{{marker.status}}</b-badge>
                                        <b-badge v-show="marker.status == 'Proses'" variant="primary">{{marker.status}}</b-badge>
                                        <b-badge v-show="marker.status == 'Selesai'" variant="success">{{marker.status}}</b-badge>
                                        <b-badge v-show="marker.status == 'Ditolak'" variant="danger">{{marker.status}}</b-badge>
                                    </span>
                                </b-col>
                            </b-row>
                        </l-popup>
                    </l-marker>
                </l-map>
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
            search: ''
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
                let result = await axios().get('/lapor/getall');
                this.totalMenunggu = result.data.values[0].total_menunggu;
                this.totalProses = result.data.values[0].total_proses;
                this.totalSelesai = result.data.values[0].total_selesai;
                this.totalDitolak = result.data.values[0].total_ditolak;
                
                result.data.values.map((e, i) => {
                    marker = {
                        lat: e.lat_lapor, 
                        lng: e.long_lapor, 
                        loc: e.lokasi_lapor, 
                        foto: e.foto_lapor, 
                        nama: e.nama_user, 
                        alamat: e.alamat_user, 
                        telp: e.telp_user,
                        status: e.status_lapor,
                        desk: e.desk_lapor
                        };
                    this.markers.push(marker)
                });
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
                console.log(this.search);
                
                if (this.search == '') {
                    this.markers = [];
                    this.getData();
                } else {
                    this.markers = [];
                    let marker = null;
                    let result = await axios().get('/lapor/searchloc/' + this.search);
                    result.data.values.map((e, i) => {
                        marker = {
                            lat: e.lat_lapor, 
                            lng: e.long_lapor, 
                            loc: e.lokasi_lapor, 
                            foto: e.foto_lapor, 
                            nama: e.nama_user, 
                            alamat: e.alamat_user, 
                            telp: e.telp_user,
                            status: e.status_lapor,
                            desk: e.desk_lapor
                        };
                        this.markers.push(marker)
                    })
                    this.showDismissibleAlert = true;
                    this.totalRows = this.markers.length
                    console.log(result.data.values);
                }
            } catch (error) {
                console.log(error.message);
                
            }
        },
        clearSearch() {
            this.markers = [];
            this.search = '';
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
