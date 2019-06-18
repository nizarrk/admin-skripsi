<template>
<div class="animated fadeIn">
    <b-button variant="success" @click="openModal('add')">Tambah Info</b-button><br>
    <b-card v-show="items.length == 0"><center> Tidak ada data </center></b-card>
    <b-row v-for="(article, index) in groupedArticles" :key="index">
        <b-col v-for="(item, index) in items.slice(index * 3, (index + 1) * 3)" :key="index">
            <b-card
                :title="item.judul_info"
                :sub-title="formatTgl(item.tgl_info)"
                :img-src="baseURL + item.foto_info"
                img-alt="Image"
                img-top
                tag="article"
                style="max-width: 20rem;"
                class="mb-2"
            >
                <b-card-text v-if="item.desk_info.length > 300">
                    {{item.desk_info | limitToDisplay(item.desk_info)}}
                </b-card-text>
                <b-card-text v-else>
                    {{item.desk_info}}
                </b-card-text>

                <div class="mt-3">
                    <b-button-group>
                      <b-button v-b-tooltip.hover title="Lihat" class="fa fa-window-maximize" variant="info" @click="openModal('see', item.id_info)"></b-button>
                      <b-button v-b-tooltip.hover title="Edit" class="fa fa-edit" variant="warning" @click="openModal('edit', item.id_info)"></b-button>
                      <b-button v-b-tooltip.hover title="Hapus" class="fa fa-trash" variant="danger" @click="openModal('del', item.id_info)"></b-button>
                    </b-button-group>
                </div>
            </b-card>
        </b-col>
    </b-row>
    <!-- Modal Delete -->
    <b-modal okTitle='Ya' cancelTitle='Tidak' okVariant='danger' id="modal-delete" title="Konfirmasi" @ok="deleteInfo(form.id)">
      <p class="my-4">Apakah anda yakin menghapus Berita {{form.id}}?</p>
    </b-modal>
    <!-- Modal See -->
    <b-modal size="lg" id="modal-see" hide-footer hide-header>
      <b-card :title="form.judul" :sub-title="formatTgl(form.tgl)">
        <i class="float-right fa fa-close" style="cursor:pointer; margin-top: -50px;" @click="$bvModal.hide('modal-see')"></i>
        <center>
          <img :src="baseURL + imagePreview" alt="image" style="max-width: 400px; max-height: 400px;">
        </center>
        <b-card-text>
          {{form.desk}}
        </b-card-text>
      </b-card>
    </b-modal>
    <!-- Modal Edit -->
    <b-modal
      id="modal-edit"
      ref="modal"
      :title="form.id ? 'Update Berita' : 'Tambah Berita'"
      @ok="handleOk"
    >
      <form ref="formmodal" @submit.stop.prevent="handleSubmit(form.id ? 'edit' : 'add')">
        <b-form-group
          label="Judul"
          label-for="judul-input"
          invalid-feedback="Judul harus diisi"
        >
          <b-form-input
            id="judul-input"
            v-model="form.judul"
            required
          ></b-form-input>
        </b-form-group>
        <b-form-group
        label="Foto"
        label-for="file"
        invalid-feedback="Foto harus diisi"
        >
        <b-form-file
        accept="image/*"
        id="file"
        @change="handleFileUpload"
        v-model="file"
        :state="Boolean(imagePreview)"
        :placeholder="imagePreview ? imagePreview.substr(14) : 'Pilih Foto...'"
        drop-placeholder="Drop file disini..."
        ></b-form-file>
        <center> <br>
          <img v-if="Boolean(file)" id="myimg" ref="myimg" style="max-width: 200px; max-height: 200px;"
          :class="{preview: showPreview}" 
          :src="imagePreview" 
          v-show="showPreview"/>
          <img v-else id="myimg" ref="myimg" style="max-width: 200px; max-height: 200px;"
          :class="{preview: showPreview}" 
          :src="baseURL + imagePreview" 
          v-show="showPreview"/>
        </center>
        </b-form-group>
        <b-form-group
        label="Deskripsi"
        label-for="desk-textarea"
        invalid-feedback="Deskripsi harus diisi"
        >
        <b-form-textarea
        id="desk-textarea"
        v-model="form.desk"
        required
        ></b-form-textarea>
        </b-form-group>
        <b-form-group
        label="Kategori"
        label-for="kat-input"
        invalid-feedback="Kategori harus diisi"
        >
        <b-form-input
        id="kat-input"
        v-model="form.kat"
        required
        ></b-form-input>
        </b-form-group>
        <b-button type="submit" variant="primary" style="display:none" id="submit2">Submit</b-button>
      </form>
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

            // form
            form: {
                id: '',
                judul: '',
                desk: '',
                author: '',
                kat: '',
                tgl: ''
            },
            file: null,

            showPreview: false,
            imagePreview: '',
        }
    },
    async created() {
        try {
            let baseURL = await axios().request();
            this.baseURL = baseURL.config.baseURL;
            this.getData();            
        } catch (error) {
            console.log(error.messasge);
        }
    },
    methods: {
      async getData() {
          try {
              let result = await axios().get('/info');
              console.log(result);

              this.items = result.data.values;
          } catch (error) {
              console.log(error.messasge);
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
            let result = await axios().get('/info/' + id);
            if (type == 'del') {
              this.form.id = result.data.values[0].id_info;
              this.$bvModal.show('modal-delete');
            } else if (type == 'see') {
              this.form.id = result.data.values[0].id_info;
              this.form.judul = result.data.values[0].judul_info;
              this.form.desk = result.data.values[0].desk_info;
              this.form.author = result.data.values[0].author_info;
              this.form.kat = result.data.values[0].kat_info;
              this.form.tgl = result.data.values[0].tgl_info;
              this.imagePreview = result.data.values[0].foto_info;
              this.$bvModal.show('modal-see');
            } else if (type == 'add') {
              this.form.id = '';
              this.form.judul = '';
              this.form.desk = '';
              this.form.author = '';
              this.form.kat = '';
              this.form.tgl = '';
              this.imagePreview = '';
              this.showPreview = false;
              this.$bvModal.show('modal-edit');
            } else if (type == 'edit') {           
              this.form.id = result.data.values[0].id_info;
              this.form.judul = result.data.values[0].judul_info;
              this.form.desk = result.data.values[0].desk_info;
              this.form.author = result.data.values[0].author_info;
              this.form.kat = result.data.values[0].kat_info;
              this.form.tgl = result.data.values[0].tgl_info;
              this.imagePreview = result.data.values[0].foto_info;
              this.showPreview = true;
              
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
            /*Initialize the form data*/
            let formData = new FormData();

            /*Add the form data we need to submit*/
            formData.append('id', this.form.id);
            formData.append('judul', this.form.judul);
            formData.append('fotoInfo', this.file);
            formData.append('desk', this.form.desk);
            formData.append('kat', this.form.kat);
            formData.append('author', this.form.author);

            // Display the key/value pairs
            for (var pair of formData.entries()) {
                console.log(pair[0]+ ': ' + pair[1]); 
            }
            if (type == 'edit') {
              await axios().put('/info', formData);
              this.file = null;
              
              
              // Hide the modal manually
              this.$nextTick(() => {
                  this.$refs.modal.hide()
              })
              
              this.makeToast(`Berhasil mengubah pertanyaan ${this.form.id}`, 'Berhasil', 'success');
              this.getData();
              } else if (type = 'add') {
                await axios().post('/info', formData);
                this.file = null;
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
        /*Handles a change on the file upload*/
        handleFileUpload(){
          let self = this;
          /*Set the local file variable to what the user has selected.*/
          this.file = document.getElementById('file').files[0];
          

          /*Initialize a File Reader object*/
          var reader  = new FileReader();

          /*
            Add an event listener to the reader that when the file
            has been loaded, we flag the show preview as true and set the
            image to be what was read from the reader.
          */
          reader.addEventListener("load", function () {
            this.showPreview = true;
            this.imagePreview = reader.result;
            //console.log(reader.result);
          
        }.bind(this), false);
        
        /*Check to see if the file is not empty.*/
        if( this.file ){
          /*Ensure the file is an image file.*/
          if ( /\.(jpe?g|png|gif)$/i.test( this.file.name ) ) {
            /*
              Fire the readAsDataURL method which will read the file in and
              upon completion fire a 'load' event which we will listen to and
              display the image in the preview.
            */
            reader.readAsDataURL( this.file );
          }
        }
      },
      async deleteInfo(id){
        try {
          await axios().delete('/info/' + id);
          this.getData();
          this.makeToast(`Berhasil menghapus berita ${id}`, 'Berhasil', 'success');
          
        } catch (error) {
          console.log(error.message);
          this.makeToast(error.message, 'Terjadi Kesalahan', 'danger');
          
        }
      }
    },
    computed: {
        groupedArticles() {
            return Array.from(Array(Math.ceil(this.items.length / 3)).keys())
        }
    },
    filters: {
        limitToDisplay(text) {
            return text.substring(0, 300) + '....';
            
        }
    },
    mixins: [date]
}
</script>
<style scoped>
.preview {
  display: block;
}
</style>


