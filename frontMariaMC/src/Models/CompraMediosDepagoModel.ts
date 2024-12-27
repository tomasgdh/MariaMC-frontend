class CompraMediosDepagoModel {
    id: number
    description: string
    total: number

    constructor({ id = 0, description = "",total = 0} = {}) {
        this.id = id;
        this.description = description;
        this.total = total;
    }
}

export default CompraMediosDepagoModel;