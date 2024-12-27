<template>
    <div class="notFound">
      <h1>Página no encontrada</h1>
      <p>Redirigiendo en {{ counter }} segundos...</p>
    </div>
  </template>

<script lang="ts" setup>

import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../store/auth.store'

const counter = ref(5)
const router = useRouter()
const store = useAuthStore()


onMounted(() => {
  const interval = setInterval(() => {
    if (counter.value > 0) {
      counter.value -= 1;
    }
  }, 1000);

  setTimeout(() => {
    clearInterval(interval);
    store.initializeAuthState()
    const idSucursal = store.getIdSucursal()
    console.log("LogAout por NotFound")
    store.logout()
    router.push({ name: 'Login', params: { idSucursal: idSucursal } })
  }, 5000);
});

</script>

  
  <style  scoped>
  h3 {
    margin: 40px 0 0;
  }
  ul {
    list-style-type: none;
    padding: 0;
  }
  li {
    display: inline-block;
    margin: 0 10px;
  }
  a {
    color: #42b983;
  }
  .notFound {
    text-align: center;
    color: #2c3e50;
    margin-top: 10px;
  }
  </style>