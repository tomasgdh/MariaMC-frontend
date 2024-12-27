class TipoDocumentoModel {
    id: number
    description: string

    constructor({ id = 0, description = "",} = {}) {
        this.id = id;
        this.description = description;
    }
}

export default TipoDocumentoModel;