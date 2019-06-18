<template>
<div class="animated fadeIn">
    <b-container fluid>
        <b-card title="Hasil Survey">
        <!-- <b-button class="float-right" variant="danger" @click="deleteAll">Hapus Semua Survey</b-button><br> -->
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
            >
            <template slot="no" slot-scope="row">
                {{ row.index + 1}}
            </template>

            <template slot="actions" slot-scope="row">
                <div class="mt-3" v-show="row.item.status_izin == 'Menunggu'">
                    <b-button-group>
                        <b-button v-b-tooltip.hover title="Terima" class="fa fa-check" variant="success" @click="openModal('terima', row.item.id_izin)"></b-button>
                        <b-button v-b-tooltip.hover title="Tolak" class="fa fa-close" variant="danger" @click="openModal('tolak', row.item.id_izin)"></b-button>
                    </b-button-group>
                </div>
                <div class="mt-3" v-show="row.item.status_izin == 'Proses'">
                    <b-button-group>
                        <b-button v-b-tooltip.hover title="Selesai" class="fa fa-check-circle" variant="success" @click="openModal('selesai', row.item.id_izin)"></b-button>
                    </b-button-group>
                </div>
                <div class="mt-3" v-show="row.item.status_izin == 'Ditolak'">
                    <b-button-group>
                        <b-button v-b-tooltip.hover title="Hapus" class="fa fa-trash" variant="danger" @click="openModal('hapus', row.item.id_izin)"></b-button>
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
</div>
</template>

<script>
import axios from '@/config/axiosConfig';
export default {
    data() {
        return {
            baseURL: '',
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
            perPage: 10,
            pageOptions: [5, 10, 15],
            sortBy: null,
            sortDesc: false,
            sortDirection: 'asc',
            filter: null,
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
                let result = await axios().get('/survey/soal');
                
                result.data.values.map(async e => {
                    let jwb = await axios().get('/survey/jwb/' + e.id_pertanyaan_survey);
                    console.log(jwb.data.values);
                    
                })
                

                // Set the initial number of items
                this.totalRows = this.items.length
            } catch (error) {
                console.log(error.message);
                
            }
        }
    }
}
</script>

<style>

</style>
