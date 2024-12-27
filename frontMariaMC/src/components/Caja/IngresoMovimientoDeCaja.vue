<template>
    <v-sheet class="mx-5">
        <v-row align="center" justify="center">
            <h3 class="classMaria mt-1">Ingreso de Movimiento - {{ titulo }}</h3>
        </v-row>
        <v-row>
            <v-data-table :headers="headers" :items="listaItems" :dense="true" :page="options.page"
                v-model:items-per-page.sync="options.itemsPerPage" :loading="procesando"
                no-data-text="No hay datos disponibles">
                <template v-slot:item.importe="{ item }">
                    {{ formatoMoneda(item.importe) }}
                </template>
                <template v-slot:top>
                    <v-toolbar flat>
                        <v-toolbar-title class="classMaria">{{ titulo }}</v-toolbar-title>
                        <v-divider class="mx-4" vertical></v-divider>
                        <v-spacer></v-spacer>
                        <v-btn color="primary" variant="outlined" dark @click="openDialogToAddItem"
                            prepend-icon="mdi-plus">
                            {{ titulo }}
                        </v-btn>
                        <v-dialog v-model="dialog" max-width="800px" persistent>
                            <v-card>
                                <v-card-title>
                                    <span class="classMaria d-flex flex-column align-center justify-center">{{ formTitle
                                        }}</span>
                                </v-card-title>
                                <v-card-text>
                                    <v-container>
                                        <v-row>
                                            <v-col cols="4" v-if="editedIndex !== -1">
                                                <!-- <label>{{`Fecha: ${editedItem.fecha}`}}</label> -->
                                                <v-text-field v-model="editedItem.fecha" type="string" label="Fecha"
                                                    placeholder="Fecha" variant="outlined"
                                                    :disabled="true"></v-text-field>
                                            </v-col>
                                            <v-col cols="8">
                                                <v-text-field v-model="editedItem.descripcion" type="string"
                                                    label="Descripción" placeholder="Descripción" variant="outlined"
                                                    :error="stateDescripcion" :maxlength="50"
                                                    @input="editedItem.descripcion = editedItem.descripcion.toUpperCase()"
                                                    hint="Máximo 50 caracteres" counter></v-text-field>
                                            </v-col>
                                        </v-row>
                                        <v-row>
                                            <v-col cols="6">
                                                <v-select v-model="editedItem.idTipoMovimiento"
                                                    :items="listaTipoMovimiento" item-title="description"
                                                    item-value="id" :label="labelTipoMovimientoSelect"
                                                    variant="outlined" :error="stateTipoMovimiento"></v-select>
                                            </v-col>
                                            <v-col cols="6">
                                                <v-select v-model="editedItem.idTipoFormaDePago"
                                                    :items="listaTipoFormaDePago" item-title="description"
                                                    item-value="id" label="Forma de Pago" variant="outlined"
                                                    :error="stateTipoFormaDePago"></v-select>
                                            </v-col>
                                        </v-row>
                                        <v-row>
                                            <v-col cols="6">
                                                <v-text-field v-model="editedItem.importe" type="number" label="Importe"
                                                    placeholder="Importe" variant="outlined"
                                                    :disabled="editedIndex !== -1" :error="stateImporte"></v-text-field>
                                            </v-col>
                                        </v-row>
                                    </v-container>
                                    <AlertMessage ref="alertRef" />
                                </v-card-text>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn color="primary" variant="elevated" @click="close">Cancelar</v-btn>
                                    <v-btn color="primary" variant="elevated" @click="save">{{ btnOkTitle
                                        }}</v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>
                        <v-dialog v-model="dialogDelete" max-width="600px" persistent>
                            <v-card>
                                <v-card-title class="classMaria d-flex flex-column align-center justify-center">Atención
                                    - Inactivar Item</v-card-title>
                                <v-card-text class="text-h6">{{ `¿Estás seguro que deseas Inactivar este Item: (Id:
                                    ${editedItem.id}) "${editedItem.descripcion}" ?` }}
                                </v-card-text>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn color="primary" variant="elevated" @click="closeDelete">NO</v-btn>
                                    <v-btn color="primary" variant="elevated"
                                        @click="deleteItemConfirm">SI</v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>
                    </v-toolbar>
                </template>
                <template v-slot:item.actions="{ item }">
                    <v-icon class="me-2" size="small" @click="editItem(item)">mdi-pencil </v-icon>
                    <v-icon size="small" @click="deleteItem(item)">mdi-delete</v-icon>
                </template>
                <template v-slot:bottom>
                    <div class="text-center pt-2">
                        <v-pagination v-model="options.page" :total-visible="5" :length="pageCount"></v-pagination>
                    </div>
                </template>
            </v-data-table>
        </v-row>
    </v-sheet>
    <Modal ref="modalRef"></Modal>
    <ModalLoader ref="modalLoaderRef"></ModalLoader>
</template>
<script lang="ts" setup>
import { ref, Ref, onMounted, computed, nextTick, watch } from 'vue';
import { useRoute } from 'vue-router'

//Stores
import { useMovimientosStore } from '../../store/movimientos.store'
import { useAuthStore } from '../../store/auth.store'
import { useVentaStore } from '../../store/venta.store'

//Components
import AlertMessage from '../../components/AlertMessage.vue'
import Modal from '../../components/Modal.vue'
import ModalLoader from '../../components/ModalLoader.vue'

//Models
import ItemMovimientoModel from "../../Models/ItemMovimientoModel"
import TipoMovimientoModel from "../../Models/TipoMovimientoModel"
import TipoMediosDePagoModel from "../../Models/TipoMediosDePagoModel"
//functions
import { formatoMoneda } from "../../functions/functions"

const titulo = ref("")

const dialog = ref(false)
const dialogDelete = ref(false)

const headers: any = [
    { title: "#", value: "id" },
    { title: "Fecha", value: "fecha" },
    { title: "Descripción", value: "descripcion" },
    { title: "Tipo", value: "tipoMovimientoDesc" },
    { title: "Forma de Pago", value: "descTipoFormaDePago" },
    { title: "Importe", value: "importe" },
    { title: "Acciones", value: "actions", sortable: false },
]

const listaItems: Ref<Array<ItemMovimientoModel>> = ref([])
const totalDeRegistros = ref(0)
const options = ref({ page: 1, itemsPerPage: 10, sortBy: "IdCierre", sortDesc: "asc" })
const pageCount = computed(() => {
    return Math.ceil(totalDeRegistros.value / options.value.itemsPerPage)
})
const listaTipoMovimiento: Ref<Array<TipoMovimientoModel>> = ref([])
const listaTipoFormaDePago: Ref<Array<TipoMediosDePagoModel>> = ref([])
const editedIndex = ref(-1)
const editedItem = ref(new ItemMovimientoModel());
const defaultItem = new ItemMovimientoModel()
const alertRef = ref()
const modalRef = ref()
const modalLoaderRef = ref()
const stateDescripcion = ref(false)
const stateTipoMovimiento = ref(false)
const stateImporte = ref(false)
const stateTipoFormaDePago = ref(false)
const procesando = ref(false)

const route = useRoute()
const storeMovimientos = useMovimientosStore()
const ventaStore = useVentaStore()
const storeAuth = useAuthStore()

const nombreTabla = ref("")

const formTitle = computed(() => {
    return editedIndex.value === -1 ? "Nuevo Item" : "Editar Item"
})

const btnOkTitle = computed(() => {
    return editedIndex.value === -1 ? "Agregar" : "Editar"
})

const labelTipoMovimientoSelect = computed(() => {
    return "Tipo de " + nombreTabla.value
})

onMounted(() => {
    fetchData()
})

const fetchData = () => {
    if (route.params.nombreTabla != null && route.params.nombreTabla != undefined && route.params.nombreTabla != '') {

        try {
            nombreTabla.value = route.params.nombreTabla.toString()
            CargarDatos(nombreTabla.value)
        }
        catch (e) {
            modalRef.value.ModalErrorShow("Movimientos de Caja", "Ocurrío un error al cargar los datos.", false)

        }

    } else {
        modalRef.value.ModalErrorShow("Movimientos de Caja", "Ocurrío un error al cargar los datos.", false)
    }
}

const CargarDatos = async (NombreTabla: string) => {
    //procesar Venta
    try {
        titulo.value = NombreTabla
        procesando.value = true
        modalLoaderRef.value.Show()
        let response;
        listaTipoFormaDePago.value = await ventaStore.getAllMediosDePago()
        response = await storeMovimientos.GetAllTipoMovimientos(NombreTabla)
        if (response.result == "ok") {
            listaTipoMovimiento.value = response.lista

        } else {
            modalRef.value.ModalErrorShow("ABM - " + NombreTabla, response.message, false)
        }
        CargarLisatdo()

    } catch (error) {
        if (modalLoaderRef.value)
            modalLoaderRef.value.Close()
        procesando.value = false
        modalRef.value.ModalErrorShow("ABM - " + NombreTabla, error, false)
    }
    finally {
        procesando.value = false
        if (modalLoaderRef.value)
            modalLoaderRef.value.Close()
    }
}

const CargarLisatdo = async () => {

    try {
        procesando.value = true
        let idSucursal = storeAuth.getIdSucursal()
        let response = await storeMovimientos.GetAllPaginado(nombreTabla.value,idSucursal, options.value.page, options.value.itemsPerPage)
        // procesando.value = false

        if (response.result == "ok") {
            listaItems.value = response.lista
            totalDeRegistros.value = response.totalRecords

        } else {
            modalRef.value.ModalErrorShow("Cierres", response.message)
        }

    } catch (error) {
        modalRef.value.ModalErrorShow("Cierres", error)
    } finally {
        procesando.value = false
    }
}

const AddItem = async (NombreTabla: string) => {
    //procesar Venta
    try {
        procesando.value = true
        modalLoaderRef.value.Show()
        let idUsuario = storeAuth.getIdUserLogin()
        let idSucursal = storeAuth.getIdSucursal()
        let response = await storeMovimientos.Add(NombreTabla, editedItem.value, idSucursal, idUsuario)

        modalLoaderRef.value.Close()
        procesando.value = false

        if (response.result == "ok") {
            CargarLisatdo()
        } else {
            modalRef.value.ModalErrorShow("ABM - " + NombreTabla, response.message, false)
        }
        close()
    } catch (error) {
        if (modalLoaderRef.value)
            modalLoaderRef.value.Close()
        procesando.value = false
        modalRef.value.ModalErrorShow("ABM - " + NombreTabla, error, false)
    }
}

const UpdateItem = async (NombreTabla: string) => {
    //procesar Venta
    try {
        procesando.value = true
        modalLoaderRef.value.Show()

        let idUsuario = storeAuth.getIdUserLogin()
        let response = await storeMovimientos.Update(NombreTabla, editedItem.value, idUsuario)

        modalLoaderRef.value.Close()
        procesando.value = false

        if (response.result == "ok") {
            Object.assign(listaItems.value[editedIndex.value], editedItem.value)
        } else {
            modalRef.value.ModalErrorShow("ABM - " + NombreTabla, response.message, false)
        }
        close()

    } catch (error) {
        if (modalLoaderRef.value)
            modalLoaderRef.value.Close()
        procesando.value = false
        modalRef.value.ModalErrorShow("ABM - " + NombreTabla, error, false)
    }
}

// const DelItem = async (NombreTabla: string) => {
//     //procesar Venta
//     try {
//         procesando.value = true
//         modalLoaderRef.value.Show()

//         let idUsuario = storeAuth.getIdUserLogin()
//         let response = await storeTalasBasicas.Delete(NombreTabla, editedItem.value.id, idUsuario)

//         modalLoaderRef.value.Close()
//         procesando.value = false

//         if (response.result == "ok") {
//             editedItem.value = listaItems.value[editedIndex.value]
//             editedItem.value.activo = "N"
//             Object.assign(listaItems.value[editedIndex.value], editedItem.value)
//         } else {
//             modalRef.value.ModalErrorShow("ABM - " + NombreTabla, response.message, false)
//         }
//         closeDelete()

//     } catch (error) {
//         if (modalLoaderRef.value)
//             modalLoaderRef.value.Close()
//         procesando.value = false
//         modalRef.value.ModalErrorShow("ABM - " + NombreTabla, error, false)
//     }
// }

const editItem = (item: ItemMovimientoModel | any) => {
    editedIndex.value = listaItems.value.indexOf(item)
    editedItem.value = Object.assign({}, item)
    limpiarEstados()
    dialog.value = true
}

const close = () => {
    dialog.value = false
    nextTick(() => {
        editedItem.value = Object.assign({}, defaultItem)
        editedIndex.value = -1
    })
}

const save = () => {
    if (validarDatos()) {
        if (editedIndex.value > -1) {
            UpdateItem(nombreTabla.value)
        } else {
            AddItem(nombreTabla.value)
        }
    }
}

const validarDatos = (): boolean => {
    let resultado = true
    let mensajeValidacion = ""
    const newline = "\n"
    const caracterItem = "•"
    limpiarEstados()

    if (!editedItem.value.descripcion || editedItem.value.descripcion == "") {
        stateDescripcion.value = true
        resultado = false
        mensajeValidacion += newline + caracterItem + " La Descripcion no puede estar vacía"
    }

    if (!editedItem.value.idTipoFormaDePago || editedItem.value.idTipoFormaDePago == 0) {
        stateTipoFormaDePago.value = true
        resultado = false
        mensajeValidacion += newline + caracterItem + " La Forma de Pago no puede estar vacía"
    }

    if (!editedItem.value.idTipoMovimiento || editedItem.value.idTipoMovimiento == 0) {
        stateTipoMovimiento.value = true
        resultado = false
        mensajeValidacion += newline + caracterItem + " El " + labelTipoMovimientoSelect.value + " no puede estar vacío"
    }

    if (!editedItem.value.importe || editedItem.value.importe == 0) {
        stateTipoMovimiento.value = true
        resultado = false
        mensajeValidacion += newline + caracterItem + " El Importe no puede estar vacío o ser 0"
    }


    if (!resultado)
        alertRef.value.alertErrorShow("Los datos ingreados no son válidos:", mensajeValidacion)


    return resultado
}

const openDialogToAddItem = () => {
    limpiarEstados()
    editedItem.value.idTipoFormaDePago = 0
    editedItem.value.idTipoMovimiento = 0
    dialog.value = true
}

const limpiarEstados = () => {
    stateDescripcion.value = false
    stateTipoMovimiento.value = false
    stateTipoFormaDePago.value = false
    stateImporte.value = false
}

const limpiar = () => {
    listaItems.value.splice(0, listaItems.value.length)
}
// defineExpose({ limpiar })

watch(() => route.params.nombreTabla, () => {
    limpiar()
    fetchData()
});

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