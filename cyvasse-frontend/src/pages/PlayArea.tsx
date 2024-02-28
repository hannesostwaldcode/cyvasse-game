import { twMerge } from "tailwind-merge";
import { PositionType, Unit, unitKeys, unitStyles } from "../components/Unit";
import { CountryCode, move} from "../data/board";
import { useEffect, useState } from "react";
import { ReservesDisplay } from "../components/ReservesDisplay";
import { fileCalc, rankCalc } from "../lib/positionCalc";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Navigate, useParams } from "react-router-dom";
import { PlayerDisplay } from "../components/PlayerDisplay";
import useToken from "../hooks/useToken";
import { useAuth } from "@/components/provider/Auth-Provider";
type player = {
    id:         number,
    captures:   unitKeys[]
    name:       string
    elo:        number
    country:    CountryCode
}

type gameData = {
    id: number
    playerSelf: player
    playerOpponent: player
    board: PositionType[]
    moves: move[]
    gameEnded: boolean
    doubleMove: boolean
    reserves: unitKeys[]
    self_alabaster: boolean
    last_move: move | null
}

export function PlayArea() {
    const { token } = useAuth();

    if (!token) {
        return <Navigate to="/" replace />;
    }
    const queryClient = useQueryClient()
    const params = useParams()


    const [isActiveField, setIsActiveField] = useState<number| undefined>(undefined)
    const [selectedMoves, setSelectedMoves] = useState<move[]>([])
    const [selectedReserve, setSelectedReserve] = useState<unitKeys | undefined>(undefined)
    const [reserves, setReserves] = useState<number[]>([])
    const fetchBoard = async (): Promise<gameData> => {
        const res = await axios.get(`/api/boardData/${params.gameId}`, {headers: {
            Authorization: 'Bearer ' + token
          }})
        return res.data
    }

    const [playerAdvantage, setplayerAdvantage] = useState(0)

    const {isPending, error, data: gameData, isFetching} = 
    useQuery({queryKey: ['board'],queryFn: fetchBoard}) // refetchInterval: 6000,

    
    const mutation = useMutation({
        mutationFn: (submitMove: {gameId: number, startSquare: number | null, endSquare: number, unit: unitKeys | null}) => {
          return axios.post(`/api/submitMove`, submitMove, {headers: {
            Authorization: 'Bearer ' + token
          }})
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
                    playerSelf: {
                        ...oldData.playerSelf, 
                        captures: data.data.playerSelf.captures},
                    playerOpponent:  {
                        ...oldData.playerOpponent, 
                        captures: data.data.playerOpponent.captures},
                    last_move: data.data.last_move,
                    gameEnded: data.data.gameEnded,
                    doubleMove: data.data.doubleMove
                }
                : oldData,
        )
           
          },
      })

    useEffect(() => {
        if (!gameData?.moves){return}
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

    useEffect(() => {
        if (!gameData?.playerOpponent){return}
        let tempplayerAdvantage = 0
        const captures = gameData.playerOpponent.captures.concat(gameData.playerSelf.captures)
        captures.forEach((e) => {
            if (!e) {return}
            const color = e[0]
            const unit = e[1]
            let localResult = 0
            if(unit == 'R' || unit == 'S') {
                localResult = 1
            }
            else if(unit == 'B' || unit == 'L' || unit == 'H') {
                localResult = 3
            }
            else if(unit == 'E' || unit == 'C' || unit == 'T') {
                localResult = 5
            }
            else if(unit == 'D'){
                localResult = 9
            }
            localResult = localResult * (color == 'a' ? 1 : -1 )
            tempplayerAdvantage += localResult
        })
        tempplayerAdvantage = tempplayerAdvantage * (gameData.self_alabaster ? -1 : 1 )
        setplayerAdvantage(tempplayerAdvantage)
    }, [gameData?.moves])
    const handleReserveFilter = () => {
        if (!gameData?.moves) return
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
        if (index != -1){
            setIsActiveField(square)
            setSelectedReserve(undefined)
        }
    }

    const handleSelectReserve = (unit: unitKeys) => {
  
        setIsActiveField(undefined)
        setSelectedReserve(unit)
        handleReserveFilter()
    
    }
    const playMove = (startSquare: number | null, endSquare: number, unit: unitKeys | null = null) => {
        if(gameData){
            console.log(gameData.id)
            mutation.mutate({gameId: gameData.id, startSquare, endSquare, unit: unit})
        }
        setIsActiveField(undefined)
    }
    if (isPending) return 'Loading...'
   
    if (error) return 'An error has occurred: ' + error.message
    
    if(!gameData.id) return 'Game not found'
    

   
    if(gameData.gameEnded) return 'Game has ended!'
    
    return (
        <>
            <div className="mt-5 ml-auto mr-auto"> 
                <div>
                <PlayerDisplay 
                    country={gameData.playerOpponent.country}
                    imgUrl=""
                    playerName={"Bot " + gameData.playerOpponent.name}
                    rating={gameData.playerOpponent.elo}
                    advantage={playerAdvantage < 0 ? playerAdvantage : undefined}
                    units={gameData.playerOpponent.captures}
                    />
                </div>
              

                <div className="flex flex-row py-5">
                    <div  className={`h-[600px] w-[600px]  flex-none relative bg-contain bg-no-repeat  bg-game-board ${gameData.self_alabaster ? "rotate-180" : ""}`}>
                        <div onClick={() => setIsActiveField(undefined)} className="h-[600px] w-[600px] absolute top-0 left-0"></div>
                    
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
                        
                    <div className="flex justify-between flex-col">
                        <ReservesDisplay title="Reserves" reserves={gameData.reserves} selectedReserve={handleSelectReserve}/>
                        <button className={`rounded-md h-12 bg-gray-700 text-slate-200m ${gameData.doubleMove ? '' : 'hidden'}`} onClick={() => playMove(null, 0, null)}>Skip Double Rabble Move</button>
                    </div>

                </div>
                <div className="flex flex-row">
                <div>
                <PlayerDisplay 
                    country={gameData.playerSelf.country}
                    imgUrl=""
                    playerName={gameData.playerSelf.name}
                    rating={gameData.playerSelf.elo}
                    advantage={playerAdvantage > 0 ? playerAdvantage : undefined}
                    units={gameData.playerSelf.captures}/>
                </div>
                
                </div>
            </div>
        </>
    )
}