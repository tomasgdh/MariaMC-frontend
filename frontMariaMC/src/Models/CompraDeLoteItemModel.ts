class CompraDeLoteItemModel {
    id: number
    // description: string
    idCategoria: number
    categoria: string
    idMarca: number
    marca: string
    idTalle: number
    talle: string
    valorPorc: number
    valorPorcTienda: number
    price: number

    constructor({ id = 0,/*description = "",*/idCategoria=0,categoria="",idMarca=0,marca="",idTalle=0,talle = "",valorPorc =0,valorPorcTienda =0,price =0,} = {}) {
        this.id = id;
        // this.description = description;
        this.idCategoria = idCategoria;
        this.categoria = categoria;
        this.idMarca = idMarca;
        this.marca = marca;
        this.idTalle = idTalle;
        this.talle = talle;
        this.valorPorc = valorPorc;
        this.valorPorcTienda = valorPorcTienda;
        this.price = price;
    }
}
export default CompraDeLoteItemModel;