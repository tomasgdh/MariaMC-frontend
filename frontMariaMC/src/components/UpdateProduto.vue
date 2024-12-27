<template>
    <v-row align="center" justify="center">
        <h3 class="classMaria mt-2">{{ titulo }}</h3>
    </v-row>
    <v-container>
        <v-row>
            <v-text-field ref="refTxtItem" v-model="txtItem" type="string" label="Item"
                placeholder="Ingrese un articulo" variant="outlined" clearable density="compact"
                @keyup.stop="handleEnter($event)" @click:append-inner="handlerSearch" :loading="procesando"
                append-inner-icon="mdi-magnify" prepend-inner-icon="mdi-barcode-scan"></v-text-field>
        </v-row>
        <div class="mt-5" v-if="ItemSearch.id > 0">
            <v-row>
                <v-col cols="12" md="4" sm="4">
                    <v-text-field v-model="ItemSearch.id" label="Codígo" variant="outlined"
                        :disabled="true"></v-text-field>
                </v-col>
                <!-- <v-col cols="12" md="8" sm="8">
                    <v-text-field v-model="ItemSearch.descripcion" label="Descripción" variant="outlined"
                        :error="stateDescription" :disabled="isVendido"></v-text-field>
                </v-col> -->
            </v-row>
            <v-row>
                <v-col cols="12" md="3" sm="3">
                    <v-autocomplete v-model="ItemSearch.idTipoProducto" :items="TipoCategoriaProducto"
                        item-title="description" item-value="id" label="Categoria" variant="outlined"
                        :error="stateCategoria" :disabled="isVendido"></v-autocomplete>
                </v-col>
                <v-col cols="12" md="3" sm="3">
                    <v-autocomplete v-model="ItemSearch.idTipoMarca" :items="TipoMarca" item-title="description"
                        item-value="id" label="Marca" variant="outlined" :error="stateMarca"
                        :disabled="isVendido"></v-autocomplete>
                </v-col>
                <v-col cols="12" md="3" sm="3">
                    <v-autocomplete v-model="ItemSearch.idTipoTalle" :items="TipoTalles" item-title="description"
                        item-value="id" label="Talle" variant="outlined" :error="stateTalle"
                        :disabled="isVendido"></v-autocomplete>
                </v-col>
                <v-col cols="12" md="3" sm="3">
                    <v-autocomplete v-model="ItemSearch.idEstado" :items="TipoEstado" item-title="description"
                        item-value="id" label="Estado" variant="outlined" :error="stateEstado"
                        :disabled="isVendido"></v-autocomplete>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" md="4" sm="4">
                    <v-text-field v-model="ItemSearch.precioDeCompra" label="Precio de Compra" type="number"
                        variant="outlined" :disabled="true"></v-text-field>
                </v-col>
                <v-col cols="12" md="4" sm="4">
                    <v-text-field v-model="ItemSearch.precioDeVenta" label="Precio de Venta" type="number"
                        variant="outlined" :error="statePrecioDeVenta" :disabled="isVendido"></v-text-field>
                </v-col>
                <v-col cols="12" md="4" sm="4">
                    <div class="divBarcode">
                        <div style="border: solid .5px;">
                            <div class="barcode" :id="'Etiqueta-' + ItemSearch.id">
                                <svg :id="'barcode-' + ItemSearch.id"></svg>
                <table class="lineaHorizontal">
                    <tr >
                        <td rowspan="2" class="lineaVertical"><p class="precioBarcode">{{ formatoMoneda(itemPrecioDeVenta,0) }}</p></td>
                        <td><p class="DescripcionBarcode">M: {{ tipoMarcaDescripcion.substring(0,14) }}</p></td>
                    </tr>
                    <tr>
                        <td><p class="DescripcionBarcode">{{ tipoProductoDescripcion }} - {{ tipoTalleDescripcion }}</p></td>
                    </tr>
                </table>
                            </div>
                        </div>
                        <v-btn @click="printBarcode(ItemSearch.id)" class="mx-1"
                            :disabled="isVendido || sinGuardar"><v-icon>mdi-printer</v-icon></v-btn>

                    </div>

                </v-col>
            </v-row>
            <v-row>
                <v-btn color="primary" variant="elevated" @click="guardar" :disabled="isVendido">Guardar</v-btn>
            </v-row>
        </div>
    </v-container>
    <Modal ref="modalRef"></Modal>
    <ModalLoader ref="modalLoaderRef"></ModalLoader>
</template>
<script lang="ts" setup>
import { ref, Ref, onMounted, computed, nextTick, watch } from 'vue'
//External Libraries
import JsBarcode from 'jsbarcode'; //npm install jsbarcode print-js
import printJS from 'print-js'; //npm install jsbarcode print-js
//Store
import { useProductoStore } from '../store/producto.store'
import { useAuthStore } from '../store/auth.store'
//Model
import ProductoDTOModel from "../Models/ProductoDTOModel"
import TipoCategoriaProductoModel from "../Models/TipoCategoriaProductoModel"
import TipoMarcaModel from "../Models/TipoMarcaModel"
import TipoEstadoModel from "../Models/TipoEstadoModel"
import TipoTalleModel from "../Models/TipoTalleModel"
//Enum
import { EstadoProductoEnum } from "../Enum/EstadoProductoEnum"
//Modal
import Modal from '../components/Modal.vue'
import ModalLoader from '../components/ModalLoader.vue'
//Functions
import { formatoMoneda, PaddingLeft } from "../functions/functions"


const productoStore = useProductoStore();
const storeAuth = useAuthStore()
const titulo = "Update Producto"
//Ref
const modalRef = ref()
const modalLoaderRef = ref()
const refTxtItem = ref()

const TipoTalles: Ref<Array<TipoTalleModel>> = ref([])
const TipoCategoriaProducto: Ref<Array<TipoCategoriaProductoModel>> = ref([])
const TipoMarca: Ref<Array<TipoMarcaModel>> = ref([])
const TipoEstado: Ref<Array<TipoEstadoModel>> = ref([])
const ItemSearch: Ref<ProductoDTOModel> = ref(new ProductoDTOModel())

//Validaciones
const stateCategoria = ref(false)
const stateMarca = ref(false)
// const stateDescription = ref(false)
const stateTalle = ref(false)
const stateEstado = ref(false)
const statePrecioDeVenta = ref(false)
const procesando = ref(false)
const isVendido = ref(false)
const sinGuardar = ref(false)

const txtItem: Ref<string> = ref("")
// const itemDescripcion = computed(() => {
//     return ItemSearch.value.descripcion
// })
const itemCategoria = computed(() => {
    return ItemSearch.value.idTipoProducto
})
const itemMarca = computed(() => {
    return ItemSearch.value.idTipoMarca
})
const itemTalle = computed(() => {
    return ItemSearch.value.idTipoTalle
})
const itemPrecioDeVenta = computed(() => {
    return ItemSearch.value.precioDeVenta
})
const itemEstado = computed(() => {
    return ItemSearch.value.idEstado
})

const tipoProductoDescripcion = computed(() => {
    const categoriaAux: TipoCategoriaProductoModel | undefined = TipoCategoriaProducto.value.find(item => item.id === ItemSearch.value.idTipoProducto)
    if (categoriaAux)
        return categoriaAux.description
    else
        return ""
})

const tipoMarcaDescripcion = computed(() => {
    const marcaAux: TipoMarcaModel | undefined = TipoMarca.value.find(item => item.id === ItemSearch.value.idTipoMarca)
    if (marcaAux)
        return marcaAux.description
    else
        return ""
})

const tipoTalleDescripcion = computed(() => {
    const talleAux: TipoTalleModel | undefined = TipoTalles.value.find(item => item.id === ItemSearch.value.idTipoTalle)
    if (talleAux)
        return talleAux.description.split('-')[0]
    else
        return ""
})

onMounted(async () => {
    try {
        procesando.value = true
        modalLoaderRef.value.Show()
        refTxtItem.value.focus()
        TipoTalles.value = await productoStore.getAllTalles()
        TipoCategoriaProducto.value = await productoStore.getAllCategoriasDeProducto()
        TipoMarca.value = await productoStore.getAllMarcasProducto()
        TipoEstado.value = await productoStore.getAllEstadosProducto()

    } catch (error) {
        modalRef.value.ModalErrorShow(titulo, "Ocurrio un Error al inicializar la pagina")
    } finally {
        procesando.value = false
        if (modalLoaderRef.value)
            modalLoaderRef.value.Close()
    }

})

const SearchItem = async () => {
    try {
        if (txtItem.value && txtItem.value != "") {
            limpiarEstados()
            procesando.value = true
            let resupuesta = await productoStore.searchItem(txtItem.value)

            if (resupuesta.result == "ok") {
                ItemSearch.value = resupuesta.item
                isVendido.value = ItemSearch.value.idEstado == EstadoProductoEnum.Vendido
                generateBarcodes(ItemSearch.value)
            }
            else {
                modalRef.value.ModalWarningShow(titulo, resupuesta.message)
            }
            txtItem.value = ""
        }
    } catch (error) {
        modalRef.value.ModalWarningShow(titulo, "Ocurrio un Error en la busqueda del Producto!")
    } finally {
        await nextTick(); // Espera a que el DOM se actualice
        procesando.value = false
        sinGuardar.value = false
    }

}
const handleEnter = (evt: KeyboardEvent) => {
    const key = evt.key
    if (key === 'Enter') {
        evt.preventDefault() // Evita agregar un espacio en el campo de texto
        SearchItem()
    }
}
const handlerSearch = (): void => {
    SearchItem()
}

const guardar = async () => {

    try {
        procesando.value = true

        if (validarDatos()) {
            limpiarEstados()
            if (ItemSearch.value.precioDeVenta) {
                if (typeof ItemSearch.value.precioDeVenta === "string") {
                    ItemSearch.value.precioDeVenta = Number(Number(ItemSearch.value.precioDeVenta).toFixed(2))
                } else if (typeof ItemSearch.value.precioDeVenta === "number") {
                    ItemSearch.value.precioDeVenta = Number(ItemSearch.value.precioDeVenta.toFixed(2))
                }
            } else {
                // Asigna un valor predeterminado si monto no es un número.
                ItemSearch.value.precioDeVenta = 0.00; // O cualquier valor predeterminado que consideres apropiado.
            }
            let idUsuario = storeAuth.getIdUserLogin()
            let response = await productoStore.GuardarProducto(idUsuario, ItemSearch.value)

            if (response.result == "ok") {
                sinGuardar.value = false
                modalRef.value.ModalOkShow(titulo, response.message)

            } else {
                modalRef.value.ModalErrorShow(titulo, response.message)
            }
        }

    } catch (error) {
        modalRef.value.ModalErrorShow(titulo, error)
    } finally {
        procesando.value = false
    }

}

const limpiarEstados = () => {
    stateCategoria.value = false
    // stateDescription.value = false
    stateMarca.value = false
    stateTalle.value = false
    stateEstado.value = false
    statePrecioDeVenta.value = false
}

const validarDatos = (): boolean => {
    let resultado = true
    let mensajeValidacion = ""
    const newline = "\n"
    const caracterItem = "•"
    limpiarEstados()

    if (!ItemSearch.value.idTipoProducto || ItemSearch.value.idTipoProducto == 0) {
        stateCategoria.value = true
        resultado = false
        mensajeValidacion += newline + caracterItem + " La categoria no puede estar vacía"
    }
    if (!ItemSearch.value.idTipoMarca || ItemSearch.value.idTipoMarca == 0) {
        stateMarca.value = true
        resultado = false
        mensajeValidacion += newline + caracterItem + " La Marca no puede estar vacía"
    }
    // if (!ItemSearch.value.descripcion || ItemSearch.value.descripcion == "") {
    //     stateDescription.value = true
    //     resultado = false
    //     mensajeValidacion += newline + caracterItem + " La descripción no puede estar vacía"
    // }
    if (!ItemSearch.value.idTipoTalle || ItemSearch.value.idTipoTalle == 0) {
        stateTalle.value = true
        resultado = false
        mensajeValidacion += newline + caracterItem + " El talle no puede estar vacío"
    }
    if (!ItemSearch.value.idEstado || ItemSearch.value.idEstado == 0) {
        stateEstado.value = true
        resultado = false
        mensajeValidacion += newline + caracterItem + " El Estado no puede estar vacío"
    }
    if (!ItemSearch.value.precioDeVenta || ItemSearch.value.precioDeVenta == null || ItemSearch.value.precioDeVenta == undefined) {
        statePrecioDeVenta.value = true
        resultado = false
        mensajeValidacion += newline + caracterItem + " El precio no puede estar vacío"
    } else if (ItemSearch.value.precioDeVenta <= 0) {
        statePrecioDeVenta.value = true
        resultado = false
        mensajeValidacion += newline + caracterItem + " El precio tiene que ser mayor a cero"
    }
    if (!resultado)
        modalRef.value.ModalWarningShow("Los datos ingreados no son válidos:", mensajeValidacion, false)

    return resultado
}

const generateBarcodes = async (producto: ProductoDTOModel) => {
    await nextTick(); // Espera a que el DOM se actualice

    const svgElement = document.getElementById(`barcode-${producto.id}`);
    let idProducto = PaddingLeft(producto.id.toString(), 10, "0")
    if (svgElement) {
        JsBarcode(svgElement, idProducto, {
            format: 'CODE128',
            width: 2,
            height: 40, fontSize: 14,
            displayValue: true,
        });
    }

}
const configPage =  `
        @page {
            width: 5.04cm;
            height: 2.54cm;
            margin: 0;
            border: initial;
            border-radius: initial;
            width: initial;
            min-height: initial;
            box-shadow: initial;
            background: initial;
            page-break-after: always;
              }
          .barcode { margin: 0px; height: 2.5cm; display: flex; flex-direction: column; justify-content: center; align-items: center; }
          .barcode svg { height: 2cm; }
          .barcode table { align-items: start; }
          .precioBarcode { margin: 0 2px 0 0; font-size: 14px; font-family: 'Roboto', sans-serif; font-weight: bold;}
          .DescripcionBarcode {margin: 0 0 0 2px; font-size: 8px; font-family: 'Roboto', sans-serif; font-weight: bold; }
          .lineaHorizontal{ width: 4.8cm; border-top: solid 0.3px; }
          .lineaVertical{ border-right: solid 0.3px; }
        `

const printBarcode = (id: number) => {
    const svgElement = document.getElementById(`Etiqueta-${id}`);
    if (svgElement) {
        printJS({
            printable: svgElement.outerHTML,
            type: 'raw-html',//html
            style: configPage,
            targetStyles: ['*'],
        });
    }
};
// watch(itemDescripcion, (newValue, oldValue) => {
//     if (newValue !== oldValue && oldValue != "") {
//         sinGuardar.value = true
//     }
// })
watch(itemCategoria, (newValue, oldValue) => {
    if (newValue !== oldValue && oldValue !== 0) {
        sinGuardar.value = true
    }
})
watch(itemMarca, (newValue, oldValue) => {
    if (newValue !== oldValue && oldValue !== 0) {
        sinGuardar.value = true
    }
})
watch(itemTalle, (newValue, oldValue) => {
    if (newValue !== oldValue && oldValue !== 0) {
        sinGuardar.value = true
    }
})
watch(itemPrecioDeVenta, (newValue, oldValue) => {
    if (newValue !== oldValue && oldValue !== 0) {
        sinGuardar.value = true
    }
})

watch(itemEstado, (newValue, oldValue) => {
    if (newValue !== oldValue && oldValue !== 0) {
        sinGuardar.value = true
    }
})

</script>

<style scoped>
.classMaria {
    font-size: 1.5rem;
    font-family: 'MariaFont Sans';
    font-weight: 500;
    color: black;
}

:deep(.v-input__details) {
    min-height: 0px;
    padding: 0px;
}

.divBarcode {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
}

.barcode {
    margin: 0px;
    height: 2.5cm;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.barcode svg {
    height: 2cm;
}
.barcode table {
    align-items: start;
}
/* .barcode p {
    margin: 0;
} */
.precioBarcode {
    margin: 0 2px 0 0;
    font-size: 14px;
    font-family: 'Roboto', sans-serif;
    font-weight: bold;
    /* font-family: 'monospace'; */
}
.DescripcionBarcode {
    margin: 0 0 0 2px;
    font-size: 8px;
    font-family: 'Roboto', sans-serif;
    font-weight: bold;
    /* font-family: 'monospace'; */
}

.lineaHorizontal{
    width: 4.8cm;
    border-top: solid 0.3px;
}
.lineaVertical{
    border-right: solid 0.3px;
}
</style>