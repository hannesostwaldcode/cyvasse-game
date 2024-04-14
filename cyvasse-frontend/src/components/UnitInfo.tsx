import { twMerge } from "tailwind-merge"
import { unitKeys, unitStyles } from "./Unit"
import { useUnitInfoString } from "@/contexts/text"

interface UnitInfoProps {
    unit: unitKeys
    onClick: () => void
}



export function UnitInfo({unit, onClick}: UnitInfoProps) {
    const res = useUnitInfoString(unit?.slice(-1) ?? "B")
    if (!unit) {
        return (
            <div onClick={onClick} className="flex flex-col w-full h-full px-3">
            <div className="text-2xl font-bold">Cyvasse</div>
            <div>A game about capturing the oppoenents kings</div>
              
        </div>
        )
    }
    return (
        
        <div onClick={onClick} className="flex flex-col w-full h-full px-3">
            <div className="text-2xl font-bold">{res.name}</div>
            <div>{res.description}</div>
            <div className={twMerge("m-auto",unitStyles({unit:unit, style: "big_icon"}))}></div>   
                
        </div>
    )
}