<template>
    <v-sheet class="mx-auto" width="800">
        <v-row align="center" justify="center">
            <h3 class="classMaria mt-1">{{ titulo }}</h3>
        </v-row>
        <v-form v-if="!procesando">
            <v-container>
                <v-row>
                    <v-col cols="12" md="6" sm="6">
                        <v-text-field v-model="txtUserName" type="string" label="UserName" placeholder="UserName"
                            variant="outlined" readonly></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6" sm="6">
                        <v-btn color="primary" prepend-icon="mdi-key-variant" variant="elevated" :loading="procesando"
                            @click.prevent="OpenPasswordUpdate">Actualizar contraseña</v-btn>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12" md="6" sm="6">
                        <!-- <v-text-field v-model="txtApellido" type="string" label="Apellido" placeholder="Apellido"
                            variant="outlined" readonly :error="stateApellido" :maxlength="50"
                            @input="txtApellido = txtApellido.toUpperCase()" hint="Máximo 50 caracteres"
                            counter></v-text-field> -->
                            <v-text-field v-model="txtApellido" type="string" label="Apellido" placeholder="Apellido"
                            variant="outlined" readonly></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6" sm="6">
                        <v-text-field v-model="txtNombre" type="string" label="Nombre" placeholder="Nombre"
                            variant="outlined" readonly></v-text-field>
                    </v-col>
                </v-row>
                <!-- <v-row>
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
                </v-row> -->
                <!-- <v-row>
                    <v-col cols="12" md="6" sm="6">
                        <v-text-field v-model="txtMail" type="string" label="Mail" placeholder="Mail" variant="outlined"
                            :error="stateMail" :maxlength="50" hint="Máximo 50 caracteres"
                            @input="txtMail = txtMail.toLowerCase()" counter></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6" sm="6">
                        <v-text-field v-model="txtMailConfirmacion" type="string" label="Mail Confirmación"
                            placeholder="Mail Confirmación" variant="outlined" :error="stateMailConfirmacion"
                            @input="txtMailConfirmacion = txtMailConfirmacion.toLowerCase()" @paste.stop.prevent
                            :maxlength="50" hint="Máximo 50 caracteres" counter></v-text-field>
                    </v-col>

                </v-row> -->
                <!-- <v-row align="center" justify="end">
                    <v-btn color="primary" variant="elevated" @click.prevent="Guardar">Guardar</v-btn>
                </v-row> -->
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
    <v-dialog v-model="dialog" persistent max-width="600px">
        <v-card>
            <v-card-title>
                <span class="headline">Actualizar contraseña</span>
            </v-card-title>
            <v-card-text>
                <v-form ref="form" v-model="valid" lazy-validation>
                    <v-text-field v-model="currentPassword"
                        :append-icon="showCurrentPassword ? 'mdi-eye' : 'mdi-eye-off'"
                        :type="showCurrentPassword ? 'text' : 'password'" name="current-password" label="Clave Actual"
                        prepend-inner-icon="mdi-lock" @click:append="showCurrentPassword = !showCurrentPassword"
                        :rules="[rules.required]" variant="outlined" autocomplete="current-password"></v-text-field>

                    <v-text-field v-model="newPassword" :append-icon="showNewPassword ? 'mdi-eye' : 'mdi-eye-off'"
                        :type="showNewPassword ? 'text' : 'password'" name="new-password" label="Nueva Clave"
                        prepend-inner-icon="mdi-lock" @click:append="showNewPassword = !showNewPassword"
                        :rules="[rules.required, rules.password]" variant="outlined"
                        autocomplete="new-password"></v-text-field>

                    <v-text-field v-model="confirmPassword"
                        :append-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
                        :type="showConfirmPassword ? 'text' : 'password'" name="confirm-password"
                        label="Confirmar Clave" prepend-inner-icon="mdi-lock"
                        @click:append="showConfirmPassword = !showConfirmPassword"
                        :rules="[rules.required, rules.match]" variant="outlined"
                        autocomplete="new-password"></v-text-field>
                </v-form>
            </v-card-text>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" variant="elevated" @click="dialog = false">Cancelar</v-btn>
                <v-btn color="primary" variant="elevated" @click="ActualizarPassWord">Actualizar</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
    <Modal ref="modalRef"></Modal>
</template>
<script lang="ts" setup>
import { ref, Ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
//Stores
import { useClienteStore } from '../store/cliente.store'
import { useAuthStore } from '../store/auth.store'
//Functions
import { isValidEmail } from '../functions/functions'

//Modal
import AlertMessage from '../components/AlertMessage.vue'
import Modal from "../components/Modal.vue"
//Models
import TipoDocumentoModel from '../Models/TipoDocumentoModel'

//Definicion de Variables
const txtNombre = ref("")
const txtUserName = ref("")
const txtApellido = ref("")
const txtMail = ref("")
const txtMailConfirmacion = ref("")
const idTipoDocumento = ref(0)
const txtNroDocumento = ref(0)
const titulo = "Account"
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
const router = useRouter()

const alertRef = ref()
const modalRef = ref()

//////Modal Actualiza Pass //////
const dialog = ref(false)
const valid = ref(false)
const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

const rules = {
    required: (value: string) => !!value || 'Requerido.',
    password: (value: string) => {
        const minLength = /.{8,}/;
        const hasUpperCase = /[A-Z]/;
        const hasLowerCase = /[a-z]/;
        const hasNumber = /\d/;
        const hasSpecialChar = /[!#$%&=*]/;
        return (
            minLength.test(value) &&
            hasUpperCase.test(value) &&
            hasLowerCase.test(value) &&
            hasNumber.test(value) &&
            hasSpecialChar.test(value)
        ) || 'La clave debe tener mínimo 8 caracteres, 1 mayúscula, 1 minúscula, 1 número y 1 caracter especial (!#$%&=*)';
    },
    match: (value: string) => value === newPassword.value || 'Las contraseñas no coinciden.',
};

const ActualizarPassWord = async () => {
    if (valid.value) {
        try {

            procesando.value = true
            let response = await storeAuth.updatePassword(currentPassword.value, newPassword.value)
            procesando.value = false

            if (response.result == "ok") {
                dialog.value = false
                modalRef.value.ModalOkShow("Atención", response.message, false)

                // Reset form fields
                currentPassword.value = ''
                newPassword.value = ''
                confirmPassword.value = ''

            } else if (response.result == "NoAutorizado") {
                modalRef.value.ModalErrorShow("No Autorizado", response.message, false, LogoutNoAutorizado)
            } else {
                modalRef.value.ModalErrorShow("Atención", response.message, false)
            }

        } catch (error) {
            console.error('Error al actualizar la contraseña:', error)
        }
    }
}
const LogoutNoAutorizado = () => {
    const idSucursal = storeAuth.getIdSucursal()
    storeAuth.logout()
    router.push({ name: 'Login', params: { idSucursal: idSucursal } })
}

const OpenPasswordUpdate = () => {
    currentPassword.value = ''
    newPassword.value = ''
    confirmPassword.value = ''
    dialog.value = true

}

//////Modal Actualiza Pass //////

onMounted(async () => {
    let response = await storeAuth.getDatosUsuario()

    //modalLoaderRef.value.Close()
    procesando.value = false

    if (response.result == "ok") {
        console.log("user:",response.user)
        txtApellido.value = response.user.apellido
        txtNombre.value = response.user.nombre
        txtUserName.value = response.user.nombreUsuario
        alertRef.value.closeAlert()
    } else {
        console.log("result:",response.result)
        if(response.result == "NoAutorizado"){
            const idSucursal = storeAuth.getIdSucursal()
            storeAuth.logout()
            router.push({ name: 'Login', params: { idSucursal: idSucursal } })
        }
        alertRef.value.alertErrorShow("Login", response.message)
    }
    ListaTipoDocumento.value = await store.getAllTipoDocumento()
    idTipoDocumento.value = 1
})

const Guardar = async () => {

    if (validarDatos()) {
        procesando.value = true
        let idUsuario = storeAuth.getIdUserLogin()
        let response = await store.guardarCliente(txtNombre.value, txtApellido.value, txtMail.value, idTipoDocumento.value, txtNroDocumento.value, idUsuario)

        procesando.value = false

        if (response.result == "ok") {
            modalRef.value.ModalOkShow("Atención", response.message)
        } else {
            modalRef.value.ModalErrorShow("Atención", response.message)
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