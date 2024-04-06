import { ReactNode, useState } from "react"
import { Button } from "./ui/button"
import { ArrowLeft } from "lucide-react"

type CreateGameSidebarProps = {
    children: ReactNode
    actionButton: ReactNode
    secondary: ReactNode

}

export const CreateGameSidebar = ({children, actionButton, secondary}: CreateGameSidebarProps) => {
    const [showFriends, setShowFriends] = useState(false)
    return (
        <div className="bg-slate-800 rounded-md overflow-hidden h-[200px] ml-10 w-[300px] md:h-[600px]">
            <div className="bg-slate-900 text-neutral-300 mx p-3 font-bold text-2xl text-center">
                New Game
            </div>
            <div className="h-[100px] md:h-[200px] overflow-y-scroll">
            {children}
            </div>
            { !showFriends ?
            (<div className="flex md:flex-col">
            <Button className="w-1/2 mx-auto mt-5" onClick={() => setShowFriends(true)} variant={"secondary"}>Play Against Friends</Button>
            
             
             <div className="mx-auto mt-5">
              {actionButton}
              </div>
              </div>
              ): (
                
              <div className="mx-auto">
                <Button className="" onClick={() => setShowFriends(false)} variant={"link"}><ArrowLeft/></Button>
                {secondary}
                
              </div>)}
        </div>
    )
}