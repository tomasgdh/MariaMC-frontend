// store/index.ts
import { defineStore } from 'pinia';
import { decodeToken } from '../functions/functions';

interface User {
  username: string;
  nombreCompleto: string;
  userRole: string;
  idUsuario: number;
  urlPortrait: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  idSucursal: number | null;
  token: string | null;
  refreshToken: string | null;
  baseUrl: string | null;
}

async function fetchWithRetry(
  url: string,
  options: RequestInit,
  refreshTokenAndRetryUri: (
    headers: HeadersInit | undefined,
    body: BodyInit | null | undefined,
    url: string
  ) => Promise<Response | { result: string; message: string; }>,
  retries = 3,
  delay = 1000
): Promise<Response | any> {
  for (let i = 0; i < retries; i++) {
    try {
      const rawResponse = await fetch(url, options);

      // Si la respuesta es 401 (no autorizado), intenta refrescar el token y reintentar la solicitud
      if (rawResponse.status === 401) {
        return await refreshTokenAndRetryUri(options.headers, options.body, url);
      }

      // Clonar la respuesta para poder usarla más adelante si es necesario
      const responseClone = rawResponse.clone();

      // Verificar si la respuesta tiene contenido JSON antes de intentar convertirla
      const contentType = rawResponse.headers.get('content-type');
      let response;
      if (contentType && contentType.includes('application/json')) {
        response = await rawResponse.json();
      } else {
        response = await rawResponse.text(); // Procesa como texto si no es JSON
      }

      // Si la respuesta tiene un "NoAutorizado" explícito, intenta refrescar el token
      if (response.result === "NoAutorizado") {
        return await refreshTokenAndRetryUri(options.headers, options.body, url);
      }

      // Si la respuesta no fue exitosa, lanza un error
      if (!rawResponse.ok) {
        throw new Error(`HTTP error! Status: ${rawResponse.status}`);
      }

      return responseClone; // Retorna la respuesta si es exitosa
    } catch (error: any) {
      if (i < retries - 1) {
        console.error(`Intento ${i + 1} fallido. Reintentando en ${delay} ms...`);
        await new Promise((res) => setTimeout(res, delay));
      } else {
        console.error(`Todos los intentos fallaron: ${error.message}`);
        throw error; // Lanza el error después de todos los intentos fallidos
      }
    }
  }
}


export const useAuthStore = defineStore('auth.store', {
  state: (): AuthState => ({
    isAuthenticated: false,
    user: null,
    idSucursal: null,
    token: null,
    refreshToken: null,
    baseUrl: window.VITE_APP_BASE_URL_API,
  }),

  actions: {
    async login(username: string, password: string) {
      const uri = `${this.baseUrl}Session/Login`;
      try {
        const headersList = {
          Accept: "application/json",
          "Content-Type": "application/json",
        };
        const bodyContent = JSON.stringify({
          username,
          password,
          idSucursal: this.idSucursal,
        });

        const rawResponse = await fetchWithRetry(uri, {
          method: "POST",
          headers: headersList,
          body: bodyContent,
        }, this.refreshTokenAndRetryUri);

        const response = await rawResponse.json();

        if (response.result === "ok") {
          this.isAuthenticated = true;
          const decodedToken = decodeToken(response.token);
          this.token = response.token;
          this.refreshToken = response.refreshToken;
          const urlAvatar = `${this.baseUrl?.replace("api", "Portraits")}${decodedToken.userId}.png`;
          this.user = {
            username,
            nombreCompleto: decodedToken.nombreCompleto,
            userRole: decodedToken.role,
            idUsuario: decodedToken.userId,
            urlPortrait: urlAvatar,
          };
          localStorage.setItem('authState_MC', JSON.stringify(this.$state));
        }

        return response;

      } catch (error: any) {
        console.error("Error en el inicio de sesión:", error);
        return {
          result: "error",
          message: "Ocurrió un error al iniciar sesión: " + error.message,
        };
      }
    },
    async updatePassword(currentPassword: string, newPassword: string) {
      const uri = `${this.baseUrl}Session/UpdatePassword`;
      try {
        const headersList = {
          Accept: "application/json",
          "Content-Type": "application/json",
          'Authorization': `Bearer ${this.token}`
        };
        const bodyContent = JSON.stringify({
          currentPassword,
          newPassword,
          idUsuario: this.user?.idUsuario,
        });

        const rawResponse = await fetchWithRetry(uri, {
          method: "POST",
          headers: headersList,
          body: bodyContent,
        }, this.refreshTokenAndRetryUri);

        const response = await rawResponse.json();
        return response;

      } catch (error: any) {
        console.error("Error al actualizar la contraseña:", error);
        return {
          result: "error",
          message: "Ocurrió un error al actualizar la clave: " + error.message,
        };
      }
    },
    async getDatosUsuario() {
      const uri = `${this.baseUrl}User/GetDataUser`;
      try {
        const headersList = {
          Accept: "application/json",
          "Content-Type": "application/json",
          'Authorization': `Bearer ${this.token}`
        };
        const bodyContent = JSON.stringify({
          idUsuario: this.user?.idUsuario,
        });

        const rawResponse = await fetchWithRetry(uri, {
          method: "POST",
          headers: headersList,
          body: bodyContent,
        }, this.refreshTokenAndRetryUri);

        const response = await rawResponse.json();
        return response;

      } catch (error: any) {
        console.error("Error al obtener los datos de usuario:", error);
        return {
          result: "error",
          message: "Ocurrió un error al obtener los datos de usuario: " + error.message,
        };
      }
    },
    async GetRefreshToken() {
      const uri = `${this.baseUrl}Session/RefreshToken`;

      try {
        const headersList = {
          Accept: "application/json",
          "Content-Type": "application/json",
        };

        const bodyContent = JSON.stringify({
          AccessToken: this.token,
          RefreshToken: this.refreshToken
        });

        const rawResponse = await fetch(uri, {
          method: "POST",
          headers: headersList,
          body: bodyContent,
        });
        const response = await rawResponse.json()
        if (response.result != "ok") {
          return false;
        }

        if (response.accessToken)
          this.initializeAuthState()
        if (response.accessToken && response.refreshToken) {
          this.token = response.accessToken;
          this.refreshToken = response.refreshToken;
          localStorage.setItem('authState_MC', JSON.stringify(this.$state));
          return true;
        }
        return false;
      } catch (error) {
        console.log(error);
        return false;
      }
    },

    isValidSucursal(idSucursal: number): boolean {
      if (idSucursal) {
        this.idSucursal = idSucursal;
        return true;
      } else {
        return false;
      }
    },

    getIdUserLogin(): number | null {
      return this.user?.idUsuario ?? null;
    },

    getIdSucursal(): number | null {
      return this.idSucursal;
    },

    logout(): void {
      this.isAuthenticated = false
      this.user = {
        username: "",
        nombreCompleto: "",
        userRole: "",
        idUsuario: 0,
        urlPortrait: "",
      }
      this.token = null
      this.refreshToken = null
      localStorage.setItem('authState_MC', JSON.stringify(this.$state))
    },

    initializeAuthState(): void {
      const authState = localStorage.getItem('authState_MC');

      if (!authState) {
        this.logout(); // Si no hay estado de autenticación, desloguear
        return;
      }

      const parsedAuthState = JSON.parse(authState);
      const { token, refreshToken, isAuthenticated, user, idSucursal } = parsedAuthState;
      // Asignar Sucursal
      this.idSucursal = idSucursal;
      if (!this.validateToken(token)) {
        // Si el token principal no es válido, verificar el refreshToken
        if (!this.validateToken(refreshToken)) {
          this.logout(); // Si ambos tokens no son válidos, desloguear
        }
        //return;
      }
      // Asignar estado de autenticación
      this.isAuthenticated = isAuthenticated;
      this.user = {
        username: user?.username ?? null,
        nombreCompleto: user?.nombreCompleto ?? null,
        userRole: user?.userRole,
        idUsuario: user?.idUsuario,
        urlPortrait: user?.urlPortrait ?? null,
      };

      // Asignar tokens
      this.token = token;
      this.refreshToken = refreshToken;
    },
    validateToken(token: string | null): boolean {
      // Verifica si el token es nulo
      if (!token) return false;

      // Decodifica el token para obtener sus datos
      const decodedToken = decodeToken(token);
      console.log("decodedToken:", decodedToken)
      // Calcula la fecha de expiración del token
      let expiration = 0;
      if (decodedToken.exp)
        expiration = decodedToken.exp * 1000; // Exp es en segundos, convertir a milisegundos
      console.log("isValid:", Date.now() < expiration)
      // Retorna true si el token es válido (no ha expirado), de lo contrario retorna false
      return Date.now() < expiration;
    },
    async refreshTokenAndRetryUri(
      headers: HeadersInit | undefined,
      body: BodyInit | null | undefined,
      url: string
    ): Promise<Response> {
      const uriRefresh = `${this.baseUrl}Session/RefreshToken`;

      try {
        const response = await fetch(uriRefresh, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            AccessToken: this.token,
            RefreshToken: this.refreshToken
          }),
        });

        const data = await response.json();

        if (data.result === "ok") {
          // Actualiza los tokens
          this.token = data.accessToken;
          this.refreshToken = data.refreshToken;

          if (!(headers instanceof Headers)) {
            headers = new Headers(headers);
          }

          // Establece el nuevo token en los headers
          headers.set('Authorization', `Bearer ${this.token}`);

          // Reintenta la solicitud original con el nuevo token
          const retriedResponse = await fetch(url, {
            method: "POST",
            headers,
            body,
          });

          return retriedResponse;
        } else {
          this.isAuthenticated = false;
          //localStorage.removeItem('authState_MC');

          // Retorna una respuesta simulada con un error 401
          return new Response(JSON.stringify({
            result: "NoAutorizado",
            message: "Error al refrescar el token",
          }), {
            status: 401,
            headers: { "Content-Type": "application/json" }
          });
        }

      } catch (error: any) {
        console.error("Error al refrescar el token:", error);

        // Retorna una respuesta simulada en caso de error con un código de estado 500
        return new Response(JSON.stringify({
          result: "error",
          message: "Error al refrescar el token: " + error.message,
        }), {
          status: 500,
          headers: { "Content-Type": "application/json" }
        });
      }
    },

  }
});
