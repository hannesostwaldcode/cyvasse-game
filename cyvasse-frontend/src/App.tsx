import { Outlet } from "react-router-dom";
import { MainNavbar } from "./components/nav/main-navbar";
import { AuthProvider } from "./components/provider/AuthProvider";
import { LoginModal } from "./modals/login-modal";
import { SignupModal } from "./modals/signup-modal";
import {AggregateTextProvider} from "./contexts/text";

export default function App(){
 

  return (
    <>
    <AggregateTextProvider>
    <AuthProvider>
    <LoginModal/>
    <SignupModal/>
  
 
    <div className="flex flex-row bg-slate-600 h-screen">
      <MainNavbar/>
      <Outlet/>
    </div>
    </AuthProvider>
    </AggregateTextProvider>
    </>
  )
}
