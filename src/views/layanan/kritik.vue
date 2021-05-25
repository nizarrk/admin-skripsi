<template>
    <div class="animated fadeIn">
        <b-container fluid>
            <b-card title="Daftar Kritik & Saran">
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
                <!-- <template slot="no" slot-scope="row">
                    {{row.index + 1}}
                </template> -->
                
                <template #cell(created_at)="row">
                    {{formatTglFull(row.value)}}
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
import date from '@/mixins/dateConfig';
export default {
    data() {
        return {
            items: [],
            fields: [   
                { key: 'user.name', label: 'Nama User' },
                { key: 'rate', label: 'Rate'},
                { key: 'description', label: 'Kritik & Saran'},
                { key: 'created_at', label: 'Tanggal'}
            ],
            totalRows: 1,
            currentPage: 1,
            perPage: 5,
            pageOptions: [5, 10, 15],
            sortBy: null,
            sortDesc: false,
            sortDirection: 'asc',
            filter: null,
            }
    },
    async created() {
        try {
            let result = await axios().get('/critic/get');
            this.items = result.data.data;
        } catch (error) {
            console.log(error.response);
            this.makeToast(error.response.data.message, 'Terjadi Kesalahan', 'danger');
        }
    },
    makeToast(text, title, variant = null) {
        this.$bvToast.toast(text, {
        title: title,
        variant: variant,
        solid: true
        })
    },
    mixins : [date]
}
</script>
