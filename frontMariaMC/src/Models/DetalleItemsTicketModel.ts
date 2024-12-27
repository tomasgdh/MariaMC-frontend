class DetalleItemsTicketModel {
    id: number
    producto: string
    precio: number

    constructor({ id = 0, producto = "",precio=0} = {}) {
        this.id = id;
        this.producto = producto;
        this.precio = precio;
    }
}

export default DetalleItemsTicketModel;