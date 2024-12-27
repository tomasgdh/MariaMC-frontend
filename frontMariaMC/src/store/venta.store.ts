// store/index.ts
import { defineStore } from 'pinia'
import ItemVentaModel from '../Models/VentaItemModel'
import VentaMediosDepagoModel from '../Models/VentaMediosDepagoModel'
import TipoMediosDePagoModel from '../Models/TipoMediosDePagoModel'
import DetalleItemsTicketModel from '../Models/DetalleItemsTicketModel'
import { formatoMoneda, PaddingRightCadena, PaddingLeftCadena } from '../functions/functions'

export const useVentaStore = defineStore('venta.store', {
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
        async procesarVenta(idSucursal: number | null, listaDeProductos: Array<ItemVentaModel>,
            idCliente: number,
            listaMediosDePago: Array<VentaMediosDepagoModel>,
            subtotal: number, descuento: number, total: number, idUsuario: number | null) {
            const uri = `${this.baseUrl}Venta/RealizarVenta`;
            try {
                const headersList = {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                };
                const nuevaListaProductos = listaDeProductos.map(item => {
                    return {
                        id: item.id,
                        price: item.price
                    }
                })

                const nuevaListaMediosDePago = listaMediosDePago.map(item => {
                    return {
                        id: item.id,
                        descuento: item.descuentoValor,
                        subTotal: item.subTotal,
                        total: item.total,
                    };
                })

                const bodyContent = JSON.stringify({
                    idSucursal: idSucursal,
                    listaDeProductos: nuevaListaProductos,
                    idCliente: idCliente,
                    listaMediosDePago: nuevaListaMediosDePago,
                    subtotal: subtotal,
                    descuento: descuento,
                    total: total,
                    idUsuario: idUsuario,
                });
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
        async EnviarMailVenta(idVenta: number | null,idUsuario:number | null) {
            const uri = `${this.baseUrl}Venta/EnviarMailVenta`;
            try {
                const headersList = {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                };

                const bodyContent = JSON.stringify({
                    idVenta: idVenta,
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
                    "message": "Ocurrio un error al enviar el mail de la venta"
                }
            }
        },
        async getAllMediosDePago(): Promise<Array<TipoMediosDePagoModel>> {
            const uri = `${this.baseUrl}TipoFormaDePago/GetAllFormasDePago`;
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
        async GetAllVentasPaginado(idSucursal: number | null,fechaDesde:string,fechaHasta:string,pageNumber:number,pageSize:number) {
            const uri = `${this.baseUrl}Venta/GetAllVentasPaginado?idSucursal=${idSucursal}&fechaDesde=${encodeURIComponent(fechaDesde)}&fechaHasta=${encodeURIComponent(fechaHasta)}&pageNumber=${pageNumber}&pageSize=${pageSize}`;
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
        async _generarTicket(): Promise<string> {
            try {
                let htmlReemplazado = ""
                await fetch('/DataMocap/TicketNoValidoTexto.txt')
                    .then(response => response.text())
                    .then(htmlContent => {
                        // Realizar reemplazos necesarios en el HTML
                        const datos = {
                            Cliente: 'Maria Iustina Chequer',
                            Usuario: 'iuschequer@gmail.com',
                            Fecha: '10/05/2014 21:00',
                            NroOperacion: '123456789',
                            Vendedor: 'Mechi',
                            Detalle: [
                                {
                                    id: 123456789,
                                    producto: 'Zapatilla zzz',
                                    precio: 57894.5
                                },
                                {
                                    id: 987654321,
                                    producto: 'Campera xxx',
                                    precio: 60825.75
                                },
                                {
                                    id: 111444777,
                                    producto: 'Remera aaa',
                                    precio: 23000
                                },
                            ],
                            DetalleMedioDePago: [
                                {
                                    medio: 'Efectivo',
                                    valor: 23000
                                },
                                {
                                    medio: 'Transferencia',
                                    valor: 108720.25
                                },
                                {
                                    medio: 'Credito en tienda',
                                    valor: 10000
                                },
                            ]
                        }
                        htmlReemplazado = htmlContent
                            .replace('{Cliente}', datos.Cliente)
                            .replace('{Usuario}', datos.Usuario)
                            .replace('{Fecha}', datos.Fecha)
                            .replace('{NroOperacion}', datos.NroOperacion)
                            .replace('{Vendedor}', datos.Vendedor)
                            .replace('{Detalle}', this._generarTablaProductosDetalle(datos.Detalle))
                        // .replace('{DetalleMedioDePago}', this._generarTablaMediosDePago(datos.DetalleMedioDePago))
                    })
                return htmlReemplazado.replace(/ /g, "&nbsp;") + '\x1B\x01'

            } catch (error) {
                console.log(error)
                return ""
            }
        },
        _generarTablaProductosDetalle(detalle: Array<DetalleItemsTicketModel>): string {
            let tablaHTML = ""
            // Encabezados de la tabla con fondo gris claro
            tablaHTML += "Codigo   Producto   Precio<br>"
            tablaHTML += "--------------------------------<br>"
            let total = 0
            // Filas de la tabla
            detalle.forEach(item => {
                tablaHTML += `${PaddingLeftCadena(item.id.toString(), 8).substring(0, 8)} `
                tablaHTML += `${PaddingRightCadena(item.producto, 10).substring(0, 10)} `
                tablaHTML += `${PaddingLeftCadena(formatoMoneda(item.precio), 12).substring(0, 12)}`
                tablaHTML += "<br>"
                total = Number((total + item.precio).toFixed(2))
            });
            tablaHTML += "--------------------------------<br>"//.replace(" ","&nbsp;")}
            tablaHTML += `${PaddingRightCadena("SUBTOTAL", 20).substring(0, 20)}`
            tablaHTML += `${PaddingLeftCadena(formatoMoneda(total), 12).substring(0, 12)}`

            return tablaHTML
        },
        _generarTablaMediosDePago(detalle: any[]): string {
            let tablaHTML = "<table style='width: 54mm; border-collapse: collapse; font-size: 0.7rem;'>";
            tablaHTML += "<thead><tr>";

            // Encabezados de la tabla con fondo gris claro
            tablaHTML += "<th style='padding: 5px; border: 1px solid black; background-color: #f2f2f2; '>Medio de pago:</th>";
            tablaHTML += "<th style='padding: 5px; border: 1px solid black; background-color: #f2f2f2; '>Valor</th>";
            tablaHTML += "</tr></thead><tbody>";
            // Filas de la tabla
            detalle.forEach(item => {
                tablaHTML += "<tr>";
                tablaHTML += `<td style='padding: 5px; border: 1px solid black;'>${item.medio}</td>`;
                tablaHTML += `<td style='padding: 5px; border: 1px solid black; text-align: right;'>${formatoMoneda(item.valor)}</td>`;
                tablaHTML += "</tr>";
            });

            tablaHTML += "</tbody></table>";

            return tablaHTML;
        },
        _generarTablaProductosDetalle2(detalle: Array<DetalleItemsTicketModel>): string {
            let tablaHTML = "<table style='width: 54mm; border-collapse: collapse; font-size: 0.7rem;'>";
            tablaHTML += "<thead><tr>";

            // Encabezados de la tabla con fondo gris claro
            tablaHTML += "<th style='padding: 5px; border: 1px solid black; background-color: #f2f2f2; '>Código</th>";
            tablaHTML += "<th style='padding: 5px; border: 1px solid black; background-color: #f2f2f2; '>Producto</th>";
            tablaHTML += "<th style='padding: 5px; border: 1px solid black; background-color: #f2f2f2;'>Precio</th>";
            tablaHTML += "</tr></thead><tbody>";
            let total = 0
            // Filas de la tabla
            detalle.forEach(item => {
                tablaHTML += "<tr>";
                tablaHTML += `<td style='padding: 5px; border: 1px solid black;'>${item.id.toString()}</td>`;
                tablaHTML += `<td style='padding: 5px; border: 1px solid black;'>${item.producto}</td>`;
                tablaHTML += `<td style='padding: 5px; border: 1px solid black; text-align: right;'>${formatoMoneda(item.precio)}</td>`;
                tablaHTML += "</tr>";
                total = Number((total + item.precio).toFixed(2))
            });

            tablaHTML += "<tr>";
            tablaHTML += `<td style='padding: 5px; border: 1px solid black;' colspan=2>TOTAL</td>`;
            tablaHTML += `<td style='padding: 5px; border: 1px solid black; text-align: right;'>${formatoMoneda(total)}</td>`;
            tablaHTML += "</tr>";

            tablaHTML += "</tbody></table>";

            return tablaHTML;
        },
        _generarTablaMediosDePago2(detalle: any[]): string {
            let tablaHTML = "<table style='width: 54mm; border-collapse: collapse; font-size: 0.7rem;'>";
            tablaHTML += "<thead><tr>";

            // Encabezados de la tabla con fondo gris claro
            tablaHTML += "<th style='padding: 5px; border: 1px solid black; background-color: #f2f2f2; '>Medio de pago:</th>";
            tablaHTML += "<th style='padding: 5px; border: 1px solid black; background-color: #f2f2f2; '>Valor</th>";
            tablaHTML += "</tr></thead><tbody>";
            // Filas de la tabla
            detalle.forEach(item => {
                tablaHTML += "<tr>";
                tablaHTML += `<td style='padding: 5px; border: 1px solid black;'>${item.medio}</td>`;
                tablaHTML += `<td style='padding: 5px; border: 1px solid black; text-align: right;'>${formatoMoneda(item.valor)}</td>`;
                tablaHTML += "</tr>";
            });

            tablaHTML += "</tbody></table>";

            return tablaHTML;
        },
    }
});
