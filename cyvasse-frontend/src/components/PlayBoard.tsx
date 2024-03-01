import { twMerge } from "tailwind-merge";
import { Unit, unitKeys, unitStyles } from "./Unit";
import { fileCalc, rankCalc } from "@/lib/positionCalc";
import { gameData } from "@/pages/PlayArea";
import { useEffect, useState } from "react";
import { move } from "@/data/board";
import { ReservesDisplay } from "./ReservesDisplay";
import { UnitInfo } from "./UnitInfo";

type playBoardProps = {
    gameData: gameData
    playMove: (startSquare: number | null, endSquare: number, unit: unitKeys | null) => void
}

export function PlayBoard({gameData, playMove}: playBoardProps) {
    const [isActiveField, setIsActiveField] = useState<number| undefined>(undefined)
    const [selectedMoves, setSelectedMoves] = useState<move[]>([])
    const [selectedReserve, setSelectedReserve] = useState<unitKeys | undefined>(undefined)
    const [reserves, setReserves] = useState<number[]>([])
    const [infoObject, setInfoObject] = useState<unitKeys>(null)
     useEffect(() => {
        handleReserveFilter()
        gameData.moves.forEach(move => {
            if(isActiveField == undefined) {
                setSelectedMoves([])
                
            }
            if(move.startSquare == isActiveField){
                setSelectedMoves(oldArray => [...oldArray, move] );
            }
        })
        
    }, [isActiveField])
  
    const handleReserveFilter = () => {
        const reserves = gameData?.moves.filter(move => move.unit != null)
        let filtered: number[] = []
        
        if(reserves){
            filtered = reserves.filter(e => e.unit == selectedReserve).map(e => e.endSquare)
            setReserves(filtered)
        }
    }

    const handleSelectField = (square: number) => {
        if(isActiveField){
            setIsActiveField(undefined) 
            return
        }
        setInfoObject(gameData.board.find(e => e.square == square)?.unit ?? null)
        const index = gameData?.moves.findIndex(e => e.startSquare == square)
        if (index != -1){
            setIsActiveField(square)
            // ToDo write less dodgy
            setSelectedReserve(undefined)
        }
    }

    const handleSelectReserve = (unit: unitKeys) => {
        setIsActiveField(undefined)
        setSelectedReserve(unit)
        handleReserveFilter()
    
    }

    const handlePlayMove = (startSquare: number | null, endSquare: number, unit: unitKeys | null) => {
        playMove(startSquare, endSquare, unit)
        setIsActiveField(undefined)
    }
    return (
        <div className="flex flex-row py-5">
        <div  className={`h-[600px] w-[600px]  flex-none relative bg-contain bg-no-repeat  bg-game-board ${gameData.self_alabaster ? "rotate-180" : ""}`}>
                        <div onClick={() => setIsActiveField(undefined)} 
                            className="h-[600px] w-[600px] absolute top-0 left-0"></div>
                    
                        {gameData.last_move && (
                            <div>
                            <div  style={{top: `${rankCalc(gameData.last_move.endSquare)}%`, left: `${fileCalc(gameData.last_move.endSquare)}%`}} className={twMerge(unitStyles({unit: "default"}), "opacity-50 bg-yellow-200")}></div>
                            <div  style={{top: `${rankCalc(gameData.last_move.startSquare)}%`, left: `${fileCalc(gameData.last_move.startSquare)}%`}} className={twMerge(unitStyles({unit: "default"}), "opacity-50 bg-yellow-200")}></div>
                        </div>
                        )}

                        {isActiveField && (
                            <div  style={{top: `${rankCalc(isActiveField)}%`, left: `${fileCalc(isActiveField)}%`}} className={twMerge(unitStyles({unit: "default"}), "opacity-50 bg-yellow-200")}></div>
                        
                        )}
                        {gameData.board.map(unit => (
                            <Unit  onClick={handleSelectField} flipped={gameData.self_alabaster} key={unit.square} square={unit.square} unit={unit.unit}/>
                            ))}
                        {selectedReserve && (
                            reserves.map(square => (
                                <div onClick={() => handlePlayMove(null, square, selectedReserve)}  style={{top: `${rankCalc(square)}%`, left: `${fileCalc(square)}%`}} className={twMerge(unitStyles({unit: "default"}), "opacity-50 bg-yellow-200")}></div>
                            ))
                        )}
                        
                        {/* Move Fields */}
                        {isActiveField && ( <>
                        {selectedMoves.map(move => (
                            <div key={move.endSquare} onClick={() => handlePlayMove(move.startSquare, move.endSquare, null)}  style={{top: `${rankCalc(move.endSquare)}%`, left: `${fileCalc(move.endSquare)}%`}} className={twMerge(unitStyles({unit: "default"}), "w-[10%] h-[10%]")}>
                                <div className={`${move.isCapture ? "border-8 opacity-40 w-full h-full border-slate-400 rounded-full" : "w-[50%] h-[50%] opacity-75 bg-slate-700 translate-x-1/2 translate-y-1/2 rounded-full"}`}></div>
                            </div>
                            ))}
                        </>)} 
                    </div>
                          
                          <div className="flex justify-between flex-col">
                          <ReservesDisplay title="Reserves" reserves={gameData.reserves} selectedReserve={handleSelectReserve}/>
                          <button className={`rounded-md h-12 bg-gray-700 text-slate-200m ${gameData.doubleMove ? '' : 'hidden'}`} onClick={() => handlePlayMove(null, 0, null)}>Skip Double Rabble Move</button>
                      </div>
                      {infoObject && <UnitInfo unit={infoObject}/>}
                      </div>
    )
}