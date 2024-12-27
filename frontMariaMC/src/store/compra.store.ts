// store/index.ts
import { defineStore } from 'pinia'
import CompraDeLoteItemModel from '../Models/CompraDeLoteItemModel'
import CompraMediosDepagoModel from '../Models/CompraMediosDepagoModel'
import TipoMediosDePagoModel from '../Models/TipoMediosDePagoModel'
// import DetalleItemsTicketModel from '../Models/DetalleItemsTicketModel'
// import { formatoMoneda, PaddingRightCadena, PaddingLeftCadena } from '../functions/functions'

export const useCompraStore = defineStore('compra.store', {
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
        async procesarCompra(idSucursal: number | null, listaDeProductos: Array<CompraDeLoteItemModel>,
            idCliente: number,
            listaMediosDePago: Array<CompraMediosDepagoModel>,
            totalEfectivo: number, totalCredito: number, idUsuario: number | null) {
            const uri = `${this.baseUrl}Compra/RealizarCompra`;
            try {
                const headersList = {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                };
                const nuevaListaProductos = listaDeProductos.map(item => {
                    return {
                        idCategoria: item.idCategoria,
                        idMarca: item.idMarca,
                        idTalle: item.idTalle,
                        // descripcion: item.description,
                        ValorCompra: item.valorPorc,
                        ValorCreditoEnTienda: item.valorPorcTienda,
                        ValorVentaSugerido: item.price
                    }
                })

                const nuevaListaMediosDePago = listaMediosDePago.map(item => {
                    return {
                        id: item.id,
                        total: item.total,
                    };
                })

                const bodyContent = JSON.stringify({
                    idSucursal: idSucursal,
                    listaDeProductos: nuevaListaProductos,
                    idCliente: idCliente,
                    listaMediosDePago: nuevaListaMediosDePago,
                    totalEfectivo: totalEfectivo,
                    totalCredito: totalCredito,
                    idUsuario: idUsuario,
                });
                console.log("bodyContent:",bodyContent)
                const rawResponse = await fetch(uri, {
                    method: "POST",
                    headers: headersList,
                    body: bodyContent,
                });
                //const rawResponse = await fetch('/DataMocap/ProcesamientoVenta.json');

                const response = await rawResponse.json()
                return response

            } catch (error) {
                console.log(error)
                return {
                    "result": "error",
                    "idVenta": -1,
                    "message": "Ocurrio un error al procesar la venta"
                }
            }
        },
        async getAllMediosDePagoCompra(): Promise<Array<TipoMediosDePagoModel>> {
            const uri = `${this.baseUrl}TipoFormaDePago/GetAllFormasDeCompra`;
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
    }
});
