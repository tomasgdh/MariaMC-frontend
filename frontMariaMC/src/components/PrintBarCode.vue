<template>
    <v-row align="center" justify="center">
        <h3 class="classMaria mt-1">{{ titulo }}</h3>
    </v-row>

    <v-data-table :headers="headers" :items="products" item-key="idProducto" :dense="true"
        no-data-text="No data avaible" :items-per-page="-1" @update:page="handlePageChange"
        @update:items-per-page="handlePageChange" show-select v-model="selected" item-value="idProducto"
        select-strategy="all">
        <template v-slot:top>
            <v-toolbar flat>
                <v-toolbar-title class="classMaria">{{ titulo }}</v-toolbar-title>
                <v-divider class="mx-4" vertical></v-divider>
                <v-spacer></v-spacer>
                <v-btn @click="printSelected"><v-icon>mdi-printer</v-icon> Imprimir Seleccionados</v-btn>
                <v-btn @click="printAll"><v-icon>mdi-printer</v-icon> Imprimir Todos</v-btn>

            </v-toolbar>
        </template>
        <template v-slot:item.precioDeVenta="{ item }">
            {{ formatoMoneda(item.precioDeVenta) }}
        </template>
        <template v-slot:item.barcode="{ item }">
            <div class="barcode" :id="'Etiqueta-' + item.idProducto">
                <svg :id="'barcode-' + item.idProducto"></svg>
                <table class="lineaHorizontal">
                    <tr >
                        <td rowspan="2" class="lineaVertical"><p class="precioBarcode">{{ formatoMoneda(item.precioDeVenta, 0) }}</p></td>
                        <td><p class="DescripcionBarcode">M: {{ item.tipoMarcaDescripicion.substring(0,14) }}</p></td>
                    </tr>
                    <tr>
                        <td><p class="DescripcionBarcode">{{ item.tipoProductoDescripcion }} - {{ item.tipoTalleDescripcion }}</p></td>
                    </tr>
                </table>
            </div>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
            <v-btn @click="printBarcode(item.idProducto)"><v-icon>mdi-printer</v-icon></v-btn>
        </template>
    </v-data-table>
    <Modal ref="modalRef"></Modal>
    <ModalLoader ref="modalLoaderRef"></ModalLoader>
</template>

<script setup lang="ts">
import { ref, Ref, onMounted, nextTick } from 'vue';
//External Libraries
import JsBarcode from 'jsbarcode'; //npm install jsbarcode print-js
import printJS from 'print-js'; //npm install jsbarcode print-js
//Store
import { useProductoStore } from '../store/producto.store'
//Models
import ProductoPrintResponseModel from '../Models/ProductoPrintResponseModel';
//Modal
import Modal from '../components/Modal.vue'
import ModalLoader from '../components/ModalLoader.vue'
//Functions
import { PaddingLeft, formatoMoneda } from "../functions/functions"

const headers: any = [
    { title: "#", value: "idProducto" },
    { title: "Codigo De Barras", value: "barcode" },
    // { title: "Descripción", value: "descripcion" },
    { title: "Categoria", value: "tipoProductoDescripcion", },
    { title: "Marca", value: "tipoMarcaDescripicion", },
    { title: "talle", value: "tipoTalleDescripcion", },
    { title: "Precio", value: "precioDeVenta", align: "end" },
    { title: "Imprimir", value: "actions", sortable: false },
]

const products: Ref<Array<ProductoPrintResponseModel>> = ref([])
const storeProducto = useProductoStore()
const titulo = "Print BarCode"
const modalRef = ref()
const modalLoaderRef = ref()
const selected = ref([]); // Para almacenar la selección de productos

const generateBarcodes = async () => {
    await nextTick(); // Espera a que el DOM se actualice
    products.value.forEach(product => {
        const svgElement = document.getElementById(`barcode-${product.idProducto}`);
        let idProducto = PaddingLeft(product.idProducto.toString(), 10, "0")
        if (svgElement) {
            JsBarcode(svgElement, idProducto, {
                format: 'CODE128',
                width: 2,
                height: 40,fontSize: 14,
                displayValue: true,
            });
        }
    });
};
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
          .precioBarcode { margin: 0 2px 0 0; font-size: 14px; font-family: 'Roboto', sans-serif;font-weight: bold;}
          .DescripcionBarcode {margin: 0 0 0 2px; font-size: 8px; font-family: 'Roboto', sans-serif; font-weight: bold;}
          .lineaHorizontal{ width: 4.8cm; border-top: solid 0.3px; }
          .lineaVertical{ border-right: solid 0.3px; }
        `
const printBarcode = (id: number) => {
    const svgElement = document.getElementById(`Etiqueta-${id}`);
    if (svgElement) {
        printJS({
            printable: svgElement.outerHTML,
            type: 'raw-html',//html
            style:configPage,
            targetStyles: ['*'],
        });
    }
};


onMounted(async () => {
    try {
        modalLoaderRef.value.Show()

        let response = await storeProducto.GetAllProductosToPrint()

        if (response.result == "ok") {
            products.value = response.listToPrint
            generateBarcodes()
        } else {
            modalRef.value.ModalErrorShow(titulo, response.message)
        }

    } catch (error) {
        modalRef.value.ModalErrorShow(titulo, error, false)
    } finally {
        if (modalLoaderRef.value)
            modalLoaderRef.value.Close()
    }

});
const handlePageChange = () => {
    generateBarcodes();
}

const printSelected = () => {
    let printableContent= "";
    selected.value.forEach(product => {
        const svgElement = document.getElementById(`Etiqueta-${product}`);
        if (svgElement) {
            if (svgElement) {
                printableContent+=svgElement.outerHTML;
            }
        }
    });

    printJS({
        printable: printableContent,
        type: 'raw-html',
        style:configPage,
    });
};

const printAll = () => {
    // products.value.forEach(product => {
    //     printBarcode(product.idProducto);
    // });
    let printableContent:any[] = [];
    // let printableContent= "";
    products.value.forEach(product => {
        const svgElement = document.getElementById(`Etiqueta-${product.idProducto}`);
        if (svgElement) {
            if (svgElement) {
                printableContent.push(svgElement.outerHTML);
                // printableContent+=svgElement.outerHTML;
            }
        }
    });
    printJS({
        printable: printableContent.join(''),
        type: 'raw-html',
        style:configPage,
    });
}
</script>

<style scoped>
.barcode-container {
    display: flex;
    flex-direction: column;
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