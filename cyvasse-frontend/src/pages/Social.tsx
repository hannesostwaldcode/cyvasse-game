import { UserCards } from "@/components/UserCards"
import { User } from "@/components/UserDisplay"
import { useSocialString } from "@/contexts/text"
import api from "@/lib/api"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export type UserWithFriend = User & {friend: {req: boolean, acc: boolean, receiv: boolean}}

export function Social() {
    const queryClient = useQueryClient()
    const {title, friends, requested, users} = useSocialString()
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
        <div className="flex flex-col p-5">
            <div className="text-2xl mx-auto">{title}</div>
            <div>
            <div className="flex flex-col text-lg">
                {friends}:
                {data.data.filter((u) => u.friend.acc).map((user) => (
                <UserCards onClick={(e) => {mutation.mutate(e)}} user={user}/>

                ))}
            </div>
            <div className="flex flex-col text-lg">  
                {requested}:
                {data.data.filter((u) => u.friend.req && !u.friend.acc).map((user) => (
                    <UserCards onClick={(e) => {mutation.mutate(e)}} user={user}/>
                    
                    ))}
            </div>
            <div className="flex flex-col text-lg">
                {users}:
                {data.data.filter((u) => !u.friend.req).map((user) => (
                    <UserCards onClick={(e) => {mutation.mutate(e)}} user={user}/>
                    
                    ))}
            </div>
            </div>
          
        </div>
    )
}