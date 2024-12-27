<template>
    <v-sheet class="mx-auto" width="800">
        <v-row align="center" justify="center">
            <h3 class="classMaria mt-1">ABM - {{ titulo }}</h3>
        </v-row>
        <v-row>
            <v-data-table :headers="computedHeaders" :fixed-footer="true" :items="listaItems" :dense="true"
                :sort-by="[{ key: 'id', order: 'asc' }]" no-data-text="No data avaible" :loader="procesando">
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
                                            <v-col cols="12">
                                                <v-text-field v-model="editedItem.descripcion" type="string"
                                                    label="Descripción" placeholder="Descripción" variant="outlined"
                                                    :error="stateDescripcion" :maxlength="50"
                                                    @input="editedItem.descripcion = editedItem.descripcion.toUpperCase()"
                                                    hint="Máximo 50 caracteres" counter></v-text-field>
                                            </v-col>
                                        </v-row>
                                        <v-row v-if="hasDescuento">
                                            <v-col cols="6">
                                                <v-text-field v-model="editedItem.descuento" type="number"
                                                    label="Descuento" placeholder="Descuento" variant="outlined"
                                                    :error="stateDescuento"></v-text-field>
                                            </v-col>
                                        </v-row>
                                        <v-row>
                                            <v-col cols="12">
                                                <v-select v-model="editedItem.activo" :items="activo"
                                                    item-title="descripcion" item-value="id" label="Activo"
                                                    variant="outlined" :error="stateActivo"></v-select>
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
import { useTablasBasicasStore } from '../../store/tablasBasicas.store'
import { useAuthStore } from '../../store/auth.store'

//Components
import AlertMessage from '../../components/AlertMessage.vue'
import Modal from '../../components/Modal.vue'
import ModalLoader from '../../components/ModalLoader.vue'

//Models
import ItemTablasBasicasModel from "../../Models/ItemTablasBasicasModel"

const titulo = ref("")

const dialog = ref(false)
const dialogDelete = ref(false)
const hasDescuento = ref(false)
const headers: any = [
    { title: "id", value: "id" },
    { title: "Descripción", value: "descripcion" },
    { title: "Activo", value: "activo" },
    { title: "Acciones", value: "actions", sortable: false },
]

const listaItems: Ref<Array<ItemTablasBasicasModel>> = ref([])
const activo = ref([{ id: "N", descripcion: "No" }, { id: "S", descripcion: "Si" },])
const editedIndex = ref(-1)
const editedItem = ref(new ItemTablasBasicasModel());
const defaultItem = new ItemTablasBasicasModel()
const alertRef = ref()
const modalRef = ref()
const modalLoaderRef = ref()
const stateDescripcion = ref(false)
const stateActivo = ref(false)
const stateDescuento = ref(false)
const procesando = ref(false)

const route = useRoute()
const storeTalasBasicas = useTablasBasicasStore()
const storeAuth = useAuthStore()

const nombreTabla = ref("")

const formTitle = computed(() => {
    return editedIndex.value === -1 ? "Nuevo Item" : "Editar Item"
})

const btnOkTitle = computed(() => {
    return editedIndex.value === -1 ? "Agregar" : "Editar"
})

const computedHeaders = computed(() => {
    return hasDescuento.value
        ? [...headers, { title: "Descuento", value: "descuento" }]
        : headers;
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
            modalRef.value.ModalErrorShow("Tablas Basicas", "Ocurrío un error al cargar los datos.", false)

        }

    } else {
        modalRef.value.ModalErrorShow("Tablas Basicas", "Ocurrío un error al cargar los datos.", false)
    }
}

const CargarDatos = async (NombreTabla: string) => {
    //procesar Venta
    try {
        titulo.value = NombreTabla
        procesando.value = true
        modalLoaderRef.value.Show()

        let response = await storeTalasBasicas.GetAll(NombreTabla)

        modalLoaderRef.value.Close()
        procesando.value = false

        if (response.result == "ok") {
            listaItems.value = response.lista
            hasDescuento.value = response.lista.some((item: any) => 'descuento' in item)
        } else {
            modalRef.value.ModalErrorShow("ABM - " + NombreTabla, response.message, false)
        }

    } catch (error) {
        if (modalLoaderRef.value)
            modalLoaderRef.value.Close()
        procesando.value = false
        modalRef.value.ModalErrorShow("ABM - " + NombreTabla, error, false)
    }
}

const AddItem = async (NombreTabla: string) => {
    //procesar Venta
    try {
        procesando.value = true
        modalLoaderRef.value.Show()
        let idUsuario = storeAuth.getIdUserLogin()
        let response = await storeTalasBasicas.Add(NombreTabla, editedItem.value, idUsuario)

        modalLoaderRef.value.Close()
        procesando.value = false

        if (response.result == "ok") {
            listaItems.value.push(response.item)
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
        let response = await storeTalasBasicas.Update(NombreTabla, editedItem.value, idUsuario)

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

const DelItem = async (NombreTabla: string) => {
    //procesar Venta
    try {
        procesando.value = true
        modalLoaderRef.value.Show()

        let idUsuario = storeAuth.getIdUserLogin()
        let response = await storeTalasBasicas.Delete(NombreTabla, editedItem.value.id, idUsuario)

        modalLoaderRef.value.Close()
        procesando.value = false

        if (response.result == "ok") {
            editedItem.value = listaItems.value[editedIndex.value]
            editedItem.value.activo = "N"
            Object.assign(listaItems.value[editedIndex.value], editedItem.value)
        } else {
            modalRef.value.ModalErrorShow("ABM - " + NombreTabla, response.message, false)
        }
        closeDelete()

    } catch (error) {
        if (modalLoaderRef.value)
            modalLoaderRef.value.Close()
        procesando.value = false
        modalRef.value.ModalErrorShow("ABM - " + NombreTabla, error, false)
    }
}

const editItem = (item: ItemTablasBasicasModel | any) => {
    editedIndex.value = listaItems.value.indexOf(item)
    editedItem.value = Object.assign({}, item)
    limpiarEstados()
    dialog.value = true
}

const deleteItem = (item: ItemTablasBasicasModel | any) => {
    editedIndex.value = listaItems.value.indexOf(item)
    editedItem.value = Object.assign({}, item)
    dialogDelete.value = true
}

const deleteItemConfirm = () => {
    if (editedIndex.value > -1)
        DelItem(nombreTabla.value)
}

const close = () => {
    dialog.value = false
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
    } else {
        if (existeItem(editedItem.value.descripcion) && editedIndex.value == -1) {
            resultado = false
            mensajeValidacion += newline + caracterItem + " La descripcion del item ya existe."
        }
    }

    if (hasDescuento.value && editedItem.value.descuento < 0) {
        stateDescuento.value = true;
        resultado = false;
        mensajeValidacion += newline + caracterItem + " El descuento no puede ser negativo.";
    } else if (hasDescuento.value && editedItem.value.descuento > 1) {
        stateDescuento.value = true;
        resultado = false;
        mensajeValidacion += newline + caracterItem + " El descuento no puede ser mayor a 1, sus valores ocilan entre 0 y 1.";
    }

    if (!resultado)
        alertRef.value.alertErrorShow("Los datos ingreados no son válidos:", mensajeValidacion)


    return resultado
}

const existeItem = (value: string) => {
    return listaItems.value.some(item => item.descripcion && item.descripcion != undefined && item.descripcion.toUpperCase().trim() === value.toUpperCase().trim());
}

const openDialogToAddItem = () => {
    limpiarEstados()

    editedItem.value.activo = "S"
    dialog.value = true
}

const limpiarEstados = () => {
    stateDescripcion.value = false
    stateActivo.value = false
    stateDescuento.value = false
}

const limpiar = () => {
    listaItems.value.splice(0, listaItems.value.length)
}
// defineExpose({ limpiar })

watch(() => route.params.nombreTabla, () => {
    limpiar()
    fetchData()
});

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