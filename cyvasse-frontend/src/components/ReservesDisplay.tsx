import { move, reserve } from "../data/board";
import {unitKeys } from "./Unit"

type ReservesDisplayProps = {
    reserves: unitKeys[]
    selectedReserve: (reserve: unitKeys) => void;
}

export function ReservesDisplay({
    reserves,
    selectedReserve
}:ReservesDisplayProps) {
    return <div>
            <div className="flex flex-row items-center h-20 w-96 justify-around  bg-slate-700">
            {reserves.map((reserve, index) => (
              
                  <div key={index} onClick={() => selectedReserve(reserve)} className={`bg-cover w-6 h-6 bg-${reserve}`}></div>   
              
                ))}
            </div>
    </div>
}