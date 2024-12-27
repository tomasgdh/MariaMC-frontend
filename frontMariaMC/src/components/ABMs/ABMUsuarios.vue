<template>
    <v-sheet class="mx-auto" width="800">
        <v-row align="center" justify="center">
            <h3 class="classMaria mt-1">ABM - Clientes</h3>
        </v-row>
        <v-form v-if="!procesando">
            <v-container>
                <v-row>
                    <v-col cols="12" md="6" sm="6">
                        <v-text-field v-model="txtApellido" type="string" label="Apellido" placeholder="Apellido"
                            variant="outlined" :error="stateApellido" :maxlength="50"
                            @input="txtApellido = txtApellido.toUpperCase()"
                            hint="Máximo 50 caracteres" counter></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6" sm="6">
                        <v-text-field v-model="txtNombre" type="string" label="Nombre" placeholder="Nombre"
                            variant="outlined" :error="stateNombre" :maxlength="50"
                            @input="txtNombre = txtNombre.toUpperCase()"
                            hint="Máximo 50 caracteres" counter></v-text-field>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12" md="6" sm="6">
                        <v-autocomplete v-model="idTipoDocumento" :items="ListaTipoDocumento" item-title="description"
                            item-value="id" label="Tipo Documento" variant="outlined"
                            :error="stateTipoDocumento"></v-autocomplete>
                    </v-col>
                    <v-col cols="12" md="6" sm="6">
                        <v-text-field v-model="txtNroDocumento" type="number" label="Nro Documento"
                            placeholder="Nro Documento" variant="outlined" :error="stateNroDocumento"
                            oninput="if(this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
                            :maxlength="8"></v-text-field>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12" md="6" sm="6">
                        <v-text-field v-model="txtMail" type="string" label="Mail" placeholder="Mail" variant="outlined"
                            :error="stateMail" :maxlength="50" hint="Máximo 50 caracteres"
                            @input="txtMail = txtMail.toLowerCase()"
                            counter></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6" sm="6">
                        <v-text-field v-model="txtMailConfirmacion" type="string" label="Mail Confirmación"
                            placeholder="Mail Confirmación" variant="outlined" :error="stateMailConfirmacion"
                            @input="txtMailConfirmacion = txtMailConfirmacion.toLowerCase()"
                            @paste.stop.prevent :maxlength="50" hint="Máximo 50 caracteres" counter></v-text-field>
                    </v-col>

                </v-row>
                <v-row align="center" justify="end">
                    <v-btn color="primary" variant="elevated" @click.prevent="Guardar">Guardar</v-btn>
                </v-row>
            </v-container>
        </v-form>
        <v-row v-if="procesando" align="center" justify="center">
            <div class="d-flex flex-column align-center justify-center mt-5">
                <v-progress-circular indeterminate color="primary" :size="120"></v-progress-circular>
                <div>{{ "Guardando el cliente..." }}</div>
            </div>
            
        </v-row>
        <v-row align="center" justify="center">
            <div class="d-flex flex-row align-center justify-center mt-5">
                <AlertMessage ref="alertRef" />
            </div>
        </v-row>
    </v-sheet>
    <Modal ref="modalRef"></Modal>
</template>
<script lang="ts" setup>
import { ref, Ref, onMounted } from 'vue'
import { useClienteStore } from '../../store/cliente.store'
import { useAuthStore } from '../../store/auth.store'
import { isValidEmail } from '../../functions/functions'

import AlertMessage from '../../components/AlertMessage.vue'
import Modal from "../../components/Modal.vue"

import TipoDocumentoModel from '../../Models/TipoDocumentoModel'
const txtNombre = ref("")
const txtApellido = ref("")
const txtMail = ref("")
const txtMailConfirmacion = ref("")
const idTipoDocumento = ref(0)
const txtNroDocumento = ref(0)

const stateApellido = ref(false)
const stateNombre = ref(false)
const stateTipoDocumento = ref(false)
const stateNroDocumento = ref(false)
const stateMail = ref(false)
const stateMailConfirmacion = ref(false)

const procesando = ref(false)

const ListaTipoDocumento: Ref<Array<TipoDocumentoModel>> = ref([])

const store = useClienteStore()
const storeAuth = useAuthStore()

const alertRef = ref()
const modalRef = ref()

onMounted(async () => {
    ListaTipoDocumento.value = await store.getAllTipoDocumento()
    idTipoDocumento.value = 1
})

const Guardar = async () => {

    if (validarDatos()) {
        procesando.value = true
        let idUsuario = storeAuth.getIdUserLogin()
        let response = await store.guardarCliente(txtNombre.value, txtApellido.value, txtMail.value, idTipoDocumento.value, txtNroDocumento.value,idUsuario)

        procesando.value = false

        if (response.result == "ok") {
            modalRef.value.ModalOkShow("Atención", response.message, false, limpiar)
        } else {
            modalRef.value.ModalErrorShow("Atención", response.message, false)
        }
    }
}

const limpiar = () => {
    txtNombre.value = ""
    txtApellido.value = ""
    txtMail.value = ""
    txtMailConfirmacion.value = ""
    idTipoDocumento.value = 1
    txtNroDocumento.value = 0
}

const limpiarEstados = () => {
    stateApellido.value = false
    stateNombre.value = false
    stateTipoDocumento.value = false
    stateNroDocumento.value = false
    stateMail.value = false
    stateMailConfirmacion.value = false
}

const validarDatos = (): boolean => {
    let resultado = true
    let mensajeValidacion = ""
    const newline = "\n"
    const caracterItem = "•"
    limpiarEstados()

    // if (editedIndex.value === -1) {
    if (!txtNombre.value || txtNombre.value.trim() == "") {
        stateNombre.value = true
        resultado = false
        mensajeValidacion += newline + caracterItem + " El nombre no puede estar vacío"
    }
    if (!txtApellido.value || txtApellido.value.trim() == "") {
        stateApellido.value = true
        resultado = false
        mensajeValidacion += newline + caracterItem + " El apellido no puede estar vacío"
    }
    if (!txtMail.value || txtMail.value == "") {
        stateMail.value = true
        resultado = false
        mensajeValidacion += newline + caracterItem + " El mail no puede estar vacío"
    } else {
        if (!isValidEmail(txtMail.value)) {
            stateMail.value = true
            resultado = false
            mensajeValidacion += newline + caracterItem + " El mail no es válido"
        }
    }

    if (!txtMailConfirmacion.value || txtMailConfirmacion.value == "") {
        stateMailConfirmacion.value = true
        resultado = false
        mensajeValidacion += newline + caracterItem + " El mail de confirmación no puede estar vacío"
    } else {
        if (!isValidEmail(txtMailConfirmacion.value)) {
            stateMail.value = true
            resultado = false
            mensajeValidacion += newline + caracterItem + " El mail de confirmación no es válido"
        }
    }

    if (txtMailConfirmacion.value != "" && txtMail.value != "" && txtMailConfirmacion.value != txtMail.value) {
        stateMailConfirmacion.value = true
        stateMail.value = true
        resultado = false
        mensajeValidacion += newline + caracterItem + " El mail y el mail de confirmación no coinciden"
    }

    if (!idTipoDocumento.value || idTipoDocumento.value == 0) {
        stateTipoDocumento.value = true
        resultado = false
        mensajeValidacion += newline + caracterItem + " El tipo de documento no puede estar vacío"
    }
    // }

    if (!txtNroDocumento.value || txtNroDocumento.value == null || txtNroDocumento.value == undefined) {
        stateNroDocumento.value = true
        resultado = false
        mensajeValidacion += newline + caracterItem + " El nro de documento no puede estar vacío"
    } else {
        if (txtNroDocumento.value < 100000) {
            stateNroDocumento.value = true
            resultado = false
            mensajeValidacion += newline + caracterItem + " El nro de documento tiene que ser mayor a 100.000"
        } else if (txtNroDocumento.value > 100000000) {
            stateNroDocumento.value = true
            resultado = false
            mensajeValidacion += newline + caracterItem + " El nro de documento tiene que ser menor a 100.000.000"
        }
    }
    if (!resultado)
        alertRef.value.alertErrorShow("Los datos ingreados no son válidos:", mensajeValidacion)
    else
        alertRef.value.closeAlert()

    return resultado
}
</script>

<style scoped>
.classMaria {
    font-family: 'MariaFont Sans';
    font-weight: 500;
    color: black;
}

.classMariaFont {
    font-size: 1.5rem;
    font-family: 'MariaFont Sans';
    font-weight: 500;
    color: black;
}
</style>