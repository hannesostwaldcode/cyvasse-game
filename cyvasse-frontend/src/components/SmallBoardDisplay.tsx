import { PositionType, Unit } from "./Unit"

interface SmallBoardDisplayProps {
    board:              PositionType[]
    alabasterPlayer:    boolean

}
export function SmallBoardDisplay({
    board,
    alabasterPlayer,
}: SmallBoardDisplayProps) {

    return  <div  className={`h-[150px] w-[150px]  flex-none relative bg-contain bg-no-repeat  bg-game-board ${alabasterPlayer ? "rotate-180" : ""}`}>
        
    {board.map(unit => (
        <Unit onClick={() => {}} flipped={alabasterPlayer} key={unit.square} square={unit.square} unit={unit.unit}/>
        ))}
    </div>
}