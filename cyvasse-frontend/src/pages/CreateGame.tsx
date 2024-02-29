import { useEffect, useState } from "react";
import { Navigate, redirect } from "react-router-dom";
import { PositionType, Unit, unitKeys, unitStyles } from "../components/Unit";
import {startUnitsA, startUnitsO } from "../data/board";
import { twMerge } from "tailwind-merge";
import { fileCalc, rankCalc } from "../lib/positionCalc";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuth } from "@/components/provider/Auth-Provider";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";



export function CreateGame() {
    const {token} = useAuth()
    if (!token) {
      return <Navigate to="/" replace />;
    }

    const [availableObjects, setavailableObjects] = useState<unitKeys[]>(["aF", "am", "am", "am"])
    const [availabelUnits, setAvailableUnits] = useState(startUnitsA)
    const [new_unit_positions, setNew_unit_positions] = useState<PositionType[]>([])
    const [toPlace, setToPlace] = useState<unitKeys>(undefined) 
    const [placedObj, setPlacedObj] = useState(false)
    const [selectedKeepPosition, setSelectedKeepPosition] = useState<number| undefined>(undefined)
    const [keepPosition, setKeepPosition] = useState<number[]>([])
    const [homeSquare, setHomeSquare] = useState<number[]>([])
    const keepPositionOperator = [1,10,11, 0]
    const homeSquareOperator = [-11, -10, -9, -8, -1, 2, 9, 12, 19,20,21,22]
   
    
    const fetchActiveGame = async (): Promise<{gameId: number}> => {
        const res = await api.get(`/createGame`, {headers: {
            Authorization: 'Bearer ' + token
          }})
        return res.data
    }

    const {isPending, error, data: gameId} = 
    useQuery({queryKey: ['activeGames'], queryFn: fetchActiveGame})

    const onSubmit = () => {
        mutation.mutate({board: new_unit_positions, boardId: gameId?.gameId, reserves: availabelUnits})
    }

    const mutation = useMutation({
        mutationFn: (submitMove: {boardId: undefined | number, board: PositionType[], reserves: unitKeys[]}) => {
          return api.post(`/createGame`, submitMove, {headers: {
            Authorization: 'Bearer ' + token
          }})
        },
        onSuccess: () => {
            redirect("/")
          },
      })

    //Change which Set to use
    useEffect(() => {
        if (typeof gameId?.gameId == "number") {
            setavailableObjects(["oF", "om", "om", "om"])
            setAvailableUnits(startUnitsO)
        }
    },[gameId])
    //Calculate Home and Keep squares
    useEffect(() => {
        if(selectedKeepPosition){
            setKeepPosition([])
            let tempKeepSquare: number[] = []
            keepPositionOperator.forEach(e => {
                tempKeepSquare.push(selectedKeepPosition+e)
                let temp = new_unit_positions
                if(e != 0){
                    temp.push({square: selectedKeepPosition+e, unit: gameId?.gameId ? 'of' : 'af'})
                }
                setNew_unit_positions(temp)
            })
            setKeepPosition(tempKeepSquare)
            
            setHomeSquare([])
            let tempHomeSquare: number[] = []
            homeSquareOperator.forEach(e => tempHomeSquare.push(selectedKeepPosition+e))
            setHomeSquare(tempHomeSquare)
            console.log(keepPosition)
        }
    },[selectedKeepPosition])

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
        let tempAvailable = availabelUnits
        setPlacedObj(true)
        const index = tempAvailable.indexOf(selected);
            if (index > -1) {
                tempAvailable.splice(index, 1)
                setAvailableUnits(tempAvailable)
                setToPlace(selected)
            }
    }

    const setObject = (square: number) => {
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
            if(toPlace == "aF" || toPlace == "oF") {
                setSelectedKeepPosition(square)
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
            if(toPlace == "aF") {
                setSelectedKeepPosition(square)
            }
            setToPlace(undefined)
        }
    }
    // Clickable Fields 
    const renderList = () => {
        const start = gameId?.gameId ? 51 : 1
        const end = gameId?.gameId ? 101: 51
        const listItems = [];
        for (let i = start; i < end; i++) {
          listItems.push(<div onClick={() => setObject(i)} style={{top: `${rankCalc(i)}%`, left: `${fileCalc(i)}%`}} className={twMerge(unitStyles({unit: "default"}), "opacity-50 bg-yellow-200")}></div>);
        }
        return listItems;
      };

    //ToDo Should players have to place a unit on every free home square?

    if (isPending) return 'Loading...'

    if (error) return 'An error has occurred: ' + error.message

    return (
    <div className="flex flex-col">
    <div className="flex flex-row">
        <div className="p-3 flex justify-center">
            <div className="h-[600px] w-[600px] ml-10 relative bg-contain bg-no-repeat  bg-game-board">
            {new_unit_positions.map(unit => (
                        <Unit  onClick={() => {return}}  key={unit.square} square={unit.square} unit={unit.unit}/>
                        ))}
                {homeSquare && availableObjects.length == 0 && homeSquare.map(index => (
                    <div onClick={() => setUnit(index)} style={{top: `${rankCalc(index)}%`, left: `${fileCalc(index)}%`}} className={twMerge(unitStyles({unit: "default"}), "opacity-50 bg-green-200")}></div>
                ))}
            {toPlace && !placedObj && renderList()}

           

            </div>
            <div className="bg-slate-800 overflow-scroll w-40 h-[600px] grid grid-cols-2">
                {availableObjects.length != 0 ? (
                 availableObjects.map(unit => (
                    <div onClick={() => objectSelected(unit)} className={`bg-cover w-20 h-20 bg-${unit}`}></div>
               ))
                ):(
                    availabelUnits.map(unit => (
                        <div onClick={() => unitSelected(unit)} className={`bg-cover w-20 h-20 bg-${unit}`}></div>
                    ))
                
                )}
               

                
            </div>
        </div>
    </div>
    {availableObjects.length == 0 && 
                <div>
                    <Button variant={"default"} size={"lg"} onClick={onSubmit}>Submit</Button>
                </div>
                }
    </div>
    )
}