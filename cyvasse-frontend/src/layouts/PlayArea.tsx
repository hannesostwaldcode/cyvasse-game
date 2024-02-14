import { twMerge } from "tailwind-merge";
import { PositionType, Unit, unitKeys, unitStyles } from "../components/Unit";
import { emptyHomeSquares, move, reserve} from "../data/board";
import { useEffect, useState } from "react";
import { Dices } from "lucide-react";
import { ReservesDisplay } from "../components/ReservesDisplay";
import { fileCalc, rankCalc } from "../utils/positionCalc";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "react-router-dom";

type gameData = {
    id: number
    playerOne: number,
    playerTwo: number,
    board: PositionType[]
    moves: move[]
    reserves: unitKeys[]
    captures: unitKeys[]
}

export function PlayArea() {
    const queryClient = useQueryClient()
    const params = useParams()

    const [activeTurn, setActiveTurn] = useState(true)
    const [isActiveField, setIsActiveField] = useState<number| undefined>(undefined)
    const [selectedMoves, setSelectedMoves] = useState<move[]>([])
    const [selectedReserve, setSelectedReserve] = useState<unitKeys | undefined>(undefined)
    const [reserves, setReserves] = useState<number[]>([])
    const fetchBoard = async (): Promise<gameData> => {
        const res = await axios.get(`/api/boardData/${params.gameId}/${params.playerId}`)
        return res.data
    }

    const {isPending, error, data: gameData, isFetching} = 
    useQuery({queryKey: ['board'],queryFn: fetchBoard, refetchInterval: 3000,}) // refetchInterval: 6000,

    const mutation = useMutation({
        mutationFn: (submitMove: {gameId: number, playerId: number, startSquare: number | null, endSquare: number, unit: unitKeys | null}) => {
          return axios.post(`/api/submitMove`, submitMove)
        },
        onSuccess: (data) => {
            
        queryClient.setQueryData(
            ['board'],
            (oldData: gameData) =>
            oldData
                ? {
                    ...oldData,
                    board: data.data.board,
                    moves: data.data.moves,
                    reserves: data.data.reserves,
                    captures: data.data.captures,
                }
                : oldData,
        )
           
          },
      })

    useEffect(() => {
        handleReserveFilter()
        gameData?.moves.forEach(move => {
            if(isActiveField == undefined) {
                setSelectedMoves([])
            }
            if(move.startSquare == isActiveField){
                setSelectedMoves(oldArray => [...oldArray, move] );
            }
        })
    }, [gameData, isActiveField])

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
        const index = gameData?.moves.findIndex(e => e.startSquare == square)
        if (activeTurn && index != -1){
            setIsActiveField(square)
            setSelectedReserve(undefined)
        }
    }

    const handleSelectReserve = (unit: unitKeys) => {
        if (activeTurn){
        setIsActiveField(undefined)
        setSelectedReserve(unit)
        handleReserveFilter()
    }
    }
    const playMove = (startSquare: number | null, endSquare: number, unit: unitKeys | null = null) => {
        if(gameData){
            console.log(gameData.id)
            mutation.mutate({playerId: Number(params.playerId ?? 3),gameId: gameData.id, startSquare, endSquare, unit: unit})
        }
        setIsActiveField(undefined)
    }
    const playReserve = (unit: unitKeys, square: number) => {
        console.log(unit, square)
        setSelectedReserve(undefined)
    }

    if (isPending) return 'Loading...'

    if (error) return 'An error has occurred: ' + error.message

    return (
        <>
            <div> 
                <div>
                    <div>Player One</div>
                    <ReservesDisplay reserves={gameData.reserves} selectedReserve={handleSelectReserve}/>
                </div>
              


                <div  className="h-[600px] w-[600px] relative bg-contain bg-no-repeat  bg-game-board">
                    <div onClick={() => setIsActiveField(undefined)} className="h-[600px] w-[600px] absolute top-0 left-0"></div>
                {isActiveField && (
                         <div  style={{top: `${rankCalc(isActiveField)}%`, left: `${fileCalc(isActiveField)}%`}} className={twMerge(unitStyles({unit: "default"}), "opacity-50 bg-yellow-200")}></div>
                    
                    )}
                    {gameData.board.map(unit => (
                        <Unit  onClick={handleSelectField}  key={unit.square} square={unit.square} unit={unit.unit}/>
                        ))}
                    {selectedReserve && (
                        reserves.map(square => (
                            <div onClick={() => playMove(null, square, selectedReserve)}  style={{top: `${rankCalc(square)}%`, left: `${fileCalc(square)}%`}} className={twMerge(unitStyles({unit: "default"}), "opacity-50 bg-yellow-200")}></div>
                        ))
                    )}
                    
                    
                    {/* Move Fields */}
                    {isActiveField && ( <>
                    {selectedMoves.map(move => (
                        <div key={move.endSquare} onClick={() => playMove(move.startSquare, move.endSquare)}  style={{top: `${rankCalc(move.endSquare)}%`, left: `${fileCalc(move.endSquare)}%`}} className={twMerge(unitStyles({unit: "default"}), "w-[10%] h-[10%]")}>
                            <div className={`${move.isCapture ? "border-8 opacity-40 w-full h-full border-slate-400 rounded-full" : "w-[50%] h-[50%] opacity-75 bg-slate-700 translate-x-1/2 translate-y-1/2 rounded-full"}`}></div>
                        </div>
                        ))}
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