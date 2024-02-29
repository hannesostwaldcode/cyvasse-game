import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { PositionType } from "@/components/Unit";
import { SmallBoardDisplay } from "@/components/SmallBoardDisplay";
import { useAuth } from "@/components/provider/Auth-Provider";
  

type gameInfo = {
    id: number,
    player_alabaster: string,
    player_onyx: string
    board:      PositionType[] 
  }
  type gameInfoArray = {
    data: gameInfo[]
      
  }

export function Dashboard() {
    const {token} = useAuth()
    if (!token) {
      return <Navigate to="/" replace />;
    }
    const [gameId, setGameId] = useState(1)
    const navigate = useNavigate();
  
  
    const fetchBoard = async (): Promise<gameInfoArray> => {
      const res = await api.get(`/games`)
      console.log(res.data)
      return res.data
  }
  
    const {isPending, error, data: games, isFetching} = 
    useQuery({queryKey: ['board'],queryFn: fetchBoard})
  
  
    const onClick = (id: number) => {
      navigate(`/playgame/${id}`)
    }
  
    if (isPending || !games?.data) return "Loading"
  
    if (error) return 'An error has occurred: ' + error.message
    return (
       <div className="flex gap-5 flex-col">
    <div>
    <Link to={ "/creategame"}>Create Game</Link>
    </div>
       
    <div className="flex m-3 gap-5 flex-row">
    </div>
    {games.data.map(e => (
      <div onClick={() => onClick(e.id)} key={e.id} className="flex items-center bg-slate-500">
      <div className="mr-5">Alabaster: {e.player_alabaster} vs. Onyx: {e.player_onyx}</div>
      <SmallBoardDisplay board={e.board} alabasterPlayer/>
      </div>
    ))}
    
   </div>
    )
}