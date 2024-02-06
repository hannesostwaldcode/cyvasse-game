import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PositionType, Unit, UnitStyles, unitKeys, unitStyles } from "../components/Unit";
import { alabasterKeys, startUnits } from "../data/board";
import { twMerge } from "tailwind-merge";
import { fileCalc, rankCalc } from "../utils/positionCalc";

export function CreateGame() {

    const [availableObjects, setavailableObjects] = useState<unitKeys[]>(["aCs", "am", "am", "am"])
    const [availabelUnits, setAvailableUnits] = useState(startUnits)
    const [new_unit_positions, setNew_unit_positions] = useState<PositionType[]>([])
    const [toPlace, setToPlace] = useState<unitKeys>(undefined) 
    const [placedObj, setPlacedObj] = useState(false)
    const [selectedKeepPosition, setSelectedKeepPosition] = useState<number| undefined>(undefined)
    const [keepPosition, setKeepPosition] = useState<number[]>([])
    const [homeSquare, setHomeSquare] = useState<number[]>([])
    const keepPositionOperator = [1,10,11,0]
    const homeSquareOperator = [-11, -10, -9, -8, -1, 2, 9, 12, 19,20,21,22]
    useEffect(() => {
            if(selectedKeepPosition){
                setKeepPosition([])
                let tempKeepSquare: number[] = []
                keepPositionOperator.forEach(e => tempKeepSquare.push(selectedKeepPosition+e))
                setKeepPosition(tempKeepSquare)
                
                setHomeSquare([])
                let tempHomeSquare: number[] = []
                homeSquareOperator.forEach(e => tempHomeSquare.push(selectedKeepPosition+e))
                setHomeSquare(tempHomeSquare)
                console.log(keepPosition)
            }
    },[selectedKeepPosition])

    const objectSelected = (selected: unitKeys) => {
        let tempAvailable = availableObjects
        
        const index = tempAvailable.indexOf(selected);
            if (index > -1) {
                tempAvailable.splice(index, 1)
                setavailableObjects(tempAvailable)
                setToPlace(selected)
            }
    }

    const unitSelected = (selected: unitKeys) => {
        let tempAvailable = availabelUnits
        setPlacedObj(true)
        const index = tempAvailable.indexOf(selected);
            if (index > -1) {
                tempAvailable.splice(index, 1)
                setAvailableUnits(tempAvailable)
                setToPlace(selected)
            }
    }

    const setObject = (square: number) => {
        const index = new_unit_positions.findIndex((e) => e.square === square)
        if(index > -1) {return}
        
        if(keepPosition.length > 0){
            const index = keepPosition.findIndex(e => e == square)
            if(index > -1) {return}
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

    const setUnit = (square: number) => {
        const index = new_unit_positions.findIndex((e) => e.square === square)
        
        if(index > -1) {return}
        
        if(keepPosition.length > 0){
            const index = keepPosition.findIndex(e => e == square)
            if(index > -1) {return}
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
                {homeSquare && homeSquare.map(index => (
                    <div onClick={() => setUnit(index)} style={{top: `${rankCalc(index)}%`, left: `${fileCalc(index)}%`}} className={twMerge(unitStyles({unit: "default"}), "opacity-50 bg-green-200")}></div>
                ))}
            {toPlace && !placedObj && alabasterKeys.map(square => (
                <div onClick={() => setObject(square)} style={{top: `${rankCalc(square)}%`, left: `${fileCalc(square)}%`}} className={twMerge(unitStyles({unit: "default"}), "opacity-50 bg-yellow-200")}></div>
            ))}

           

            </div>
            <div className="bg-slate-800 w-40 grid grid-cols-2">
                {availableObjects.map(unit => (
                     <div onClick={() => objectSelected(unit)} className={`bg-cover w-20 h-20 bg-${unit}`}></div>
                ))}
                {availableObjects.length == 0 && availabelUnits.map(unit => (
                    <div onClick={() => unitSelected(unit)} className={`bg-cover w-20 h-20 bg-${unit}`}></div>
                ))}
            </div>
        </div>
    </div>
}