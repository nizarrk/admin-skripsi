<template>
<div class="animated fadeIn">
    <b-container fluid>
        <b-card title="Pengguna">
                <b-row>
                    <b-col>
                        <div class="mb-2 mr-sm-2 mb-sm-0">
                            <b-button-group>
                            <b-button 
                            class="fa fa-file-excel" 
                            variant="success" 
                            v-b-tooltip.hover 
                            title="Excel"
                            @click="exportExcel"
                            ></b-button>
                            <b-button 
                            class="fa fa-file-pdf" 
                            variant="danger" 
                            v-b-tooltip.hover 
                            title="PDF"
                            @click="exportPdf"
                            ></b-button>
                            </b-button-group>
                        </div>
                    </b-col>
                    <b-col cols="10" class="mb-2">
                        <b-form inline class="float-right">
                            <b-form-select
                            class="mb-2 mr-sm-2 mb-sm-0"
                                v-model="search.selected"
                                :options="search.opt"
                                required
                            ></b-form-select>

                            <b-input
                                v-show="search.selected == 'Nama'"
                                v-model="search.query"
                                id="inline-form-input-cari"
                                class="mb-2 mr-sm-2 mb-sm-0"
                                placeholder="Cari"
                                required
                            ></b-input>

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
                    </b-col>
                </b-row>
                <b-alert 
                    :variant="search.found > 0 ? 'success' : 'warning'"  
                    :show="showDismissibleAlert"
                    dismissible
                    fade
                    @dismissed="showDismissibleAlert=false"
                    style="margin-top: 10px;"
                >
                        Ditemukan <b>{{search.found}}</b> User
                </b-alert>
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

                <template #cell(picture)="row">
                    <b-img 
                    id="myImg" 
                    :src="baseURL + row.value" 
                    style="max-height: 100px; max-width:100px;"
                    >
                    </b-img>
                </template>

                <template #cell(status)="row">
                    <b-badge v-show="row.value == 0" variant="warning">Non Aktif</b-badge>
                    <b-badge v-show="row.value == 1" variant="primary">Aktif</b-badge>
                </template>

                <template #cell(created_at)="row">
                    {{formatTglFull(row.value)}}
                </template>

                <template #cell(actions)="row">
                    <div class="mt-3" v-show="row.item.status == 0">
                        <b-button-group>
                            <b-button 
                            v-b-tooltip.hover 
                            title="Detail" 
                            class="fa fa-eye" 
                            variant="primary" 
                            @click="openModal('lihat', row.item.id)"
                            >
                            </b-button>
                            <b-button 
                            v-b-tooltip.hover 
                            title="Aktifkan" 
                            class="fa fa-check" 
                            variant="success" 
                            @click="openModal('aktif', row.item.id)"
                            >
                            </b-button>
                        </b-button-group>
                    </div>
                    <div class="mt-3" v-show="row.item.status == 1">
                        <b-button-group>
                            <b-button 
                            v-b-tooltip.hover 
                            title="Detail" 
                            class="fa fa-eye" 
                            variant="primary"
                            @click="openModal('lihat', row.item.id)" 
                            >
                            </b-button>
                            <b-button 
                            v-b-tooltip.hover 
                            title="Non Aktif" 
                            class="fa fa-close" 
                            variant="danger"
                            @click="openModal('nonaktif', row.item.id)" 
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
            <b-row class="text-center mt-2">
                <b-col style="text-align: right" cols="5">
                    <b-badge variant="light">Total</b-badge>
                    <b>:</b> <b-badge variant="default">{{totalRows}}</b-badge>
                </b-col>
                <b-col>
                    <b-badge variant="primary">Aktif</b-badge>      
                    <b>:</b> <b-badge variant="default">{{totalAktif}}</b-badge> 
                </b-col>
                <b-col style="text-align:left" cols="5">
                    <b-badge variant="danger">Non-Aktif</b-badge>      
                    <b>:</b> <b-badge variant="default">{{totalNonAktif}}</b-badge>
                </b-col>
            </b-row>
        </b-card>
        <!-- <b-card>         
            <mdb-container v-for="(item, index) in pieChartData" :key="index">
                <mdb-pie-chart :data="pieChartData[index]" :options="pieChartOptions" :width="600" :height="300"></mdb-pie-chart>
            </mdb-container>
        </b-card> -->
    </b-container>
    <!-- Modal Actions -->
    <b-modal size="sm" okTitle='Ya' cancelTitle='Tidak' okVariant='primary' id="modal-action" title="Konfirmasi" @ok="handleOk">
        <p class="my-4">Apakah anda yakin {{form.act}} {{form.id}}?</p>
    </b-modal>
    <!-- Modal Lihat -->
    <b-modal size="lg" id="modal-lihat" hide-footer title="Detail User">
        <b-card style="border: 0px;">
            <b-row>
                <b-col>
                    <img :src="baseURL + user.picture" alt="image" style="max-width: 300px; max-height: 300px;">
                </b-col>
                <b-col>
                    <h4>{{user.name}}</h4>
                        <small><cite :title="user.address">{{user.address}} <i class="fa fa-map-marker-alt">
                        </i></cite></small>
                        <p>
                            <i class="fa fa-user mr-1"></i> {{user.username}}
                            <br />
                            <i class="fa fa-envelope mr-1"></i> {{user.email}}
                            <br />
                            <i class="fa fa-birthday-cake mr-1"></i> {{formatTgl(user.dob)}}
                            <br />
                            <i class="fa fa-calendar-day mr-1"></i> {{formatTgl(user.created_at)}}
                            <br />
                            <i :class="user.status == 1 ? 'fa fa-check-square mr-1' : 'fa fa-window-close mr-1'"></i> <b-badge :variant="user.status == 1 ? 'primary' : 'warning'">{{user.status == 1 ? 'Aktif' : 'Non-Aktif'}}</b-badge>
                        </p>
                </b-col>
            </b-row>
        </b-card>
    </b-modal>
    <!-- Modal Img -->
    <div id="myModal" class="modal">
        <span class="close">&times;</span>
        <img class="modal-content" id="img01">
        <div id="caption"></div>
    </div>
</div>
</template>

<script>
import { mdbPieChart, mdbContainer } from 'mdbvue';
import axios from '@/config/axiosConfig';
import date from '@/mixins/dateConfig';
// Excel
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
// PDF
import jsPDF from 'jspdf'
import 'jspdf-autotable'

import moment from 'moment';

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
                { key: 'name', label: 'Nama User' },
                // { key: 'address', label: 'Alamat'},
                // { key: 'dob', label: 'Tanggal Lahir'},
                { key: 'phone', label: 'No. Telp'},
                { key: 'picture', label: 'Foto'},
                { key: 'email', label: 'Email' },
                { key: 'username', label: 'Username' },
                { key: 'status', label: 'Status' },
                { key: 'created_at', label: 'Tanggal Daftar' },
                { key: 'actions', label: 'Actions' }
            ],
            totalRows: 1,
            totalAktif: 0,
            totalNonAktif: 0,
            currentPage: 1,
            perPage: 10,
            pageOptions: [5, 10, 15],
            sortBy: null,
            sortDesc: false,
            sortDirection: 'asc',
            filter: null,

            form: {
                id: null,
                act: null,
                status: null
            },

            // detail
            user: {},

            // search box
            search: {
                query: '',
                found: 0,
                selected: 'Nama',
                opt: ['Nama', 'Status', 'Tanggal'],
                dates: {
                    start: new Date(),
                    end: new Date()
                },
                status: {
                    selected: '0',
                    opt: [{ text: 'Non-Aktif', value: '0' }, { text: 'Aktif', value: 1 }]
                }
            },

            showDismissibleAlert: false,

            pieChartData: [],
            pieChartOptions: {
                responsive: false,
                maintainAspectRatio: false
            }
        }
    },
    async created() {
        try {
            let baseURL = await axios().request();
            this.baseURL = baseURL.config.baseURL;
            this.getData();

        } catch (error) {
            console.log(error);
            
        }
    },
    methods: {
        async getData() {
            try {
                let result = await axios().get('/user/all');
                // console.log(result.data.data);
                // this.totalPoint = result
                
                this.items = result.data.data;

                this.totalAktif = result.data.data.filter(x => x.status == 1).length
                this.totalNonAktif = result.data.data.filter(x => x.status == 0).length

                console.log(this.items);
                // Set the initial number of items
                this.totalRows = this.items.length
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

        async openModal(type, id, idkomen) {
            try {
                let getid = await axios().get('/user/id/' + id);
                this.user = getid.data.data;
                this.form.id = getid.data.data.id;
                
                if (type == 'aktif') {
                    this.form.status = 1;
                    this.form.act = 'mengaktifkan';
                    this.$bvModal.show('modal-action');
                } else if (type == 'nonaktif') {
                    this.form.status = 0;
                    this.form.act = 'menonaktifkan '
                    this.$bvModal.show('modal-action');
                } else if (type == 'lihat') {
                    this.$bvModal.show('modal-lihat');
                }
            } catch (error) {
            console.log(error.response);
            this.makeToast(error.response.data.message, 'Terjadi Kesalahan', 'danger');
            
            }
        },

        async handleOk(e) {
          try {
                console.log(this.form.status);
                let result = await axios().put('/user/status/' + this.form.id, {
                    status: this.form.status
                });

                this.makeToast(`Berhasil ${this.form.act} ${this.form.id}`, 'Berhasil', 'success');
                this.getData();
          } catch (error) {
                console.log(error.response);
                this.makeToast(error.response.data.message, 'Terjadi Kesalahan', 'danger');this.makeToast(error.message, 'Terjadi Kesalahan', 'danger');
          }
        },

        async cari() {
            try {
                if (this.search.selected == 'Tanggal') this.search.query =  moment(this.search.dates.start).format('YYYY-MM-DD') + ',' + moment(this.search.dates.end).format('YYYY-MM-DD');
                if (this.search.selected == 'Status') this.search.query = this.search.status.selected;
                
                if (this.search.query == '') {
                    this.showDismissibleAlert = false;
                    this.getData();
                } else {
                    this.showDismissibleAlert = true;

                    let result = await axios().get(`/user/search/?type=${this.search.selected}&q=${this.search.query}`);
                    this.items = result.data.data;
                    console.log(result.data.data);
                    // Set the initial number of items
                    this.search.found = this.items.length
                }
            } catch (error) {
                console.log(error);
                this.makeToast(error.response.data.message, 'Terjadi Kesalahan', 'danger');     
            }
        },

        modalImg(img, desk) {
            this.img = img;
            // Get the modal
            var modal = document.getElementById("myModal");

            // Get the image and insert it inside the modal - use its "alt" text as a caption
            let modalImg = document.getElementById("img01");
            let captionText = document.getElementById("caption");

            modal.style.display = "block";
            modalImg.src = this.img;
            captionText.innerHTML = desk;
            

            // Get the <span> element that closes the modal
            var span = document.getElementsByClassName("close")[0];

            // When the user clicks on <span> (x), close the modal
            span.onclick = function() { 
                modal.style.display = "none";
            }
        },

        clearSearch() {
            this.showDismissibleAlert = false;
            this.search.query = '';
            this.getData();
        },

        exportExcel() {
            let data = this.items;
            const workbook = new ExcelJS.Workbook();
            let sheet = workbook.addWorksheet('Survey Result');

            let columnWidth = [20, 50, 10, 10, 10, 10, 10, 10];

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
            sheet.getCell("A1").value = "Nama";
            sheet.getCell("B1").value = "Alamat";
            sheet.getCell("C1").value = "No. Telp";
            sheet.getCell("D1").value = "Username";
            sheet.getCell("E1").value = "Email";
            sheet.getCell("F1").value = "Tanggal Lahir";
            sheet.getCell("G1").value = "Status";
            sheet.getCell("H1").value = "Tanggal Daftar";
            boldCell(["A1", "B1", "C1", "D1", "E1", "F1", "G1", "H1"]);
            // sheet.getRow(1).alignment = alignCenter;

            data.forEach(el => {
                sheet.getCell("A" + row).value = el.name;
                sheet.getCell("B" + row).value = el.address;
                sheet.getCell("C" + row).value = el.phone;
                sheet.getCell("D" + row).value = el.username;
                sheet.getCell("E" + row).value = el.email;
                sheet.getCell("F" + row).value = el.dob;
                sheet.getCell("G" + row).value = el.status == 1 ? 'Aktif' : 'Non-Aktif';
                sheet.getCell("H" + row).value = el.created_at;

                row++;
            });

            // Adjust column width
            sheet.columns.forEach((col, index) => {
                if (columnWidth[index]) {
                    col.width = columnWidth[index];
                }
            });

            // exporting
            let nameFile = "User_";
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
            let col = ["Nama","Alamat", "No. Telp", "Username", 
                        "Email", "Tanggal Lahir", "Status", "Tanggal Daftar"];
            // let col1 = ["Details", "Values"];
            let rows = [];
            // let rows1 = [];

            this.items.forEach(el => {      
                var temp = [el.name, el.address, el.phone, el.username, el.email, 
                            el.dob, el.status == 1 ? 'Aktif' : 'Non-Aktif', el.created_at];
                // var temp1 = [element.id,element.name];
                rows.push(temp);
                // rows1.push(temp1);

            });        

            doc.autoTable(col, rows, { startY: 10 });

            // doc.autoTable(col1, rows1, { startY: 60 });
            let currentTime = new Date().getDate().toString().padStart(2, "0") + (Number(new Date().getMonth()) + 1).toString().padStart(2, "0") + new Date().getFullYear();
            let nameFile = "User_" + currentTime + '.pdf';
            doc.save(nameFile);
        }
    },
    mixins: [date]
}
</script>

<style>

</style>
