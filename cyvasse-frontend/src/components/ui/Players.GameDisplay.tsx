import { Square, User } from "lucide-react";

type PlayersGameDisplayProps = {
    onyx_player:        string;
    alabaster_player:   string;
    self_alabaster:     boolean;
}
export const PlayersGameDisplay = ({
    onyx_player,
    alabaster_player,
    self_alabaster
}: PlayersGameDisplayProps) => {
    return (
        <div className="inline-flex ml-2">
            <User className="my-auto mr-5"/>
            <div>
                <div className="flex flex-row items-center"><Square color={self_alabaster ?  "green" : "gray"} fill="white" className="w-4 h-4"/>{alabaster_player}</div>
                <div className="flex flex-row items-center"><Square color={self_alabaster ?  "gray" : "green"} fill="black" className="w-4 h-4"/>{onyx_player}</div>
            </div>
        </div>
    )
}