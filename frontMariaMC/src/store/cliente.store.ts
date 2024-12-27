// store/index.ts
import { defineStore } from 'pinia'
import ClienteVentaModel from '../Models/ClienteVentaModel'
import TipoDocumentoModel from '../Models/TipoDocumentoModel'

export const useClienteStore = defineStore('cliente.store', {
    //SETTERS
    state: () => {
        return {
            baseUrl: window.VITE_APP_BASE_URL_API,
            clienteSeleccionVenta: new ClienteVentaModel()
        };
    },
    //GETTERS
    getters: {
        //selectedClass: (state) => state.treeViewSelectedItem * 2,
    },
    //ACTIONS

    actions: {
        SetClienteSeleccionVenta(cliente: ClienteVentaModel){
            this.clienteSeleccionVenta = cliente
        },
        getClienteSeleccionVenta(){
            return this.clienteSeleccionVenta
        },
        async searchCliente(busqueda: string) {
            const uri = `${this.baseUrl}Cliente/GetCliente/${busqueda}`;
            try {
                const headersList = {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                };

                const rawResponse = await fetch(uri, {
                    method: "GET",
                    headers: headersList,
                });

                if (rawResponse.ok) { // Si la respuesta es exitosa (código de estado 200-299)
                    const response = await rawResponse.json();

                    if (response) {
                        return response; // Devuelve los datos
                    } else {
                        // TODO: Manejar respuesta exitosa con error de lógica (si es necesario)
                        console.error("Respuesta exitosa pero con error en la lógica:", response);
                        return [];
                    }
                } else { // Si hay un error en la respuesta (código de estado fuera del rango 200-299)
                    console.error("Error en la solicitud:", rawResponse.status, rawResponse.statusText);
                    return []; // Devuelve un array vacío u otro valor por defecto según sea necesario
                }

            } catch (error) {
                console.log(error)
                return { "result": "error", "item": [], "mensaje": "Ocurrio un Error al buscar el Cliente!" }
            }
        },
        async getAllTipoDocumento(): Promise<Array<TipoDocumentoModel>> {
            const uri = `${this.baseUrl}TiposDocumento/GetAllTipoDocumento`;
            try {
                const headersList = {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                };

                const rawResponse = await fetch(uri, {
                    method: "GET",
                    headers: headersList,
                });
                //const rawResponse = await fetch('/DataMocap/TipoCategoriaProdcuto.json');

                if (rawResponse.ok) { // Si la respuesta es exitosa (código de estado 200-299)
                    const response = await rawResponse.json();

                    if (response) {
                        return response; // Devuelve los datos
                    } else {
                        // TODO: Manejar respuesta exitosa con error de lógica (si es necesario)
                        console.error("Respuesta exitosa pero con error en la lógica:", response);
                        return [];
                    }
                } else { // Si hay un error en la respuesta (código de estado fuera del rango 200-299)
                    console.error("Error en la solicitud:", rawResponse.status, rawResponse.statusText);
                    return []; // Devuelve un array vacío u otro valor por defecto según sea necesario
                }
            } catch (error) {
                console.log(error)
                return []
            }
        },
        async guardarCliente(nombre:string, apellido:string, mail:string,idTipoDocu:number, nroDocumento:number,idUsuario:number | null) {
            const uri = `${this.baseUrl}Cliente/Add`;
            try {
                const headersList = {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                };

                const bodyContent = JSON.stringify({
                    nombre: nombre,
                    apellido: apellido,
                    mail: mail,
                    idTipoDocumento: idTipoDocu,
                    nroDocumento: nroDocumento,
                    idUsuario:idUsuario
                });
                const rawResponse = await fetch(uri, {
                    method: "POST",
                    headers: headersList,
                    body: bodyContent,
                });

                const response = await rawResponse.json()
                return response

            } catch (error) {
                console.log(error)
                return {
                    "result": "error",
                    "idCliente": -1,
                    "message": "Ocurrio un error al guardar el Cliente"
                }
            }
        },
    }
});
