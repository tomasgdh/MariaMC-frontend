<!-- eslint-disable vue/valid-v-slot -->
<template>
    <div>
        <v-data-table :headers="headers" :fixed-footer="true" :items="MediosDePago" :dense="true"
            :sort-by="[{ key: 'id', order: 'asc' }]" no-data-text="No data avaible">
            <template v-slot:item.subTotal="{ item }">
                {{ formatoMonedaItem(item.subTotal) }}
            </template>
            <template v-slot:item.descuentoValor="{ item }">
                {{ formatoMonedaItem(item.descuentoValor) }}
            </template>
            <template v-slot:item.total="{ item }">
                <span style="background-color: lightgreen;">{{ formatoMonedaItem(item.total) }}</span>
            </template>
            <template v-slot:top>
                <v-toolbar flat>
                    <v-toolbar-title class="classMaria">Medios de Pago</v-toolbar-title>
                    <v-divider class="mx-4" vertical></v-divider>
                    <div v-if="saldoAPagar != 0 && MediosDePago.length > 0">
                        <b style="color: red;">A asignar: {{ formatoMoneda(saldoAPagar) }}</b>
                    </div>
                    <v-spacer></v-spacer>
                    <v-btn v-if="saldoAPagar != 0 || (saldoAPagar == 0 && MediosDePago.length == 0)" color="primary"
                        variant="outlined" dark @click="openDialogToAddItem" prepend-icon="mdi-plus">
                        Medio de Pago
                    </v-btn>
                    <v-dialog v-model="dialog" max-width="800px" persistent>
                        <v-card>
                            <v-card-title>
                                <span class="classMaria d-flex flex-column align-center justify-center">{{ formTitle }}</span>
                            </v-card-title>
                            <v-card-text>
                                <v-container>
                                    <v-row>
                                        <v-col cols="12" md="8" sm="6">
                                            <v-select v-model="editedItem.id" :items="TipoMediosDePago"
                                                item-title="description" item-value="id" label="Medio de Pago"
                                                variant="outlined" @update:modelValue="handlerChange"
                                                :error="stateMedioDePago"></v-select>
                                        </v-col>
                                        <v-col cols="12" md="4" sm="6">
                                            <v-text-field v-model="editedItem.subTotal" label="Monto" variant="outlined"
                                                type="number" :error="stateMonto"></v-text-field>
                                        </v-col>
                                    </v-row>
                                </v-container>
                                <AlertMessage ref="alertRef" />
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="primary" variant="elevated" @click="close">Cancelar</v-btn>
                                <v-btn color="primary" variant="elevated" @click="save">{{ btnOkTitle }}</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                    <v-dialog v-model="dialogDelete" max-width="600px" persistent>
                        <v-card>
                            <v-card-title class="classMaria d-flex flex-column align-center justify-center">Atención</v-card-title>
                            <v-card-text class="text-h6">{{`¿Estás seguro que deseas eliminar este Medio de Pago:`}} <br>
                                {{ `${editedItem.description} ?`}}
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="primary" variant="elevated" @click="closeDelete">NO</v-btn>
                                <v-btn color="primary" variant="elevated" @click="deleteItemConfirm">SI</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </v-toolbar>
            </template>
            <template v-slot:item.actions="{ item }">
                <v-icon class="me-2" size="small" @click="editItem(item)">mdi-pencil </v-icon>
                <v-icon size="small" @click="deleteItem(item)">mdi-delete</v-icon>
            </template>
        </v-data-table>
    </div>
</template>
<script lang="ts" setup>
import { ref, Ref, computed, watch, nextTick, onMounted } from "vue"
import { useVentaStore } from '../store/venta.store'
import AlertMessage from "../components/AlertMessage.vue"
import ClienteVentaModel from '../Models/ClienteVentaModel'
import VentaMediosDepagoModel from "../Models/VentaMediosDepagoModel"
import TipoMediosDePagoModel from "../Models/TipoMediosDePagoModel"
import { TipoMediosDePagoEnum } from "../Enum/TipoMediosDePagoEnum"
import { formatoMoneda } from "../functions/functions"
const emits = defineEmits(["saldo", "descuento","listaMediosDePago"])
const props = defineProps(["total", "cliente"])
const ventaStore = useVentaStore()

const dialog = ref(false)
const dialogDelete = ref(false)
const headers: any = [
    { title: "id", value: "id" },
    { title: "Descripción", value: "description" },
    { title: "SubTotal", value: "subTotal", align: "end" },
    { title: "Descuento", value: "descuentoValor", align: "end" },
    { title: "Total", value: "total", align: "end" },
    { title: "Acciones", value: "actions", sortable: false },
]
const MediosDePago: Ref<Array<VentaMediosDepagoModel>> = ref([])
const TipoMediosDePago: Ref<Array<TipoMediosDePagoModel>> = ref([])
const saldoAPagar = ref(props.total)
const clienteSeleccionado: Ref<ClienteVentaModel | null> = ref(props.cliente)
const editedIndex = ref(-1)
const editedItem = ref(new VentaMediosDepagoModel());
const defaultItem = new VentaMediosDepagoModel()
const alertRef = ref()
const stateMedioDePago = ref(false)
const stateMonto = ref(false)

const formTitle = computed(() => {
    return editedIndex.value === -1 ? "Nuevo medio de pago" : "Editar medio de pago"
})

const btnOkTitle = computed(() => {
    return editedIndex.value === -1 ? "Agregar" : "Editar"
})


onMounted(async () => {
    TipoMediosDePago.value = await ventaStore.getAllMediosDePago()
    saldoAPagar.value = props.total
    calcularSaldo()
})

const editItem = (item: VentaMediosDepagoModel | any) => {
    editedIndex.value = MediosDePago.value.indexOf(item)
    item.saldo = saldoAPagar.value
    editedItem.value = Object.assign({}, item)
    limpiarEstados()
    actualizaCliente()
    dialog.value = true
}

const actualizaCliente = () => {
    clienteSeleccionado.value = props.cliente
}

const formatoMonedaItem = (valor: number | any) => {

    return formatoMoneda(valor)
}

const deleteItem = (item: VentaMediosDepagoModel | any) => {
    editedIndex.value = MediosDePago.value.indexOf(item)
    editedItem.value = Object.assign({}, item)
    dialogDelete.value = true
}

const deleteItemConfirm = () => {
    MediosDePago.value.splice(editedIndex.value, 1)
    closeDelete()
}

const close = () => {
    dialog.value = false
    calcularSaldo()
    nextTick(() => {
        editedItem.value = Object.assign({}, defaultItem)
        editedIndex.value = -1
    })
}


const closeDelete = () => {
    dialogDelete.value = false
    nextTick(() => {
        editedItem.value = Object.assign({}, defaultItem)
        editedIndex.value = -1
    })
}

const save = () => {
    if (validarDatos()) {
        // Asegúrate de que monto es un número.
        if (editedItem.value.subTotal) {
            if (typeof editedItem.value.subTotal === "string") {
                editedItem.value.subTotal = Number(Number(editedItem.value.subTotal).toFixed(2))
            } else if (typeof editedItem.value.subTotal === "number") {
                editedItem.value.subTotal = Number(editedItem.value.subTotal.toFixed(2))
            }
        } else {
            // Asigna un valor predeterminado si monto no es un número.
            editedItem.value.subTotal = 0.00
        }

        const medioAux: TipoMediosDePagoModel | undefined = TipoMediosDePago.value.find(item => item.id === editedItem.value.id)

        if (medioAux && medioAux.descuento)
            if (medioAux.descuento > 0) {
                editedItem.value.descuentoValor = Number((editedItem.value.subTotal * medioAux.descuento).toFixed(2))
            } else {
                editedItem.value.descuentoValor = 0
            }

        editedItem.value.total = Number((editedItem.value.subTotal - editedItem.value.descuentoValor).toFixed(2))

        if (medioAux)
            editedItem.value.description = medioAux.description
        if (editedIndex.value > -1) {
            Object.assign(MediosDePago.value[editedIndex.value], editedItem.value)
        } else {
            MediosDePago.value.push(editedItem.value)
        }
        close()
    }
}

const validarDatos = (): boolean => {
    let resultado = true
    let mensajeValidacion = ""
    const newline = "\n"
    const caracterItem = "•"
    limpiarEstados()

    if (!editedItem.value.id || editedItem.value.id == 0) {
        stateMedioDePago.value = true
        resultado = false
        mensajeValidacion += newline + caracterItem + " El medio de pago no puede estar vacío"
    }else{
        if(existeItemConId(editedItem.value.id) && editedIndex.value == -1){
            resultado = false
            mensajeValidacion += newline + caracterItem + " El medio de pago seleccionado ya fue ingresado"
        }
    }

    if (!editedItem.value.subTotal || editedItem.value.subTotal == null || editedItem.value.subTotal == undefined) {
        stateMonto.value = true
        resultado = false
        mensajeValidacion += newline + caracterItem + " El monto no puede estar vacío"
    } else if (editedItem.value.subTotal <= 0) {
        stateMonto.value = true
        resultado = false
        mensajeValidacion += newline + caracterItem + " El monto tiene que ser mayor a cero"
    } else {
        if (editedItem.value.id === TipoMediosDePagoEnum.CreditoEnTienda) {
            if (clienteSeleccionado.value && editedItem.value.subTotal > clienteSeleccionado.value.creditoEnTienda) {
                stateMonto.value = true
                resultado = false
                if (clienteSeleccionado.value.creditoEnTienda == 0)
                    mensajeValidacion += newline + caracterItem + ` El Cliente no tiene Credito en Tienda (${formatoMoneda(clienteSeleccionado.value.creditoEnTienda)})`
                else
                    mensajeValidacion += newline + caracterItem + ` El monto tiene que ser menor igual a cero ${formatoMoneda(clienteSeleccionado.value.creditoEnTienda)}`
            }
        }
    }
    if (!resultado)
        alertRef.value.alertErrorShow("Los datos ingreados no son válidos:", mensajeValidacion)


    return resultado
}

const existeItemConId = (id: number) => {
    return MediosDePago.value.some(item => item.id === id);
}

watch(MediosDePago.value, (newValue, oldValue) => {
    //if (newValue)
    calcularSaldo()
})
watch(() => props.total, (newValue, oldValue) => {
    if (newValue !== oldValue) {
        saldoAPagar.value = newValue
        calcularSaldo()
    }
});

const calcularSaldo = () => {
    let saldoAux = props.total
    let descAux = 0
    MediosDePago.value.forEach(item => {
        saldoAux = Number((saldoAux - item.total).toFixed(2))
        descAux = Number((descAux + item.descuentoValor).toFixed(2))
    })
    saldoAPagar.value = saldoAux
    // descuentoTotal.value = descAux
    emits("saldo", saldoAPagar.value)
    emits("descuento", descAux)
    emits("listaMediosDePago", MediosDePago.value)
}

const openDialogToAddItem = () => {
    calcularSaldo()
    editedItem.value.subTotal = Number(saldoAPagar.value.toFixed(2))
    limpiarEstados()
    actualizaCliente()
    dialog.value = true
}

const handlerChange = () => {
    if (editedItem.value.id === TipoMediosDePagoEnum.CreditoEnTienda) {
        if (clienteSeleccionado.value)
            editedItem.value.subTotal = saldoAPagar.value < clienteSeleccionado.value.creditoEnTienda ? saldoAPagar.value : clienteSeleccionado.value.creditoEnTienda
    }
}
const limpiarEstados = () => {
    stateMedioDePago.value = false
    stateMonto.value = false
}

const limpiar = () => {
    //MediosDePago.value = []
    MediosDePago.value.splice(0, MediosDePago.value.length)
    calcularSaldo()

}
defineExpose({ limpiar })
</script>
<style scoped>
.classMaria {
    font-size: 1.5rem;
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

:deep(.v-toolbar__content > .v-toolbar-title) {
    min-width: 150px;
}

:deep(.v-spacer){
    flex-grow: 0.5;
}
:deep(.v-data-table__tr:nth-of-type(even)) {
   background-color: rgba(0, 0, 0, .05);
 }

</style>