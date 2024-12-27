import CierreDetalleModel from "./CierreDetalleModel"

class CierreDeCajaResponseModel {
    idCierre: number
    fechaDesde: string
    fechaHasta: string
    usuarioCierre: string
    totalEfectivo: number
    totalMP: number
    enCaja:number
    aperturaEfCaja:number
    cierreEfCaja:number    
    efectivoAGuardar:number
    detalle : Array<CierreDetalleModel>

    constructor({ idCierre = 0, FechaDesde = "", FechaHasta = "",UsuarioCierre = "",TotalEfectivo = 0,TotalMP =0,EnCaja =0,
    aperturaEfCaja =0,cierreEfCaja =0,efectivoAGuardar =0,Detalle = new Array<CierreDetalleModel>()} = {}) {
        this.idCierre = idCierre;
        this.fechaDesde = FechaDesde;
        this.fechaHasta = FechaHasta;
        this.usuarioCierre = UsuarioCierre;
        this.totalEfectivo = TotalEfectivo;
        this.totalMP = TotalMP;
        this.enCaja = EnCaja;
        this.aperturaEfCaja = aperturaEfCaja;
        this.cierreEfCaja = cierreEfCaja;
        this.efectivoAGuardar = efectivoAGuardar;
        this.detalle = Detalle;
    }
}

export default CierreDeCajaResponseModel;