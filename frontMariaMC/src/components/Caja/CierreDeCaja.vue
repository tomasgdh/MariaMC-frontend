<template>
    <v-sheet class="mx-auto">
        <v-row align="center" justify="center">
            <h3 class="classMaria mt-1">Cierre de Caja</h3>
        </v-row>
        <v-form class="mt-2">
            <v-container>
                <v-row align="center" justify="center">
                    <v-btn color="primary" variant="elevated" :loading="procesando"
                        @click.prevent="realizarCierreX">Cierre Parcial</v-btn>
                    <v-btn color="error" variant="elevated" class="ml-2" :loading="procesando"
                        @click.prevent="realizarCierre">Cierre
                        De Caja</v-btn>
                </v-row>
            </v-container>
        </v-form>
        <div class="mt-3">
            <v-row align="center" justify="center">
                    <div class="mx-2"><b>Fec. Desde: </b> {{ fechaDesde }}</div>
                    <div class="mx-2"><b>Fec. Hasta: </b> {{ fechaHasta }}</div>
                    <div class="mx-2"><b>Usuario: </b> {{ usuarioCierre }}</div>
                    <div class="mx-2"><b>Total MP: </b><span :class="getClass(totalMP)"> {{ formatoMoneda(totalMP) }} </span></div>
                    <div class="mx-2"><b>Total Ef: </b><span :class="getClass(totalEfectivo)"> {{ formatoMoneda(totalEfectivo) }} </span></div>
            </v-row>
            <v-row align="center" justify="center">
                    <div class="mx-2"><b>En Caja deben quedar: </b><span :class="getClass(enCaja)"> {{ formatoMoneda(enCaja) }} </span></div>
                    <div class="mx-2"><b>Apertura de Caja: </b> <span :class="getClass(cajaInicial)"> {{ formatoMoneda(cajaInicial) }} </span></div>
                    <div class="mx-2"><b>Cierre de Caja: </b> <span :class="getClass(cajaFinal)"> {{ formatoMoneda(cajaFinal) }} </span></div>
                    <div class="mx-2"><b>A Guardar: </b> <span :class="getClass(aGuardar)"> {{ formatoMoneda(aGuardar) }} </span></div>
            </v-row>
            <v-row>
                <v-col>
                    <v-data-table id="tablaCierre" :headers="headers" :fixed-footer="true" :items="ListaItems"
                        :dense="true" :items-per-page="50" :sort-by="[{ key: 'idMovimiento', order: 'asc' }]"
                        no-data-text="No data avaible">
                        <template v-slot:item.importe="{ item }">
                            <span :class="getClass(item.importe)">
                                {{ formatoMoneda(item.importe) }}
                            </span>
                        </template>
                        <template v-slot:top>
                            <v-toolbar flat>
                                <v-toolbar-title class="classMaria">{{ leyendaTabla }}</v-toolbar-title>
                                <v-divider class="mx-4" vertical></v-divider>
                                <v-spacer></v-spacer>

                            </v-toolbar>
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
import { ref, Ref } from 'vue';
//Store
import { useCierreDeCajaStore } from '../../store/cierre.store'
import { useAuthStore } from '../../store/auth.store'
//Components
import Modal from '../../components/Modal.vue'
import ModalLoader from '../../components/ModalLoader.vue'
//Models
import CierreDetalleModel from "../../Models/CierreDetalleModel"
import CierreDeCajaResponseModel from "../../Models/CierreDeCajaResponseModel"
//Functions
import { formatoMoneda } from "../../functions/functions"

const headers: any = [
    { title: "Fecha", value: "fechaHora" },
    { title: "Id", value: "idMovimiento" },
    { title: "Tipo", value: "tipoMovimiento" },
    { title: "Forma de Pago", value: "formaDePago" },
    { title: "Importe", value: "importe", align: "end" },
    // { title: "Acciones", value: "actions", sortable: false },
]

const storeCierre = useCierreDeCajaStore()
const storeAuth = useAuthStore()

const modalRef = ref()
const modalLoaderRef = ref()

const procesando = ref(false)

const ListaItems: Ref<Array<CierreDetalleModel>> = ref([])

const leyendaTabla = ref("")
const cierre: Ref<CierreDeCajaResponseModel> = ref(new CierreDeCajaResponseModel())

const fechaDesde = ref("")
const fechaHasta = ref("")
const usuarioCierre = ref("")
const totalEfectivo = ref(0)
const totalMP = ref(0)
const enCaja = ref(0)
const cajaInicial = ref(0)
const cajaFinal = ref(0)
const aGuardar = ref(0)


// Función para realizar el cierre de caja
const realizarCierre = async () => {
    modalRef.value.ModalInfoShow("Atención - Cierre de Caja", "Usted esta por Realizar el Cierre de Caja, ¿Desea continuar?", true, EjecutarCierre)
}

const EjecutarCierre = async () => {

    try {
        leyendaTabla.value = "Cierre de Caja"
        procesando.value = true
        modalLoaderRef.value.Show()

        let idUsuario = storeAuth.getIdUserLogin()
        let idSucursal = storeAuth.getIdSucursal()
        let response = await storeCierre.RealizarCierreDeCaja(idSucursal, idUsuario)

        modalLoaderRef.value.Close()
        procesando.value = false

        if (response.result == "ok") {
            modalRef.value.ModalOkShow("Cierre de caja", response.message, false, cargarDatos, [response.cierre])
        } else {
            modalRef.value.ModalErrorShow("Cierre de caja", response.message, false)
        }


    } catch (error) {
        if (modalLoaderRef.value)
            modalLoaderRef.value.Close()
        procesando.value = false
        modalRef.value.ModalErrorShow("Cierre de caja", error, false)
    }

}

const realizarCierreX = async () => {
    //procesar Venta
    try {
        leyendaTabla.value = "Cierre de Caja X - No Definitivo"
        procesando.value = true
        modalLoaderRef.value.Show()

        let idUsuario = storeAuth.getIdUserLogin()
        let idSucursal = storeAuth.getIdSucursal()
        let response = await storeCierre.RealizarCierreDeCajaX(idSucursal, idUsuario)

        modalLoaderRef.value.Close()
        procesando.value = false

        if (response.result == "ok") {
            modalRef.value.ModalOkShow("Cierre de caja X", response.message, false, cargarDatos, [response.cierre])
        } else {
            modalRef.value.ModalErrorShow("Cierre de caja X ", response.message, false)
        }


    } catch (error) {
        if (modalLoaderRef.value)
            modalLoaderRef.value.Close()
        procesando.value = false
        modalRef.value.ModalErrorShow("Cierre de caja X", error, false)
    }

}

const getClass = (value: number) => {
    return value < 0 ? 'negative' : '';
}

const cargarDatos = (cierreDeCaja: CierreDeCajaResponseModel) => {
    cierre.value = cierreDeCaja
    ListaItems.value = cierre.value.detalle
    fechaDesde.value = cierreDeCaja.fechaDesde
    fechaHasta.value = cierreDeCaja.fechaHasta
    usuarioCierre.value = cierreDeCaja.usuarioCierre == "" ? "--" : cierreDeCaja.usuarioCierre
    totalMP.value = cierreDeCaja.totalMP
    totalEfectivo.value = cierreDeCaja.totalEfectivo
    enCaja.value = cierreDeCaja.enCaja
    cajaInicial.value = cierreDeCaja.aperturaEfCaja
    cajaFinal.value = cierreDeCaja.cierreEfCaja
    aGuardar.value = cierreDeCaja.efectivoAGuardar
}

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