import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { Navigate, useNavigate } from "react-router-dom";
import { PositionType } from "@/components/Unit";
import { SmallBoardDisplay } from "@/components/SmallBoardDisplay";
import { useAuth } from "@/components/provider/AuthProvider";
import { UserDisplay } from "@/components/UserDisplay";
import { Button } from "@/components/ui/button";
import { PlayersGameDisplay } from "@/components/ui/Players.GameDisplay";
import { Book, Computer, Handshake } from "lucide-react";
  

type gameInfo = {
    id: number,
    player_alabaster: string,
    player_onyx: string
    last_interaction: string,
    self_alabaster:   boolean,
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
    const navigate = useNavigate();
  
  
    const fetchBoard = async (): Promise<gameInfoArray> => {
      const res = await api.get(`/games`)
      console.log(res.data)
      return res.data
    }
    const fetchArchive = async (): Promise<gameInfoArray> => {
      const res = await api.get('/archivedgames')
      return res.data
    }
    const archivedGames = useQuery({queryKey: ['archivedGames'], queryFn: fetchArchive})

    const {isPending, error, data: games} = 
    useQuery({queryKey: ['board'],queryFn: fetchBoard})
  
  
    const onClick = (id: number) => {
      navigate(`/playgame/${id}`)
    }
  
    if (isPending || !games?.data) return "Loading"
  
    if (error) return 'An error has occurred: ' + error.message
    return (
       <div className="flex flex-col w-full lg:w-1/2 justify-center mx-auto m-5">
        <div className="w-full flex flex-row">
          <div>
            <UserDisplay/>
            <div className="flex flex-col gap-6">
              <Button onClick={() => navigate('/creategame')}>Play Online</Button>
              <Button disabled>Settings</Button>
              <Button onClick={() => navigate('/social')}>Fiend Friends</Button>
            </div>
          </div>
          <div className="ml-5 flex-row my-auto hidden md:flex  justify-evenly flex-grow">

            <div className="w-[100px] h-[180px] flex flex-col" onClick={() => navigate('/creategame')}>
              <div className="inline-flex">vs. Computer <Computer/></div>
              <div className="bg-slate-400 mt-auto rounded-md overflow-hidden">
                <SmallBoardDisplay board={[]} size="tiny" alabasterPlayer/>
                <div>Play Friend</div>
              </div>
            </div>

            <div className="w-[100px] h-[180px] flex flex-col" onClick={() => navigate('/creategame')}>
              <div className="inline-flex">vs. Friend <Handshake/></div>
              <div className="bg-slate-400 rounded-md mt-auto overflow-hidden">
                <SmallBoardDisplay board={[]} size="tiny" alabasterPlayer/>
                <div>Play vs. Bot</div>
              </div>
            </div>

            <div className="w-[100px] h-[180px] flex flex-col" onClick={() => navigate('/learn')}>
              <div className="inline-flex">Learn<Book/></div>
              <div className="bg-slate-400  mt-auto rounded-md overflow-hidden">
                <SmallBoardDisplay board={[{square: 30, unit: "aB"}]} size="tiny" alabasterPlayer/>
                <div>Learn</div>
              </div>
            </div>

          </div>
        </div>

        <div className="rounded-md overflow-hidden border-slate-400 border-4 mt-5 pt-5 flex-col bg-slate-400">
          <h1 className="text-xl ml-4 font-bold">Active Games</h1>
        {games.data.map(e => (
          <div onClick={() => onClick(e.id)} key={e.id} className="flex mt-5 justify-between items-center bg-slate-500">
        
          
          <PlayersGameDisplay self_alabaster={e.self_alabaster} alabaster_player={e.player_alabaster} onyx_player={e.player_onyx}/>
          <div>{e.last_interaction}</div>
          
          <SmallBoardDisplay board={e.board} size="tiny" alabasterPlayer/>
          </div>
        ))}
        </div>

        <div className="rounded-md overflow-hidden  border-slate-400 border-4 mt-5 pt-5 flex-col bg-slate-400">
          <h1 className="text-xl ml-4 font-bold">Finished Games</h1>
        {archivedGames.data?.data && archivedGames.data.data.map(e => (
          <div key={e.id} className="flex mt-5 justify-between items-center bg-slate-500">
        
          
          <PlayersGameDisplay self_alabaster={e.self_alabaster} alabaster_player={e.player_alabaster} onyx_player={e.player_onyx}/>
          <div>{e.last_interaction}</div>
          
          <SmallBoardDisplay board={e.board} size="tiny" alabasterPlayer/>
          </div>
        ))}
        </div>
   </div>
    )
}