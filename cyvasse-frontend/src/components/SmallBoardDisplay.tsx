import { cva } from "class-variance-authority"
import { PositionType, Unit } from "./Unit"
import { twMerge } from "tailwind-merge"

interface SmallBoardDisplayProps {
    board:              PositionType[]
    alabasterPlayer:    boolean
    size?: "small" | "large" | "xl" | "tiny"

}

export const boardStyle = cva(["flex-none", "relative", "bg-contain", "bg-no-repeat",  "bg-game-board" ],{
    variants: {
        size: {
            tiny: ["w-[100px]", "h-[100px]"],
            small: ["w-[150px]", "h-[150px]"],
            large: ["w-[300px]", "h-[300px]"],
            xl: ["w-[450px]", "h-[450px]"],
            
        }
        
    },
    defaultVariants: {
        size: "small"
    }
})
export function SmallBoardDisplay({
    board,
    alabasterPlayer,
    size = "small"
}: SmallBoardDisplayProps) {

    return  <div className={twMerge(boardStyle({size: size}), alabasterPlayer ? "rotate-180" : "")}>
        
    {board.map(unit => (
        <Unit onClick={() => {}} flipped={alabasterPlayer} key={unit.square} square={unit.square} unit={unit.unit}/>
        ))}
    </div>
}