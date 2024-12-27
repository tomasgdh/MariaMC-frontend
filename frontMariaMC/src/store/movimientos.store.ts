// store/index.ts
import { defineStore } from 'pinia'
//Models
import ItemMovimientoModel from "../Models/ItemMovimientoModel"

export const useMovimientosStore = defineStore('movimientos.store', {
    //SETTERS
    state: () => {
        return {
            baseUrl: window.VITE_APP_BASE_URL_API,
        };
    },
    //GETTERS
    getters: {
        //selectedClass: (state) => state.treeViewSelectedItem * 2,
    },
    //ACTIONS

    actions: {
        async GetAll(nombreTabla: string,idSucursal:number | null) {
            const uri = `${this.baseUrl}${nombreTabla}/GetAll?idSucursal=${idSucursal}`;
            try {
                const headersList = {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                };
                const rawResponse = await fetch(uri, {
                    method: "GET",
                    headers: headersList,
                });
                // const rawResponse = await fetch('/DataMocap/TipoTalles.json');

                if (rawResponse.ok) { // Si la respuesta es exitosa (código de estado 200-299)
                    const response = await rawResponse.json();

                    if (response) {
                        return response; // Devuelve los datos
                    } else {
                        // TODO: Manejar respuesta exitosa con error de lógica (si es necesario)
                        console.error("Respuesta exitosa pero con error en la lógica:", response);
                        return {
                            "result": "error",
                            "message": "Respuesta exitosa pero con error en la lógica. "
                        }
                    }
                } else { // Si hay un error en la respuesta (código de estado fuera del rango 200-299)
                    console.error("Error en la solicitud:", rawResponse.status, rawResponse.statusText);
                    return {
                        "result": "error",
                        "message": "Error en la solicitud: (status: "+rawResponse.status+") statusText: " + rawResponse.statusText
                    }
                }
            } catch (error) {
                console.log(error)
                return {
                    "result": "error",
                    "message": "Ocurrio un error en el GetAll, nombreTabla: " +nombreTabla +". Error: " + error
                }
            }
        },
        async GetAllTipoMovimientos(nombreTabla: string) {
            const uri = `${this.baseUrl}Tipo${nombreTabla}/GetAllActivos`;
            try {
                const headersList = {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                };
                const rawResponse = await fetch(uri, {
                    method: "GET",
                    headers: headersList,
                });
                // const rawResponse = await fetch('/DataMocap/TipoTalles.json');

                if (rawResponse.ok) { // Si la respuesta es exitosa (código de estado 200-299)
                    const response = await rawResponse.json();

                    if (response) {
                        return response; // Devuelve los datos
                    } else {
                        // TODO: Manejar respuesta exitosa con error de lógica (si es necesario)
                        console.error("Respuesta exitosa pero con error en la lógica:", response);
                        return {
                            "result": "error",
                            "message": "Respuesta exitosa pero con error en la lógica. "
                        }
                    }
                } else { // Si hay un error en la respuesta (código de estado fuera del rango 200-299)
                    console.error("Error en la solicitud:", rawResponse.status, rawResponse.statusText);
                    return {
                        "result": "error",
                        "message": "Error en la solicitud: (status: "+rawResponse.status+") statusText: " + rawResponse.statusText
                    }
                }
            } catch (error) {
                console.log(error)
                return {
                    "result": "error",
                    "message": "Ocurrio un error en el GetAll, nombreTabla: " +nombreTabla +". Error: " + error
                }
            }
        },
        async GetAllPaginado(nombreTabla:string,idSucursal: number | null,pageNumber:number,pageSize:number) {
            const uri = `${this.baseUrl}${nombreTabla}/GetAllPaginado?idSucursal=${idSucursal}&pageNumber=${pageNumber}&pageSize=${pageSize}`;
            try { 
                const headersList = {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                };
                const rawResponse = await fetch(uri, {
                    method: "GET",
                    headers: headersList,
                });
                // const rawResponse = await fetch('/DataMocap/TipoTalles.json');

                if (rawResponse.ok) { // Si la respuesta es exitosa (código de estado 200-299)
                    const response = await rawResponse.json();

                    if (response) {
                        return response; // Devuelve los datos
                    } else {
                        // TODO: Manejar respuesta exitosa con error de lógica (si es necesario)
                        console.error("Respuesta exitosa pero con error en la lógica:", response);
                        return {
                            "result": "error",
                            "message": "Respuesta exitosa pero con error en la lógica. "
                        }
                    }
                } else { // Si hay un error en la respuesta (código de estado fuera del rango 200-299)
                    console.error("Error en la solicitud:", rawResponse.status, rawResponse.statusText);
                    return {
                        "result": "error",
                        "message": "Error en la solicitud: (status: "+rawResponse.status+") statusText: " + rawResponse.statusText
                    }
                }
            } catch (error) {
                console.log(error)
                return {
                    "result": "error",
                    "message": "Ocurrio un error en el GetAll, nombreTabla: " +nombreTabla +". Error: " + error
                }
            }
        },
        async Add(nombreTabla:string,item: ItemMovimientoModel,idSucursal: number | null,idUsuario: number | null) {
            const uri = `${this.baseUrl}${nombreTabla}/Add`;
            try {
                const headersList = {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                };
                const bodyContent = JSON.stringify({
                    idSucursal:idSucursal,
                    descripcion: item.descripcion,
                    idTipoFormaDePago: item.idTipoFormaDePago,
                    idTipoMovimiento: item.idTipoMovimiento,
                    importe: item.importe,
                    idUsuario,
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
                    "message": "Ocurrio un error al Agregar el Item"
                }
            }
        },
        async Update(nombreTabla:string,item: ItemMovimientoModel,idUsuario: number | null) {
            const uri = `${this.baseUrl}${nombreTabla}/Update`;
            try {
                const headersList = {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                };
                const bodyContent = JSON.stringify({
                    id: item.id,
                    descripcion: item.descripcion,
                    idTipoFormaDePago: item.idTipoFormaDePago,
                    idTipoMovimiento: item.idTipoMovimiento,
                    importe: item.importe,
                    idUsuario,
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
                    "message": "Ocurrio un error al Actualizar el Item"
                }
            }
        },
        async Delete(nombreTabla:string,idItem: number,idUsuario: number | null) {
            const uri = `${this.baseUrl}${nombreTabla}/Delete`;
            try {
                const headersList = {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                };
                const bodyContent = JSON.stringify({
                    id: idItem,
                    idUsuario,
                });
                const rawResponse = await fetch(uri, {
                    method: "DELETE",
                    headers: headersList,
                    body: bodyContent,
                });
                const response = await rawResponse.json()
                return response

            } catch (error) {
                console.log(error)
                return {
                    "result": "error",
                    "message": "Ocurrio un error al Actualizar el Item"
                }
            }
        },
    }
});
