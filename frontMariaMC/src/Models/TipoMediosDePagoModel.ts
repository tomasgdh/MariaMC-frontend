class TipoMediosDePagoModel {
    id: number
    description: string
    descuento: number

    constructor({ id = 0, description = "",descuento=0} = {}) {
        this.id = id
        this.description = description
        this.descuento = descuento

    }
}

export default TipoMediosDePagoModel;