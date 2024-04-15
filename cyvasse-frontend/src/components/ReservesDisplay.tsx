import {unitKeys } from "./Unit"

type ReservesDisplayProps = {
    reserves: unitKeys[]
    selectedReserve: (reserve: unitKeys) => void;
    title?: string
    res_text?: string
    neutral?: boolean
}

export function ReservesDisplay({
    reserves,
    selectedReserve,
    title,
    res_text,
    neutral = false
}:ReservesDisplayProps) {
    return <div className="bg-gray-500 h-full">
            {title && <div className="text-center text-lg  mt-4">{title}</div>}
            {res_text && <div className="text-center mx-auto w-52 text-lg mt-4">{res_text}</div>}
            <div className="grid grid-cols-4 gap-2 p-5 h-3/4 items-center overflow-x-scroll w-auto">
                
                {reserves.map((reserve, index) => (
                
                    <div key={index} onClick={() => selectedReserve(reserve)} className={`bg-cover w-12 h-12 bg-${reserve} ${neutral ? "contrast-50" : ""}`}></div>   
                
                    ))}
            </div>
    </div>
}