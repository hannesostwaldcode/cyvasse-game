import { VariantProps, cva } from "class-variance-authority"
import { fileCalc, rankCalc } from "../lib/positionCalc"
import { twMerge } from "tailwind-merge"

export const unitVariants = {
    default: [""],
    C:    ["bg-C", "contrast-50"],
    B:     ["bg-B", "contrast-50"],
    f:    [""],
    x:    ["bg-x","w-[20%]", "h-[20%]", "contrast-50"],
    F:    ["bg-F","w-[20%]", "h-[20%]", "contrast-50"],
    D: ["bg-D", "contrast-50"],
    E: ["bg-E", "contrast-50"],
    H: ["bg-H", "contrast-50"],
    K: ["bg-K", "contrast-50"],
    L: ["bg-L", "contrast-50"],
    m: ["bg-m", "contrast-50"],
    S: ["bg-S", "contrast-50"],
    T: ["bg-T", "contrast-50"],
    R: ["bg-R", "contrast-50"],

    aC:    ["bg-aC"],
    aB:     ["bg-aB"],
    af:    [""],
    aF:    ["bg-aF","w-[20%]", "h-[20%]"],
    ax:    ["bg-ax","w-[20%]", "h-[20%]"],
    aD: ["bg-aD"],
    aE: ["bg-aE"],
    aH: ["bg-aH"],
    aK: ["bg-aK"],
    aL: ["bg-aL"],
    am: ["bg-am"],
    aS: ["bg-aS"],
    aT: ["bg-aT"],
    aR: ["bg-aR"],

    oR:["bg-oR"],
    oB: ["bg-oB"],
    oC:    ["bg-oC"],
    of:    [""],
    ox:    ["bg-ox","w-[20%]",  "h-[20%]"],
    oF:    ["bg-oF","w-[20%]", "h-[20%]"],
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
            default: [ "absolute", "w-[10%]", "h-[10%]"],
            default_flip: [ "absolute", "w-[10%]", "h-[10%]", "rotate-180"]
            
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
    flipped?: boolean
}

export type PositionType = UnitStyles &
{ square: number}

export type unitKeys = keyof typeof unitVariants | null | undefined

export function Unit({square,flipped = false, unit, onClick}: UnitProps) {
    return (
    <div
    style={{left: `${fileCalc(square)}%`, top: `${rankCalc(square)}%`}}
    onClick={() => onClick(square)}
    className={twMerge(unitStyles({unit}), flipped ? "rotate-180" : "")}
    />
    )
}