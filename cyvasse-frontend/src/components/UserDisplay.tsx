import { CountryCode } from "@/data/board"
import api from "@/lib/api"
import { getCountryFlagEmoji } from "@/lib/utils"
import { useQuery } from "@tanstack/react-query"
import { LucideGrid } from "lucide-react"
import userimage from "@/assets/user-image.svg"

export type User = {
    name:       string
    country:    CountryCode
    elo:        number
    id:         number
    gamePlayed: number
}
type UserDisplayProps = {
    played: string
}

export const UserDisplay = ({played}: UserDisplayProps) => {
    const fetchUser = async (): Promise<User> => {
        const res = await api.get(`/currentuser`)
        console.log(res.data)
        return res.data
    }
      
    const {isPending, error, data: user} = 
        useQuery({queryKey: ['user'],queryFn: fetchUser})
    
    if (isPending || error) return 

    return (
        <div className="flex flex-col w-[200px] text-xl">
            <div className="flex flex-row items-center ml-auto">
            <div className="w-[24px] mr-5 overflow-hidden h-[24px] rounded-sm"><img width={64} height={64} src={userimage}></img></div>
            {user.name}({user.elo}) {getCountryFlagEmoji(user.country)} 
            </div>
            <div className="flex flex-row ml-auto items-center">
                {played}: {user.gamePlayed} <LucideGrid className="ml-2"/> 
            </div>
        </div>
    )
}