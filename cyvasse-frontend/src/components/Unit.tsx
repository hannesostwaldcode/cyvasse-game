import { VariantProps, cva } from "class-variance-authority"
import { positionCalc } from "../utils/positionCalc"

export const squareVariants = {
    0: [],
    1: ["top-[0%]", "right-[90%]"],
    2: ["top-[0%]", "right-[80%]"],
    3: ["top-[0%]", "right-[70%]"],
    4: ["top-[0%]", "right-[60%]"],
    5: ["top-[0%]", "right-[50%]"],
    6: ["top-[0%]", "right-[40%]"],
    7: ["top-[0%]", "right-[30%]"],
    8: ["top-[0%]", "right-[20%]"],
    9: ["top-[0%]", "right-[10%]"],
    10: ["top-[0%]", "right-[0%]"],
    11: ["top-[10%]", "right-[90%]"],
    12: ["top-[10%]", "right-[80%]"],
    13: ["top-[10%]", "right-[70%]"],
    14: ["top-[10%]", "right-[60%]"],
    15: ["top-[10%]", "right-[50%]"],
    16: ["top-[10%]", "right-[40%]"],
    17: ["top-[10%]", "right-[30%]"],
    18: ["top-[10%]", "right-[20%]"],
    19: ["top-[10%]", "right-[10%]"],
    20: ["top-[10%]", "right-[0%]"],
    21: ["top-[20%]", "right-[90%]"],
    22: ["top-[20%]", "right-[80%]"],
    23: ["top-[20%]", "right-[70%]"],
    24: ["top-[20%]", "right-[60%]"],
    25: ["top-[20%]", "right-[50%]"],
    26: ["top-[20%]", "right-[40%]"],
    27: ["top-[20%]", "right-[30%]"],
    28: ["top-[20%]", "right-[20%]"],
    29: ["top-[20%]", "right-[10%]"],
    30: ["top-[20%]", "right-[0%]"],
    31: ["top-[30%]", "right-[90%]"],
    32: ["top-[30%]", "right-[80%]"],
    33: ["top-[30%]", "right-[70%]"],
    34: ["top-[30%]", "right-[60%]"],
    35: ["top-[30%]", "right-[50%]"],
    36: ["top-[30%]", "right-[40%]"],
    37: ["top-[30%]", "right-[30%]"],
    38: ["top-[30%]", "right-[20%]"],
    39: ["top-[30%]", "right-[10%]"],
    40: ["top-[30%]", "right-[0%]"],
    41: ["top-[40%]", "right-[90%]"],
    42: ["top-[40%]", "right-[80%]"],
    43: ["top-[40%]", "right-[70%]"],
    44: ["top-[40%]", "right-[60%]"],
    45: ["top-[40%]", "right-[50%]"],
    46: ["top-[40%]", "right-[40%]"],
    47: ["top-[40%]", "right-[30%]"],
    48: ["top-[40%]", "right-[20%]"],
    49: ["top-[40%]", "right-[10%]"],
    50: ["top-[40%]", "right-[0%]"],
    51: ["top-[50%]", "right-[90%]"],
    52: ["top-[50%]", "right-[80%]"],
    53: ["top-[50%]", "right-[70%]"],
    54: ["top-[50%]", "right-[60%]"],
    55: ["top-[50%]", "right-[50%]"],
    56: ["top-[50%]", "right-[40%]"],
    57: ["top-[50%]", "right-[30%]"],
    58: ["top-[50%]", "right-[20%]"],
    59: ["top-[50%]", "right-[10%]"],
    60: ["top-[50%]", "right-[0%]"],
    61: ["top-[60%]", "right-[90%]"],
    62: ["top-[60%]", "right-[80%]"],
    63: ["top-[60%]", "right-[70%]"],
    64: ["top-[60%]", "right-[60%]"],
    65: ["top-[60%]", "right-[50%]"],
    66: ["top-[60%]", "right-[40%]"],
    67: ["top-[60%]", "right-[30%]"],
    68: ["top-[60%]", "right-[20%]"],
    69: ["top-[60%]", "right-[10%]"],
    70: ["top-[60%]", "right-[0%]"],
    71: ["top-[70%]", "right-[90%]"],
    72: ["top-[70%]", "right-[80%]"],
    73: ["top-[70%]", "right-[70%]"],
    74: ["top-[70%]", "right-[60%]"],
    75: ["top-[70%]", "right-[50%]"],
    76: ["top-[70%]", "right-[40%]"],
    77: ["top-[70%]", "right-[30%]"],
    78: ["top-[70%]", "right-[20%]"],
    79: ["top-[70%]", "right-[10%]"],
    80: ["top-[70%]", "right-[0%]"],
    81: ["top-[80%]", "right-[90%]"],
    82: ["top-[80%]", "right-[80%]"],
    83: ["top-[80%]", "right-[70%]"],
    84: ["top-[80%]", "right-[60%]"],
    85: ["top-[80%]", "right-[50%]"],
    86: ["top-[80%]", "right-[40%]"],
    87: ["top-[80%]", "right-[30%]"],
    88: ["top-[80%]", "right-[20%]"],
    89: ["top-[80%]", "right-[10%]"],
    90: ["top-[80%]", "right-[0%]"],
    91: ["top-[90%]", "right-[90%]"],
    92: ["top-[90%]", "right-[80%]"],
    93: ["top-[90%]", "right-[70%]"],
    94: ["top-[90%]", "right-[60%]"],
    95: ["top-[90%]", "right-[50%]"],
    96: ["top-[90%]", "right-[40%]"],
    97: ["top-[90%]", "right-[30%]"],
    98: ["top-[90%]", "right-[20%]"],
    99: ["top-[90%]", "right-[10%]"],
    100: ["top-[90%]", "right-[0%]"],

}

const unitVariants = {
    default: [""],
    aB:     ["bg-aB"],
    aCa:    ["bg-aCa"],
    aCs:    ["bg-aCs","w-[20%]", "h-[20%]"],
    aD: ["bg-aD"],
    aE: ["bg-aE"],
    aH: ["bg-aH"],
    aK: ["bg-aK"],
    aL: ["bg-aL"],
    am: ["bg-am"],
    aS: ["bg-aS"],
    aT: ["bg-aT"],
    oB: ["bg-oB"],
    oCa:    ["bg-oCa"],
    oCs:    ["bg-oCs","w-[20%]", "h-[20%]"],
    oD: ["bg-oD"],
    oE: ["bg-oE"],
    oH: ["bg-oH"],
    oK: ["bg-oK"],
    oL: ["bg-oL"],
    oT: ["bg-oT"],
    om: ["bg-om"],
    oS: ["bg-oS"],
}

export const unitStyles = cva(["bg-contain"],{
    variants: {
        style: {
            icon: ["w-6", "h-6", "static"],
            default: [ "absolute", "w-[10%]", "h-[10%]", ], 
            
        },
        square: squareVariants,
        unit: unitVariants,
        
    },
    defaultVariants: {
        style: "default",
        square: 0,
        unit: "default"
    }
})

export type UnitStyles = VariantProps<typeof unitStyles>


export type UnitProps = UnitStyles & {
    onClick: (square: squareKeys) => void;
}

export type squareKeys = keyof typeof squareVariants | null | undefined 
export type unitKeys = keyof typeof unitVariants | null | undefined

export function Unit({square, unit, onClick}: UnitProps) {
    return (
    <div
    style={positionCalc(3)}
    onClick={() => onClick(square)}
    className={unitStyles({square, unit})}
    />
    )
}