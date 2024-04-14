import {unitKeys } from "./Unit"

type ReservesDisplayProps = {
    reserves: unitKeys[]
    selectedReserve: (reserve: unitKeys) => void;
    title?: string
    neutral?: boolean
}

export function ReservesDisplay({
    reserves,
    selectedReserve,
    title,
    neutral = false
}:ReservesDisplayProps) {
    return <div className="bg-slate-300 h-full">
            {title && <div className="text-center mt-2">{title}</div>}
            <div className="grid grid-cols-4 gap-2 p-5 h-full items-center overflow-x-scroll w-auto">
                
                {reserves.map((reserve, index) => (
                
                    <div key={index} onClick={() => selectedReserve(reserve)} className={`bg-cover w-12 h-12 bg-${reserve} ${neutral ? "contrast-50" : ""}`}></div>   
                
                    ))}
            </div>
    </div>
}