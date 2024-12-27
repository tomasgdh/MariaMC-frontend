// store/index.ts
import { defineStore } from 'pinia'

export const useCierreDeCajaStore = defineStore('cierreDeCaja.store', {
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
        async RealizarCierreDeCaja(idSucursal: number | null,idUsuario: number | null) {
            const uri = `${this.baseUrl}CierreDeCaja/RealizarCierreDeCaja`;
            try {
                const headersList = {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                };

                const bodyContent = JSON.stringify({
                    idSucursal: idSucursal,
                    idUsuario: idUsuario,
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
                    "idCierre": -1,
                    "message": "Ocurrio un error al procesar al Realizar el Cierre de Caja"
                }
            }
        },
        async RealizarCierreDeCajaX(idSucursal: number | null,idUsuario: number | null) {
            const uri = `${this.baseUrl}CierreDeCaja/RealizarCierreDeCajaX`;
            try {
                const headersList = {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                };

                const bodyContent = JSON.stringify({
                    idSucursal: idSucursal,
                    idUsuario: idUsuario,
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
                    "idCierre": -1,
                    "message": "Ocurrio un error al procesar al Realizar el Cierre de Caja X"
                }
            }
        },
        async GetCierreDeCaja(idCierre:number) {
            const uri = `${this.baseUrl}CierreDeCaja/GetCierreDeCaja?idCierre=${idCierre}`;
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
        async GetUltimoCierreDeCaja() {
            const uri = `${this.baseUrl}CierreDeCaja/GetUltimoCierreDeCaja`;
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
        async GetAllCierreDeCaja(idSucursal: number | null) {
            const uri = `${this.baseUrl}CierreDeCaja/GetAllCierreDeCaja?idSucursal=${idSucursal}`;
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
        async GetAllCierreDeCajaPaginado(idSucursal: number | null,pageNumber:number,pageSize:number) {
            const uri = `${this.baseUrl}CierreDeCaja/GetAllCierreDeCajaPaginado?idSucursal=${idSucursal}&pageNumber=${pageNumber}&pageSize=${pageSize}`;
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
        }
    }
});
