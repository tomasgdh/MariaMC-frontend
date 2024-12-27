<template>
    <v-row align="center" justify="center">
        <h3 class="classMaria mt-1">Compra de Lote</h3>
    </v-row>
    <v-row align="center" justify="center">
        <v-col>
            <BuscadorDeCliente ref="BuscadorDeClienteRef" :vistaTabla="false" @clienteSeleccionado="clienteSel">
            </BuscadorDeCliente>
        </v-col>
    </v-row>
    <hr>
    <v-row>
        <v-col>
            <v-data-table id="tablaLote" :headers="headers" :fixed-footer="true" :items="ListaItems" :dense="true"
                :itemPerPage="25" :sort-by="[{ key: 'id', order: 'asc' }]" no-data-text="No data avaible">
                <template v-slot:item.price="{ item }">
                    {{ formatoMoneda(item.price) }}
                </template>
                <template v-slot:item.valorPorc="{ item }">
                    {{ formatoMoneda(item.valorPorc) }}
                </template>
                <template v-slot:item.valorPorcTienda="{ item }">
                    {{ formatoMoneda(item.valorPorcTienda) }}
                </template>
                <template v-slot:top>
                    <v-toolbar flat>
                        <v-toolbar-title class="classMaria">Items Lote</v-toolbar-title>
                        <v-divider class="mx-4" vertical></v-divider>
                        <v-spacer></v-spacer>
                        <v-btn color="primary" variant="outlined" dark @click="openDialogToAddItem"
                            prepend-icon="mdi-plus">
                            Item
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
                                            <v-col cols="12" md="4" sm="4">
                                                <v-select v-model="editedItem.idCategoria"
                                                    :items="TipoCategoriaProducto" item-title="description"
                                                    item-value="id" label="Categoria" variant="outlined"
                                                    :disabled="isReadonly" :error="stateCategoria"></v-select>
                                            </v-col>
                                            <v-col cols="12" md="4" sm="4">
                                                <v-autocomplete v-model="editedItem.idMarca" :items="TipoMarca"
                                                    item-title="description" item-value="id" label="Marca"
                                                    variant="outlined" :disabled="isReadonly"
                                                    :error="stateMarca"></v-autocomplete>
                                            </v-col>
                                            <v-col cols="12" md="4" sm="4">
                                                <v-select v-model="editedItem.idTalle" :items="TipoTalles"
                                                    item-title="description" item-value="id" label="Talle"
                                                    variant="outlined" :disabled="isReadonly"
                                                    :error="stateTalle"></v-select>
                                            </v-col>
                                        </v-row>
                                        <!-- <v-row>
                                            <v-col cols="12" md="12" sm="12">
                                                <v-text-field v-model="editedItem.description" label="Descripcíon"
                                                    variant="outlined" :disabled="isReadonly"
                                                    :error="stateDescription"></v-text-field>
                                            </v-col>
                                        </v-row> -->
                                        <v-row>
                                            <v-col cols="12" md="4" sm="4">
                                                <v-text-field v-model="editedItem.price" label="Valor de Venta"
                                                    type="number" variant="outlined" :error="statePrice"></v-text-field>
                                            </v-col>
                                            <v-col cols="12" md="4" sm="4">
                                                <v-text-field v-model="itemPorcentajeAPagar"
                                                    :label="porcentajeAPagarTexto" readonly variant="outlined">
                                                </v-text-field>
                                            </v-col>
                                            <v-col cols="12" md="4" sm="4">
                                                <v-text-field v-model="itemPorcentajeCreditoTienda"
                                                    :label="porcentajeCreditoTiendaTexto" readonly variant="outlined">
                                                </v-text-field>
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
                                    <v-btn color="primary" variant="elevated"
                                        @click="deleteItemConfirm">Si</v-btn>
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
                <template v-slot:body.append>
                    <!-- <v-table> -->
                    <tr>
                        <td colspan="3"></td>
                        <td><b>Totales:</b></td>
                        <td style="text-align: end;"><b>{{ formatoMoneda(total) }}</b></td>
                        <td style="text-align: end;"><b>{{ formatoMoneda(totalPorc) }}</b></td>
                        <td style="text-align: end;"><b>{{ formatoMoneda(totalPorcTienda) }}</b></td>
                        <td />
                    </tr>
                    <tr>
                        <td colspan="8"><b>Cantidad de Prendas: </b><b>{{ ListaItems.length }}</b></td>
                    </tr>
                    <!-- </v-table> -->
                </template>
            </v-data-table>
        </v-col>
    </v-row>

    <AlertMessage ref="alertRef" />

    <v-row>
        <v-col cols="12" md="6" sm="6">
            <v-row>
                <v-col cols="12" md="9" sm="9">
                    <v-slider v-model="efectivo" step="10" min="0" :max="maxEfectivo" thumb-label="always"
                        :label="`${porcentajeAPagarTexto}`" @update:modelValue="updateCredito" />
                </v-col>
                <v-col cols="12" md="3" sm="3">
                    <v-text-field v-model="efectivo" :label="`${porcentajeAPagarTexto}`" type="number"
                        variant="outlined" :min="0" :max="maxEfectivo" @update:modelValue="updateCredito" oninput="if(!isNaN(parseInt(this.value))) { 
                            const intValue = parseInt(this.value); 
                            if(intValue < 0) { 
                                this.value = 0; 
                            } else if(intValue > this.max) { 
                                this.value = this.max; 
                            } else { 
                                this.value = intValue; 
                            } 
                          } else { 
                            this.value = 0; 
                          }" density="compact"></v-text-field>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" md="9" sm="9">
                    <v-slider v-model="credito" step="10" min="0" :max="maxCredito" thumb-label="always"
                        :label="`${porcentajeCreditoTiendaTexto}`" @update:modelValue="updateEfectivo" />
                </v-col>
                <v-col cols="12" md="3" sm="3">
                    <v-text-field v-model="credito" :label="`${porcentajeCreditoTiendaTexto}`" type="number"
                        variant="outlined" :min="0" :max="maxCredito" @update:modelValue="updateEfectivo" oninput="if(!isNaN(parseInt(this.value))) { 
                            const intValue = parseInt(this.value); 
                            if(intValue < 0) { 
                                this.value = 0; 
                            } else if(intValue > this.max) { 
                                this.value = this.max; 
                            } else { 
                                this.value = intValue; 
                            } 
                          } else { 
                            this.value = 0; 
                          }" density="compact"></v-text-field>
                </v-col>
            </v-row>
        </v-col>
        <v-col cols="12" md="6" sm="6" lg="6">
            <div v-if="ListaItems.length > 0 && cliente">
                <TablaTiposMediosDePagoCompraLote ref="tablaMpRef" :Efectivo="efectivo" :CreditoEnTienda="credito"
                    @saldo="saldoTotal" @listaMediosDePago="mediosDePagoCompra" />
            </div>
        </v-col>
    </v-row>
    <div class="d-flex flex-column align-center justify-center">
        <v-btn v-if="ListaItems.length > 0 && cliente" class="mt-2" variant="elevated" title="Comprar Lote"
            color="primary" @click.prevent="preComprar" :loading="procesando">Comprar Lote</v-btn>
    </div>
    <Modal ref="modalRef"></Modal>
    <ModalLoader ref="modalLoaderRef"></ModalLoader>
</template>
<script lang="ts" setup>
import { Ref, ref, computed, watch, nextTick, onMounted } from "vue"

//Components
import AlertMessage from "../components/AlertMessage.vue"
import BuscadorDeCliente from '../components/BuscadorDeCliente.vue'
import TablaTiposMediosDePagoCompraLote from '../components/TablaTiposMediosDePagoCompraLote.vue'
import Modal from '../components/Modal.vue'
import ModalLoader from '../components/ModalLoader.vue'
//Store
import { useProductoStore } from '../store/producto.store'
import { useCompraStore } from '../store/compra.store'
import { useAuthStore } from '../store/auth.store'
//Models
import ClienteVentaModel from '../Models/ClienteVentaModel'
import TipoTalleModel from "../Models/TipoTalleModel"
import TipoMarcaModel from "../Models/TipoMarcaModel"
import CompraDeLoteItemModel from "../Models/CompraDeLoteItemModel"
import TipoCategoriaProductoModel from "../Models/TipoCategoriaProductoModel"
import CompraMediosDepagoModel from "../Models/CompraMediosDepagoModel"
//Functions
import { formatoMoneda } from "../functions/functions"

const cliente: Ref<ClienteVentaModel | null> = ref(null)
const clienteSel = (client: ClienteVentaModel) => {
    cliente.value = client
}

const productoStore = useProductoStore()
const compraStore = useCompraStore()
const authStore = useAuthStore()
const TipoTalles: Ref<Array<TipoTalleModel>> = ref([])
const TipoCategoriaProducto: Ref<Array<TipoCategoriaProductoModel>> = ref([])
const TipoMarca: Ref<Array<TipoMarcaModel>> = ref([])
const dialog = ref(false);
const dialogDelete = ref(false);

const ListaItems: Ref<Array<CompraDeLoteItemModel>> = ref([])
const editedIndex = ref(-1)
const editedItem = ref(new CompraDeLoteItemModel());
const defaultItem = new CompraDeLoteItemModel()

const stateCategoria = ref(false)
const stateMarca = ref(false)
// const stateDescription = ref(false)
const stateTalle = ref(false)
const statePrice = ref(false)
const alertRef = ref()
const total = ref(0)
const totalPorc = ref(0)
const totalPorcTienda = ref(0)
const cantidad = ref(0)

const porcentajeAPagar = ref(0) //30% se lleva en el acto
const porcentajeAPagarTexto = ref("") //30% se lleva en el acto
const porcentajeCreditoTienda = ref(0) //45% credito en tiendo
const porcentajeCreditoTiendaTexto = ref("") //45% credito en tiendo

const headers: any = computed(() => {
    return [
        { title: "Categoria", value: "categoria" },
        { title: "Marca", value: "marca" },
        // { title: "Descripción", value: "description" },
        { title: "Talle", value: "talle" },
        { title: "Valor de venta sugerido*", value: "price", align: "end" },
        { title: porcentajeAPagarTexto.value, value: "valorPorc", align: "end" },
        { title: porcentajeCreditoTiendaTexto.value, value: "valorPorcTienda", align: "end" },
        { title: "Acciones", value: "actions", sortable: false },
    ]
})


const maxEfectivo = ref(total.value * porcentajeAPagar.value); // Máximo para efectivo
const maxCredito = ref(total.value * porcentajeCreditoTienda.value); // Máximo para crédito en tienda
const efectivo = ref(maxEfectivo.value);
const credito = ref(0);
const coeficienteCredito = ref(maxCredito.value / maxEfectivo.value)
const coeficienteEfectivo = ref(maxEfectivo.value / maxCredito.value)

const tablaMpRef = ref()
const saldoEfectivo = ref(0)
const listaMediosDePagoCompra: Ref<Array<CompraMediosDepagoModel>> = ref([])
const modalRef = ref()
const modalLoaderRef = ref()
const BuscadorDeClienteRef = ref()
const procesando = ref(false)

const updateCredito = () => {
    if (efectivo.value > maxEfectivo.value)
        efectivo.value = maxEfectivo.value
    else if (efectivo.value < 0)
        efectivo.value = 0
    let aux = Number(((maxEfectivo.value - efectivo.value) * coeficienteCredito.value).toFixed(2))
    credito.value = isNaN(aux) ? 0 : aux
    if (tablaMpRef.value)
        tablaMpRef.value.limpiar()
}

const updateEfectivo = () => {
    if (credito.value > maxCredito.value)
        credito.value = maxCredito.value
    else if (credito.value < 0)
        credito.value = 0

    let aux = Number(((maxCredito.value - credito.value) * coeficienteEfectivo.value).toFixed(2))
    efectivo.value = isNaN(aux) ? 0 : aux
    if (tablaMpRef.value)
        tablaMpRef.value.limpiar()
}

const formTitle = computed(() => {
    return editedIndex.value === -1 ? "Nuevo Item" : "Editar Item"
})

const btnOkTitle = computed(() => {
    return editedIndex.value === -1 ? "Agregar" : "Editar"
})

const isReadonly = computed(() => {
    return editedIndex.value !== -1 && editedItem.value.id > 0
})

const itemPorcentajeAPagar = computed(() => {
    return Number((editedItem.value.price * porcentajeAPagar.value).toFixed(2))
})
const itemPorcentajeCreditoTienda = computed(() => {
    return Number((editedItem.value.price * porcentajeCreditoTienda.value).toFixed(2))
})

onMounted(async () => {
    try {
        procesando.value = true
        modalLoaderRef.value.Show()
        TipoTalles.value = await productoStore.getAllTalles()
        TipoCategoriaProducto.value = await productoStore.getAllCategoriasDeProducto()
        TipoMarca.value = await productoStore.getAllMarcasProducto()
        obtenerConfiguracionPorcentajes()
    } catch (error) {
        modalLoaderRef.value.Close()
        modalRef.value.ModalErrorShow("Compra de Lote", error)

    } finally {
        procesando.value = false
        if (modalLoaderRef.value)
            modalLoaderRef.value.Close()
    }


})

const preComprar = () => {
    if (validarCompra()) {
        modalRef.value.ModalInfoShow("Atención - Compra de Lote", "Usted esta por procesar la compra del lote, ¿Desea continuar?", true, Comprar)
    }
}

const validarCompra = (): boolean => {
    let resultado = true
    let mensajeValidacion = ""
    const newline = "\n"
    const caracterItem = "•"

    if (saldoEfectivo.value && saldoEfectivo.value > 0) {
        resultado = false
        mensajeValidacion += newline + caracterItem + " No puede quedar dinero Sin Asignar para la compra"
    }

    if (!cliente.value) {
        resultado = false
        mensajeValidacion += newline + caracterItem + " Debe seleccionar un Cliente"
    }
    let idUsuario = authStore.getIdUserLogin()
    if (!idUsuario) {
        resultado = false
        mensajeValidacion += newline + caracterItem + " Ocurrio un error, la session esta vencida, vuelva a loguearse"
    }

    if (!resultado)
        modalRef.value.ModalErrorShow("Error:", mensajeValidacion)

    return resultado
}

const Comprar = async () => {
    //procesar Venta

    procesando.value = true
    modalLoaderRef.value.Show()
    let idCliente = -1
    if (cliente.value)
        idCliente = cliente.value.id
    let idUsuario = authStore.getIdUserLogin()
    let idSucursal = authStore.getIdSucursal()
    let response = await compraStore.procesarCompra(idSucursal, ListaItems.value, idCliente,
        listaMediosDePagoCompra.value, efectivo.value, credito.value, idUsuario)
    procesando.value = false
    modalLoaderRef.value.Close()

    if (response.result == "ok") {
        modalRef.value.ModalOkShow("Compra de Lote", response.message, false, limpiar)
        //puede devolver un objeto ticket con el nroOperacion
        //resultado.value = response.idVenta
    } else {
        modalRef.value.ModalErrorShow("Compra de Lote", response.message, false)
        //resultado.value = response.idVenta
    }
}
const limpiar = () => {
    BuscadorDeClienteRef.value.limpiar()
    ListaItems.value.splice(0, ListaItems.value.length)
    credito.value = 0
}

const obtenerConfiguracionPorcentajes = () => {
    porcentajeAPagarTexto.value = "30%"
    porcentajeAPagar.value = .3
    porcentajeCreditoTiendaTexto.value = "45%"
    porcentajeCreditoTienda.value = .45
}

const formatoItem = (item: CompraDeLoteItemModel | any) => {
    return ` ${item.categoria} |  ${item.marca} | ${item.description} | ${item.talle} | ${formatoMoneda(item.price)}`
}


const editItem = (item: CompraDeLoteItemModel | any) => {
    editedIndex.value = ListaItems.value.indexOf(item)
    editedItem.value = Object.assign({}, item)
    limpiarEstados()
    dialog.value = true
}

const deleteItem = (item: CompraDeLoteItemModel | any) => {
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
        editedItem.value.valorPorc = itemPorcentajeAPagar.value
        editedItem.value.valorPorcTienda = itemPorcentajeCreditoTienda.value

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

    if (!editedItem.value.price || editedItem.value.price == null || editedItem.value.price == null || editedItem.value.price == undefined) {
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

watch(ListaItems.value, (newValue, oldValue) => {

    calcularTotales()
    maxEfectivo.value = total.value * porcentajeAPagar.value;
    maxCredito.value = total.value * porcentajeCreditoTienda.value;
    coeficienteCredito.value = (maxCredito.value / maxEfectivo.value)
    coeficienteEfectivo.value = (maxEfectivo.value / maxCredito.value)
    efectivo.value = maxEfectivo.value
})


const calcularTotales = () => {
    let totalAux = 0
    let valorPorcAux = 0
    let valorPorcTiendaAux = 0
    ListaItems.value.forEach(item => {
        totalAux = Number((totalAux + item.price).toFixed(2))
        valorPorcAux = Number((valorPorcAux + item.valorPorc).toFixed(2))
        valorPorcTiendaAux = Number((valorPorcTiendaAux + item.valorPorcTienda).toFixed(2))
    })
    total.value = totalAux
    totalPorc.value = valorPorcAux
    totalPorcTienda.value = valorPorcTiendaAux
    cantidad.value = ListaItems.value.length
}

const saldoTotal = (valor: number) => {
    if (valor) {
        if (typeof valor === "string") {
            saldoEfectivo.value = Number(Number(valor).toFixed(2))
        } else if (typeof valor === "number") {
            saldoEfectivo.value = Number(valor.toFixed(2))
        } else {

            saldoEfectivo.value = 0.00
        }
    } else {

        saldoEfectivo.value = 0.00
    }
    // saldoEfectivo.value = Number((valor)?.toFixed(2))
}
const mediosDePagoCompra = (lista: Array<CompraMediosDepagoModel>) => {
    listaMediosDePagoCompra.value = lista
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
</style>