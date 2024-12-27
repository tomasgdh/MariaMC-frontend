<template>
    <div :style="{ 'white-space': 'pre-line' }">
    <v-alert v-if="visibilidad" :variant="variant" :border="border" :type="type" :closable="closable"
        :title="title"
        :text="text"
        @click:close="closeAlert">
    </v-alert>
</div>
</template>
<script lang="ts" setup>
import { ref,Ref  } from "vue"

const visibilidad = ref(false)
const text:Ref< string | undefined> = ref("")
const title:Ref< string | undefined> = ref("")
const variant:Ref<"flat" | "text" | "elevated" | "tonal" | "outlined" | "plain"> = ref("tonal")
const border:Ref<boolean | "end" | "start" | "top" | "bottom" | undefined> = ref("start")
const type:Ref< "error" | "success" | "warning" | "info" | undefined> = ref("error")
const closable = ref(true)

const closeAlert = () => {
    visibilidad.value = false
    text.value = ""
}
const alertErrorShow = (titulo: string, texto: string): void => {
    variant.value = "tonal"
    border.value = "start"
    type.value = "error"
    title.value = titulo
    text.value = texto
    visibilidad.value = true
}
defineExpose({alertErrorShow,closeAlert})
</script>

<style scoped></style>