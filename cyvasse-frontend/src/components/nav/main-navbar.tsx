import { Book, Gamepad, Hammer, User } from "lucide-react";
import { UserAuth } from "./Auth";
import { useNavigate } from "react-router-dom";

export function MainNavbar() {
    const navigate = useNavigate()
    return (
        <div className="w-1/6 bg-slate-300 flex flex-col">
      <h1 onClick={() => navigate('/')} className="text-3xl mt-5 text-center font-bold  text-slate-700">Cyvasse</h1>
      <div className='mt-4 text-2xl flex text-slate-600 flex-col gap-5 h-full w-full'>
        <div className="justify-between flex flex-col">
        <button onClick={() => navigate('/dashboard')} className='hover:bg-slate-400'><Gamepad className='w-6 h-6 m-auto'/>Play</button>
        <button onClick={() => navigate('/creategame')} className='hover:bg-slate-400'><Hammer className='w-6 h-6 m-auto'/>New Game</button>
        <button onClick={() => navigate('/learn')} className='hover:bg-slate-400'><Book className='w-6 h-6 m-auto'/>Learn</button>
        <button className='hover:bg-slate-400'><User className='w-6 h-6 m-auto'/>Social</button>
        </div>
        <div className="mt-auto mx-auto mb-5">
            <UserAuth/>
        </div>
      </div>
    </div>
    )
}