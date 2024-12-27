class TipoCategoriaProductoModel {
    id: number
    description: string
    categoria: string

    constructor({ id = 0, description = "",categoria=""} = {}) {
        this.id = id;
        this.description = description;
        this.categoria = categoria;
    }
}

export default TipoCategoriaProductoModel;