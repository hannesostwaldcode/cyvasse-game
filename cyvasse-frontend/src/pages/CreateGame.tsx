import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Unit, UnitStyles, squareKeys, unitKeys, unitStyles } from "../components/Unit";
import { alabasterKeys, startUnits } from "../data/board";
import { twMerge } from "tailwind-merge";

export function CreateGame() {

    const [availableObjects, setavailableObjects] = useState<unitKeys[]>(["aCs", "am", "am", "am"])
    const [availabelUnits, setAvailableUnits] = useState(startUnits)
    const [new_unit_positions, setNew_unit_positions] = useState<UnitStyles[]>([])
    const [toPlace, setToPlace] = useState<unitKeys>(undefined) 
    const [selectedKeepPosition, setSelectedKeepPosition] = useState<squareKeys>(undefined)
    const keepPosition: number[] = []
    const homeSquare: number[] = []
    const keepPositionOperator = [-1,9,10,0]
    const homeSquareOperator = [-10,-9,1,11,21,20,19,18,8,-2,-11,-12]
    useEffect(() => {
            if(selectedKeepPosition){
                keepPosition.splice(0, keepPosition.length)
                keepPositionOperator.forEach(e => keepPosition.push(selectedKeepPosition+e))
                homeSquare.slice(0, homeSquare.length)
                homeSquareOperator.forEach(e => homeSquare.push(selectedKeepPosition+e))
                console.log(homeSquare)
            }
    },[selectedKeepPosition])

    const unitSelected = (selected: unitKeys) => {
        let tempAvailable = availableObjects
        
        const index = tempAvailable.indexOf(selected);
            if (index > -1) {
                tempAvailable.splice(index, 1)
                setavailableObjects(tempAvailable)
                setToPlace(selected)
            }
    }

    const setField = (square: squareKeys) => {
        const index = new_unit_positions.findIndex((e) => e.square === square)
        const CastleIndex = new_unit_positions.find((e) => e.unit === "aCs")?.square
        if(index > -1) {return}
        
        if(CastleIndex) {
            if(CastleIndex-1 == square || CastleIndex + 10 == square || CastleIndex + 9 == square){return}
        }
       
        if(toPlace) {
            let temp = new_unit_positions
            temp.push({square: square, unit: toPlace})
            setNew_unit_positions(temp)
            if(toPlace == "aCs") {
                setSelectedKeepPosition(square)
            }
            setToPlace(undefined)
        }
    }

    return <div className="flex flex-row">
        <div>
            <Link to={"/"}>Home</Link>
        </div>
        <div className="p-3 flex justify-center">
            <div className="h-[600px] w-[600px] ml-10 relative bg-contain bg-no-repeat  bg-game-board">
            {new_unit_positions.map(unit => (
                        <Unit  onClick={() => {return}}  key={unit.square} square={unit.square} unit={unit.unit}/>
                        ))}
            {toPlace && alabasterKeys.map(index => (
                <div onClick={() => setField(index)} className={twMerge(unitStyles({square: index, unit: "default"}), "opacity-50 bg-yellow-200")}></div>
            ))}

            {homeSquare && homeSquare.map(index => (
                <div onClick={() => {}} className={twMerge(unitStyles({square: index, unit: "default"}), "opacity-50 bg-green-200")}></div>
            ))}
           

            </div>
            <div className="bg-slate-800 w-40 grid grid-cols-2">
                {availableObjects.map(unit => (
                     <div onClick={() => unitSelected(unit)} className={`bg-cover w-20 h-20 bg-${unit}`}></div>
                ))}
                {availableObjects.length == 0 && availabelUnits.map(unit => (
                    <div className={`bg-cover w-20 h-20 bg-${unit}`}></div>
                ))}
            </div>
        </div>
    </div>
}