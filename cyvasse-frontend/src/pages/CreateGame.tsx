import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { PositionType, Unit, unitKeys, unitStyles } from "../components/Unit";
import {startUnits} from "../data/board";
import { twMerge } from "tailwind-merge";
import { fileCalc, rankCalc } from "../lib/positionCalc";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuth } from "@/components/provider/AuthProvider";
import api from "@/lib/api";
import { User } from "@/components/UserDisplay"
import { Button } from "@/components/ui/button";
import { ReservesDisplay } from "@/components/ReservesDisplay";
import { CreateGameSidebar } from "@/components/CreateGameSidebar";
import queryString from 'query-string';
import { Check } from "lucide-react";
import { useCreateGameString } from "@/contexts/text";
   
type Challenges = {
    challenger: string;
    game_id:    number;
}

export function CreateGame() {
    const {token} = useAuth()
    const navigate = useNavigate()
    if (!token) {
      return <Navigate to="/" replace />;
    }
    const {area_title, sec_desc, prim_action, sec_action, title} = useCreateGameString();
    const [availableObjects, setavailableObjects] = useState<unitKeys[]>(["F", "m", "m", "m"])
    const [availabelUnits, setAvailableUnits] = useState([...startUnits])
    const [new_unit_positions, setNew_unit_positions] = useState<PositionType[]>([])
    const [toPlace, setToPlace] = useState<unitKeys>(undefined)
    const [showBoard, setShowBoard] = useState(true) 
    const [ShowAllSquares, setShowAllSquares] = useState(true)
    const [keepPosition, setKeepPosition] = useState<number[]>([])
    const [homeSquare, setHomeSquare] = useState<number[]>([])

    const [friendGame, setFriendGame] = useState<number | null>(null)
    const [friendOpponent, setFriendOpponent] = useState<number | null>(null)

    const keepPositionOperator = [1,10,11, 0]
    const homeSquareOperator = [-11, -10, -9, -8, -1, 2, 9, 12, 19,20,21,22]

    
    
    const onSubmit = () => {
        mutation.mutate({submitMove: {board: new_unit_positions, reserves: availabelUnits}, urlAddOn: null})
        
    }
    const mutationWithFriend = useMutation({
        mutationFn: (data: {submitMove: {board: PositionType[], reserves: unitKeys[]}, game: number | null , friend: number | null} ) => {
            let query = queryString.stringifyUrl({url: '/createGame/friend', query:{game: data.game, friend: data.friend}}, {skipNull: true})
            return api.post(query, data.submitMove)
        },
        onSuccess: () => {
            navigate("/dashboard")
          },
      })

    const mutation = useMutation({
        mutationFn: (data: {submitMove: { board: PositionType[], reserves: unitKeys[]}, urlAddOn: string | null}) => {
          return api.post(`${data.urlAddOn ? `/createGame${data.urlAddOn}` : "/createGame"}`, data.submitMove)
        },
        onSuccess: () => {
            navigate("/dashboard")
          },
      })
  
    //Calculate Home and Keep squares
    const placeKeep = (selectedKeepPosition: number) => {
    
            setKeepPosition([])
            let tempKeepSquare: number[] = []
            keepPositionOperator.forEach(e => {
                tempKeepSquare.push(selectedKeepPosition+e)
                let temp = new_unit_positions
                if(e != 0 ){
                    temp.push({square: selectedKeepPosition+e, unit: 'f'})
                }
                setNew_unit_positions(temp)
            })
            setKeepPosition(tempKeepSquare)
            
            setHomeSquare([])
            let tempHomeSquare: number[] = []
            homeSquareOperator.forEach(e => {
                if (selectedKeepPosition+e < 51){
                tempHomeSquare.push(selectedKeepPosition+e)}
            })
            setHomeSquare(tempHomeSquare)
            console.log(keepPosition)
        
    }

    const fetchFriendGames = async (): Promise<Challenges[]> => {
        const res = await api.get(`/createGame/friend`)
        return res.data
      }
    const fetchFriends = async (): Promise<{data: User[]}> => {
        const res = await api.get('/friends')
        return res.data
    }
    const getFriendGames = 
      useQuery({queryKey: ['friendgames'],queryFn: fetchFriendGames})
    const getFriends = 
        useQuery({queryKey: ['friends'], queryFn: fetchFriends})

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
        if (toPlace) return
        let tempAvailable = availabelUnits
        setShowAllSquares(false)
        const index = tempAvailable.indexOf(selected);
            if (index > -1) {
                tempAvailable.splice(index, 1)
                setAvailableUnits(tempAvailable)
                setToPlace(selected)
            }
    }

    const setObject = (square: number) => { 
        console.log(square)
        const index = new_unit_positions.findIndex((e) => e.square === square)
        if(index > -1) {return}

        if(keepPosition.length > 0){
            const index = keepPosition.findIndex(e => e == square)
            if(index > -1) {return}
        }
       
        if(toPlace) {
            if(toPlace == "F") {
                if (square <= 11 || square >= 29 || (square >= 19 && square <= 21)) {
                    return
                }
            }
            let temp = new_unit_positions
            temp.push({square: square, unit: toPlace})
            setNew_unit_positions(temp)
            if(toPlace == "F") {
                placeKeep(square)
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
            if(toPlace == "F") {
               // setSelectedKeepPosition(square)
            }
            setToPlace(undefined)
        }
    }
    // Clickable Fields 
    const renderList = () => {
        const listItems = [];
        for (let i = 1; i < 51; i++) {
            if(toPlace == "F") {
                if (i <= 11 || i >= 29 || (i >= 19 && i <= 21)) {
                    continue
                }
            }
          listItems.push(<div key={i} onClick={() => setObject(i)} style={{top: `${rankCalc(i)}%`, left: `${fileCalc(i)}%`}} className={twMerge(unitStyles({unit: "default"}), "opacity-50 bg-yellow-200")}></div>);
        }
        return listItems;
      };

    //ToDo Should players have to place a unit on every free home square?

    return (
    <div className="flex flex-col mx-auto">
        <div className="text-xl md:text-4xl my-5 text-center">{title}</div>
        <Button className="lg:hidden mx-auto" onClick={() => setShowBoard(!showBoard)}>{showBoard ? "Show Opponent Options": "Show Board"}</Button>
       
    <div>
        <div className=" p-3 flex flex-row justify-center">
            
            <div className={`${showBoard ? "" : "hidden"} lg:flex flex flex-col`}>

                <div className="h-[300px] w-[300px] md:h-[600px] md:w-[600px]  relative bg-contain shrink-0 rotate-180 bg-no-repeat  bg-game-board-fow">
                {homeSquare && availableObjects.length == 0 && homeSquare.map(index => (
                    <div onClick={() => setUnit(index)} style={{top: `${rankCalc(index)}%`, left: `${fileCalc(index)}%`}} className={twMerge(unitStyles({unit: "default"}), "opacity-50 bg-green-100")}></div>
                    ))}
                {new_unit_positions.map(unit => (
                    <Unit  onClick={() => {return}} flipped  key={unit.square} square={unit.square} unit={unit.unit}/>
                    ))}
                    
                {toPlace && ShowAllSquares && renderList()}


                </div>
                <div className="w-full h-24 mx-auto">
                {new_unit_positions.length < 7 ? (
                        <ReservesDisplay reserves={availableObjects} neutral selectedReserve={objectSelected}/>
                    ):(
                        <ReservesDisplay reserves={availabelUnits} neutral selectedReserve={unitSelected}/>
                                    
                    )}
                </div>
            </div>
           <div className={`${showBoard ? "hidden" : "block"} lg:block`}>
            <CreateGameSidebar
            title={area_title}>
               <div className="flex p-2  h-full flex-col">
                <div className="mb-5">
                    <div className="text-lg font-bold">{sec_desc.friends}:</div>
                        {getFriends.data && getFriends.data.data.map((user) => ( 
                        <div className="my-1 mx-4 justify-between flex flex-row " onClick={() => {
                            setFriendOpponent(user.id)
                            setFriendGame(null)}}>
                                {user.name} {friendOpponent == user.id ? <Check/> : <div/>}
                        </div>))}
                    <div className="text-lg font-bold">{sec_desc.games}:</div>
                        {getFriendGames.data && getFriendGames.data.map((game) => (
                        <div className="my-1 mx-4 justify-between  flex flex-row " onClick={() => {
                            setFriendOpponent(null)
                            setFriendGame(game.game_id)}}>
                                {game.game_id} {game.challenger} {friendGame == game.game_id && <Check/>}
                        </div>))}
                        </div>
                <div className="flex flex-col mt-auto mb-20 space-y-4">
                <Button className="mx-auto" disabled={availableObjects.length != 0 || availabelUnits.length > 19} variant={"default"}  onClick={onSubmit}>{prim_action}</Button>
                <Button className="mx-auto" disabled={availableObjects.length != 0 || availabelUnits.length > 19} onClick={() => mutation.mutate({submitMove: {board: new_unit_positions, reserves: availabelUnits}, urlAddOn: '/bot'})}>{sec_action.bot}</Button>
                <Button disabled={!friendOpponent && !friendGame || availableObjects.length != 0 || availabelUnits.length > 19} className="mx-auto" onClick={() => mutationWithFriend.mutate({submitMove: {board: new_unit_positions, reserves: availabelUnits}, friend: friendOpponent, game: friendGame})}>{sec_action.friends}</Button>
                    </div>
               </div>
             
            </CreateGameSidebar>
            </div>    
        </div>
       
    </div>
    </div>
    )
}