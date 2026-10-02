import { createContext, useContext, useEffect, useState } from "react"
import { refreshAccessToken } from "../api/axiosSetup"
import axios from "axios"
import { setAccessToken } from "../api/tokenStore"

const AuthContext = createContext(null)


export function AuthProvider({children}){
    const [user, setUser] = useState(null)

    const [isLoading, setIsLoading] = useState(null)

    useEffect(() => {
        async function restoreSession() {
            try {
                const data = await refreshAccessToken()
                setUser(data.user)
            } catch {
                //No valid refresh token cookie, user is simply not logged in
            } finally {
                setIsLoading(false)
            }
        }
        restoreSession()
    },[])


    //Provides authentication for login, sets access token etc
    const login = async (email, password) => {
        const response = await axios.post("/auth/login", {email, password})
        setAccessToken(response.data.token)
        setUser(response.data.user)
    }
    //Provides logout functionality and removes tokens stored
    const logout = async () => {
        await axios.post("/auth/logout")
        setAccessToken(null)
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{user, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth(){
    return useContext(AuthContext)
}


