<template>
    <div class="clock">
      {{ currentTime }}
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, onUnmounted } from 'vue';
  import moment from 'moment';
  
  const currentTime = ref(getFormattedTime());
  
  function getFormattedTime() {
    return moment().format('HH:mm:ss');
  }
  
  const updateClock = () => {
    currentTime.value = getFormattedTime();
  };
  
  onMounted(() => {
    // Actualiza el reloj cada segundo
    const intervalId = setInterval(updateClock, 1000);
  
    // Limpia el intervalo cuando el componente se desmonta
    onUnmounted(() => {
      clearInterval(intervalId);
    });
  });
  </script>
  
  <style scoped>
  .clock {
    font-size: 1.2em;
    font-weight: bold;
    padding: 5px;
    background-color: rgb(238, 238, 238);
    color: black;
    border-radius: 8px;
    display: inline-block;
    width: 100%;
    
    display: flex;
    flex-wrap: nowrap;
    align-content: center;
    justify-content: center;
    align-items: center;

  }
  </style>
  