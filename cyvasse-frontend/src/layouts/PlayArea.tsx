import { twMerge } from "tailwind-merge";
import { Unit, squareKeys, unitKeys, unitStyles } from "../components/Unit";
import { emptyHomeSquares, move, moves, reserves, unit_positions } from "../data/board";
import { useEffect, useState } from "react";
import { Dices } from "lucide-react";
import { ReservesDisplay } from "../components/ReservesDisplay";

export function PlayArea() {
    const [activeTurn, setActiveTurn] = useState(false)
    const [isActiveField, setIsActiveField] = useState<squareKeys>(undefined)
    const [selectedMove, setSelectedMove] = useState<move | undefined>(undefined)
    const [selectedReserve, setSelectedReserve] = useState<unitKeys | undefined>(undefined)
   


    useEffect(() => {
        let move = moves.find(e => e.startSquare == isActiveField)
        setSelectedMove(move)
    }, [isActiveField])

    const handleSelectField = (square: squareKeys) => {
        if (activeTurn){
            setIsActiveField(square)
            setSelectedReserve(undefined)
        }
    }

    const handleSelectReserve = (unit: unitKeys) => {
        if (activeTurn){
        setIsActiveField(undefined)
        setSelectedReserve(unit)
    }
    }
    const playMove = (startSquare: squareKeys, endSquare: squareKeys) => {
        console.log(startSquare, endSquare)
        setIsActiveField(undefined)
    }
    const playReserve = (unit: unitKeys, square: squareKeys) => {
        console.log(unit, square)
        setSelectedReserve(undefined)
    }
    return (
        <>
            <div> 
                <div>
                    <div>Player One</div>
                    <ReservesDisplay reserves={reserves} selectedReserve={handleSelectReserve}/>
                </div>


                <div className="h-[600px] w-[600px] relative bg-contain bg-no-repeat  bg-game-board">
                    {unit_positions.map(unit => (
                        <Unit  onClick={handleSelectField}  key={unit.square} square={unit.square} unit={unit.unit}/>
                        ))}
                    {selectedReserve && (
                        emptyHomeSquares.map(square => (
                            <div onClick={() => playReserve(selectedReserve, square)} className={twMerge(unitStyles({square: square, unit: "default"}), "opacity-50 bg-yellow-200")}></div>
                        ))
                    )}
                    
                    {/* Move Fields */}
                    {selectedMove && ( <>
                    {selectedMove.moveSquares.map(square => (
                        <div key={square} onClick={() => playMove(selectedMove.startSquare, square)} className={twMerge(unitStyles({square: square, unit: "default"}), "w-[10%] h-[10%]")}>
                            <div className="w-[50%] h-[50%] opacity-75 bg-slate-700 translate-x-1/2 translate-y-1/2 rounded-full"></div>
                        </div>
                        ))}
                    {selectedMove.captureSquares.map(square => (
                        <div key={square} onClick={() => playMove(selectedMove.startSquare, square)} className={twMerge(unitStyles({square: square, unit: "default"}), "border-4 opacity-40 border-slate-400 rounded-full")}></div>
                        ))}
                    <div className={twMerge(unitStyles({square: selectedMove.startSquare, unit: "default"}), "opacity-50 bg-yellow-200")}></div>
                    
                    </>)}
                    
                
                    
                  
                </div>
                <div className="flex flex-row">
                    <div>
                    <div>Opponent:</div>
                    <div className="flex">Bot Dice<Dices className="ml-4 h-6 w-6"/></div>
                    </div>
                </div>
            </div>
        </>
    )
}