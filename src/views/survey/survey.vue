<template>
<div class="animated fadeIn">
  <b-container fluid>
    <b-card title="Pertanyaan Survey">
      <b-button class="float-right" variant="danger" @click="deleteAll">Hapus Semua Survey</b-button><br>
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
                v-b-tooltip.hover 
                title="Edit" 
                class="fa fa-edit" 
                variant="warning" 
                @click="openModal('edit', row.item.id_pertanyaan_survey, row.item.id_jawaban1, row.item.id_jawaban2,row.item.id_jawaban3,  row.item.id_jawaban4)"
                >
                </b-button>
                <b-button 
                v-b-tooltip.hover 
                title="Hapus" 
                class="fa fa-trash" 
                variant="danger" 
                @click="openModal('del', row.item.id_pertanyaan_survey)"
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
    </b-card>
    <!-- Modal Delete -->
    <b-modal okTitle='Ya' cancelTitle='Tidak' okVariant='danger' id="modal-delete" title="Konfirmasi" @ok="deleteSurvey(formedit.id)">
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
      @ok="handleOk"
    >
      <form ref="formmodal" @submit.stop.prevent="handleSubmit">
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
          { key: 'pertanyaan_survey', label: 'Pertanyaan' },
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
    async mounted() {
      this.getData();
    },
    methods: {
      async getData() {
        let result = await axios().get('/survey/list'); 
        console.log(result.data);
        this.items = result.data.values;
        
        // Set the initial number of items
        this.totalRows = this.items.length
      },
      async deleteSurvey(id){
        try {
          await axios().delete('/survey/list/' + id);
          this.getData();
          this.makeToast(`Berhasil menghapus survey ${id}`, 'Berhasil', 'success');
          
        } catch (error) {
          console.log(error.message);
          this.makeToast(error.message, 'Terjadi Kesalahan', 'danger');
          
        }
      },
      async deleteAll(){
        try {
          await axios().delete('/survey/list');
          this.getData();
          this.makeToast(`Berhasil menghapus semua survey`, 'Berhasil', 'success');
          
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
      makeToast(text, title, variant = null) {
        this.$bvToast.toast(text, {
          title: title,
          variant: variant,
          solid: true
        })
      },
      async openModal(type, id, jwb1, jwb2, jwb3, jwb4) {
        try {
          let result = await axios().get('/survey/list/' + id);
          console.log(result);
          
          this.formedit.pertanyaan = result.data.values[0].pertanyaan_survey;
          this.formedit.jawabanA = result.data.values[0].jawaban1;
          this.formedit.jawabanB = result.data.values[0].jawaban2;
          this.formedit.jawabanC = result.data.values[0].jawaban3;
          this.formedit.jawabanD = result.data.values[0].jawaban4;
          this.formedit.id = result.data.values[0].id_pertanyaan_survey;
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
      handleOk(bvModalEvt) {
        // Prevent modal from closing
        bvModalEvt.preventDefault()
        // Trigger submit handler
        document.getElementById('submit2').click();
      },
      async handleSubmit() {
        try {
          let update = await axios().put('/survey/list', {
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
      }
    }
  }
</script>