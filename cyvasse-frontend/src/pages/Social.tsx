import { UserCards } from "@/components/UserCards"
import { User } from "@/components/UserDisplay"
import { useSocialString } from "@/contexts/text"
import api from "@/lib/api"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export type UserWithFriend = User & {friend: {req: boolean, acc: boolean, receiv: boolean}}

export function Social() {
    const queryClient = useQueryClient()
    const {title} = useSocialString()
    const mutation = useMutation({
        mutationFn: (id: number) => {
          return api.post(`/friend-request/${id}`)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['friend-requests'] })
          },
      })

      const fetchUser = async (): Promise<{data: UserWithFriend[]}> => {
        const res = await api.get(`/friend-request`)
        return res.data
    }
 
    const {isPending, error, data} = 
        useQuery({queryKey: ['friend-requests'],queryFn: fetchUser})
    
    
    if(isPending || error) {
        return (
            //mutation.mutate(user.id
            <div>
                Loading...
            </div>
        )
    }

    return(
        <div>
            <div className="text-2xl">{title}</div>
            <div>
            <div className="flex flex-col">
                Friends:
                {data.data.filter((u) => u.friend.acc).map((user) => (
                <UserCards onClick={(e) => {mutation.mutate(e)}} user={user}/>

                ))}
            </div>
            <div className="flex flex-col">  
                Requested:
                {data.data.filter((u) => u.friend.req && !u.friend.acc).map((user) => (
                    <UserCards onClick={(e) => {mutation.mutate(e)}} user={user}/>
                    
                    ))}
            </div>
            <div className="flex flex-col">
                Users:
                {data.data.filter((u) => !u.friend.req).map((user) => (
                    <UserCards onClick={(e) => {mutation.mutate(e)}} user={user}/>
                    
                    ))}
            </div>
            </div>
          
        </div>
    )
}