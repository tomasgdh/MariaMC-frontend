// store/index.ts
import { defineStore } from 'pinia'
//Model
import TipoTalleModel from '../Models/TipoTalleModel'
import TipoCategoriaProductoModel from '../Models/TipoCategoriaProductoModel'
import TipoMarcaModel from '../Models/TipoMarcaModel'
import TipoEstadoModel from '../Models/TipoEstadoModel'
import ProductoDTOModel from "../Models/ProductoDTOModel"

export const useProductoStore = defineStore('producto.store', {
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
        async searchItemToSell(id: string) {
            const uri = `${this.baseUrl}Producto/GetProductoToSell/${id}`;
            try {
                const headersList = {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                };

                const rawResponse = await fetch(uri, {
                    method: "GET",
                    headers: headersList,
                });
                // const rawResponse = await fetch('/DataMocap/itemventa.json');

                // const response = await rawResponse.json();
                // return response

                if (rawResponse.ok) { // Si la respuesta es exitosa (código de estado 200-299)
                    const response = await rawResponse.json();

                    if (response) {
                        return response; // Devuelve los datos
                    } else {
                        // TODO: Manejar respuesta exitosa con error de lógica (si es necesario)
                        console.error("Respuesta exitosa pero con error en la lógica:", response);
                        return { "result": "error", "item": [], "message": "Respuesta exitosa pero con error en la lógica: " + `${response}` }
                    }
                } else { // Si hay un error en la respuesta (código de estado fuera del rango 200-299)
                    console.error("Error en la solicitud:", rawResponse.status, rawResponse.statusText);
                    return { "result": "error", "item": [], "message": "Ocurrio un Error al buscar el item!" + `(Status: ${rawResponse.status}) - '${rawResponse.statusText}'` }
                }

            } catch (error) {
                console.log(error)
                return { "result": "error", "item": [], "message": "Ocurrio un Error al buscar el item!" }
            }
        },
        async searchItem(id: string) {
            const uri = `${this.baseUrl}Producto/GetProducto/${id}`;
            try {
                const headersList = {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                };

                const rawResponse = await fetch(uri, {
                    method: "GET",
                    headers: headersList,
                });
                // const rawResponse = await fetch('/DataMocap/itemventa.json');

                // const response = await rawResponse.json();
                // return response

                if (rawResponse.ok) { // Si la respuesta es exitosa (código de estado 200-299)
                    const response = await rawResponse.json();

                    if (response) {
                        return response; // Devuelve los datos
                    } else {
                        // TODO: Manejar respuesta exitosa con error de lógica (si es necesario)
                        console.error("Respuesta exitosa pero con error en la lógica:", response);
                        return { "result": "error", "item": [], "message": "Respuesta exitosa pero con error en la lógica: " + `${response}` }
                    }
                } else { // Si hay un error en la respuesta (código de estado fuera del rango 200-299)
                    console.error("Error en la solicitud:", rawResponse.status, rawResponse.statusText);
                    return { "result": "error", "item": [], "message": "Ocurrio un Error al buscar el item!" + `(Status: ${rawResponse.status}) - '${rawResponse.statusText}'` }
                }

            } catch (error) {
                console.log(error)
                return { "result": "error", "item": [], "message": "Ocurrio un Error al buscar el item!" }
            }
        },
        async getAllTalles(): Promise<Array<TipoTalleModel>> {
            const uri = `${this.baseUrl}TipoTalle/GetAllTalles`;
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
        async getAllCategoriasDeProducto(): Promise<Array<TipoCategoriaProductoModel>> {
            const uri = `${this.baseUrl}TipoProducto/GetAllTiposProducto`;
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
        async getAllMarcasProducto(): Promise<Array<TipoMarcaModel>> {
            const uri = `${this.baseUrl}TipoMarca/GetAllMarcas`;
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
        async getAllEstadosProducto(): Promise<Array<TipoEstadoModel>> {
            const uri = `${this.baseUrl}TipoEstado/GetAllEstados`;
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
        async CargaDeProductosPorArchivo(idUsuario: number | null, productos: Array<ProductoDTOModel>) {

            try {
                const uri = `${this.baseUrl}Producto/CargaDeProductosPorArchivo`;
                const headersList = {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                };
                const bodyContent = JSON.stringify({
                    IdUsuario: idUsuario,
                    Productos: productos
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
                    "message": "Ocurrio un error al procesar el Archivo de Productos"
                }
            }
        },
        async GuardarProducto(idUsuario: number | null, producto: ProductoDTOModel) {
            const uri = `${this.baseUrl}Producto/GuardarProducto`;
            try {
                const headersList = {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                };
                const bodyContent = JSON.stringify({
                    idUsuario: idUsuario,
                    producto: producto,
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
                    "message": "Ocurrio un error al guaradar el producto"
                }
            }
        },
        async GetAllProductosToPrint(){
            const uri = `${this.baseUrl}Producto/GetAllProductosToPrint`;
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
    }
});
