import { createContext, useContext, useState } from "react"
import axios from "axios"
import { setAccessToken } from "../api/tokenStore"

const AuthContext = createContext(null)


export function AuthProvider({children}){
    const [user, setUser] = useState(null)

    const login = async (email, password) => {
        const response = await axios.post("/auth/login", {email, password})
        setAccessToken(response.data.token)
        setUser(response.data.user)
    }

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


