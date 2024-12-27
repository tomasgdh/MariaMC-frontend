class ClienteVentaModel {
    id: number
    usuario: string
    description: string
    nroDocumento: number
    creditoEnTienda: number

    constructor({ id = 0, usuario = "",description = "",nroDocumento = 0,creditoEnTienda =0,} = {}) {
        this.id = id;
        this.usuario = usuario;
        this.description = description;
        this.nroDocumento = nroDocumento;
        this.creditoEnTienda = creditoEnTienda;
    }
}

export default ClienteVentaModel;