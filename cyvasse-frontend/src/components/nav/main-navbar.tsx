import { BarChart2, Book, Gamepad, Hammer, User } from "lucide-react";
import { UserAuth } from "./Auth";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export function MainNavbar() {
    const navigate = useNavigate()
    const [open, setIsOpen] = useState(false)

    const navAction = (target: string) => {
      setIsOpen(false)
      navigate(target)
    }
    return (
      <div>
        <div className="md:hidden bg-slate-300 w-screen flex h-16"> 
        <h1 onClick={() => navAction('/')} className="text-3xl  text-center font-bold  text-slate-700">Cyvasse</h1>
        <div className="ml-auto"><UserAuth/></div>
        <BarChart2 onClick={() => setIsOpen(!open)}  className="ml-auto my-auto mr-5"/>
        </div>
        <div className={`${open ? "absolute" : "hidden"} bg-slate-300 min-w-[200px] top-0 mr-3 h-screen  md:flex flex-col sticky`}>
      <h1 onClick={() => navAction('/')} className="text-3xl mt-5 text-center font-bold  text-slate-700">Cyvasse</h1>
      <div className='mt-4 text-2xl flex text-slate-600 flex-col gap-5 h-full w-full'>
        <div className="justify-between flex flex-col">
        <button onClick={() => navAction('/dashboard')} className='hover:bg-slate-400'><Gamepad className='w-6 h-6 m-auto'/>Dashboard</button>
        <button onClick={() => navAction('/creategame')} className='hover:bg-slate-400'><Hammer className='w-6 h-6 m-auto'/>New Game</button>
        <button onClick={() => navAction('/learn')} className='hover:bg-slate-400'><Book className='w-6 h-6 m-auto'/>Learn</button>
        <button onClick={() => navAction('/social')}  className='hover:bg-slate-400'><User className='w-6 h-6 m-auto'/>Social</button>
        </div>
        <div className="mt-auto mx-auto mb-5">
            <UserAuth/>
        </div>
      </div>
    </div>
    </div>
    )
}