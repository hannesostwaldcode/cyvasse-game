import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function App(){
  const [playerId, setPlayerId] = useState(3)
  const [gameId, setGameId] = useState(4)
  const navigate = useNavigate();

  const fetchBoard = async (): Promise<any> => {
    const res = await axios.get(`/api/games`)
    console.log(res.data)
    return res.data
}

  const {isPending, error, data: games, isFetching} = 
  useQuery({queryKey: ['board'],queryFn: fetchBoard})


  const onClick = () => {
    navigate(`/playgame/${gameId}/${playerId}`)
  }

  if (isPending) return 'Loading...'

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
    <label>
          Player Id:  <input type="number" value={playerId} onChange={(e) => setPlayerId(e.target.valueAsNumber)}/>
    </label>
    </div>
    
   </div>
  )
}
