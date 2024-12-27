<template>

    <v-sheet class="mx-auto" width="500">
        <v-row align="center" justify="center">
            <h3 class="classMaria mt-1">Login - {{ sucursal }}</h3>
        </v-row>
        <v-form v-if="isvalid">
            <v-container>
                <v-row>
                    <v-text-field v-model="txtUserName" type="string" label="User name" autocomplete="username"
                        placeholder="Username" variant="outlined" density="compact"
                        prepend-inner-icon="mdi-at"></v-text-field>
                </v-row>
                <v-row>
                    <v-text-field v-model="txtPassword" label="Password" placeholder="Password"
                        prepend-inner-icon="mdi-lock" :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                        :type="showPassword ? 'text' : 'password'" @click:append="showPassword = !showPassword"
                        variant="outlined" density="compact" autocomplete="new-password"></v-text-field>
                </v-row>
                <v-row align="center" justify="end">
                    <v-btn color="primary" variant="elevated" @click.prevent="Login">Login</v-btn>
                </v-row>
            </v-container>
        </v-form>
    </v-sheet>
    <v-row align="center" justify="center">
        <div style="max-width: 600px;" class="d-flex flex-row align-center justify-center mt-5">
            <AlertMessage ref="alertRef" />
        </div>
    </v-row>
    <ModalLoader ref="modalLoaderRef"></ModalLoader>
</template>
<script lang="ts" setup>
import { Ref, ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../store/auth.store'
// import router from '../router';
import AlertMessage from "../components/AlertMessage.vue"
import ModalLoader from '../components/ModalLoader.vue'
import { SucursalEnum } from "../Enum/SucursalEnum"

const txtUserName: Ref<string> = ref("")
const txtPassword: Ref<string> = ref("")
const sucursal = ref("")
const store = useAuthStore()
const isvalid = ref(false)

const route = useRoute()
const router = useRouter()
const alertRef = ref()
// const modalRef = ref()
const modalLoaderRef = ref()
const procesando = ref(false)
const showPassword = ref(false)

onMounted(async () => {
    await CargarDatos()
})

const Login = async () => {


    //procesar login
    try {
        procesando.value = true
        modalLoaderRef.value.Show()

        let response = await store.login(txtUserName.value, txtPassword.value)

        modalLoaderRef.value.Close()
        procesando.value = false

        if (response.result == "ok") {
            router.push({ name: 'Home' })
        } else {
            alertRef.value.alertErrorShow("Login", response.message)
        }

    } catch (error) {
        if (modalLoaderRef.value)
            modalLoaderRef.value.Close()
        procesando.value = false
        alertRef.value.alertErrorShow("Login", error)
    }finally{
        if (modalLoaderRef.value)
            modalLoaderRef.value.Close()
        procesando.value = false
    }
}
const CargarDatos = async () => {
    sucursal.value = "Error"
    if (route.params.idSucursal != null && route.params.idSucursal != undefined && route.params.idSucursal != '') {

        let idSucursalAux = 0
        try {
            idSucursalAux = parseInt(route.params.idSucursal.toString())
            isvalid.value = await store.isValidSucursal(idSucursalAux)
            if (isvalid.value) {
                switch (idSucursalAux) {
                    case SucursalEnum.camacua:
                        sucursal.value = "Camacua"
                        break;
                    case SucursalEnum.yerbal:
                        sucursal.value = "Yerbal"
                        break;
                    case SucursalEnum.testing:
                        sucursal.value = "testing"
                        break;
                    default:
                        sucursal.value = "Error de Configuracion de Sucursal"
                        alertRef.value.alertErrorShow("Error de configuración:", "Ocurrío un error al configurar la sucursal. Hable con el Equipo Tecnico.")
                        break;
                }

            } else {
                alertRef.value.alertErrorShow("Error de configuración:", "Ocurrío un error al configurar la sucursal. Hable con el Equipo Tecnico.")
            }
        }
        catch (e) {
            alertRef.value.alertErrorShow("Error de configuración:", "Ocurrío un error al configurar la sucursal. Hable con el Equipo Tecnico.")
        }

    } else {
        alertRef.value.alertErrorShow("Error de configuración:", "Ocurrío un error al configurar la sucursal. Hable con el Equipo Tecnico.")
    }
}

watch( () => route.params.idSucursal, async () => {
    await CargarDatos()
})

</script>

<style scoped>
.main {
    /* margin: 0; */
    display: flex;
    place-items: center;
    flex-direction: column;
    align-items: center;
}

.classMaria {
    font-family: 'MariaFont Sans';
    font-weight: 500;
    color: black;
}
</style>