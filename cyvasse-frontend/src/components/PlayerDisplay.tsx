import { unitKeys } from "./Unit"
import { CountryCode } from "../data/board"
import { getCountryFlagEmoji } from "@/lib/utils"

type PlayerDisplayProps = {
    playerName: string
    rating:     number
    imgUrl:     string
    advantage?: number
    country:    CountryCode
    units:      unitKeys[]
}



export function PlayerDisplay({
    playerName,
    rating,
    units,
    country,
    imgUrl,
    advantage
}: PlayerDisplayProps){
    
   

    return (
        <div className="w-[300px] flex ">
            <div className="w-16 overflow-hidden flex-shrink-0 h-16 bg-blue-500 rounded-md"><img width={64} height={64} src="/src/assets/user-image.svg"></img></div>
            <div className="flex ml-4 flex-col">
                <div className="flex flex-row">{playerName} ({rating}) {country ? getCountryFlagEmoji(country) : "🏳"}</div>
                <div className="flex my-auto flex-row">
                {units.map(e => (
                     <div key={e} className={`bg-cover -mr-2.5 w-6 h-6 bg-${e}`}/> 
              
                ))}
                
                {advantage && <div className="ml-3">+ {Math.abs(advantage)}</div> }
                </div>
            </div>
        </div>
    )
}