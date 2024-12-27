<template>
    <v-sheet class="mx-auto">
        <v-row align="center" justify="center">
            <h3 class="classMaria mt-1">Ventas</h3>
        </v-row>
        <v-form class="mt-2">
            <v-container>
                <v-row>
                    <v-col>
                        <v-date-input v-model="rangoFecha" label="Seleccione un Rango de Fechas" max-width="368"
                            placeholder="Ingrse un Rango de Fechas DD/MM/YYYY" locale="es" multiple="range"
                            variant="outlined" :clearable="true" :persistentClear="true" @click:clear="limpiarFechas"
                            @update:input="handleDateChange"
                            :input-props="{ format: 'dd/MM/yyyy', type: 'datetime-local' }"></v-date-input>
                    </v-col>
                    <v-col>
                        <v-btn color="primary" variant="elevated" :loading="procesando"
                            @click.prevent="CargarLisatdo">Listar Ventas</v-btn>
                    </v-col>
                </v-row>
            </v-container>
        </v-form>
        <div class="mt-3">
            <v-row>
                <v-col>
                    <v-data-table id="tablaVentas" :headers="headers" :fixed-footer="true" :items="listaItems"
                        :dense="true" :page="options.page" v-model:items-per-page.sync="options.itemsPerPage"
                        :loading="procesando" no-data-text="No hay datos disponibles">
                        <template v-slot:item.totalDeVenta="{ item }">
                            <span :class="getClass(item.totalDeVenta)">
                                {{ formatoMoneda(item.totalDeVenta) }}
                            </span>
                        </template>
                        <template v-slot:top>
                            <v-toolbar flat>
                                <v-toolbar-title class="classMaria">Lista De Ventas</v-toolbar-title>
                                <v-divider class="mx-4" vertical></v-divider>
                                <v-spacer></v-spacer>
                            </v-toolbar>
                        </template>
                        <template v-slot:item.actions="{ item }">
                            <v-icon class="me-2" size="small" @click="openItem(item)">mdi-open-in-new</v-icon>
                            <v-icon v-if="item.comprobante != ''" class="me-2" size="small"
                                @click="downloadPdf(item.facturaHtml, `Factura_${item.comprobante}.pdf`)">mdi-download</v-icon>
                        </template>
                        <template v-slot:bottom>
                            <div class="text-center pt-2">
                                <v-pagination v-model="options.page" :total-visible="5"
                                    :length="pageCount"></v-pagination>
                            </div>
                        </template>
                    </v-data-table>
                </v-col>
            </v-row>
        </div>
    </v-sheet>
    <Modal ref="modalRef"></Modal>
    <ModalLoader ref="modalLoaderRef"></ModalLoader>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <!-- Contenido HTML dinámico que será convertido en PDF -->
    <div ref="pdfContent" id="pdf-content" v-html="htmlContent"></div>

</template>

<script lang="ts" setup>
import { onMounted, ref, Ref, computed, watch, nextTick } from 'vue';
import { useRouter } from 'vue-router'
//Store
import { useVentaStore } from '../store/venta.store'
import { useAuthStore } from '../store/auth.store'
//Components
import Modal from '../components/Modal.vue'
import ModalLoader from '../components/ModalLoader.vue'
import { VDateInput } from 'vuetify/labs/VDateInput'
//Models
import VentaResultadoModel from "../Models/VentaResultadoModel"
import CCResponseModel from "../Models/CCResponseModel"
//Functions
import { formatoMoneda } from "../functions/functions"
import { format } from 'date-fns'

import jsPDF from 'jspdf'

const headers: any = [
    { title: "#", value: "idVenta" },
    { title: "Fecha", value: "fechaVenta" },
    { title: "Total", value: "totalDeVenta", align: "end" },
    { title: "Nro. comprobante", value: "comprobante", align: "end" },
    { title: "Cliente", value: "cliente" },
    { title: "Nro. Documento", value: "nroDocumento", align: "end" },
    { title: "Acciones", value: "actions", sortable: false },
]

const storeVenta = useVentaStore()
const storeAuth = useAuthStore()

const modalRef = ref()
const modalLoaderRef = ref()

const procesando = ref(false)
const listaItems: Ref<Array<VentaResultadoModel>> = ref([])
const totalDeRegistros = ref(0)
const options = ref({ page: 1, itemsPerPage: 10, sortBy: "IdVenta", sortDesc: "asc" })
const pageCount = computed(() => {
    return Math.ceil(totalDeRegistros.value / options.value.itemsPerPage)
})

const router = useRouter()

const rangoFecha = ref(null)
const fecInicio = ref('')
const fecFinal = ref('')

// Función para formatear la fecha a 'dd/MM/yyyy'
const formattedDate = (date: Date) => {
    // Con date-fns
    return format(date, 'dd/MM/yyyy');
}

const limpiarFechas = () => {
    rangoFecha.value = null
}
const handleDateChange = (newValue: string) => {
    console.log('Texto o selección cambiado:', newValue);
}
const htmlContent = ref("")
const pdfContent = ref<HTMLDivElement | null>(null)

const downloadPdf = (html: string, filename: string) => {

    htmlContent.value = html
    nextTick()

    const element = pdfContent.value; // Obtén el contenido del DOM

    if (element) {
        const pdf = new jsPDF({
            orientation: 'portrait', // 'portrait' o 'landscape'
            unit: 'mm',
            format: 'a4'
        })

        pdf.html(element, {
            callback: (pdf) => {
                pdf.save(filename)
            },
            x: 10, // Margen en mm
            y: 10,
            width: 190, // Ancho de la página A4 menos márgenes
            windowWidth: 800, // Ajustar el ancho virtual de la ventana para el render
        }).finally( () => {
            htmlContent.value = ""
            nextTick()
        })
    }
}

onMounted(() => {
    const today = new Date();

    // Obtener el año y el mes actual
    const year = today.getFullYear();
    const month = today.getMonth(); // Este valor es indexado desde cero

    // Crear el primer día del mes actual
    const firstDayOfMonth = new Date(year - 1, month, 1);

    // Crear el último día del mes actual
    const lastDayOfMonth = new Date(year, month + 1, 0); // 0 representa el último día del mes anterior

    // Crear el array con las dos fechas
    rangoFecha.value = [firstDayOfMonth, lastDayOfMonth]
    CargarLisatdo()
})

const CargarLisatdo = async () => {
    console.log("rangoFecha.value:", rangoFecha.value)
    if (rangoFecha.value && rangoFecha.value.length != 0) {
        if (rangoFecha.value.length == 1) {
            fecInicio.value = formattedDate(rangoFecha.value[0])
            fecFinal.value = formattedDate(rangoFecha.value[0])
        } else {
            fecInicio.value = formattedDate(rangoFecha.value[0])
            fecFinal.value = formattedDate(rangoFecha.value[rangoFecha.value.length - 1])
        }
    } else {
        fecInicio.value = ""
        fecFinal.value = ""
    }
    if ((!fecInicio.value || fecInicio.value == "") || (!fecFinal.value || fecFinal.value == "")) {
        modalRef.value.ModalErrorShow("Ventas", "Seleccione unas fechas por favor.")
        return
    }
    try {
        procesando.value = true
        let idSucursal = storeAuth.getIdSucursal()
        let response = await storeVenta.GetAllVentasPaginado(idSucursal, fecInicio.value, fecFinal.value, options.value.page, options.value.itemsPerPage)
        // procesando.value = false

        if (response.result == "ok") {
            listaItems.value = response.ventas
            totalDeRegistros.value = response.totalDeRegistros

        } else {
            modalRef.value.ModalErrorShow("Ventas", response.message)
        }

    } catch (error) {
        modalRef.value.ModalErrorShow("Ventas", error)
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
        CargarLisatdo();
    }
);

watch(
    () => options.value.itemsPerPage,
    (newItemsPerPage) => {
        CargarLisatdo();
    }
);
</script>

<style scoped>
.menu-card {
    position: absolute;
    top: 0;
    right: 60px;
    /* Ajusta para colocarlo a la izquierda del icono */
    z-index: 2;
}

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