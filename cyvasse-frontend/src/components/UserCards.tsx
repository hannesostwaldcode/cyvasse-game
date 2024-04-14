import { Check, MailSearch } from "lucide-react"
import { UserWithFriend } from "@/pages/Social"
import { Button } from "./ui/button";
import { useSocialString } from "@/contexts/text";


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
        <div onClick={() => onClick(user.id)}  className="">
            
                    <div className={`flex flex-row p-4 justify-between items-baseline ${user.friend.acc ? 'bg-green-300' : 'bg-neutral-300'}`}>
                        {user.name} 
                        {user.friend.req ?( 
                            user.friend.acc ? <Check/> : user.friend.receiv ? <Button>{send}</Button> : <MailSearch/>
                            ): <Button>{befriend}</Button>
                        }
                    </div>
          
        </div>
    )
}