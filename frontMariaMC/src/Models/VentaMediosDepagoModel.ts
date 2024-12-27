class VentaMediosDepagoModel {
    id: number
    description: string
    subTotal: number
    descuentoValor: number
    total: number

    constructor({ id = 0, description = "",subTotal = 0,descuentoValor = 0,total = 0} = {}) {
        this.id = id;
        this.description = description;
        this.subTotal = subTotal;
        this.descuentoValor = descuentoValor;
        this.total = total;
    }
}

export default VentaMediosDepagoModel;