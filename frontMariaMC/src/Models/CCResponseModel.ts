class CCResponseModel {
    idCierre: number
    fechaDesde: string
    fechaHasta: string
    usuarioCierre: string
    totalEfectivo: number
    totalMP: number

    constructor({ idCierre = 0, FechaDesde = "", FechaHasta = "",UsuarioCierre = "",TotalEfectivo = 0,TotalMP =0 } = {}) {
        this.idCierre = idCierre;
        this.fechaDesde = FechaDesde;
        this.fechaHasta = FechaHasta;
        this.usuarioCierre = UsuarioCierre;
        this.totalEfectivo = TotalEfectivo;
        this.totalMP = TotalMP;
    }
}

export default CCResponseModel;