import { Link } from "react-router-dom";
import { PlayArea } from "./layouts/PlayArea";

export default function App(){
  return (
   <div className="flex flex-row bg-zinc-100">
    <div className="w-1/6 p-3">
      <h1 className="text-3xl font-bold text-slate-700">Cyvasse</h1>
      <Link to={ "/creategame"}>Create Game</Link>
    </div>
    <div className="p-5">
      <PlayArea/>
    </div>
   </div>
  )
}
