import { unitKeys } from "./Unit"

interface UnitInfoProps {
    unit: unitKeys
}



export function UnitInfo({unit}: UnitInfoProps) {
    const unitInfo = (unit: unitKeys) => {
        const unitLetter  = unit?.slice(-1)
        switch(unitLetter){
            case "C":
                return {
                    name: "Catapult",
                    description: "A mighty unit that can capture two units per move"
                }
            case "B":
                return {
                    name: "Crossbowman",
                    description: "A light Unit that moves one field in the diagonal"
            }
            case "f":
            case "F":
                return {
                    name: "Fort",
                    description: "Houses the Reserves. Can be destroyed if two opposition units enter its adjacent squares"
                }
            case "D":
            return {
                name: "Dragon",
                description: "Moves in any direction and can bypass mountains and water fields"
                }
            case "E":
                return {
                    name: "Elephant",
                    description: "This powerfull creature can only be captured if another enemy piece is adjacent"
                }
            case "H":
                return {
                    name: "Heavy Horse",
                    description: "Moves in the diagonal"
                }
            case "K":
                return {
                    name: "King",
                    description: "Moves one field in any direction. If captured the game is lost"
                }

            case "L":
                return {
                    name: "Light Horse",
                    description: "Moves in a straight line. Can move off the edge of the board and enter on the opposite site"
                }
            case "m":
                return {
                    name: "Mountain",
                    description: "Will block almost all units moves"
                }
            case "S":
                return {
                    name: "Spearman",
                    description: "Moves one field in a straight line. Can change postion with friendly units"
                }
            case "T":
                return {
                    name: "Trebuchet",
                    description: "Moves in a straight line. May bypass friendlys to capture"
                }
            case "R":
                return {
                    name: "Rabble",
                    description: "Moves one field in a straigt line, if moved another rabble may be moved in the same turn"
                }
            default:
                return {
                    name: "NaN",
                    description: "This doesnt seem to be a valid Unit"
                }
        }
    
    }
    if (!unit) {
        return null
    }
    return (
        
        <div className="flex flex-col w-[200px] bg-slate-200">
            <div>{unitInfo(unit).name}</div>
            <div>{unitInfo(unit).description}</div>
        </div>
    )
}