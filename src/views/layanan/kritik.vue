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
                <template slot="no" slot-scope="row">
                    {{row.index + 1}}
                </template>
                
                <template slot="tgl_kritiksaran" slot-scope="row">
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
                { key: 'no', label: 'No.', sortDirection: 'desc' },
                { key: 'nama_user', label: 'Nama User' },
                { key: 'rate_kritiksaran', label: 'Rate'},
                { key: 'desk_kritiksaran', label: 'Kritik & Saran'},
                { key: 'tgl_kritiksaran', label: 'Tanggal'}
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
            let result = await axios().get('/kritik');
            this.items = result.data.values;
        } catch (error) {
            
        }
    },
    mixins : [date]
}
</script>
