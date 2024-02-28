import { Outlet } from "react-router-dom";
import { MainNavbar } from "./components/nav/main-navbar";
import { AuthProvider } from "./components/provider/Auth-Provider";
import { LoginModal } from "./modals/login-modal";
import { SignupModal } from "./modals/signup-modal";

export default function App(){
 

  return (
    <>
    <AuthProvider>
    <LoginModal/>
    <SignupModal/>
  
 
    <div className="flex flex-row bg-slate-600 h-screen">
      <MainNavbar/>
      <Outlet/>
    </div>
    </AuthProvider>
    </>
  )
}
