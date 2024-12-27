<template>
  <!-- <h3 v-if="isTest" style="color:blue; text-align: center;"> {{ compilacion }}</h3> -->
  <v-app>
    <v-navigation-drawer v-model="drawer" :rail="rail" permanent @click="rail = false" v-if="isAuthenticated">
      <!-- <v-img src="/NombreMaria.png" height="40px"></v-img> -->
      <label v-if="!rail" class="classMaria d-flex flex-column align-center justify-center"
        style="font-size: 3rem ; ">Maria</label>
      <label v-else class="classMaria d-flex flex-column align-center justify-center"
        style="font-size: 1rem ; ">Maria</label>
        <label class="classMaria d-flex flex-column align-center justify-center"
        style="font-size: 1.5rem ; ">{{ !rail? nombreSucLargo : nombreSucCorto }}</label>
      <v-list-item :prepend-avatar="urlAvatar" :title="userName"
      @click="navigateTo('Account')" nav>
        <template v-slot:append>
          <v-btn icon="mdi-chevron-left" variant="text" @click.stop="rail = !rail"></v-btn>
        </template>
      </v-list-item>

      <v-divider></v-divider>
      <v-list density="compact" nav>
        <v-list-item prepend-icon="mdi-tag-outline" title="Nueva Venta" value="venta"
          @click="navigateTo('Venta')"></v-list-item>
        <v-list-item prepend-icon="mdi-cart-arrow-right" title="Compra de lote" value="CompraDeLotes"
          @click="navigateTo('CompraDeLotes')"></v-list-item>
        <v-list-group prepend-icon="mdi-table-cog" :class="styleItem" title="Tablas Básicas">
          <template v-slot:activator="{ props }">
            <v-list-item v-bind="props"></v-list-item>
          </template>
          <v-list-item prepend-icon="mdi-account-group" title="Clientes" value="Clientes"
            @click="navigateTo('ABM-Cliente')"></v-list-item>
          <v-list-item prepend-icon="mdi-account-circle-outline" title="Usuarios" value="Usuarios"
            @click="navigateTo('ABM-Usuario')"></v-list-item>
          <v-list-item prepend-icon="mdi-cog-outline" title="ABM - Categoria" value="TipoProducto"
            @click="navigateToTB('TablasBasicas', 'TipoProducto')"></v-list-item>
          <v-list-item prepend-icon="mdi-cog-outline" title="ABM - Esatdo" value="TipoEstado"
            @click="navigateToTB('TablasBasicas', 'TipoEstado')"></v-list-item>
          <v-list-item prepend-icon="mdi-cog-outline" title="ABM - TipoFormaDePago" value="TipoFormaDePago"
            @click="navigateToTB('TablasBasicas', 'TipoFormaDePago')"></v-list-item>
          <v-list-item prepend-icon="mdi-cog-outline" title="ABM - TiposDocumento" value="TiposDocumento"
            @click="navigateToTB('TablasBasicas', 'TiposDocumento')"></v-list-item>
          <v-list-item prepend-icon="mdi-cog-outline" title="ABM - TipoGasto" value="TipoGasto"
            @click="navigateToTB('TablasBasicas', 'TipoGasto')"></v-list-item>
          <v-list-item prepend-icon="mdi-cog-outline" title="ABM - TipoIngreso" value="TipoIngreso"
            @click="navigateToTB('TablasBasicas', 'TipoIngreso')"></v-list-item>
          <v-list-item prepend-icon="mdi-cog-outline" title="ABM - Marca" value="TipoMarca"
            @click="navigateToTB('TablasBasicas', 'TipoMarca')"></v-list-item>
          <v-list-item prepend-icon="mdi-cog-outline" title="ABM - Talle" value="TipoTalle"
            @click="navigateToTB('TablasBasicas', 'TipoTalle')"></v-list-item>
        </v-list-group>
        <v-list-group prepend-icon="mdi-finance" :class="styleItem" title="T. Administrativas">
          <!-- <v-list-group prepend-icon="mdi-finance" :class="styleItem" title="Tareas Administrativas"> -->
          <template v-slot:activator="{ props }">
            <v-list-item v-bind="props"></v-list-item>
          </template>
          <v-list-item prepend-icon="mdi-cash-register" title="Cierre de Caja" value="CierreDeCaja"
            @click="navigateTo('CierreDeCaja')"></v-list-item>
          <v-list-item prepend-icon="mdi-chart-bar" title="Cierre de caja listado" value="CierreDeCajaListado"
            @click="navigateTo('CierreDeCajaListado')"></v-list-item>
          <v-list-group prepend-icon="mdi-cash-multiple" :class="styleItem" title="Mov. Caja">
            <template v-slot:activator="{ props }">
              <v-list-item v-bind="props"></v-list-item>
            </template>
            <v-list-item prepend-icon="mdi-cash" title="Add Gasto" value="Gasto"
              @click="navigateToTB('AddMovimientos','Gasto')"></v-list-item>
            <v-list-item prepend-icon="mdi-cash" title="Add Ingreso" value="Ingreso"
              @click="navigateToTB('AddMovimientos','Ingreso')"></v-list-item>
          </v-list-group>
          <v-list-item prepend-icon="mdi-file-excel" title="Cargar Productos" value="CargaDeProductosPorArchivo"
            @click="navigateTo('CargaDeProductosPorArchivo')"></v-list-item>
          <v-list-item prepend-icon="mdi-tag-outline" title="Ventas" value="VentasListado"
            @click="navigateTo('VentasListado')"></v-list-item>
          <v-list-item prepend-icon="mdi-update" title="Update Producto" value="UpdateProduto"
            @click="navigateTo('UpdateProduto')"></v-list-item>
          <v-list-item prepend-icon="mdi-barcode-scan" title="Print BarCode" value="PrintBarCode"
            @click="navigateTo('PrintBarCode')"></v-list-item>
        </v-list-group>
        <v-list-item prepend-icon="mdi-chart-bar" title="Reportes" value="reportes"
          @click="navigateTo('Report')"></v-list-item>
      </v-list>
      <template v-slot:append>
        <div class="pa-2" v-if="!rail">
          <Clock />
        </div>
        <div class="pa-2">
          <BtnLogOut />
        </div>
      </template>
    </v-navigation-drawer>
    <v-main>
      <!-- <v-main style="height: 250px"> -->
      <div class="main">
        <!-- <router-view v-slot="{ Component }">
          <transition-group name="page" mode="out-in" key="transitionGroup">
            <div :key="Component as any">
              <component :is="Component" />
            </div>

          </transition-group>
        </router-view> -->

        <router-view></router-view>
      </div>
    </v-main>
  </v-app>


</template>

<script setup lang="ts">
import { ref, computed,watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from './store/auth.store';

import Clock from './components/Clock.vue'
import BtnLogOut from './components/btnLogOut.vue'
import { SucursalEnum } from './Enum/SucursalEnum';

const drawer = ref(true); // Variable para controlar el estado del drawer
const rail = ref(false); // Variable para controlar el rail (barra lateral)

const router = useRouter()
const authStore = useAuthStore()

const nombreSucLargo = ref("")
const nombreSucCorto = ref("")

const navigateTo = (nameRoute: string): void => {
  router.push({ name: nameRoute });
}
const navigateToTB = (nameRoute: string, nombreTabla: string): void => {
  router.push({ name: nameRoute, params: { nombreTabla: nombreTabla } })
}

const styleItem = computed(() => {
  return rail.value ? "" : "styleItem"
})

const isAuthenticated = computed(() => {
  return authStore.isAuthenticated ?? false
})
const userName = computed(() => {
  return authStore.user?.nombreCompleto
})
const urlAvatar = computed(() => {
  return authStore.user?.urlPortrait
})

watch(() => authStore.isAuthenticated, () => {
  calcularNombreSucursal()
});
const calcularNombreSucursal = () => {

  switch (authStore.getIdSucursal()) {
    case SucursalEnum.camacua:
      nombreSucLargo.value = "Camacua"
      nombreSucCorto.value = "C"
      break;
    case SucursalEnum.yerbal:
      nombreSucLargo.value = "Yerbal"
      nombreSucCorto.value = "Y"
      break;

    default:
      nombreSucLargo.value = ""
      nombreSucCorto.value = ""
      break;
  }
}

</script>

<style scoped>
.main {
  margin: 5px;
  /* display: flex; */
  /* place-items: center; */
  /* flex-direction: column; */
  align-items: center;
}

.classMaria {
  font-family: 'MariaFont Sans';
  font-weight: 500;
  color: black;
}

:deep(.v-list-group) {
  --prepend-width: 0px;
  --list-indent-size: 0px;
}

:deep(.v-list-item__prepend > .v-icon ~ .v-list-item__spacer) {
  width: 5px;
}

:deep(.v-list-item--nav .v-list-item-title) {
  line-height: initial;
}

.styleItem {
  --prepend-width: 10px;
  --list-indent-size: 8px;
}
</style>
