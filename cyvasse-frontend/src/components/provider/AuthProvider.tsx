import useToken from "@/hooks/useToken"
import api from "@/lib/api";
import { createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";

type authProps = {
    token: string | null
    onLogin: (data: any) => void
    onLogout: () => void
}

const AuthContext = createContext<authProps | undefined>(undefined);
export const AuthProvider = ({children} : {children: React.ReactNode}) => {
    const {removeToken, setToken, token} = useToken()
    const navigate = useNavigate()
    const handleLogIn = (data: any) => {
        api.postForm("/login", data)
        .then((res) => {
            setToken(res.data.access_token)
            navigate('/dashboard')
        })
        .catch((error) => {console.log(error)})
    
    }

    const handleLogOut = () =>  {
        api.post("/logout")
        .then(() => {
            removeToken()
        })
        .catch((error) => {console.log(error)})
    }

    const value = {
        token,
        onLogin: handleLogIn,
        onLogout: handleLogOut,
      };
    
      return (
        <AuthContext.Provider value={value}>
          {children}
        </AuthContext.Provider>
      );
}   

export const useAuth = () => {
    const context =  useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useTodoContext must be within TodoProvider")
    }
    return context;
  };