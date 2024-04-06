import { UserCards } from "@/components/UserCards"
import { User } from "@/components/UserDisplay"
import api from "@/lib/api"
import { useMutation, useQuery } from "@tanstack/react-query"

export type UserWithFriend = User & {friend: {req: boolean, acc: boolean}}

export function Social() {

    
    const mutation = useMutation({
        mutationFn: (id: number) => {
          return api.post(`/friend-request/${id}`)
        },
        onSuccess: () => {
            
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
            Social
            {data.data.map((user) => (
            <UserCards onClick={(e) => {mutation.mutate(e)}} user={user}/>

            ))}

          
        </div>
    )
}