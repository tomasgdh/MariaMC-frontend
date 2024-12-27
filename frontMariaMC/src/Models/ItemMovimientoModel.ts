class ItemMovimientoModel {
    id: number
    fecha: string
    descripcion: string
    idTipoMovimiento: number
    tipoMovimientoDesc: string
    idTipoFormaDePago: number
    descTipoFormaDePago: string
    importe: number

    constructor({ id = -1, fecha = "",descripcion = "",idTipoMovimiento=0,tipoMovimientoDesc="",idTipoFormaDePago=0,descTipoFormaDePago="",importe=0} = {}) {
        this.id = id;
        this.fecha = fecha;
        this.descripcion = descripcion;
        this.idTipoMovimiento = idTipoMovimiento;
        this.tipoMovimientoDesc = tipoMovimientoDesc;
        this.idTipoFormaDePago = idTipoFormaDePago;
        this.descTipoFormaDePago = descTipoFormaDePago;
        this.importe = importe;
    }
}

export default ItemMovimientoModel;