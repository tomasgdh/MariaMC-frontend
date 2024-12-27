class CierreDetalleModel {
    idMovimiento: number
    fechaHora: string
    tipoMovimiento: string
    formaDePago: string
    importe: number

    constructor({ IdMovimiento = 0, FechaHora = "",TipoMovimiento = "",FormaDePago = "",Importe =0} = {}) {
        this.idMovimiento = IdMovimiento;
        this.fechaHora = FechaHora;
        this.tipoMovimiento = TipoMovimiento;
        this.formaDePago = FormaDePago;
        this.importe = Importe;
    }
}

export default CierreDetalleModel;