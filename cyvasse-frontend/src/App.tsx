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
  
 
    <div className="h-screen bg-slate-500  w-screen fixed overflow-hidden">
      <div className="flex w-full flex-col md:flex-row fixed overflow-hidden">
          <MainNavbar/>
          <div className="w-full mx-auto">
            <Outlet/>
          </div>
        </div>
    </div>
    </AuthProvider>
    </AggregateTextProvider>
    </>
  )
}
