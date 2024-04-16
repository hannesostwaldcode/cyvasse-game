import { Check, MailSearch } from "lucide-react"
import { UserWithFriend } from "@/pages/Social"
import { Button } from "./ui/button";
import { useSocialString } from "@/contexts/text";
import { getCountryFlagEmoji } from "@/lib/utils";


type UserDisplayProps = {
    user:   UserWithFriend;
    onClick: (selectedUser: number) => void;
}

export const UserCards = ({
    user, 
    onClick
}: UserDisplayProps) => {
   
    const {befriend, send} = useSocialString()
    

    return (
        <div onClick={() => onClick(user.id)}  className="mx-auto flex w-2/3 h-20 items-center shrink-0 rounded-md overflow-hidden bg-slate-400">
                    <div className="ml-5 text-lg">{user.name} </div>
                    <div className="ml-5 text-lg">{getCountryFlagEmoji(user.country)} </div>
                    <div className="ml-5 text-lg">Elo: {user.elo} </div>
                    <div className={`flex flex-row h-full ml-auto items-center justify-center w-40 mr-0 ${user.friend.acc ? 'bg-green-300' : 'bg-neutral-300'}`}>
                        
                        {user.friend.req ?( 
                            user.friend.acc ? <Check/> : user.friend.receiv ? <Button>{send}</Button> : <MailSearch/>
                            ): <Button>{befriend}</Button>
                        }
                    </div>
          
        </div>
    )
}