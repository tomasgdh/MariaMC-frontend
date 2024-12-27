<template>
    <v-row align="center" justify="center">
        <h3 class="classMaria mt-1">{{ titulo }}</h3>
    </v-row>
    <v-container>
        <v-row>
            <v-file-input ref="fileInputRef" :v-model="file" label="Subir archivo Excel" accept=".xls, .xlsx"
            @change="handleFileUpload" @click:clear="limpiar"></v-file-input>
        </v-row>
        <v-row>
            <v-btn class="mx-10" @click="uploadProducts" :disabled="!products.length" color="primary" :loading="procesando" prepend-icon="mdi-upload">Subir Productos</v-btn>
            <v-btn class="mx-10" @click="limpiar" prepend-icon="mdi-backspace-outline" color="primary" :disabled="!products.length" :loading="procesando">Limpiar</v-btn>
        </v-row>

        <v-row class="mt-2">
                <v-col>
                    <v-data-table v-if="products.length > 0" id="TablaPreview" :headers="headers" :fixed-footer="true" :items="products"
                        :dense="true" :items-per-page="20"
                        no-data-text="No data avaible">
                        <template v-slot:item.precioDeCompra="{ item }">
                            <span :class="getClass(item.precioDeCompra)">
                                {{ formatoMoneda(item.precioDeCompra) }}
                            </span>
                        </template>
                        <template v-slot:item.precioDeVenta="{ item }">
                            <span :class="getClass(item.precioDeVenta)">
                                {{ formatoMoneda(item.precioDeVenta) }}
                            </span>
                        </template>
                        <template v-slot:top>
                            <v-toolbar flat>
                                <v-toolbar-title class="classMaria">{{ "Vista Previa de Archivo" }}</v-toolbar-title>
                                <v-divider class="mx-4" vertical></v-divider>
                                <v-spacer></v-spacer>

                            </v-toolbar>
                        </template>
                    </v-data-table>
                </v-col>
            </v-row>
    </v-container>
    <Modal ref="modalRef"></Modal>
    <ModalLoader ref="modalLoaderRef"></ModalLoader>
</template>

<script setup lang="ts">
import { ref, Ref } from 'vue';
import * as XLSX from 'xlsx'; //npm install xlsx

//Store
import { useProductoStore } from '../store/producto.store'
import { useAuthStore } from '../store/auth.store'
//Model
import ProductoDTOModel from "../Models/ProductoDTOModel"
//Modal
import Modal from '../components/Modal.vue'
import ModalLoader from '../components/ModalLoader.vue'
//Functions
import { formatoMoneda} from "../functions/functions"


const file = ref<File | null>(null);
const products: Ref<Array<ProductoDTOModel>> = ref([]);
const storeProducto = useProductoStore();
const storeAuth = useAuthStore()
const titulo = "Carga de Productos por archivo"
const modalRef = ref()
const modalLoaderRef = ref()
const fileInputRef = ref()
const procesando = ref(false)

const headers: any = [
    { title: "Estado", value: "idEstado", align: "start" },
    // { title: "Descripcion", value: "descripcion", align: "start" },
    { title: "PrecioDeCompra", value: "precioDeCompra" , align: "end"},
    { title: "PrecioDeVenta", value: "precioDeVenta" , align: "end"},
    { title: "TipoProducto", value: "idTipoProducto", align: "start" },
    { title: "IdTipoTalle", value: "idTipoTalle", align: "start" },
    { title: "IdTipoMarca", value: "idTipoMarca", align: "start" },
]

const handleFileUpload = (event: Event) => {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const data = new Uint8Array(e.target!.result as ArrayBuffer);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const jsonData: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            parseExcelData(jsonData);
        };
        reader.readAsArrayBuffer(input.files[0]);
    }
};

const parseExcelData = (data: any[][]) => {
    products.value = data.slice(1)
    .filter(row => row.some(cell => cell !== undefined && cell !== null && cell !== ''))
    .map(row => ({
        idEstado: parseInt(row[0]),
        // descripcion: row[1],
        precioDeCompra: parseInt(row[1]),
        precioDeVenta: parseInt(row[2]),
        idTipoProducto: parseInt(row[3]),
        idTipoTalle: parseInt(row[4]),
        idTipoMarca: parseInt(row[5]),
    })) as ProductoDTOModel[];
};

const uploadProducts = async () => {

    try {
        procesando.value = true
        modalLoaderRef.value.Show()

        let idUsuario = storeAuth.getIdUserLogin()

        let response = await storeProducto.CargaDeProductosPorArchivo(idUsuario, products.value)

        modalLoaderRef.value.Close()
        procesando.value = false

        if (response.result == "ok") {
            modalRef.value.ModalOkShow(titulo, response.message, false,limpiar )
        } else {
            modalRef.value.ModalErrorShow(titulo, response.message, false)
        }

    } catch (error) {
        if (modalLoaderRef.value)
            modalLoaderRef.value.Close()
        procesando.value = false
        modalRef.value.ModalErrorShow(titulo, error, false)
    }
}

const getClass = (value: number) => {
    return value < 0 ? 'negative' : '';
}
const limpiar = ()=>{
    products.value.splice(0, products.value.length)
    file.value = null;
  if (fileInputRef.value) {
    fileInputRef.value.$el.querySelector('input').value = '';
  }
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