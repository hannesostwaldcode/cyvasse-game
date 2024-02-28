import {unitKeys } from "./Unit"

type ReservesDisplayProps = {
    reserves: unitKeys[]
    selectedReserve: (reserve: unitKeys) => void;
    title?: string
}

export function ReservesDisplay({
    reserves,
    selectedReserve,
    title
}:ReservesDisplayProps) {
    return <div className="bg-slate-700">
            {title && <div className="text-center mt-2">{title}</div>}
            <div className="grid grid-cols-3 gap-2 p-5 items-center h-auto w-auto">
                
                {reserves.map((reserve, index) => (
                
                    <div key={index} onClick={() => selectedReserve(reserve)} className={`bg-cover w-12 h-12 bg-${reserve}`}></div>   
                
                    ))}
            </div>
    </div>
}