<template>
    <v-btn block variant="outlined" title="Salir" prepend-icon="mdi-logout" color="primary" @click.prevent="Logout"></v-btn>
</template>
<script lang="ts" setup>
import { useAuthStore } from '../store/auth.store'
import router from '../router';

const store = useAuthStore()
const idSucursal = store.getIdSucursal()

const Logout = () => {
    store.logout()
    router.push({ name: 'Login', params: { idSucursal: idSucursal } })
}
</script>

<style scoped></style>