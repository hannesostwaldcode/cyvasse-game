import { useState } from "react";
import { Navigate, redirect, useNavigate } from "react-router-dom";
import { PositionType, Unit, unitKeys, unitStyles } from "../components/Unit";
import {startUnits} from "../data/board";
import { twMerge } from "tailwind-merge";
import { fileCalc, rankCalc } from "../lib/positionCalc";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuth } from "@/components/provider/Auth-Provider";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { ReservesDisplay } from "@/components/ReservesDisplay";



export function CreateGame() {
    const {token} = useAuth()
    const navigate = useNavigate()
    if (!token) {
      return <Navigate to="/" replace />;
    }

    const [availableObjects, setavailableObjects] = useState<unitKeys[]>(["F", "m", "m", "m"])
    const [availabelUnits, setAvailableUnits] = useState(startUnits)
    const [new_unit_positions, setNew_unit_positions] = useState<PositionType[]>([])
    const [toPlace, setToPlace] = useState<unitKeys>(undefined) 
    const [ShowAllSquares, setShowAllSquares] = useState(true)
    const [keepPosition, setKeepPosition] = useState<number[]>([])
    const [homeSquare, setHomeSquare] = useState<number[]>([])
    const keepPositionOperator = [1,10,11, 0]
    const homeSquareOperator = [-11, -10, -9, -8, -1, 2, 9, 12, 19,20,21,22]
   
    
    
    const onSubmit = () => {
        mutation.mutate({board: new_unit_positions, reserves: availabelUnits})
    }

    const mutation = useMutation({
        mutationFn: (submitMove: { board: PositionType[], reserves: unitKeys[]}) => {
          return api.post(`/createGame`, submitMove, {headers: {
            Authorization: 'Bearer ' + token
          }})
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
          listItems.push(<div key={i} onClick={() => setObject(i)} style={{top: `${rankCalc(i)}%`, left: `${fileCalc(i)}%`}} className={twMerge(unitStyles({unit: "default"}), "opacity-50 bg-yellow-200")}></div>);
        }
        return listItems;
      };

    //ToDo Should players have to place a unit on every free home square?

    return (
    <div className="flex flex-col mx-auto">
        <div className="text-2xl text-center space-y-5">Place your Units!</div>
    <div className="flex flex-row">
        <div className="p-3 flex justify-center">
            
            <div className="h-[600px] w-[600px] ml-10 relative bg-contain rotate-180 bg-no-repeat  bg-game-board-fow">
                
            {new_unit_positions.map(unit => (
                        <Unit  onClick={() => {return}} flipped  key={unit.square} square={unit.square} unit={unit.unit}/>
                        ))}
                {homeSquare && availableObjects.length == 0 && homeSquare.map(index => (
                    <div onClick={() => setUnit(index)} style={{top: `${rankCalc(index)}%`, left: `${fileCalc(index)}%`}} className={twMerge(unitStyles({unit: "default"}), "opacity-50 bg-green-200")}></div>
                ))}
            {toPlace && ShowAllSquares && renderList()}

           

            </div>
            <div className="bg-slate-800 overflow-scroll w-40 h-[600px]">
                {new_unit_positions.length < 7 ? (
                    <ReservesDisplay reserves={availableObjects} neutral selectedReserve={objectSelected}/>
                ):(
                    <ReservesDisplay reserves={availabelUnits} neutral selectedReserve={unitSelected}/>
                                
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