const BOARD_COLUMNS = 10;


export function positionCalc(tileId: number) {
    const rank = Math.floor(tileId/BOARD_COLUMNS) //row
    const file = tileId % BOARD_COLUMNS //column
    
    return {top: `${(rank-1) *10}%`, right: `${(10-file)*10}`}
}