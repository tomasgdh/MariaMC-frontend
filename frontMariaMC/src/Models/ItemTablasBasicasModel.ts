class ItemTablasBasicasModel {
    id: number
    descripcion: string
    descuento: number
    activo: string

    constructor({ id = -1, descripcion = "",descuento=0,activo="N"} = {}) {
        this.id = id;
        this.descripcion = descripcion;
        this.descuento = descuento;
        this.activo = activo;
    }
}

export default ItemTablasBasicasModel;