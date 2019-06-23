<template>
<div class="animated fadeIn">
    <b-container fluid>
        <b-card title="Hasil Survey">
        <!-- <b-button class="float-right" variant="danger" @click="deleteAll">Hapus Semua Survey</b-button><br> -->
            <!-- Main table element -->
            <b-table
            show-empty
            responsive
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

            <template slot="nrr" slot-scope="row">
                {{ (row.item.jumlah_point / totalSurvey).toFixed(2) }}
            </template>

            <template slot="nrr_tertimbang" slot-scope="row">
                {{ ((row.item.jumlah_point / totalSurvey) * 0.11).toFixed(2) }}
            </template>

            <template slot="hasil" slot-scope="row">
                {{ ((row.item.jumlah_point / totalSurvey) * 25).toFixed(2) }}
            </template>

            <template slot="ket" slot-scope="row">
                <div v-if="(row.item.jumlah_point / totalSurvey) * 25 < 65">
                    Tidak Baik
                </div>
                <div v-else-if="(row.item.jumlah_point / totalSurvey) * 25 < 76.61">
                    Kurang Baik
                </div>
                <div v-else-if="(row.item.jumlah_point / totalSurvey) * 25 < 88.31">
                    Baik
                </div>
                <div v-else>
                    Sangat Baik
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
            <div style="padding-top: 10px;">
                    <center>
                    <table cellpadding="0" cellspacing="0" border="0">
                        <tbody>
                            <tr>      
                                <td><b-badge variant="light">Total Survey Masuk</b-badge></td>      
                                <td align="center"><b>:</b></td>
                                <td><b-badge variant="default">{{totalSurvey}}</b-badge></td>
                            </tr>
                        </tbody>
                    </table>
                    </center>
                </div>
        </b-card>
        <!-- <b-card>         
            <mdb-container v-for="(item, index) in pieChartData" :key="index">
                <mdb-pie-chart :data="pieChartData[index]" :options="pieChartOptions" :width="600" :height="300"></mdb-pie-chart>
            </mdb-container>
        </b-card> -->
    </b-container>
</div>
</template>

<script>
import { mdbPieChart, mdbContainer } from 'mdbvue';
import axios from '@/config/axiosConfig';
export default {
    components: {
      mdbPieChart,
      mdbContainer
    },
    data() {
        return {
            baseURL: '',
            items: [],
            fields: [
                { key: 'no', label: 'No.', sortDirection: 'desc' },
                { key: 'pertanyaan_survey', label: 'Pertanyaan' },
                { key: 'point_jawaban1', label: 'Jawaban A'},
                { key: 'point_jawaban2', label: 'Jawaban B'},
                { key: 'point_jawaban3', label: 'Jawaban C'},
                { key: 'point_jawaban4', label: 'Jawaban D'},
                { key: 'jumlah_point', label: 'Jumlah' },
                { key: 'nrr', label: 'NRR' },
                { key: 'nrr_tertimbang', label: 'NRR Tertimbang' },
                { key: 'hasil', label: 'Hasil' },
                { key: 'ket', label: 'Keterangan' }
            ],
            totalRows: 1,
            currentPage: 1,
            perPage: 10,
            pageOptions: [5, 10, 15],
            sortBy: null,
            sortDesc: false,
            sortDirection: 'asc',
            filter: null,

            // survey
            totalSurvey: 0,
            jwb1: 0,
            jwb2: 0,
            jwb3: 0,
            jwb4: 0,

            pieChartData: [],
            pieChartOptions: {
                responsive: false,
                maintainAspectRatio: false
            }
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
                let result = await axios().get('/survey/hasil');
                this.items = result.data.values;
                this.totalSurvey = result.data.values[0].total_jawaban1 + result.data.values[0].total_jawaban2 + result.data.values[0].total_jawaban3 + result.data.values[0].total_jawaban4               
                for (let i = 0; i < this.items.length; i++) {
                    let a = this.items[i].total_jawaban1;
                    let b = this.items[i].total_jawaban2;
                    let c = this.items[i].total_jawaban3;
                    let d = this.items[i].total_jawaban4;
                    this.pieChartData.push({
                        labels: ["Jawaban A", "Jawaban B", "Jawaban C", "Jawaban D"],
                        datasets: [
                            {
                            data: [a, b, c, d],
                            backgroundColor: ["#F7464A", "#46BFBD", "#FDB45C", "#949FB1"],
                            hoverBackgroundColor: ["#FF5A5E", "#5AD3D1", "#FFC870", "#A8B3C5"]
                            }
                        ]
                    })
                    
                    
                }
                console.log(this.items);
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
