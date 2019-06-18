<template>
    <div class="animated fadeIn">
        <b-container fluid>
            <b-button variant="success" @click="openModal('add')">Tambah Trayek</b-button><br>
            <b-card v-for="(item, index) in items" :key="index" :title="item.nama_trayek" :sub-title="'Jarak: ' + item.jarak_trayek + ' KM' ">
                <b-card-text>
                    {{item.rute_trayek}}
                </b-card-text>
                <div class="mt-3">
                    <b-button-group>
                      <b-button class="fa fa-map" variant="info" @click="openModal('see', item.id_trayek)"></b-button>
                      <b-button class="fa fa-edit" variant="warning" @click="openModal('edit', item.id_trayek)"></b-button>
                      <b-button class="fa fa-trash" variant="danger" @click="openModal('del', item.id_trayek)"></b-button>
                    </b-button-group>
                </div>
            </b-card>
        </b-container>
        <!-- Modal Delete -->
    <b-modal okTitle='Ya' cancelTitle='Tidak' okVariant='danger' id="modal-delete" title="Konfirmasi" @ok="deleteTrayek(form.id)">
      <p class="my-4">Apakah anda yakin menghapus Trayek {{form.id}}?</p>
    </b-modal>
    <!-- Modal See -->
    <b-modal size="lg" id="modal-see" hide-footer hide-header>
      <b-card :title="form.nama" :sub-title="'Jarak: ' + form.jarak + ' KM' ">
        <i class="float-right fa fa-close" style="cursor:pointer; margin-top: -50px;" @click="$bvModal.hide('modal-see')"></i>
        <l-map style="height: 500px;" id="map" ref="myMap" :zoom="zoom" :center="center">
          <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
          <l-polyline 
          :lat-lngs="polyline.latlngs"
          :color="polyline.color">
          </l-polyline>
        </l-map>
      </b-card>
    </b-modal>
    <!-- Modal Edit -->
    <b-modal
      id="modal-edit"
      ref="modal"
      :title="form.id ? 'Update Trayek' : 'Tambah Trayek'"
      @ok="handleOk"
    >
      <form ref="formmodal" @submit.stop.prevent="handleSubmit(form.id ? 'edit' : 'add')">
        <b-form-group
          label="Nama Trayek"
          label-for="nama-input"
          invalid-feedback="Nama trayek harus diisi"
        >
          <b-form-input
            id="nama-input"
            v-model="form.nama"
            required
          ></b-form-input>
        </b-form-group>
        <b-form-group
        label="Rute Trayek"
        label-for="rute-textarea"
        invalid-feedback="Rute trayek harus diisi"
        >
        <b-form-textarea
        id="rute-textarea"
        v-model="form.rute"
        required
        ></b-form-textarea>
        </b-form-group>
        <b-form-group
        label="Jarak Trayek"
        label-for="jarak-input"
        >
        <b-form-input
        id="jarak-input"
        v-model="form.jarak"
        readonly
        ></b-form-input>
        </b-form-group>
        <l-map style="height: 500px;" id="map" ref="myMap" :zoom="zoom" :center="center"  @click="addPolyline">
          <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
          <l-polyline
          :lat-lngs="polyline.latlngs"
          :color="polyline.color">
          </l-polyline>
        </l-map>
        <b-button id="undo" variant="light" @click="removePolyline"><i class="fa fa-undo"></i></b-button>
        <b-button type="submit" variant="primary" style="display:none" id="submit2">Submit</b-button>
      </form>
    </b-modal>
    </div>
</template>

<script>
import {LMap, LTileLayer, LMarker, LPopup, LPolyline} from 'vue2-leaflet';
import axios from '@/config/axiosConfig';

export default {
    components: {
      LMap,
      LTileLayer,
      LMarker,
      LPopup,
      LPolyline
    },
    data() {
        return {
            items: [],
            zoom:13,
            center: L.latLng(-7.470475, 112.440132),
            url:'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
            attribution:'&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
            marker: L.latLng(-7.470475, 112.440132), 
            address: null,
            polyline: {
                latlngs: [],
                color: 'blue'
            },

            // form
            form: {
                id: '',
                nama: '',
                rute: '',
                jarak: ''
            },
            // total jarak polyline
            total: []
        }
    },
    async created() {
        try {
            this.getData();
        } catch (error) {
            console.log(error.message);   
        }
    },
    methods: {
        async getData() {
            try {
                let result = await axios().get('/info/trayek');
                this.items = result.data.values;
            } catch (error) {
                console.log(error.message);
                
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
              setTimeout(() => {
                this.$refs.myMap.mapObject.invalidateSize(); 
            }, 100);
            let result = await axios().get('/info/trayek/' + id);
            console.log(result);
            
            if (type == 'del') {
              this.form.id = result.data.values[0].id_trayek;
              this.$bvModal.show('modal-delete');
            } else if (type == 'see') {
              this.form.id = result.data.values[0].id_trayek;
              this.form.nama = result.data.values[0].nama_trayek;
              this.form.rute = result.data.values[0].rute_trayek;
              this.form.jarak = result.data.values[0].jarak_trayek;
              this.polyline.latlngs = JSON.parse(result.data.values[0].latlng_trayek);
              this.$bvModal.show('modal-see');
            } else if (type == 'add') {
              this.form.id = '';
              this.form.nama = '';
              this.form.rute = '';
              this.form.jarak = '';
              this.polyline.latlngs = [];
              this.total = [];

              this.$bvModal.show('modal-edit');
            } else if (type == 'edit') {           
              this.form.id = result.data.values[0].id_trayek;
              this.form.nama = result.data.values[0].nama_trayek;
              this.form.rute = result.data.values[0].rute_trayek;
              this.form.jarak = result.data.values[0].jarak_trayek;              
              this.polyline.latlngs = JSON.parse(result.data.values[0].latlng_trayek);
              this.total = [];
              
              this.$bvModal.show('modal-edit');         
            }          
          } catch (error) {
            console.log(error.message);
            this.makeToast(error.message, 'Terjadi Kesalahan', 'danger');
          
          }
        },
        handleOk(bvModalEvt) {
        // Prevent modal from closing
        bvModalEvt.preventDefault()
        // Trigger submit handler
        document.getElementById('submit2').click();
        },
        async handleSubmit(type) {
          try {
            if (type == 'edit') {
              await axios().put('/info/trayek', {
                  id: this.form.id,
                  nama: this.form.nama,
                  rute: this.form.rute,
                  jarak: this.form.jarak,
                  latlng: this.polyline.latlngs
              });
              
              // Hide the modal manually
              this.$nextTick(() => {
                  this.$refs.modal.hide()
              })
              
              this.makeToast(`Berhasil mengubah pertanyaan ${this.form.id}`, 'Berhasil', 'success');
              this.getData();
              } else if (type = 'add') {
                await axios().post('/info/trayek', {
                    nama: this.form.nama,
                    rute: this.form.rute,
                    jarak: this.form.jarak,
                    latlng:  this.polyline.latlngs
                });
                // Hide the modal manually
                this.$nextTick(() => {
                    this.$refs.modal.hide()
                })
                this.makeToast(`Berhasil menambah pertanyaan ${this.form.id}`, 'Berhasil', 'success');
                this.getData();
              }
            } catch (error) {
            console.log(error.message);
            this.makeToast(error.message, 'Terjadi Kesalahan', 'danger');
            
            }        
        },
        async deleteTrayek(id){
        try {
          await axios().delete('/info/trayek/' + id);
          this.getData();
          this.makeToast(`Berhasil menghapus trayek ${id}`, 'Berhasil', 'success');
          
        } catch (error) {
          console.log(error.message);
          this.makeToast(error.message, 'Terjadi Kesalahan', 'danger');
          
            }
        },
        removePolyline(index) {            
            this.polyline.latlngs.splice(this.polyline.latlngs.length - 1, 1);
            this.total.splice(this.total.length - 1, 1);
            this.form.jarak = this.total.reduce((a, b) => a + b / 1000, 0).toFixed(2);
        },
        addPolyline(event) {
            if (this.polyline.latlngs.length == 0) {
                this.polyline.latlngs.push(event.latlng);
                this.total.push(L.latLng(event.latlng).distanceTo(event.latlng));
            } else {
                this.polyline.latlngs.push(event.latlng);
                this.total.push(L.latLng(this.polyline.latlngs[this.polyline.latlngs.length - 2]).distanceTo(event.latlng));
            }
            this.form.jarak = this.total.reduce((a, b) => a + b / 1000, 0).toFixed(2);
            
            
        
        }
    }
}
</script>

<style scoped>
#undo {
  position: absolute;
  top: 280px;
  right: 20px;
  z-index: 400;
}
</style>
