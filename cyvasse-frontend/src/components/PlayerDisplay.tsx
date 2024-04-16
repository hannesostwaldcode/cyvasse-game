import { unitKeys } from "./Unit"
import { CountryCode } from "../data/board"
import { getCountryFlagEmoji } from "@/lib/utils"
import { useEffect, useState } from "react"
import userimage from "@/assets/user-image.svg"

type PlayerDisplayProps = {
    playerName: string
    rating:     number
    country:    CountryCode
    units:      unitKeys[]
    opponentUnits: unitKeys[]
}



export function PlayerDisplay({
    playerName,
    rating,
    units,
    country,
    opponentUnits
}: PlayerDisplayProps){
    const [playerAdvantage, setplayerAdvantage] = useState(0)

    useEffect(() => {
        setplayerAdvantage(unitValueHelper(units) - unitValueHelper(opponentUnits))
    }, [units, opponentUnits])
    
    const unitValueHelper = (units: unitKeys[]) => {
        let tempplayerAdvantage = 0
        units.forEach((e) => {
            if (!e) {return}
            const unit = e[1]
            if(unit == 'R' || unit == 'S') {
                tempplayerAdvantage += 1
            }
            else if(unit == 'B' || unit == 'L' || unit == 'H') {
                tempplayerAdvantage += 3
            }
            else if(unit == 'E' || unit == 'C' || unit == 'T') {
                tempplayerAdvantage += 5
            }
            else if(unit == 'D'){
                tempplayerAdvantage += 9
            }
        })
        return tempplayerAdvantage
    }

    return (
        <div className="w-[600px] h-6 flex md:h-auto">
            <div className="w-6 h-6 md:w-10 md:h-10 overflow-hidden flex-shrink-0 bg-blue-500 rounded-md"><img width={64} height={64} src={userimage}></img></div>
            <div className="flex ml-4 flex-row lg:flex-col">
                <div className="flex flex-row">{playerName} ({rating}) {country ? getCountryFlagEmoji(country) : "🏳"}</div>
                <div className="flex flex-row">
                {units.map(e => (
                     <div key={e} className={`bg-cover -mr-2.5 w-6 h-6 bg-${e}`}/> 
              
                ))}
                
                {playerAdvantage > 0 && <div className="ml-3">+ {playerAdvantage}</div> }
                </div>
            </div>
        </div>
    )
}