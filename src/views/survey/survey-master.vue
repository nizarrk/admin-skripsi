<template>
<div class="animated fadeIn">
  <b-container fluid>
    <b-card title="Daftar Pertanyaan">
      <b-button style="margin-bottom: 5px;" class="float-right" variant="success" @click="addAll">Tambah Semua ke Survey</b-button><br>
        <!-- Main table element -->
        <b-table
        show-empty
        stacked="md"
        :items="items"
        :fields="fields"
        :current-page="currentPage"
        :per-page="perPage"
        :filter="filter"
        :sort-by.sync="sortBy"
        :sort-desc.sync="sortDesc"
        :sort-direction="sortDirection"
        @filtered="onFiltered"
        >
          <template slot="no" slot-scope="row">
              {{ row.index + 1}}
          </template>

          <template slot="actions" slot-scope="row">
            <div class="mt-3">
                <b-button-group>
                  <b-button 
                  class="fa fa-plus-square-o" 
                  variant="success" 
                  @click="openModal('add', row.item.id_pertanyaan, row.item.id_jawaban1, row.item.id_jawaban2,row.item.id_jawaban3,  row.item.id_jawaban4)"
                  v-b-tooltip.hover 
                  title="Tambah"
                  ></b-button>
                  <b-button 
                  class="fa fa-edit" 
                  variant="warning" 
                  @click="openModal('edit', row.item.id_pertanyaan, row.item.id_jawaban1, row.item.id_jawaban2,row.item.id_jawaban3,  row.item.id_jawaban4)"
                  v-b-tooltip.hover 
                  title="Edit"
                  ></b-button>
                  <b-button 
                  class="fa fa-trash" 
                  variant="danger" 
                  @click="openModal('del', row.item.id_pertanyaan)"
                  v-b-tooltip.hover 
                  title="Hapus"
                  ></b-button>
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
    
    <b-card v-for="(item, index) in form" :key="index">
      <b-button  v-if="index == form.length - 1" variant="success" @click="addForm">Tambah Form</b-button>
      <i v-show="index != 0" class="float-right fa fa-close" style="cursor:pointer;" @click="removeForm(index)"></i>
        <b-form :id="'form-'+index" @submit="onSubmit">
          <b-form-group
            label="Pertanyaan:"
            label-for="textarea-1"
          >
            <b-form-textarea
              id="textarea-1"
              v-model="form[index].pertanyaan"
              type="text"
              required
              placeholder="Masukkan Pertanyaan Baru"
            ></b-form-textarea>
          </b-form-group>
          <b-row>
              <b-col>
                <b-form-group
                  label="Jawaban A:"
                  label-for="textarea-2"
                >
                  <b-form-textarea
                    id="textarea-2"
                    v-model="form[index].jawabanA"
                    type="text"
                    required
                    placeholder="Masukkan Jawaban Baru"
                  ></b-form-textarea>
                </b-form-group>
              </b-col>
              <b-col>
                <b-form-group
                  label="Jawaban B:"
                  label-for="textarea-3"
                >
                  <b-form-textarea
                    id="textarea-3"
                    v-model="form[index].jawabanB"
                    type="text"
                    required
                    placeholder="Masukkan Jawaban Baru"
                  ></b-form-textarea>
                </b-form-group>
              </b-col>
              <b-col>
                <b-form-group
                  label="Jawaban C:"
                  label-for="textarea-4"
                >
                  <b-form-textarea
                    id="textarea-4"
                    v-model="form[index].jawabanC"
                    type="text"
                    required
                    placeholder="Masukkan Jawaban Baru"
                  ></b-form-textarea>
                </b-form-group>
              </b-col>
              <b-col>
                <b-form-group
                  label="Jawaban D:"
                  label-for="textarea-5"
                >
                  <b-form-textarea
                    id="textarea-5"
                    v-model="form[index].jawabanD"
                    type="text"
                    required
                    placeholder="Masukkan Jawaban Baru"
                  ></b-form-textarea>
                </b-form-group>
              </b-col>
            </b-row>
            <b-button class="float-right" type="submit" variant="primary" v-if="index == form.length - 1" id="submit">Submit</b-button>
            <b-button class="float-right" type="reset" variant="danger">Reset</b-button>
        </b-form>
    </b-card>
    <!-- <b-button class="float-right" type="submit" variant="primary" @click="klik">Submit</b-button> -->
    <!-- Modal Delete -->
    <b-modal okTitle='Ya' cancelTitle='Tidak' okVariant='danger' id="modal-delete" title="Konfirmasi" @ok="deletePertanyaan(formedit.id)">
      <p class="my-4">Apakah anda yakin menghapus pertanyaan {{formedit.id}}?</p>
    </b-modal>
    <!-- Modal Add -->
    <b-modal okTitle='Ya' cancelTitle='Tidak' id="modal-add" title="Konfirmasi" @ok="addSurvey(formedit.id)">
      <p class="my-4">Apakah anda yakin menambahkan pertanyaan {{formedit.id}} ke survey?</p>
    </b-modal>
    <!-- Modal Edit -->
    <b-modal
      size="xl"
      id="modal-edit"
      ref="modal"
      title="Update Pertanyaan"
      @show="resetModal"
      @hidden="resetModal"
      @ok="handleOk"
    >
      <form ref="formmodal" @submit.stop.prevent="editSubmit">
        <b-form-group
          label="Pertanyaan"
          label-for="pertanyaan-textarea"
          invalid-feedback="Pertanyaan harus diisi"
        >
          <b-form-textarea
            id="pertanyaan-textarea"
            v-model="formedit.pertanyaan"
            required
          ></b-form-textarea>
        </b-form-group>
        <b-row>
          <b-col>
            <b-form-group
              label="Jawaban A"
              label-for="jawaban1-textarea"
              invalid-feedback="Jawaban harus diisi"
            >
              <b-form-textarea
                id="jawaban1-textarea"
                v-model="formedit.jawabanA"
                required
              ></b-form-textarea>
            </b-form-group>
          </b-col>
          <b-col>
            <b-form-group
              label="Jawaban B"
              label-for="jawaban2-textarea"
              invalid-feedback="Jawaban harus diisi"
            >
              <b-form-textarea
                id="jawaban2-textarea"
                v-model="formedit.jawabanB"
                required
              ></b-form-textarea>
            </b-form-group>
          </b-col>
          <b-col>
            <b-form-group
              label="Jawaban C"
              label-for="jawaban3-textarea"
              invalid-feedback="Jawaban harus diisi"
            >
              <b-form-textarea
                id="jawaban3-textarea"
                v-model="formedit.jawabanC"
                required
              ></b-form-textarea>
            </b-form-group>
          </b-col>
          <b-col>
            <b-form-group
              label="Jawaban D"
              label-for="jawaban4-textarea"
              invalid-feedback="Jawaban harus diisi"
            >
              <b-form-textarea
                id="jawaban4-textarea"
                v-model="formedit.jawabanD"
                required
              ></b-form-textarea>
            </b-form-group>
          </b-col>
        </b-row>
        <b-button type="submit" variant="primary" style="display:none" id="submit2">Submit</b-button>
      </form>
    </b-modal>
  </b-container>
</div>
</template>

<script>
import axios from '@/config/axiosConfig';
  export default {
    data() {
      return {
        items: [],
        fields: [
          { key: 'no', label: 'No.', sortDirection: 'desc' },
          { key: 'pertanyaan', label: 'Pertanyaan' },
          { key: 'jawaban1', label: 'Jawaban A'},
          { key: 'jawaban2', label: 'Jawaban B'},
          { key: 'jawaban3', label: 'Jawaban C'},
          { key: 'jawaban4', label: 'Jawaban D'},
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
    
        form: [
          {
            pertanyaan: '',
            jawabanA: '',
            jawabanB: '',
            jawabanC: '',
            jawabanD: ''
          }
        ],

        formedit: {
          id: '',
          idjwb1: '',
          idjwb2: '',
          idjwb3: '',
          idjwb4: '',
          pertanyaan: '',
          jawabanA: '',
          jawabanB: '',
          jawabanC: '',
          jawabanD: ''
        },

        // toast
        toastCount: 0,

        name: '',
        state: {
          pertanyaan: null,
          jawabanA: null,
          jawabanB: null,
          jawabanC: null,
          jawabanD: null
        },
      }
    },
    computed: {
      sortOptions() {
        // Create an options list from our fields
        return this.fields
          .filter(f => f.sortable)
          .map(f => {
            return { text: f.label, value: f.key }
          })
      }
    },
    async created() {
      this.getData();
    },
    methods: {
      async getData() {
        let result = await axios().get('/survey');
        this.items = result.data.values;
        
        // Set the initial number of items
        this.totalRows = this.items.length

        console.log('getdata initiated');
        console.log(this.items);
        
        
      },
      async deletePertanyaan(id){
        try {
          await axios().delete('/survey/' + id);
          this.getData();
          this.makeToast(`Berhasil menghapus pertanyaan ${id}`, 'Berhasil', 'success');
          
        } catch (error) {
          console.log(error.message);
          this.makeToast(error.message, 'Terjadi Kesalahan', 'danger');
          
        }
      },
      onFiltered(filteredItems) {
        // Trigger pagination to update the number of buttons/pages due to filtering
        this.totalRows = filteredItems.length
        this.currentPage = 1
      },
      klik() {
        document.getElementById('submit').click();
      },
      async onSubmit() {
        try {
          let result = await this.form.map(async (e, i) => {
            let pertanyaan = await axios().post('/survey', {
              pertanyaan: e.pertanyaan
            });
            console.log(e.pertanyaan);
            console.log(i);

            let jwb = await [e.jawabanA, e.jawabanB, e.jawabanC, e.jawabanD].map(async (item, index) => {
              let kode = '';
              if (index == 0) kode = 1;
              else if (index == 1) kode = 2;
              else if (index == 2) kode = 3;
              else if (index == 3) kode = 4;
              let jawaban = await axios().post('/survey/jawaban', {
                id: pertanyaan.data.values.insertId,
                jawaban: item,
                kode: kode
              });
              return jawaban              
            });
            this.form[i].pertanyaan = '';
            this.form[i].jawabanA = '';
            this.form[i].jawabanB = '';
            this.form[i].jawabanC = '';
            this.form[i].jawabanD = '';
            document.getElementById("form-" + [i]).reset();
            return pertanyaan
          })
          Promise.all(result).then((res) => {
            console.log(res);
            this.getData(res);
          })
          console.log('after map');
          this.makeToast('Berhasil menambahkan pertanyaan', 'Berhasil', 'success');
        } catch (error) {
          console.log(error.message);
          this.makeToast(error.message, 'Terjadi Kesalahan', 'danger');
        }        
      },
      addForm() {
        this.form.push({
          pertanyaan: '',
          jawabanA: '',
          jawabanB: '',
          jawabanC: '',
          jawabanD: ''
        });
      },
      removeForm(index) {
        this.form.splice(index, 1);
      },
      makeToast(text, title, variant = null) {
        this.$bvToast.toast(text, {
          title: title,
          variant: variant,
          solid: true
        })
      },
      async openModal(type, id, jwb1, jwb2, jwb3, jwb4) {
        try {
          let result = await axios().get('/survey/' + id);
          this.formedit.pertanyaan = result.data.values[0].pertanyaan;
          this.formedit.jawabanA = result.data.values[0].jawaban1;
          this.formedit.jawabanB = result.data.values[0].jawaban2;
          this.formedit.jawabanC = result.data.values[0].jawaban3;
          this.formedit.jawabanD = result.data.values[0].jawaban4;
          this.formedit.id = result.data.values[0].id_pertanyaan;
          this.formedit.idjwb1 = result.data.values[0].id_jawaban1;
          this.formedit.idjwb2 = result.data.values[0].id_jawaban2;
          this.formedit.idjwb3 = result.data.values[0].id_jawaban3;
          this.formedit.idjwb4 = result.data.values[0].id_jawaban4;
          if (type == 'del') {
            this.$bvModal.show('modal-delete');
          } else if (type == 'add') {
            this.$bvModal.show('modal-add');
          } else if (type == 'edit') {
            this.$bvModal.show('modal-edit');         
          }          
        } catch (error) {
          console.log(error.message);
          this.makeToast(error.message, 'Terjadi Kesalahan', 'danger');
          
        }
      },
      checkFormValidity() {
        const valid = this.$refs.formmodal.checkValidity()
        return valid
      },
      resetModal() {
        this.name = ''
        this.nameState = null
      },
      handleOk(bvModalEvt) {
        // Prevent modal from closing
        bvModalEvt.preventDefault()
        // Trigger submit handler
        document.getElementById('submit2').click();
      },
      async editSubmit() {
        try {
          let update = await axios().put('/survey', {
            id: this.formedit.id,
            idjwb1: this.formedit.idjwb1,
            idjwb2: this.formedit.idjwb2,
            idjwb3: this.formedit.idjwb3,
            idjwb4: this.formedit.idjwb4,
            pertanyaan: this.formedit.pertanyaan,
            jwb1: this.formedit.jawabanA,
            jwb2: this.formedit.jawabanB,
            jwb3: this.formedit.jawabanC,
            jwb4: this.formedit.jawabanD
          });
          // Hide the modal manually
          this.$nextTick(() => {
            this.$refs.modal.hide()
          })
          this.makeToast(`Berhasil mengubah pertanyaan ${this.formedit.id}`, 'Berhasil', 'success');
          this.getData();
        } catch (error) {
          console.log(error.message);
          this.makeToast(error.message, 'Terjadi Kesalahan', 'danger');
          
        }        
      },
      async addAll() {
        try {
          let result = await axios().post('/survey/addall');
          this.getData();
          this.makeToast(`Berhasil menambahkan ${result.data.values.affectedRows} survey`, 'Berhasil', 'success');
          
        } catch (error) {
          console.log(error.message);
          this.makeToast(error.message, 'Terjadi Kesalahan', 'danger');
          
        }
      },
      async addSurvey(id) {
        try {
          let result = await axios().post('/survey/addsurvey', {
            id: id
          });
          this.getData();
          this.makeToast(`Berhasil menambahkan ${result.data.values.affectedRows} survey`, 'Berhasil', 'success');
        } catch (error) {
          console.log(error.message);
          this.makeToast(error.message, 'Terjadi Kesalahan', 'danger');
        }
      }
    }
  }
</script>