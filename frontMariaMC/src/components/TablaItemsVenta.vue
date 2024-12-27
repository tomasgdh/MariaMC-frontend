<!-- eslint-disable vue/valid-v-slot -->
<template>
    <div>
        <!-- :sort-by="[{ key: 'id', order: 'asc' }]" -->
        <v-data-table :headers="headers" :fixed-footer="true" :items="ListaItems" :dense="true"
            no-data-text="No data avaible">
            <template v-slot:item.price="{ item }">
                {{ formatoMonedaItem(item) }}
            </template>
            <template v-slot:top>
                <v-toolbar flat>
                    <v-toolbar-title class="classMaria">Detalle de venta</v-toolbar-title>
                    <v-divider class="mx-4" vertical></v-divider>
                    <b>Total: {{ formatoMoneda(total) }}</b>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" variant="outlined" dark @click="openDialogToAddItem" prepend-icon="mdi-plus">
                        Item
                    </v-btn>
                    <v-dialog v-model="dialog" max-width="800px" persistent>
                        <!-- <template v-slot:activator="{ props }">
                            <v-btn color="primary" variant="outlined" dark v-bind="props" prepend-icon="mdi-plus">
                                Item
                            </v-btn>
                        </template> -->
                        <v-card>
                            <v-card-title>
                                <span class="classMaria d-flex flex-column align-center justify-center">{{ formTitle
                                    }}</span>
                            </v-card-title>

                            <v-card-text>
                                <v-container>
                                    <v-row>
                                        <v-col v-if="IsVisibleCodigo" cols="12" md="3" sm="6">
                                            <v-text-field v-model="editedItem.id" label="Codígo" variant="outlined"
                                                :disabled="IsVisibleCodigo"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" md="4" sm="4">
                                            <v-autocomplete v-model="editedItem.idCategoria"
                                                :items="TipoCategoriaProducto" item-title="description" item-value="id"
                                                label="Categoria" variant="outlined" :disabled="isReadonly"
                                                :error="stateCategoria"
                                                @update:model-value="filtrarTalles"></v-autocomplete>
                                        </v-col>
                                        <v-col cols="12" md="4" sm="4">
                                            <v-autocomplete v-model="editedItem.idMarca" :items="TipoMarca"
                                                item-title="description" item-value="id" label="Marca"
                                                variant="outlined" :disabled="isReadonly"
                                                :error="stateMarca"></v-autocomplete>
                                        </v-col>
                                        <!-- <v-col cols="12" md="4" sm="4">
                                            <v-text-field v-model="editedItem.description" label="Descripción"
                                                variant="outlined" :disabled="isReadonly"
                                                :error="stateDescription"></v-text-field>
                                        </v-col> -->
                                    </v-row>
                                    <v-row>
                                        <v-col cols="12" md="8" sm="6">
                                            <v-autocomplete v-model="editedItem.idTalle" :items="TipoTallesFiltrados"
                                                item-title="description" item-value="id" label="Talle"
                                                variant="outlined" :disabled="isReadonly"
                                                :error="stateTalle"></v-autocomplete>
                                        </v-col>
                                        <v-col cols="12" md="4" sm="6">
                                            <v-text-field v-model="editedItem.price" label="Precio" type="number"
                                                variant="outlined" :error="statePrice"></v-text-field>
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
                    <v-dialog v-model="dialogDelete" max-width="800px" persistent>
                        <v-card>
                            <v-card-title class="classMaria d-flex flex-column align-center justify-center">
                                Atenciónn
                            </v-card-title>
                            <v-card-text class="text-h6">
                                {{ `¿Estás seguro que deseas eliminar este Item: ` }}<br>
                                {{ `${formatoItem(editedItem)}?` }}
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="primary" variant="elevated" @click="closeDelete">No</v-btn>
                                <v-btn color="primary" variant="elevated" @click="deleteItemConfirm">Si</v-btn>
                                <v-spacer></v-spacer>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </v-toolbar>
            </template>
            <template v-slot:item.actions="{ item }">
                <v-icon v-if="item.id <= 0" class="me-2" size="small" @click="editItem(item)">mdi-pencil </v-icon>
                <v-icon size="small" @click="deleteItem(item)">mdi-delete</v-icon>
            </template>
        </v-data-table>
    </div>
</template>
<script lang="ts" setup>
import { Ref, ref, computed, watch, nextTick, onMounted } from "vue"
import AlertMessage from "../components/AlertMessage.vue"
//Store
import { useProductoStore } from '../store/producto.store'
//Models
import VentaItemModel from "../Models/VentaItemModel"
import TipoCategoriaProductoModel from "../Models/TipoCategoriaProductoModel"
import TipoMarcaModel from "../Models/TipoMarcaModel"
import TipoTalleModel from "../Models/TipoTalleModel"
//Functions
import { formatoMoneda } from "../functions/functions"

const props = defineProps(["Items", "total"])
const productoStore = useProductoStore()
const TipoTalles: Ref<Array<TipoTalleModel>> = ref([])
const TipoTallesFiltrados: Ref<Array<TipoTalleModel>> = ref([])
const TipoCategoriaProducto: Ref<Array<TipoCategoriaProductoModel>> = ref([])
const TipoMarca: Ref<Array<TipoMarcaModel>> = ref([])
const dialog = ref(false);
const dialogDelete = ref(false);
const headers: any = [
    { title: "Código", value: "id" },
    { title: "Categoria", value: "categoria" },
    { title: "Marca", value: "marca" },
    // { title: "Descripción", value: "description" },
    { title: "Talle", value: "talle" },
    { title: "Precio", value: "price", align: "end" },
    { title: "Acciones", value: "actions", sortable: false },
]
const ListaItems: Ref<Array<VentaItemModel>> = ref(props.Items)
// const ListaItems = ref(props.Items)
const editedIndex = ref(-1)
const editedItem = ref(new VentaItemModel());
const defaultItem = new VentaItemModel()

const stateCategoria = ref(false)
const stateMarca = ref(false)
// const stateDescription = ref(false)
const stateTalle = ref(false)
const statePrice = ref(false)
const alertRef = ref()

const formTitle = computed(() => {
    return editedIndex.value === -1 ? "Nuevo Item" : "Editar Item"
})

const btnOkTitle = computed(() => {
    return editedIndex.value === -1 ? "Agregar" : "Editar"
})

const IsVisibleCodigo = computed(() => {
    return editedIndex.value !== -1 && editedItem.value.id > 0
    //solo visible si es editable y id > 0
})

const isReadonly = computed(() => {
    return editedIndex.value !== -1 && editedItem.value.id > 0
})

onMounted(async () => {
    TipoTalles.value = await productoStore.getAllTalles()
    TipoCategoriaProducto.value = await productoStore.getAllCategoriasDeProducto()
    TipoMarca.value = await productoStore.getAllMarcasProducto()
    filtrarTalles(0)
})

const filtrarTalles = (value: number) => {

    let elemento: TipoCategoriaProductoModel = new TipoCategoriaProductoModel()
    for (var i = 0; i < TipoCategoriaProducto.value.length; i++) {
        if (TipoCategoriaProducto.value[i].id === value) {
            elemento = TipoCategoriaProducto.value[i];
            break;
        }
    }
    if (elemento.categoria === 'ROPA') {
        TipoTallesFiltrados.value = TipoTalles.value.filter(t => t.categoria === "ROPA");
    } else if (elemento.categoria === 'CALZADO') {
        TipoTallesFiltrados.value = TipoTalles.value.filter(t => t.categoria === "CALZADO");
    } else {
        TipoTallesFiltrados.value = [];
    }
    TipoTallesFiltrados.value.unshift({
        // Agrega aquí las propiedades del nuevo ítem que quieres agregar
        id: 0, // Ejemplo de propiedad
        description: "Seleccione un Talle", // Ejemplo de propiedad
        categoria: "" // Asegúrate de que el nuevo ítem también cumpla con los criterios de filtrado si es necesario
    })
    editedItem.value.idTalle = 0
}

const formatoItem = (item: VentaItemModel | any) => {
    return ` ${item.Id} |  ${item.categoria} |  ${item.marca} | ${item.description} | ${item.talle} | ${formatoMoneda(item.price)}`
}

const editItem = (item: VentaItemModel | any) => {
    editedIndex.value = ListaItems.value.indexOf(item)
    editedItem.value = Object.assign({}, item)
    limpiarEstados()
    dialog.value = true
}

const formatoMonedaItem = (item: VentaItemModel | any) => {

    return formatoMoneda(item.price)
}

const deleteItem = (item: VentaItemModel | any) => {
    editedIndex.value = ListaItems.value.indexOf(item)
    editedItem.value = Object.assign({}, item)
    dialogDelete.value = true
}

const deleteItemConfirm = () => {
    ListaItems.value.splice(editedIndex.value, 1)
    closeDelete()
}

const close = () => {
    dialog.value = false
    nextTick(() => {
        editedItem.value = Object.assign({}, defaultItem)
        editedIndex.value = -1
    })
}

const openDialogToAddItem = () => {
    limpiarEstados()
    dialog.value = true
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
        if (editedItem.value.price) {
            if (typeof editedItem.value.price === "string") {
                editedItem.value.price = Number(Number(editedItem.value.price).toFixed(2))
            } else if (typeof editedItem.value.price === "number") {
                editedItem.value.price = Number(editedItem.value.price.toFixed(2))
            }
        } else {
            // Asigna un valor predeterminado si monto no es un número.
            editedItem.value.price = 0.00; // O cualquier valor predeterminado que consideres apropiado.
        }


        // if (TipoTalles.value)
        //     editedItem.value.talle = TipoTalles.value[editedItem.value.idTalle].description
        // if (TipoCategoriaProducto.value)
        //     editedItem.value.categoria = TipoCategoriaProducto.value[editedItem.value.idCategoria].description
        // if (TipoMarca.value)
        //     editedItem.value.marca = TipoMarca.value[editedItem.value.idMarca].description
        asignarDescripcionDesdeValor(editedItem.value, TipoTalles.value, 'idTalle', 'talle')
        asignarDescripcionDesdeValor(editedItem.value, TipoCategoriaProducto.value, 'idCategoria', 'categoria')
        asignarDescripcionDesdeValor(editedItem.value, TipoMarca.value, 'idMarca', 'marca')

        if (editedIndex.value > -1) {
            Object.assign(ListaItems.value[editedIndex.value], editedItem.value)
        } else {
            ListaItems.value.push(editedItem.value)
        }
        if (editedIndex.value === -1) {
            editedItem.value.id = -1
        }

        close()
    }
}

const asignarDescripcionDesdeValor = (objeto: any, valor: any, idPropiedad: string, descripcionPropiedad: string) => {
    if (valor && objeto) {
        const id = objeto[idPropiedad];
        if (id !== undefined && valor[id]) {
            // objeto[descripcionPropiedad] = valor[id].description;
            for (var i = 0; i < valor.length; i++) {
                if (valor[i].id === id) {
                    objeto[descripcionPropiedad] = valor[i].description;
                    break;
                }
            }
        }
    }
}

const limpiarEstados = () => {
    stateCategoria.value = false
    // stateDescription.value = false
    stateMarca.value = false
    stateTalle.value = false
    statePrice.value = false
}

const validarDatos = (): boolean => {
    let resultado = true
    let mensajeValidacion = ""
    const newline = "\n"
    const caracterItem = "•"
    limpiarEstados()

    if (editedIndex.value === -1) {
        if (!editedItem.value.idCategoria || editedItem.value.idCategoria == 0) {
            stateCategoria.value = true
            resultado = false
            mensajeValidacion += newline + caracterItem + " La categoria no puede estar vacía"
        }
        if (!editedItem.value.idMarca || editedItem.value.idMarca == 0) {
            stateMarca.value = true
            resultado = false
            mensajeValidacion += newline + caracterItem + " La Marca no puede estar vacía"
        }
        // if (!editedItem.value.description || editedItem.value.description == "") {
        //     stateDescription.value = true
        //     resultado = false
        //     mensajeValidacion += newline + caracterItem + " La descripción no puede estar vacía"
        // }
        if (!editedItem.value.idTalle || editedItem.value.idTalle == 0) {
            stateTalle.value = true
            resultado = false
            mensajeValidacion += newline + caracterItem + " El talle no puede estar vacío"
        }
    }

    if (!editedItem.value.price || editedItem.value.price == null || editedItem.value.price == undefined) {
        statePrice.value = true
        resultado = false
        mensajeValidacion += newline + caracterItem + " El precio no puede estar vacío"
    } else if (editedItem.value.price <= 0) {
        statePrice.value = true
        resultado = false
        mensajeValidacion += newline + caracterItem + " El precio tiene que ser mayor a cero"
    }
    if (!resultado)
        alertRef.value.alertErrorShow("Los datos ingreados no son válidos:", mensajeValidacion)


    return resultado
}

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

:deep(.v-data-table__tr:nth-of-type(even)) {
    background-color: rgba(0, 0, 0, .05);
}
</style>