<template>
    <v-row align="center" justify="center">
        <h3 class="classMaria mt-1">Venta</h3>
    </v-row>
    <v-row>
        <v-col cols="12" md="6" sm="6" lg="6">
            <div class="mb-2">
                <BuscadorDeItem :Items="ItemsVenta"></BuscadorDeItem>
            </div>

            <TablaItemsVenta ref="tablaItemsVentaRef" :Items="ItemsVenta" :total="total"></TablaItemsVenta>
        </v-col>
        <v-col cols="12" md="6" sm="6" lg="6">
            <div v-if="ItemsVenta.length > 0">
                <BuscadorDeCliente :vistaTabla="true" @clienteSeleccionado="clienteSel"></BuscadorDeCliente>
            </div>
        </v-col>
    </v-row>
    <div v-if="ItemsVenta.length > 0 && cliente">
        <hr>
        <v-row>
            <v-col cols="12" md="6" sm="6" lg="6">
                <TablaTiposMediosDePago ref="tablaMpRef" :total="total" :cliente="cliente" @saldo="saldoTotal"
                    @descuento="descuento" @listaMediosDePago="mediosDePagoVenta" />
            </v-col>
            <v-col cols="12" md="6" sm="6" lg="6">
                <v-row>
                    <v-col cols="12" md="5" sm="5" lg="5">
                        <table style='font-size: 1.2rem;'>
                            <thead>
                                <tr>
                                    <th style='padding: 5px; border: 1px solid black; background-color: #f2f2f2; text-align: center;'
                                        colspan="2" class="classMaria"> Cobro</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td class="classMaria" style='padding: 5px; border: 1px solid black;'>SubTotal</td>
                                    <td style='padding: 5px; border: 1px solid black; text-align: right;'> {{
                    formatoMoneda(subTotal) }}</td>
                                </tr>
                                <tr>
                                    <td class="classMaria" style='padding: 5px; border: 1px solid black;'>Descuento</td>
                                    <td style='padding: 5px; border: 1px solid black; text-align: right;'> {{
                    formatoMoneda(descuentoVenta) }}</td>
                                </tr>
                                <tr>
                                    <td class="classMaria"
                                        style='padding: 5px; border: 1px solid black;font-weight: bold;'>Total</td>
                                    <td
                                        style='padding: 5px; border: 1px solid black; text-align: right;font-weight: bold;'>
                                        {{
                    formatoMoneda(total) }}</td>
                                </tr>
                                <tr v-if="saldo != 0">
                                    <td class="classMaria" style='padding: 5px; border: 1px solid black; '>Saldo</td>
                                    <td style='padding: 5px; border: 1px solid black; text-align: right;'> {{
                    formatoMoneda(saldo) }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </v-col>
                    <v-col cols="12" md="7" sm="7" lg="7">
                        <v-row> <v-btn v-if="saldo == 0 && ItemsVenta.length > 0" :disabled="ventaCobrada"
                               class="mt-2 mr-2" variant="elevated"
                                title="Cobrar" color="primary" prepend-icon="mdi-currency-usd"
                                @click.prevent="preCobrar">Cobrar</v-btn>
                            <v-btn v-if="saldo == 0 && ItemsVenta.length > 0" class="mt-2" variant="elevated"
                                title="Limpiar Venta" color="primary" prepend-icon="mdi-backspace-outline"
                                @click.prevent="limpiarVenta">Limpiar Venta</v-btn></v-row>
                        <v-row>
                            <v-btn v-if="ventaCobrada" class="mt-2 mr-2" variant="elevated"
                                title="Enviar Factura" color="primary" prepend-icon="mdi-gmail"
                                @click.prevent="preEnviarFactura">Enviar Factura</v-btn>
                        </v-row>
                        <v-row></v-row>

                    </v-col>
                </v-row>


            </v-col>
        </v-row>
    </div>
    <AlertMessage ref="alertRef" />
    <v-dialog v-model="dialog" max-width="600px" persistent @click:outside="closeDialog">
        <v-card>
            <v-card-text v-if="procesando">
                <v-container class="d-flex flex-column align-center justify-center">

                </v-container>
            </v-card-text>
            <v-card-text>
                <v-container class="d-flex flex-column align-center justify-center">
                    <v-progress-circular v-if="procesando" indeterminate color="primary"
                        :size="120"></v-progress-circular>
                    <v-icon v-else :color="iconColor" size="128">{{iconDialog}}</v-icon>
                    <div>{{ mensaje }}</div>
                </v-container>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" v-if="!procesando" variant="elevated" @click="closeDialog">Aceptar</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
    <Modal ref="modalRef"></Modal>
</template>
<script lang="ts" setup>
import { ref, Ref, onMounted, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
// import TablaDeItems from '../components/TablaDeItems.vue'
import TablaItemsVenta from '../components/TablaItemsVenta.vue'
import TablaTiposMediosDePago from '../components/TablaTiposMediosDePago.vue'
import AlertMessage from '../components/AlertMessage.vue'
import BuscadorDeItem from '../components/BuscadorDeItem.vue'
import BuscadorDeCliente from '../components/BuscadorDeCliente.vue'
import Modal from '../components/Modal.vue'
import VentaItemModel from '../Models/VentaItemModel'
import VentaMediosDepagoModel from '../Models/VentaMediosDepagoModel'
import ClienteVentaModel from '../Models/ClienteVentaModel'
import { formatoMoneda } from '../functions/functions'
import { useVentaStore } from '../store/venta.store'
import { useAuthStore } from '../store/auth.store'

const storeAuth = useAuthStore()
const storeVenta = useVentaStore()
const ItemsVenta: Ref<Array<VentaItemModel>> = ref([])
const cliente: Ref<ClienteVentaModel | null> = ref(null)
const listaMediosDePago: Ref<Array<VentaMediosDepagoModel>> = ref([])
const subTotal: Ref<number> = ref(0)
const descuentoVenta: Ref<number> = ref(0)
const modalRef = ref()
const saldo: Ref<number> = ref(0)
const tablaMpRef = ref()
const alertRef = ref()
const tablaItemsVentaRef = ref()
const dialog = ref(false)
const procesando = ref(false)
const idVenta = ref(-1)
const mensaje = ref("")
const iconDialog = ref("")
const iconColor = ref("")
const router = useRouter()
const ventaEnCurso = ref(false) // Variable que indica si hay una venta en curso
const ventaCobrada = ref(false) // Variable que indica que la venta fue cobrada
const total = computed(() => {
    return Number((subTotal.value - descuentoVenta.value).toFixed(2))
})

const beforeLeave = async (to: any, from: any, next: any) => {
    if (ventaEnCurso.value) {
        // Si hay una venta en curso, mostrar un mensaje o realizar alguna acción
        const confirmMessage = window.confirm('¿Estás seguro de que quieres salir? Se perderán los cambios de la venta.')

        if (!confirmMessage) {
            // Cancelar la navegación
            return next(false)
        }
    }
    // Si no hay una venta en curso o el usuario confirma salir, permitir la navegación
    ventaEnCurso.value = false
    next()
};

// Registrar el hook onBeforeRouteLeave
router.beforeEach(beforeLeave)

onMounted(() => {
    calcularTotal()
})

watch(ItemsVenta.value, (newValue, oldValue) => {
    calcularTotal()
    if (ItemsVenta.value.length > 0) { ventaEnCurso.value = true }
    else {
        cliente.value = null
        ventaEnCurso.value = false
    }

    if (tablaMpRef.value)
        tablaMpRef.value.limpiar()

}, { deep: true })

watch(cliente, () => {
    if (tablaMpRef.value)
        tablaMpRef.value.limpiar()
})

const preCobrar = () => {
    modalRef.value.ModalInfoShow("Atención - Venta", "Usted esta por procesar el pago, ¿Desea continuar?", true, Cobrar)
}

const preEnviarFactura = () => {
    modalRef.value.ModalInfoShow("Atención - Venta", "Usted esta por enviar un mail con el detalle de Compra, ¿Desea continuar?", true, EnviarFactura)
}

const calcularTotal = () => {
    let newSubTotal = 0
    ItemsVenta.value.forEach(item => {
        newSubTotal = Number((newSubTotal + item.price).toFixed(2))
    })
    subTotal.value = newSubTotal
}
const clienteSel = (client: ClienteVentaModel) => {
    cliente.value = client
}

const saldoTotal = (valor: number) => {
    saldo.value = Number((valor).toFixed(2))
}

const descuento = (valor: number) => {
    descuentoVenta.value = valor
}
const mediosDePagoVenta = (lista: Array<VentaMediosDepagoModel>) => {
    listaMediosDePago.value = lista
}

const Cobrar = async () => {
    mensaje.value = "Procesando Venta..."
    if (validarVenta()) {
        //procesar Venta
        dialog.value = true
        procesando.value = true
        let idCliente = -1
        if (cliente.value)
            idCliente = cliente.value.id
        let idUsuario = storeAuth.getIdUserLogin()
        let idSucursal = storeAuth.getIdSucursal()
        let response = await storeVenta.procesarVenta(idSucursal, ItemsVenta.value, idCliente,
            listaMediosDePago.value, subTotal.value, descuentoVenta.value, total.value, idUsuario)
        procesando.value = false

        if (response.result == "ok") {
            iconDialog.value = "mdi-check-circle-outline"
            iconColor.value = "success"
            mensaje.value = "Venta Procesada Correctamente"
            //puede devolver un objeto ticket con el nroOperacion
            idVenta.value = response.idVenta
            ventaCobrada.value = true
        } else {
            iconDialog.value = "mdi-alert-circle-outline"
            iconColor.value = "error"
            mensaje.value = response.message
            idVenta.value = response.idVenta
        }
        //generar Ticket
        /*const html = await storeVenta._generarTicket()
        const ventanaNueva = window.open('', '_blank')

        ventanaNueva?.document.write(html)
        ventanaNueva?.document.close()
        ventanaNueva?.print()*/
    }
}
const EnviarFactura = async () => {
    mensaje.value = "Enviando Comprobante..."
    if (idVenta.value > 0 ) {
        dialog.value = true
        procesando.value = true
        let idUser = storeAuth.getIdUserLogin()
        let response = await storeVenta.EnviarMailVenta(idVenta.value,idUser)
        procesando.value = false

        if (response.result == "ok") {
            iconDialog.value = "mdi-check-circle-outline"
            iconColor.value = "success"
            mensaje.value = response.message
        } else {
            iconDialog.value = "mdi-alert-circle-outline"
            iconColor.value = "error"
            mensaje.value = response.message
        }
    } else {
            iconDialog.value = "mdi-alert-circle-outline"
            iconColor.value = "error"
            mensaje.value = "Ocurrio un error, no se pudo enviar el Comprobante."
        }
}
const closeDialog = () => {
    dialog.value = false

    // if (resultado.value > -1)
    //     limpiarVenta()
}
const validarVenta = (): boolean => {
    let resultado = true
    let mensajeValidacion = ""
    const newline = "\n"
    const caracterItem = "•"

    if (Number((subTotal.value - descuentoVenta.value - saldo.value).toFixed(2)) != Number((total.value).toFixed(2))) {
        resultado = false
        mensajeValidacion += newline + caracterItem + " Ocurrio un error en el total de la venta"
    }

    if (!cliente.value) {
        resultado = false
        mensajeValidacion += newline + caracterItem + " Ocurrio un error en el Cliente de la venta"
    }
    let idUsuario = storeAuth.getIdUserLogin()
    if (!idUsuario) {
        resultado = false
        mensajeValidacion += newline + caracterItem + " Ocurrio un error la session esta vencida, vuelva a loguearse"
    }

    if (!resultado)
        alertRef.value.alertErrorShow("Los datos ingreados no son válidos:", mensajeValidacion)

    return resultado
}

const limpiarVenta = () => {
    ItemsVenta.value.splice(0)
    cliente.value = null
    listaMediosDePago.value = []
    subTotal.value = 0
    descuentoVenta.value = 0
    saldo.value = 0
    ventaEnCurso.value = false
    ventaCobrada.value = false
    idVenta.value = -1
}

</script>

<style scoped>
.classMaria {
    font-family: 'MariaFont Sans';
    font-weight: 500;
    color: black;
}
</style>