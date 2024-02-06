import { VariantProps, cva } from "class-variance-authority"
import { fileCalc, rankCalc } from "../utils/positionCalc"


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
        unit: unitVariants,
        
    },
    defaultVariants: {
        style: "default",
        unit: "default"
    }
})

export type UnitStyles = VariantProps<typeof unitStyles>


export type UnitProps = UnitStyles & {
    onClick: (square: number) => void;
    square: number
}

export type PositionType = UnitStyles &
{ square: number}

export type unitKeys = keyof typeof unitVariants | null | undefined

export function Unit({square, unit, onClick}: UnitProps) {
    return (
    <div
    style={{left: `${fileCalc(square)}%`, top: `${rankCalc(square)}%`}}
    onClick={() => onClick(square)}
    className={unitStyles({unit})}
    />
    )
}