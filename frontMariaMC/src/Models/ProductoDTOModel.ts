class ProductoDTOModel {
    id:number
    idEstado: number
    // descripcion: string
    precioDeCompra:number
    precioDeVenta: number
    idTipoProducto:number
    idTipoTalle: number
    idTipoMarca: number

    constructor({ id=0, idEstado = 0, /*descripcion = "",*/precioDeCompra = 0,precioDeVenta = 0,idTipoProducto = 0,idTipoTalle = 0,idTipoMarca = 0,} = {}) {
        this.id = id;
        this.idEstado = idEstado;
        // this.descripcion = descripcion;
        this.precioDeCompra = precioDeCompra;
        this.precioDeVenta = precioDeVenta;
        this.idTipoProducto = idTipoProducto;
        this.idTipoTalle = idTipoTalle;
        this.idTipoMarca = idTipoMarca;
    }
}

export default ProductoDTOModel;