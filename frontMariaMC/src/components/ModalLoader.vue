<template>
    <v-dialog v-model="modal" max-width="600px" persistent>
        <v-card>
            <v-card-title>
                <div class="d-flex flex-row align-center justify-center">
                    <v-progress-circular indeterminate color="primary"
                        :size="120"></v-progress-circular>
                    <div class="classMaria"  style="font-size: 32px;">{{ titulo }}</div>
                </div>
            </v-card-title>
            <v-card-text>
                <v-container>
                    <div class="mensaje">
                        {{ texto }}
                    </div>
                </v-container>
            </v-card-text>
        </v-card>
    </v-dialog>

</template>
<script lang="ts" setup>
import { ref} from 'vue'
const modal = ref()
const titulo = ref("")
const texto = ref("")

const Close = () => {
    modal.value =false
}

const Show = (title = "Procesando...", text: string): void => {
    titulo.value = title
    texto.value = text
    modal.value = true

}

defineExpose({ Close, Show });
</script>

<style>
.mensaje {
    white-space: pre-line;
    /* Esto permite que los saltos de línea se muestren correctamente */
}

.classMaria {
    font-family: 'MariaFont Sans';
    font-weight: 500;
    color: black;
}
</style>
