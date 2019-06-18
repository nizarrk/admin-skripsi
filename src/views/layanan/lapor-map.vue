<template>
    <div class="animated fadeIn">
        <b-container fluid>
            <div>
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
            <b-card>
                <l-map style="height: 500px;" id="map" ref="myMap" :zoom="zoom" :center="center">
                    <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
                    <l-marker
                    v-for="(marker, index) in markers" :key="index"
                    id="marker"
                    v-show="address" 
                    :lat-lng="marker" >
                        <l-popup><center><b-img :src="baseURL + marker.foto" style="max-height: 100px; max-width:100px;"></b-img></center><br>{{marker.loc}}</l-popup>
                    </l-marker>
                </l-map>
            </b-card>
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
                result.data.values.map((e, i) => {
                    marker = {lat: e.lat_lapor, lng: e.long_lapor, loc: e.lokasi_lapor, foto: e.foto_lapor};
                    this.markers.push(marker)
                })
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
                        marker = {lat: e.lat_lapor, lng: e.long_lapor, loc: e.lokasi_lapor, foto: e.foto_lapor};
                        this.markers.push(marker)
                    })
                    console.log(result.data.values);
                    // Set the initial number of items
                    this.totalRows = this.items.length
                }
            } catch (error) {
                console.log(error.message);
                
            }
        },

    }

}
</script>

<style>

</style>
