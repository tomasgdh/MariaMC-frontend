<template>
    <v-dialog v-model="modal" max-width="600px" persistent>
        <v-card>
            <v-card-title>
                <div class="d-flex flex-row align-center justify-center">
                    <v-icon :color="iconVariant" style="font-size: 64px;font-weight: 100;">{{ icon }}</v-icon>
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

            <v-card-actions>
                <v-spacer></v-spacer>                
                <v-btn v-if="btnCancelar" color="primary" variant="elevated" @click.prevent="handleModalCancelar">
                    Cancelar
                </v-btn>
                <v-btn ref="btnItemOk" color="primary" variant="elevated" @click.prevent="handleModalOk">
                    Aceptar
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

</template>
<script lang="ts" setup>
import { ref, Ref,nextTick } from 'vue'
const modal = ref()
const iconVariant = ref("")
const icon = ref("")
const titulo = ref("")
const texto = ref("")
const btnItemOk = ref()
const btnCancelar = ref(false)

const modalCallback: Ref<Function | null> = ref(null); // Almacena la función de callback
const modalCallbackParams = ref([]); // Almacena los parámetros para la función de callback

const handleModalCancelar = () => {
    modal.value =false
}

const handleModalOk = () => {
    modal.value = false
    const callback = modalCallback.value
    const params = modalCallbackParams.value
    if (typeof callback === 'function') {
        callback(...params); // Ejecuta la función de callback con los parámetros
    }
    modalCallback.value = null
    modalCallbackParams.value = []
}

const ModalErrorShow = (title = "Error", text: string, btnCancel = false, callback: Function | null = null, params = []): void => {
    iconVariant.value = "error"
    icon.value = "mdi-close-circle-outline"
    titulo.value = title
    texto.value = text
    btnCancelar.value = btnCancel
    modalCallback.value = callback;
    modalCallbackParams.value = params;
    modal.value = true
    focusBotonOk()
}

const ModalWarningShow = (title = "Atención", text: string, btnCancel = false, callback: Function | null = null, params = []): void => {
    iconVariant.value = "warning"
    icon.value = "mdi-alert-outline"
    titulo.value = title
    texto.value = text
    btnCancelar.value = btnCancel
    modalCallback.value = callback;
    modalCallbackParams.value = params;

    modal.value = true
    focusBotonOk()
}

const ModalInfoShow = (title = "Información", text: string, btnCancel = false, callback: Function | null = null, params = []): void => {
    iconVariant.value = "info"
    icon.value = "mdi-alert-circle-outline"
    titulo.value = title
    texto.value = text
    btnCancelar.value = btnCancel
    modalCallback.value = callback;
    modalCallbackParams.value = params;

    modal.value = true
    focusBotonOk()
    
}

const ModalOkShow = (title: string, text: string, btnCancel = false, callback: Function | null = null, params = []): void => {
    iconVariant.value = "success"
    icon.value = "mdi-check-circle-outline"
    titulo.value = title
    texto.value = text
    btnCancelar.value = btnCancel
    modalCallback.value = callback;
    modalCallbackParams.value = params;

    modal.value = true
    focusBotonOk()
}

const focusBotonOk = () => {
    nextTick(() => {
            if (btnItemOk.value && document.activeElement !== btnItemOk.value.$el) {
                btnItemOk.value.$el.focus();
            }
        })
}

defineExpose({ ModalErrorShow, ModalOkShow, ModalWarningShow, ModalInfoShow });
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
