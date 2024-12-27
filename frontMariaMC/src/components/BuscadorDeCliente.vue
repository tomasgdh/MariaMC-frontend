<template>
    <v-text-field id="txtCliente" v-model="txtItem" autocomplete="off" type="string" label="Buscador de Cliente"
        placeholder="Ingrese el usuario, mail o documento" variant="outlined" clearable density="compact"
        @keyup.stop="handleEnter($event)" @click:append-inner="handlerSearch" :loading="loading"
        append-inner-icon="mdi-magnify" append-icon="mdi-account-plus" @click:append="handlerAddCliente"></v-text-field>

    <div v-if="vistaTabla && ItemSeleccionado" class="mt-2 d-flex flex-row align-center">
        <table>
            <thead>
                <tr>
                    <th style='padding: 5px; border: 1px solid black; font-size: 1.5rem; background-color: #f2f2f2; text-align: center;'
                        colspan="2" class="classMaria"> Cliente</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="classMaria" style='padding: 5px;font-size: 1.2rem; border: 1px solid black;'>Nombre y
                        Apellido</td>
                    <td style='padding: 5px; border: 1px solid black; text-align: right;font-weight: bold;'>
                        {{ ItemSeleccionado.description }}</td>
                </tr>
                <tr>
                    <td class="classMaria" style='padding: 5px;font-size: 1.2rem; border: 1px solid black;'>Usuario</td>
                    <td style='padding: 5px; border: 1px solid black; text-align: right;font-weight: bold;'>
                        {{ ItemSeleccionado.usuario }}</td>
                </tr>
                <tr>
                    <td class="classMaria" style='padding: 5px;font-size: 1.2rem; border: 1px solid black;'>Nro
                        Documento</td>
                    <td style='padding: 5px; border: 1px solid black; text-align: right;font-weight: bold;'>
                        {{ formatoNumero(ItemSeleccionado.nroDocumento, 0) }}</td>
                </tr>
                <tr>
                    <td class="classMaria" style='padding: 5px;font-size: 1.2rem; border: 1px solid black; '>Credito en
                        tienda</td>
                    <td style='padding: 5px; border: 1px solid black; text-align: right;font-weight: bold;'>
                        {{ formatoMoneda(ItemSeleccionado.creditoEnTienda) }}</td>
                </tr>
            </tbody>
        </table>
        <v-btn class="ml-2" prepend-icon="mdi-backspace-outline" color="primary" variant="elevated" @click.prevent="limpiar">Limpiar</v-btn>
    </div>
    <div v-if="!vistaTabla && ItemSeleccionado" class="mt-2 d-flex flex-row align-center justify-center">
        <span style='font-size: 1rem;font-weight: bold;'><b class="classMaria" style='font-size: 1.2rem;'>Usuario:
            </b>{{ ItemSeleccionado.usuario }}&nbsp;&nbsp;-&nbsp;&nbsp;</span>
        <span style='font-size: 1rem;font-weight: bold;'><b class="classMaria" style='font-size: 1.2rem;'>Nombre:
            </b>{{ ItemSeleccionado.description }}&nbsp;&nbsp;-&nbsp;&nbsp;</span>
        <span style='font-size: 1rem;font-weight: bold;'><b class="classMaria" style='font-size: 1.2rem;'>Nro Doc:
            </b>{{ formatoNumero(ItemSeleccionado.nroDocumento, 0) }} &nbsp;&nbsp;-&nbsp;&nbsp;</span>
        <span style='font-size: 1rem;font-weight: bold;'><b class="classMaria" style='font-size: 1.2rem;'>Credito en
                tienda: </b>{{ formatoMoneda(ItemSeleccionado.creditoEnTienda) }} </span>
                <v-btn class="ml-2" prepend-icon="mdi-backspace-outline" color="primary" variant="elevated" @click.prevent="limpiar">Limpiar</v-btn>
    </div>

    <v-dialog v-model="dialog" max-width="800px" persistent>
        <v-card>
            <v-card-title>
                <span style="font-size: 1.5rem; " class="classMaria d-flex flex-column align-center justify-center">{{
        "Busqueda de Cliente" }}</span>
            </v-card-title>

            <v-card-text>
                <v-container>
                    <v-radio-group v-model="radioButtonSelected">
                        <v-data-table :items="clientes" :fixed-footer="true"
                            :sort-by="[{ key: 'description', order: 'asc' }]" no-data-text="No data avaible"
                            :dense="true">
                            <template v-slot:default="{ items }">
                                <thead>
                                    <tr>
                                        <th class="text-left">Selección</th>
                                        <th class="text-left">Descripcion</th>
                                        <th class="text-left">Usuario</th>
                                        <th class="text-left">Nro Documento</th>
                                    </tr>
                                </thead>
                                <tbody class="rowsAlternados">
                                    <tr v-for="(item, index) in items" :key="index" class="textoDescCliente">
                                        <td>
                                            <v-radio :value="item" />
                                        </td>
                                        <td>{{ item.description }}</td>
                                        <td>{{ item.usuario }}</td>
                                        <td>{{ formatoNumero(item.nroDocumento, 0) }}</td>
                                    </tr>
                                </tbody>
                            </template>
                        </v-data-table>
                    </v-radio-group>
                    <AlertMessage ref="alertRef" />
                </v-container>
            </v-card-text>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" variant="elevated" @click="close">
                    Cancel
                </v-btn>
                <v-btn color="primary" variant="elevated" @click="save">
                    Ok
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
    <Modal ref="modalRef"></Modal>
    <v-dialog v-model="dialogABMCliente" max-width="850px">
        <template v-slot:default="{ isActive }">
            <v-card rounded="lg">
                <v-card-text>
                    <div class="d-flex justify-end align-center">
                        <v-btn icon="mdi-close" variant="text" @click="isActive.value = false"></v-btn>
                    </div>
                    <v-container>
                        <AbmCliente></AbmCliente>
                    </v-container>
                </v-card-text>
            </v-card>
        </template>
    </v-dialog>
</template>
<script lang="ts" setup>
import { ref, Ref } from 'vue'
import AlertMessage from "../components/AlertMessage.vue"
import AbmCliente from "../components/ABMs/ABMClientes.vue"
import Modal from "../components/Modal.vue"
import ClienteVentaModel from '../Models/ClienteVentaModel'
import { useClienteStore } from '../store/cliente.store'
import { formatoMoneda, formatoNumero } from '../functions/functions'
const emits = defineEmits(["clienteSeleccionado"])
const props = defineProps(["vistaTabla"])
const vistaTabla = props.vistaTabla

const clientes: Ref<Array<ClienteVentaModel> | []> = ref<Array<ClienteVentaModel>>([])

const txtItem: Ref<string> = ref("")
const dialog = ref(false)
const dialogABMCliente = ref(false)
const modalRef = ref()
const clienteStore = useClienteStore()
const radioButtonSelected: Ref<ClienteVentaModel | null> = ref(null)
const ItemSeleccionado: Ref<ClienteVentaModel | null> = ref(null)

const loading: Ref<boolean> = ref(false)
const alertRef = ref()

const SearchItem = async () => {
    if (txtItem.value && txtItem.value != "") {
        loading.value = true
        let resupuesta = await clienteStore.searchCliente(txtItem.value)
        loading.value = false
        if (resupuesta.result == "ok") {
            clientes.value = resupuesta.clientes
            if (clientes.value.length == 1) {
                ItemSeleccionado.value = clientes.value[0]
                emits("clienteSeleccionado", ItemSeleccionado.value)
            } else {
                dialog.value = true
            }
        }
        else {
            modalRef.value.ModalErrorShow("Atención", resupuesta.message, false, limpiar)
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
const handlerAddCliente = (): void => {
    dialogABMCliente.value = true
}

const close = () => {
    clientes.value = []
    dialog.value = false
    radioButtonSelected.value = null
}

const save = () => {

    if (clientes.value && clientes.value.length > 0) {
        if (radioButtonSelected.value && radioButtonSelected.value.id > -1) {
            ItemSeleccionado.value = radioButtonSelected.value
            emits("clienteSeleccionado", ItemSeleccionado.value)
            close()
        } else {
            alertRef.value.alertErrorShow("Los datos ingreados no son válidos:", "Seleccione un cliente, por favor.")
        }
    } else { close() }
}
const limpiar = () => {
    radioButtonSelected.value = null
    ItemSeleccionado.value = null
    emits("clienteSeleccionado", ItemSeleccionado.value)
}
defineExpose({ limpiar })
</script>

<style scoped>
.textoDescCliente {
    font-size: 0.8rem;
    color: black;
}

.classMaria {
    font-family: 'MariaFont Sans';
    font-weight: 500;
    color: black;
}

:deep(.v-table--density-default) {
    --v-table-header-height: 24px;
    --v-table-row-height: 24px;
}

:deep(header > .v-toolbar__content) {
    height: 36px !important;
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

:deep(.v-input__details) {
    min-height: 0px;
    padding: 0px;
}

.rowsAlternados tr:nth-of-type(even) {
    background-color: rgba(0, 0, 0, .05);

}
</style>