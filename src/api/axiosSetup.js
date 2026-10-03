import axios from "axios"
import { getAccessToken, setAccessToken } from "./tokenStore"


//send hhtponly refresh token with every request
axios.defaults.withCredentials = true

let refreshPromise = null

//Function to refresh the access token
export function refreshAccessToken() {
    if (!refreshPromise) {
        refreshPromise = axios.post("/auth/refresh")
            .then((response) => {
                setAccessToken(response.data.token)
                return response.data
            })
            .finally(() => {
                refreshPromise = null
            })
    }
    return refreshPromise
}


//Attach the access token to requests
axios.interceptors.request.use((config) => {
    const token = getAccessToken()
    if (token) {
        config.headers.Authorization = `Bearer ${token}`

    }
    return config
})

axios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config

        //Never trigger a refresh because /auth/login or /auth/refresh
        //itself returns a 401, otherwise a rejected refresh call
        //would try to refresh again, which fails again , forever.
        const isAuthCall = originalRequest.url?.includes("/auth/login") || originalRequest.url?.includes("/auth/refresh")

        if (error.response?.status === 401 && !originalRequest._retry && !isAuthCall) {
            originalRequest._retry = true
            try {
                const data = await refreshAccessToken()
                originalRequest.headers.Authorization = `Bearer ${data.token}`
                return axios(originalRequest)
            } catch (refreshError) {
                setAccessToken(null)
                return Promise.reject(refreshError)
            }
        }
        return Promise.reject(error)
    }
)





