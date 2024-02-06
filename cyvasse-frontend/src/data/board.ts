import {PositionType, unitKeys } from "../components/Unit"

export const unit_positions: PositionType[] = 
[{square: 23, unit: "aB"}, 
{square: 1, unit: "aCa"},
{square: 28, unit: "aD"}, 
{square: 9, unit: "aE"}, 
{square: 36, unit: "aH"}, 
{square: 44, unit: "aK"},
{square: 33, unit: "aL"}, 
{square: 42, unit: "am"},
{square: 48, unit: "aS"}, 
{square: 20, unit: "aT"}, 
{square: 16, unit: "aCs"},

{square: 54, unit: "oB"}, 
{square: 56, unit: "oCa"},
{square: 63, unit: "oD"}, 
{square: 78, unit: "oE"}, 
{square: 64, unit: "oH"}, 
{square: 66, unit: "oK"},
{square: 70, unit: "oL"}, 
{square: 73, unit: "om"},
{square: 80, unit: "oS"}, 
{square: 99, unit: "oT"}, 
{square: 76, unit: "oCs"},
]

export const reserves: unitKeys[] = ["aB", "aB", "aD", "aH", "aS", "aS"]



export const startUnits: unitKeys[] = ["aS", "aS", "aS", "aB", "aB", "aB",
"aL", "aL", "aL", "aH", "aH", "aE", "aE", "aCa", "aT", "aD", "aK"]

export const emptyHomeSquares:  number[] = [8,5,6,7,15,18,25,35,37,38]

export type move = {
    startSquare: number
    captureSquares: number[]
    moveSquares: number[]
}

export const moves: move[]= [
    {startSquare: 36, captureSquares: [56], moveSquares:[34,35,37,38,39,40,46]}
]

export const alabasterKeys: number[] = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20
,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50] 