const BOARD_COLUMNS = 10;


export function fileCalc(tileId: number) { //row
    const file = (tileId-1) % BOARD_COLUMNS //column
    return (file)*10
}

export function rankCalc(tileId: number){
       const rank = Math.floor((tileId-1)/BOARD_COLUMNS)
       return (rank)*10
}