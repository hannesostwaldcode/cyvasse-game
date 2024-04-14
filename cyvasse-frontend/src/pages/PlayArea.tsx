import { PositionType, unitKeys } from "../components/Unit";
import { CountryCode, move} from "../data/board";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { PlayerDisplay } from "../components/PlayerDisplay";
import { useAuth } from "@/components/provider/AuthProvider";
import { PlayBoard } from "@/components/PlayBoard";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
export type player = {
    id:         number,
    captures:   unitKeys[]
    name:       string
    elo:        number
    country:    CountryCode
}

export type gameData = {
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

    const navigate = useNavigate()
   
    const fetchBoard = async (): Promise<gameData> => {
        const res = await api.get(`/boardData/${params.gameId}`, {headers: {
            Authorization: 'Bearer ' + token
          }})
        return res.data
    }

    const {isPending, error, data: gameData} = 
    useQuery({queryKey: ['board'],queryFn: fetchBoard}) // refetchInterval: 6000,
  
    const mutation = useMutation({
        mutationFn: (submitMove: {gameId: number, startSquare: number | null, endSquare: number, unit: unitKeys | null}) => {
          return api.post(`/submitMove`, submitMove, {headers: {
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

    const playMove = (startSquare: number | null, endSquare: number, unit: unitKeys | null = null) => {
        if(gameData){
            console.log(gameData.id)
            mutation.mutate({gameId: gameData.id, startSquare, endSquare, unit: unit})
        }
    }
    if (isPending) return 'Loading...'
   
    if (error) return 'An error has occurred: ' + error.message
    
    if(!gameData.id) return 'Game not found'
       
    if(gameData.gameEnded){
        navigate('/dashboard') 
        return <>
        'Game has ended!'
        <Button onClick={() => navigate('/dashboard')}>Return to Dashboard</Button>
        </>
        }
    
    return (
    
            <div className="mt-5 overflow-hidden h-full md:ml-16"> 
                <div className="">
                <PlayerDisplay 
                    country={gameData.playerOpponent.country}
                    playerName={gameData.playerOpponent.name}
                    rating={gameData.playerOpponent.elo}
                    units={gameData.playerOpponent.captures}
                    opponentUnits={gameData.playerSelf.captures}
                    />
                </div>
              

                <PlayBoard gameData={gameData} playMove={playMove}/>
                <div className="flex flex-row">
                <div>
                <PlayerDisplay 
                    country={gameData.playerSelf.country}
                    playerName={gameData.playerSelf.name}
                    rating={gameData.playerSelf.elo}
                    opponentUnits={gameData.playerOpponent.captures}
                    units={gameData.playerSelf.captures}/>
                </div>
                
                </div>
            </div>

    )
}