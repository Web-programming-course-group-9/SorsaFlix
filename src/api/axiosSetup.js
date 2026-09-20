import axios from "axios"
import { getAccessToken, setAccessToken } from "./tokenStore"


//send hhtponly refresh token with every request
axios.defaults.withCredentials = true

//Attach access token to requests
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
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true
            try {
                const refreshResponse = await axios.post("/auth/refresh")
                setAccessToken(refreshResponse.data.token)
                originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.token}`
                return axios(originalRequest)
            } catch (refreshError) {
                setAccessToken(null)
                return Promise.reject(refreshError)
            }
        }
        return Promise.reject(error)
    }
)






