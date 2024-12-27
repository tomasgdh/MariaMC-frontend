class VentaResultadoModel {
    idVenta: number
    idSucursal: number
    fechaVenta: string
    totalDeVenta: number
    comprobante: string
    facturaHtml: string
    cliente: string
    nroDocumento: string

    constructor(idVenta = 0, idSucursal = 0, fechaVenta = "",totalDeVenta = 0,comprobante ="",facturaHtml="",cliente ="",
        nroDocumento ="") {
        this.idVenta = idVenta;
        this.idSucursal = idSucursal;
        this.fechaVenta = fechaVenta;
        this.totalDeVenta = totalDeVenta;
        this.comprobante = comprobante;
        this.facturaHtml = facturaHtml;
        this.cliente = cliente;
        this.nroDocumento = nroDocumento;
    }
}

export default VentaResultadoModel;