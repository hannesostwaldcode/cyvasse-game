import {unitKeys } from "../components/Unit"


export const reserves: unitKeys[] = ["aB", "aB", "aD", "aH", "aS", "aS"]



export const startUnitsA: unitKeys[] = ["aR","aR","aR", "aS", "aS", "aS", "aB", "aB", "aB",
"aL", "aL", "aL", "aH", "aH", "aE", "aE", "aC", "aT", "aD", "aK"]
export const startUnitsO: unitKeys[] = ["oR","oR","oR", "oS", "oS", "oS", "oB", "oB", "oB",
"oL", "oL", "oL", "oH", "oH", "oE", "oE", "oC", "oT", "oD", "oK"]

export const emptyHomeSquares:  number[] = [8,5,6,7,15,18,25,35,37,38]

export type move = {
    startSquare: number
    endSquare: number
    isCapture: boolean
    unit?:  unitKeys 
}
export type reserve =  {
    endSquare: number
    unit: unitKeys[]
}
export const moves: move[]= [
    {startSquare: 36, endSquare: 56, isCapture: false}
]
