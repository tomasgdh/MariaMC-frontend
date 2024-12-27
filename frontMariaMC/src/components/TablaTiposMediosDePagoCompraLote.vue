<!-- eslint-disable vue/valid-v-slot -->
<template>
    <div>
        <v-data-table :headers="headers" :fixed-footer="true" :items="MediosDePago" :dense="true"
            :sort-by="[{ key: 'id', order: 'asc' }]" no-data-text="No data avaible">
            <template v-slot:item.subTotal="{ item }">
                {{ formatoMonedaItem(item.total) }}
            </template>
            <template v-slot:item.total="{ item }">
                <span style="background-color: lightgreen;">{{ formatoMonedaItem(item.total) }}</span>
            </template>
            <template v-slot:top>
                <v-toolbar flat>
                    <v-toolbar-title class="classMariaFont">Medios de Pago</v-toolbar-title>
                    <v-divider class="mx-4" vertical></v-divider>
                    <div v-if="saldoAPagar != 0">
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
                                <span class="classMariaFont d-flex flex-column align-center justify-center">{{ formTitle
                                    }}</span>
                            </v-card-title>
                            <v-card-text>
                                <v-container>
                                    <v-row>
                                        <v-col cols="12" md="8" sm="6">
                                            <v-select v-model="editedItem.id" :items="TipoMediosDePago"
                                                item-title="description" item-value="id" label="Medio de Pago"
                                                variant="outlined" :error="stateMedioDePago"></v-select>
                                        </v-col>
                                        <v-col cols="12" md="4" sm="6">
                                            <v-text-field v-model="editedItem.total" label="Monto" variant="outlined"
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
                            <v-card-title
                                class="classMariaFont d-flex flex-column align-center justify-center">Atención</v-card-title>
                            <v-card-text class="text-h6">{{ `¿Estás seguro que deseas eliminar este Medio de Pago:` }}
                                <br>
                                {{ `${editedItem.description} ?` }}
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
import { useCompraStore } from '../store/compra.store'
import AlertMessage from "../components/AlertMessage.vue"
import CompraMediosDepagoModel from "../Models/CompraMediosDepagoModel"
import TipoMediosDePagoModel from "../Models/TipoMediosDePagoModel"
import { formatoMoneda } from "../functions/functions"
import { TipoMediosDePagoEnum } from "../Enum/TipoMediosDePagoEnum"
const props = defineProps(["Efectivo", "CreditoEnTienda"])
const emits = defineEmits(["saldo", "listaMediosDePago"])
const compraStore = useCompraStore()

const dialog = ref(false)
const dialogDelete = ref(false)
const headers: any = [
    { title: "id", value: "id" },
    { title: "Descripción", value: "description" },
    { title: "Total", value: "total", align: "end" },
    { title: "Acciones", value: "actions", sortable: false },
]
const MediosDePago: Ref<Array<CompraMediosDepagoModel>> = ref([])
const TipoMediosDePago: Ref<Array<TipoMediosDePagoModel>> = ref([])
const saldoAPagar = ref(0)
const editedIndex = ref(-1)
const editedItem = ref(new CompraMediosDepagoModel());
const defaultItem = new CompraMediosDepagoModel()
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
    TipoMediosDePago.value = await compraStore.getAllMediosDePagoCompra()
    saldoAPagar.value = Number(props.Efectivo.toFixed(2))
    calcularSaldo()
})

const editItem = (item: CompraMediosDepagoModel | any) => {
    editedIndex.value = MediosDePago.value.indexOf(item)
    item.saldo = saldoAPagar.value
    editedItem.value = Object.assign({}, item)
    limpiarEstados()
    dialog.value = true
}


const formatoMonedaItem = (valor: number | any) => {

    return formatoMoneda(valor)
}

const deleteItem = (item: CompraMediosDepagoModel | any) => {
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
        if (editedItem.value.total) {
            if (typeof editedItem.value.total === "string") {
                editedItem.value.total = Number(Number(editedItem.value.total).toFixed(2))
            } else if (typeof editedItem.value.total === "number") {
                editedItem.value.total = Number(editedItem.value.total.toFixed(2))
            }
        } else {
            // Asigna un valor predeterminado si monto no es un número.
            editedItem.value.total = 0.00
        }

        const medioAux: TipoMediosDePagoModel | undefined = TipoMediosDePago.value.find(item => item.id === editedItem.value.id)

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
    } else {
        if (existeItemConId(editedItem.value.id, editedIndex.value)) {
            resultado = false
            mensajeValidacion += newline + caracterItem + " El medio de pago seleccionado ya fue ingresado"
        }
    }

    if (!editedItem.value.total || editedItem.value.total == null || editedItem.value.total == undefined) {
        stateMonto.value = true
        resultado = false
        mensajeValidacion += newline + caracterItem + " El monto no puede estar vacío"
    } else if (editedItem.value.total <= 0) {
        stateMonto.value = true
        resultado = false
        mensajeValidacion += newline + caracterItem + " El monto tiene que ser mayor a cero"
    }

    if (!resultado)
        alertRef.value.alertErrorShow("Los datos ingreados no son válidos:", mensajeValidacion)


    return resultado
}

watch(MediosDePago.value, (newValue, oldValue) => {
    //if (newValue)
    calcularSaldo()
})
watch(() => props.Efectivo, (newValue, oldValue) => {
    if (newValue !== oldValue) {
        saldoAPagar.value = newValue
        if (newValue) {
            if (typeof newValue === "string") {
                saldoAPagar.value = Number(Number(newValue).toFixed(2))
            } else if (typeof newValue === "number") {
                saldoAPagar.value = Number(newValue.toFixed(2))
            }
        } else {
            // Asigna un valor predeterminado si monto no es un número.
            editedItem.value.total = 0.00
        }
    // limpiar()
    }
})

watch(() => props.CreditoEnTienda, (newValue, oldValue) => {
    if (newValue !== oldValue) {
        let creditoAux = 0
        if (newValue) {
            if (typeof newValue === "string") {
                creditoAux = Number(Number(newValue).toFixed(2))
            } else if (typeof newValue === "number") {
                creditoAux = Number(newValue.toFixed(2))
            }
        }
        const index = MediosDePago.value.findIndex(item => item.id == TipoMediosDePagoEnum.CreditoEnTienda);
        if (index !== -1) {
            // Si se encontró la compra, actualiza el total
            if (creditoAux > 0)
                MediosDePago.value[index].total = creditoAux
            else {
                 MediosDePago.value.splice(index, 1)
            }

        } else {
            if (creditoAux > 0)
            // Si no se encontró la compra, agrégala
            MediosDePago.value.push({
                id: TipoMediosDePagoEnum.CreditoEnTienda,
                description: "Credito en Tienda",
                total: creditoAux
            });
        }
    }
})

const calcularSaldo = () => {
    let saldoAux = props.Efectivo
    MediosDePago.value.forEach(item => {
        if (item.id != TipoMediosDePagoEnum.CreditoEnTienda)
            saldoAux = Number((saldoAux - item.total).toFixed(2))
    })
    saldoAPagar.value = saldoAux
    emits("saldo", saldoAPagar.value)
    emits("listaMediosDePago", MediosDePago.value)
}

const openDialogToAddItem = () => {
    calcularSaldo()

    if (saldoAPagar.value) {
            if (typeof saldoAPagar.value === "string") {
                saldoAPagar.value = Number(Number(saldoAPagar.value).toFixed(2))
            } else if (typeof saldoAPagar.value === "number") {
                saldoAPagar.value = Number(saldoAPagar.value.toFixed(2))
            }
        } else {
            // Asigna un valor predeterminado si monto no es un número.
            saldoAPagar.value = 0.00
        }

    editedItem.value.total = Number(saldoAPagar.value.toFixed(2))
    limpiarEstados()
    dialog.value = true
}

const limpiarEstados = () => {
    stateMedioDePago.value = false
    stateMonto.value = false
}

const limpiar = () => {
    MediosDePago.value = MediosDePago.value.filter(item => item.id == TipoMediosDePagoEnum.CreditoEnTienda)
    calcularSaldo()

}

const existeItemConId = (id: number,i:number) => {
    return MediosDePago.value.some((item,index) => item.id === id && index != i);
}

defineExpose({ limpiar })
</script>
<style scoped>
.classMariaFont {
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

:deep(.v-spacer) {
    flex-grow: 0.5;
}

:deep(.v-data-table__tr:nth-of-type(even)) {
    background-color: rgba(0, 0, 0, .05);
}
</style>