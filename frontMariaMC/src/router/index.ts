import { createRouter, createWebHashHistory } from "vue-router"
import { useAuthStore } from '../store/auth.store'

import NotFound from '../Pages/NotFound.vue'
import HomePage from '../Pages/HomePage.vue'
import AbmClientesPage from '../Pages/ABMClientesPage.vue'
import AbmUsuariosPage from '../Pages/ABMUsuariosPage.vue'
import ReportPage from '../Pages/ReportPage.vue'
import AccountPage from '../Pages/AccountPage.vue'
import VentaPage from '../Pages/VentaPage.vue'
import VentasListadoPage from '../Pages/VentasListadoPage.vue'
import CierreDeCajaPage from '../Pages/CierreDeCajaPage.vue'
import CierreDeCajaDetallePage from '../Pages/CierreDeCajaDetallePage.vue'
import CierreDeCajaListadoPage from '../Pages/CierreDeCajaListadoPage.vue'
import MovimientosPage from '../Pages/MovimientosPage.vue'
import CargarProductosXLSPage from '../Pages/CargarProductosXLSPage.vue'
import UpdateProdutoPage from '../Pages/UpdateProdutoPage.vue'
import PrintBarCodePage from '../Pages/PrintBarCodePage.vue'
import CompraDeLotesPage from '../Pages/CompraDeLotesPage.vue'
import TablasBasicasPage from '../Pages/TablasBasicasPage.vue'
import LoginPage from '../Pages/LoginPage.vue'

const routes = [
  { path: '/', redirect: redirectToLogin },
  //Login
  { path: "/Login/:idSucursal", name: "Login", component: LoginPage, meta: { title: "Login" } },
  //Home
  { path: "/Home", name: "Home", component: HomePage, meta: { title: "Home", requiresAuth: true } },

  //CAJA
  { path: "/Cierre", name: "CierreDeCaja", component: CierreDeCajaPage, meta: { title: "Cierre", requiresAuth: true } },
  { path: "/CierreDetalle/:idCierre", name: "CierreDeCajaDetalle", component: CierreDeCajaDetallePage, meta: { title: "Cierre", requiresAuth: true } },
  { path: "/CierreList", name: "CierreDeCajaListado", component: CierreDeCajaListadoPage, meta: { title: "Cierre", requiresAuth: true } },
  { path: "/AddMovimientos/:nombreTabla", name: "AddMovimientos", component: MovimientosPage, meta: { title: "Add Movimientos", requiresAuth: true } },


  { path: "/CargaDeProductos", name: "CargaDeProductosPorArchivo", component: CargarProductosXLSPage, meta: { title: "Cargar Productos", requiresAuth: true } },
  { path: "/UpdateProduto", name: "UpdateProduto", component: UpdateProdutoPage, meta: { title: "Update Producto", requiresAuth: true } },
  { path: "/PrintBarCode", name: "PrintBarCode", component: PrintBarCodePage, meta: { title: "Impresion de Etiquetas", requiresAuth: true } },

  { path: "/Venta", name: "Venta", component: VentaPage, meta: { title: "Venta", requiresAuth: true,requiresAccess:["A"] } },
  { path: "/VentasListado", name: "VentasListado", component: VentasListadoPage, meta: { title: "Ventas", requiresAuth: true,requiresAccess:["A"] } },

  { path: "/CompraDeLotes", name: "CompraDeLotes", component: CompraDeLotesPage, meta: { title: "Compra de lotes", requiresAuth: true } },

  //ABMs
  { path: "/ABM-Cliente", name: "ABM-Cliente", component: AbmClientesPage, meta: { title: "ABM Clientes", requiresAuth: true } },
  { path: "/ABM-Usuario", name: "ABM-Usuario", component: AbmUsuariosPage, meta: { title: "ABM usuarios", requiresAuth: true } },
  { path: "/Account", name: "Account", component: AccountPage, meta: { title: "Account", requiresAuth: true } },

  //Tablas Basicas
  { path: "/TablasBasicas/:nombreTabla", name: "TablasBasicas", component: TablasBasicasPage, meta: { title: "Tablas Basicas", requiresAuth: true } },

  //Reportes
  { path: "/Report", name: "Report", component: ReportPage, meta: { title: "Report", requiresAuth: true } },

  //Errores
  { path: "/notfound", name: "NotFound", component: NotFound, meta: { title: "NotFound" } },
  { path: "/:pathMatch(.*)*", name: "not-found", component: NotFound },
  { path: "/:pathMatch(.*)", name: "bad-not-found", component: NotFound },
];

const router = createRouter({
  history: createWebHashHistory(import.meta.env.VITE_APP_BASE_URL),
  routes,
});
router.afterEach((to) => {
  document.title = `${to.meta.title}`;
  window.scrollTo(0, 0);
});

router.beforeEach((to, from, next) => {
  const store = useAuthStore()
  console.log("1 - isAuthenticated",store.isAuthenticated)
    // Inicializar el estado si es necesario
    if (!store.isAuthenticated) {
      store.initializeAuthState();
    }
  const isAuthenticated = store.isAuthenticated;
  const requiresAuth = to.meta.requiresAuth?? false;
  const requiresAccess: any = to.meta.requiresAccess?? false;
  // Verificar si la ruta requiere autenticación
  console.log("requiresAuth",requiresAuth)
  console.log("requiresAccess",requiresAccess)
  console.log("isAuthenticated",isAuthenticated)
  console.log("2 - isAuthenticated",store.isAuthenticated)
  console.log("requiresAuth && !isAuthenticated",requiresAuth && !isAuthenticated)
  if (requiresAuth && !isAuthenticated) {
    console.log("redirige login")
    next({ name: 'Login', params: { idSucursal: store.getIdSucursal() } });
  } 
  // Verificar si la ruta requiere ciertos accesos
  else if (requiresAccess) {
    const userRole = store.user?.userRole;
    const hasAccess = requiresAccess.some((role: string) => userRole?.includes(role));

    if (!hasAccess) {
      console.log("no tiene acceso")
      next({ name: 'Home' });
    } else {
      next();
    }
  } else {
    next();
  }
})

function redirectToLogin() {

  const store = useAuthStore()

    // Inicializar el estado si es necesario
    if (!store.isAuthenticated) {
      store.initializeAuthState();
    }

  if(store.isAuthenticated){
    return { name: "Home" }
  }
  else{
    const idSucursal = store.getIdSucursal();
    return { name: "Login", params: { idSucursal: idSucursal } };
  }

}

export default router;
