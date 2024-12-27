export const formatoMoneda = (valor:number,decimales = 2) => {
    // return '$' + valor.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + ",00";
    // const valorFormateado = valor.toFixed(2) // Redondea a dos decimales
    // return '$' + valorFormateado.replace(/\B(?=(\d{3})+(?!\d))/g, "."); // Formato con separadores de miles
    return '$' + valor.toLocaleString('es-AR', { minimumFractionDigits: decimales, maximumFractionDigits: decimales })
  }

  export const formatoNumero = (valor:number,decimales =2) => {

      if (typeof valor === "string") {
          valor = Number(Number(valor).toFixed(2))
      } else if (typeof valor === "number") {
        valor = Number(valor.toFixed(2))
      }

    return valor.toLocaleString('es-AR', { minimumFractionDigits: decimales, maximumFractionDigits: decimales })
  }

  export function PaddingRightCadena(cadena:string,ancho:number) {
    // Si la cadena tiene menos de 10 caracteres, la rellenamos con espacios en blanco
    const cadenaRellenada = cadena.padEnd(ancho, ' ');
    // Tomamos solo los primeros 10 caracteres
    const cadenaFinal = cadenaRellenada.substring(0, ancho);
    return cadenaFinal
  }

  export function PaddingLeftCadena(cadena:string,ancho:number) {
    // Si la cadena tiene menos de 10 caracteres, la rellenamos con espacios en blanco
    const cadenaRellenada = cadena.padStart(ancho, ' ');
    // Tomamos solo los primeros 10 caracteres
    const cadenaFinal = cadenaRellenada.substring(0, ancho);
    return cadenaFinal
  }

  export function PaddingLeft(cadena:string,ancho:number,caracter:string) {
    // Si la cadena tiene menos de 10 caracteres, la rellenamos con espacios en blanco
    const cadenaRellenada = cadena.padStart(ancho, caracter);
    // Tomamos solo los primeros 10 caracteres
    const cadenaFinal = cadenaRellenada.substring(0, ancho);
    return cadenaFinal
  }

  export function isValidEmail(email:string) {

    const acentos = "àÀâÂäÄáÁéÉèÈêÊëËìÌîíÍÎïÏòÒôÔöÖóÓúÚùÙûÛüÜçÇ'ñ";

    email = email.toLowerCase();

    let valid = true;
    if (email.substring(0, 1) == ".") valid = false;
    if (email.split(" ").length > 1) valid = false;
    if (email.split("@").length > 2) valid = false;
    if (email.length > 64) valid = false;
    //var filter = /[\w-\.]{1,}@([\w-]{2,}\.)*([\w-]{2,}\.)[\w-]{2,4}/;
    const filter = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/;
    if (!filter.test(email)) valid = false;

    //comprueba los acentos
    for (let index = 0; index < email.length; index++) {
        if (acentos.indexOf(email.charAt(index), 0) != -1) {
            valid = false;
            return valid;
        }
    }

    return valid;
}


import {jwtDecode,JwtPayload} from 'jwt-decode';

interface CustomJwtPayload extends JwtPayload {
  userId: number;
  nombreCompleto: string;
  sessionId: string;
  role: string;
}

export function decodeToken(token: string): CustomJwtPayload {
  return jwtDecode<CustomJwtPayload>(token);
}