import { BarChart2, Book, Gamepad, Hammer, User } from "lucide-react";
import { UserAuth } from "./Auth";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useNavString } from "@/contexts/text";

export function MainNavbar() {
    const navigate = useNavigate()
    const [open, setIsOpen] = useState(false)
    const {social, learn, newgame, dashboard} = useNavString()

    const navAction = (target: string) => {
      setIsOpen(false)
      navigate(target)
    }
    return (
      <div>
        <div className="md:hidden bg-slate-300 w-screen flex h-16"> 
        <h1 onClick={() => navAction('/')} className="text-3xl  text-center font-bold  text-slate-700">Cyvasse</h1>
        <div className="mx-auto"><UserAuth/></div>
        <BarChart2 onClick={() => setIsOpen(!open)}  className="ml-auto my-auto mr-5"/>
        </div>
        <div className={`${open ? "absolute" : "hidden"} bg-slate-300 min-w-[200px] -mt-5 md:mt-0  h-screen  md:flex flex-col sticky`}>
      <h1 onClick={() => navAction('/')} className="text-3xl mt-5 text-center font-bold  text-slate-700">Cyvasse</h1>
      <div className='mt-4 text-2xl flex text-slate-600 flex-col gap-5 h-full w-full'>
        <div className="justify-between flex flex-col">
        <button onClick={() => navAction('/dashboard')} className='hover:bg-slate-400'><Gamepad className='w-6 h-6 m-auto'/>{dashboard}</button>
        <button onClick={() => navAction('/creategame')} className='hover:bg-slate-400'><Hammer className='w-6 h-6 m-auto'/>{newgame}</button>
        <button onClick={() => navAction('/learn')} className='hover:bg-slate-400'><Book className='w-6 h-6 m-auto'/>{learn}</button>
        <button onClick={() => navAction('/social')}  className='hover:bg-slate-400'><User className='w-6 h-6 m-auto'/>{social}</button>
        </div>
        <div className="mt-auto mx-auto mb-5">
            <UserAuth/>
        </div>
      </div>
    </div>
    </div>
    )
}