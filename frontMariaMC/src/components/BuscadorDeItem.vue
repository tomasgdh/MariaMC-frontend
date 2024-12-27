<template>
    <v-text-field ref="refTxtItem" v-model="txtItem" type="string" label="Item" placeholder="Ingrese un articulo"
        variant="outlined" clearable density="compact" @keyup.stop="handleEnter($event)"
        @click:append-inner="handlerSearch" :loading="loading" append-inner-icon="mdi-magnify" prepend-inner-icon="mdi-barcode-scan"></v-text-field>
        
    <Modal ref="modalRef"></Modal>
</template>
<script lang="ts" setup>
import { ref, Ref, onMounted, nextTick } from 'vue'
import VentaItemModel from '../Models/VentaItemModel'
import { useProductoStore } from '../store/producto.store'
import { formatoMoneda } from '../functions/functions'
import Modal from './Modal.vue'

const props = defineProps(["Items"])
const ListaItems: Ref<Array<VentaItemModel>> = ref(props.Items)
const ItemSearch: Ref<VentaItemModel | null> = ref(null)
const modalRef = ref()
const txtItem: Ref<string> = ref("")
const refTxtItem = ref()

const productoStore = useProductoStore()
const loading: Ref<boolean> = ref(false)

onMounted(() => {
    refTxtItem.value.focus()
})

const formatItem = (item: VentaItemModel) => {
    return ` ${item.categoria} |  ${item.marca} | ${item.talle} | ${formatoMoneda(item.price)}`
}

const SearchItem = async () => {
    if (txtItem.value && txtItem.value != "") {
        loading.value = true
        let resupuesta = await productoStore.searchItemToSell(txtItem.value)
        loading.value = false

        if (resupuesta.result == "ok") {
            ItemSearch.value = resupuesta.item
            if (ItemSearch.value && !existeItemConId(ItemSearch.value.id))
                modalRef.value.ModalInfoShow("Busqueda de item", formatItem(ItemSearch.value),false, save)
            else {
                ItemSearch.value = null
                modalRef.value.ModalWarningShow("Busqueda de item", "El Item que quiere cobrar ya fue cargado, solo se permite un item por venta",false, close)
            }
        }
        else {
            modalRef.value.ModalWarningShow("Busqueda de item", resupuesta.message,false, close)
        }

        txtItem.value = ""
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

const close = () => {
    nextTick(() => {
        refTxtItem.value.focus()
        return false
    })
}

const save = () => {
    if (ItemSearch.value && ItemSearch.value.id > -1) {
        ItemSearch.value.price = Number(ItemSearch.value.price.toFixed(2))
        ListaItems.value.push(ItemSearch.value)
    }
    close()
    ItemSearch.value = null
}

const existeItemConId = (id: number) => {
    return ListaItems.value.some(item => item.id === id);
}

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
</style>