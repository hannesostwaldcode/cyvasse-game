import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
  

type gameInfo = {
    id: number,
    player_alabaster: number,
    player_onyx: number 
  }
  type gameInfoArray = {
    data: gameInfo[]
      
  }

export function Dashboard() {
    const [gameId, setGameId] = useState(4)
    const navigate = useNavigate();
  
  
    const fetchBoard = async (): Promise<gameInfoArray> => {
      const res = await api.get(`/games`)
      console.log(res.data)
      return res.data
  }
  
    const {isPending, error, data: games, isFetching} = 
    useQuery({queryKey: ['board'],queryFn: fetchBoard})
  
  
    const onClick = () => {
      navigate(`/playgame/${gameId}`)
    }
  
    if (isPending || !games?.data) return "Loading"
  
    if (error) return 'An error has occurred: ' + error.message
    return (
       <div className="flex gap-5 flex-col">
    <div>
    <Link to={ "/creategame"}>Create Game</Link>
    </div>
       
    <div className="flex m-3 gap-5 flex-row">
    <button onClick={onClick}>Find Game</button>
    <label>
          Game Id:  <input type="number" value={gameId} onChange={(e) => setGameId(e.target.valueAsNumber)}/>
    </label>
    </div>
    {games.data.map(e => (
      <div key={e.id}>Game: {e.id} Alabaster: {e.player_alabaster} Onyx: {e.player_onyx}</div>
    ))}
    
   </div>
    )
}