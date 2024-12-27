<template>
    <v-sheet class="mx-auto">
        <v-row align="center" justify="center">
            <h3 class="classMaria mt-1">Cierres de Caja</h3>
        </v-row>
        <v-form class="mt-2">
            <v-container>
                <v-row align="center" justify="center">
                    <v-btn color="primary" icon="mdi-refresh" variant="elevated" :loading="procesando"
                        @click.prevent="CargarLisatdoDeCierres"></v-btn>
                </v-row>
            </v-container>
        </v-form>
        <div class="mt-3">
            <v-row>
                <v-col>
                    <v-data-table id="tablaLote" :headers="headers" 
                        :fixed-footer="true" 
                        :items="listaItems"
                        :dense="true" 
                        :page="options.page" 
                        v-model:items-per-page.sync="options.itemsPerPage" 
                        :loading="procesando"
                        no-data-text="No hay datos disponibles">
                        <template v-slot:item.totalEfectivo="{ item }">
                            <span :class="getClass(item.totalEfectivo)">
                                {{ formatoMoneda(item.totalEfectivo) }}
                            </span>
                        </template>
                        <template v-slot:item.totalMP="{ item }">
                            <span :class="getClass(item.totalMP)">
                                {{ formatoMoneda(item.totalMP) }}
                            </span>
                        </template>
                        <template v-slot:top>
                            <v-toolbar flat>
                                <v-toolbar-title class="classMaria">Lista De Cierres de Caja</v-toolbar-title>
                                <v-divider class="mx-4" vertical></v-divider>
                                <v-spacer></v-spacer>
                            </v-toolbar>
                        </template>
                        <template v-slot:item.actions="{ item }">
                            <v-icon class="me-2" size="small" @click="openItem(item)">mdi-open-in-new</v-icon>
                        </template>
                        <template v-slot:bottom>
                            <div class="text-center pt-2">
                                <v-pagination v-model="options.page" :total-visible="5" :length="pageCount"></v-pagination>
                            </div>
                        </template>
                    </v-data-table>
                </v-col>
            </v-row>
        </div>

    </v-sheet>
    <Modal ref="modalRef"></Modal>
    <ModalLoader ref="modalLoaderRef"></ModalLoader>
</template>

<script lang="ts" setup>
import { onMounted, ref,Ref, computed,watch} from 'vue';
import { useRouter } from 'vue-router'
//Store
import { useCierreDeCajaStore } from '../../store/cierre.store'
import { useAuthStore } from '../../store/auth.store'
//Components
import Modal from '../../components/Modal.vue'
import ModalLoader from '../../components/ModalLoader.vue'
//Models
// import CierreDetalleModel from "../../Models/CierreDetalleModel"
import CierreDeCajaResponseModel from "../../Models/CierreDeCajaResponseModel"
import CCResponseModel from "../../Models/CCResponseModel"
//Functions
import { formatoMoneda } from "../../functions/functions"

const headers :any = [
    { title: "#", value: "idCierre" },
    { title: "Fec. Desde", value: "fechaDesde" },
    { title: "Fec. Hasta", value: "fechaHasta" },
    { title: "Cerrado Por", value: "usuario" },
    { title: "# Ventas", value: "cantidadDeVentas", align: "end" },
    { title: "# Prendas", value: "cantidadDePrendas", align: "end" },
    { title: "Total Ef", value: "totalEfectivo", align: "end" },
    { title: "Total MP", value: "totalMP", align: "end" },
    { title: "Acciones", value: "actions", sortable: false },
]

const storeCierre = useCierreDeCajaStore()
const storeAuth = useAuthStore()

const modalRef = ref()
const modalLoaderRef = ref()

const procesando = ref(false)
const listaItems:Ref<Array<CierreDeCajaResponseModel>> = ref([])
const totalDeRegistros = ref(0)
const options = ref({ page: 1, itemsPerPage: 10, sortBy: "IdCierre", sortDesc: "asc" })
const pageCount = computed(() => {
    return Math.ceil(totalDeRegistros.value / options.value.itemsPerPage)
})

const router = useRouter()

onMounted(() => {
    CargarLisatdoDeCierres()
})

const CargarLisatdoDeCierres = async () => {

    try {
        procesando.value = true
        let idSucursal = storeAuth.getIdSucursal()
        let response = await storeCierre.GetAllCierreDeCajaPaginado(idSucursal, options.value.page, options.value.itemsPerPage)
        // procesando.value = false

        if (response.result == "ok") {
                listaItems.value = response.cierres
                totalDeRegistros.value = response.totalDeRegistros

        } else {
            modalRef.value.ModalErrorShow("Cierres", response.message)
        }

    } catch (error) {
        modalRef.value.ModalErrorShow("Cierres", error)
    } finally {
        procesando.value = false
    }
}

const openItem = (item: CCResponseModel) => {
    // window.open(`CierreDetalle/${item.idCierre}`, '_blank')
    router.push({ name: 'CierreDeCajaDetalle', params: { idCierre: item.idCierre } })
}

const getClass = (value: number) => {
    return value < 0 ? 'negative' : '';
}
watch(
  () => options.value.page,
  (newPage) => {
    CargarLisatdoDeCierres();
  }
);

watch(
  () => options.value.itemsPerPage,
  (newItemsPerPage) => {
    CargarLisatdoDeCierres();
  }
);
</script>

<style scoped>
.classMaria {
    font-family: 'MariaFont Sans';
    font-weight: 500;
    color: black;
}

:deep(header > .v-toolbar__content) {
    height: 36px !important;
}

:deep(.v-table--density-default) {
    --v-table-header-height: 24px;
    --v-table-row-height: 24px;
}

:deep(.v-divider) {
    margin-bottom: 0px;
    margin-top: 0px;
}

:deep(.v-data-table-footer) {
    /* height: 24px !important;
    font-size: .8rem; */
    padding: 0px;
}

:deep(.v-data-table__tr:nth-of-type(even)) {
    background-color: rgba(0, 0, 0, .05);
}

.negative {
    color: red;
}
</style>