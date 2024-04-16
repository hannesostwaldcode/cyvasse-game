import { UserCards } from "@/components/UserCards"
import { User } from "@/components/UserDisplay"
import { useSocialString } from "@/contexts/text"
import api from "@/lib/api"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"

export type UserWithFriend = User & {friend: {req: boolean, acc: boolean, receiv: boolean}}

export function Social() {
    const queryClient = useQueryClient()
    const {title, friends, requested, users} = useSocialString()
    const [filteredUsers, setFilteredUsers] = useState<UserWithFriend[]>([]);
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
        setFilteredUsers(res.data.data)
        return res.data
    }
 
    const {isPending, error, data} = 
        useQuery({queryKey: ['friend-requests'],queryFn: fetchUser})
    
    const handleFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!data?.data){return}
        const value = event.target.value;
        const filtered = data.data.filter(user => user.name.toLowerCase().includes(value.toLocaleLowerCase()));
        setFilteredUsers(filtered);
        };
    
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
                <div className="w-48 ml-auto">
                <input  type="text" placeholder="Search Users..." onChange={handleFilter} />
                </div>
                {friends}:
            <div className="flex flex-col gap-4 text-lg">
                
                {filteredUsers.filter((u) => u.friend.acc).map((user) => (
                <UserCards onClick={(e) => {mutation.mutate(e)}} user={user}/>

                ))}
            </div>
            {requested}:
            <div className="flex flex-col gap-4 text-lg">  
                
                {filteredUsers.filter((u) => u.friend.req && !u.friend.acc).map((user) => (
                    <UserCards onClick={(e) => {mutation.mutate(e)}} user={user}/>
                    
                    ))}
            </div>
            {users}:
            <div className="flex max-h-[600px] gap-4 overflow-scroll flex-col text-lg">
                
                {filteredUsers.filter((u) => !u.friend.req).map((user) => (
                    <UserCards onClick={(e) => {mutation.mutate(e)}} user={user}/>
                    
                    ))}
            </div>
            </div>
          
        </div>
    )
}