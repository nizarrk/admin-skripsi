<template>
<div class="animated fadeIn">
    <b-container fluid>
        <b-card title="Hasil Survey">
            <div class="mt-3" style="float: right; margin-bottom: 5px;">
                <b-button-group>
                  <b-button 
                  class="fa fa-file-excel" 
                  variant="success" 
                  @click="exportExcel"
                  v-b-tooltip.hover 
                  title="Excel"
                  ></b-button>
                  <b-button 
                  class="fa fa-file-pdf" 
                  variant="danger" 
                  @click="exportPdf"
                  v-b-tooltip.hover 
                  title="PDF"
                  ></b-button>
                </b-button-group>
            </div>
            <!-- <b-button class="float-right" variant="danger" @click="exportExcel">Exports to Excel</b-button><br> -->
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
            <!-- <template slot="no" slot-scope="row">
                {{ row.index + 1}}
            </template> -->

            <template #cell(nrr)="row">
                {{ (row.item.jumlah_point / totalSurvey).toFixed(2) }}
            </template>

            <template #cell(nrr_tertimbang)="row">
                {{ ((row.item.jumlah_point / totalSurvey) * 0.11).toFixed(2) }}
            </template>

            <template #cell(hasil)="row">
                {{ ((row.item.jumlah_point / totalSurvey) * 25).toFixed(2) }}
            </template>

            <template #cell(ket)="row">
                <div v-if="(row.item.jumlah_point / totalSurvey) * 25 < 65">
                    <b-badge variant="danger">Tidak Baik</b-badge>
                </div>
                <div v-else-if="(row.item.jumlah_point / totalSurvey) * 25 < 76.61">
                    <b-badge variant="warning">Kurang Baik</b-badge>
                </div>
                <div v-else-if="(row.item.jumlah_point / totalSurvey) * 25 < 88.31">
                    <b-badge variant="primary">Baik</b-badge>
                </div>
                <div v-else>
                    <b-badge variant="success">Sangat Baik</b-badge>
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
// Excel
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
// PDF
import jsPDF from 'jspdf'
import 'jspdf-autotable'

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
                // { key: 'no', label: 'No.', sortDirection: 'desc' },
                { key: 'question', label: 'Pertanyaan' },
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
            totalPoint: 0,
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
                let result = await axios().get('/survey/result');
                
                this.totalSurvey = 
                    parseInt(result.data.data[0].total_jawaban1) + 
                    parseInt(result.data.data[0].total_jawaban2) + 
                    parseInt(result.data.data[0].total_jawaban3) + 
                    parseInt(result.data.data[0].total_jawaban4);

                let data = result.data.data.map(x => {
                    let hasil = (x.jumlah_point / this.totalSurvey) * 25;
                    let obj = {
                        question_id: x.question_id,
                        question: x.question,
                        id_jawaban1: x.id_jawaban1,
                        point_jawaban1: x.point_jawaban1,
                        total_jawaban1: x.total_jawaban1,
                        id_jawaban2: x.id_jawaban2,
                        point_jawaban2: x.point_jawaban2,
                        total_jawaban2: x.total_jawaban2,
                        id_jawaban3: x.id_jawaban3,
                        point_jawaban3: x.point_jawaban3,
                        total_jawaban3: x.total_jawaban3,
                        id_jawaban4: x.id_jawaban4,
                        point_jawaban4: x.point_jawaban4,
                        total_jawaban4: x.total_jawaban4,
                        jumlah_point: x.jumlah_point,
                        nrr: (x.jumlah_point / this.totalSurvey).toFixed(2),
                        nrr_tertimbang: ((x.jumlah_point / this.totalSurvey) * 0.11).toFixed(2),
                        hasil: hasil.toFixed(2),
                        ket: hasil < 65 ? 'Tidak Baik' 
                            : hasil < 76.61 ? 'Kurang Baik'
                            : hasil < 88.31 ? 'Baik'
                            : 'Sangat Baik'
                    }

                    return obj;
                });
                
                this.items = data;

                console.log(data);
            
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
        },

        exportExcel() {
            let data = this.items;
            const workbook = new ExcelJS.Workbook();
            let sheet = workbook.addWorksheet('Survey Result');

            let columnWidth = [50, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10];

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
            sheet.getCell("A1").value = "Pertanyaan";
            sheet.getCell("B1").value = "Point Jawaban A";
            sheet.getCell("C1").value = "Total Jawaban A";
            sheet.getCell("D1").value = "Point Jawaban B";
            sheet.getCell("E1").value = "Total Jawaban B";
            sheet.getCell("F1").value = "Point Jawaban C";
            sheet.getCell("G1").value = "Total Jawaban C";
            sheet.getCell("H1").value = "Point Jawaban D";
            sheet.getCell("I1").value = "Total Jawaban D";
            sheet.getCell("J1").value = "Jumlah Point";
            sheet.getCell("K1").value = "NRR";
            sheet.getCell("L1").value = "NRR Tertimbang";
            sheet.getCell("M1").value = "Hasil";
            sheet.getCell("N1").value = "Keterangan";
            boldCell(["A1", "B1", "C1", "D1", "E1", "F1", "G1", "H1", "I1", "J1", "K1", "L1", "M1", "N1"]);
            // sheet.getRow(1).alignment = alignCenter;

            data.forEach(el => {
                sheet.getCell("A" + row).value = el.question;
                sheet.getCell("B" + row).value = el.point_jawaban1;
                sheet.getCell("C" + row).value = el.total_jawaban1;
                sheet.getCell("D" + row).value = el.point_jawaban2;
                sheet.getCell("E" + row).value = el.total_jawaban2;
                sheet.getCell("F" + row).value = el.point_jawaban3;
                sheet.getCell("G" + row).value = el.total_jawaban3;
                sheet.getCell("H" + row).value = el.point_jawaban4;
                sheet.getCell("I" + row).value = el.total_jawaban4;
                sheet.getCell("J" + row).value = el.jumlah_point;
                sheet.getCell("K" + row).value = el.nrr;
                sheet.getCell("L" + row).value = el.nrr_tertimbang;
                sheet.getCell("M" + row).value = el.hasil;
                sheet.getCell("N" + row).value = el.ket;

                row++;
            });

            // Adjust column width
            sheet.columns.forEach((col, index) => {
                if (columnWidth[index]) {
                    col.width = columnWidth[index];
                }
            });

            // exporting
            let nameFile = "HasilSurvey_";
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
            let col = ["Pertanyaan","Point Jawaban A", "Total Jawaban A", "Point Jawaban B", 
                        "Total Jawaban B", "Point Jawaban C", "Total Jawaban C", 
                        "Point Jawaban D", "Total Jawaban D", "Jumlah Point", 
                        "NRR", "NRR Tertimbang", "Hasil", "Keterangan"];
            // let col1 = ["Details", "Values"];
            let rows = [];
            // let rows1 = [];

            this.items.forEach(el => {      
                var temp = [el.question, el.point_jawaban1, el.total_jawaban1, el.point_jawaban2, el.total_jawaban2, 
                            el.point_jawaban3, el.total_jawaban3, el.point_jawaban4, el.total_jawaban4, 
                            el.jumlah_point, el.nrr, el.nrr_tertimbang, el.hasil, el.ket];
                // var temp1 = [element.id,element.name];
                rows.push(temp);
                // rows1.push(temp1);

            });        

            doc.autoTable(col, rows, { startY: 10 });

            // doc.autoTable(col1, rows1, { startY: 60 });
            let currentTime = new Date().getDate().toString().padStart(2, "0") + (Number(new Date().getMonth()) + 1).toString().padStart(2, "0") + new Date().getFullYear();
            let nameFile = "HasilSurvey_" + currentTime + '.pdf';
            doc.save(nameFile);
        }
    }
}
</script>

<style>

</style>
