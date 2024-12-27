class ProductoPrintResponseModel {
    idProducto: number
    // descripcion: string
    tipoProductoDescripcion: string
    tipoMarcaDescripicion: string
    tipoTalleDescripcion: string
    precioDeVenta: number

    constructor({ IdProducto = 0, /*Descripcion = "",*/ TipoProductoDescripcion = "",TipoMarcaDescripicion = "",TipoTalleDescripcion = "",
    PrecioDeVenta =0} = {}) {
        this.idProducto = IdProducto;
        // this.descripcion = Descripcion;
        this.tipoProductoDescripcion = TipoProductoDescripcion;
        this.tipoMarcaDescripicion = TipoMarcaDescripicion;
        this.tipoTalleDescripcion = TipoTalleDescripcion;
        this.precioDeVenta = PrecioDeVenta;
    }
}

export default ProductoPrintResponseModel;