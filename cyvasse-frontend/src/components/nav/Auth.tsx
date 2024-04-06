
import { useModal } from "../../hooks/useModal"
import { useAuth } from "../provider/AuthProvider";
import { Button } from "../ui/button";


export function UserAuth() {
    const {onLogout, token } = useAuth();
    const {onOpen} = useModal()
   

    return (
        <div className="mx-3">
        {!token ? (
            <div className="space-x-3">
                <Button  onClick={() => onOpen('logIn')}>Log In</Button>
            <Button onClick={() => onOpen('signUp')}>Sign Up</Button>
            </div>
        ):(    
        <Button  className="m-5 bg-red-700" onClick={() => onLogout()}>
        Log Out
        </Button>)}
        </div>
    )
}