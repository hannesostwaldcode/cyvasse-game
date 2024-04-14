import { Button } from "@/components/ui/button";
import Board from "@/assets/Board.png"
import { Book, Gamepad } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useHomeString } from "@/contexts/text";

export function Home() {
    const navigate = useNavigate()
    const {title, prim_action, sec_action} = useHomeString()
    return (
      
            <div className="flex flex-col md:flex-row space-x-5 mx-10 mt-10">
                <div className="w-1/2">
                <img className="cover"  src={Board}></img>
                </div>
                <div className="flex flex-col text-center items-center space-y-10">
                    <div className="text-3xl text-white">{title}</div>
                    <Button onClick={() => navigate('/createGame')} className="h-auto">
                        <div className="flex-row flex items-center">
                            <Gamepad className="w-8 h-8 mr-6"/>
                            <div className="mr-12">
                                <div className="text-2xl">{prim_action.title}</div>
                                <div className="text-sm">{prim_action.text}</div>
                            </div>
                        </div>
                        </Button>

                    <Button onClick={() => navigate('/learn')} className="h-auto" variant={"secondary"}>
                            <div className="flex-row flex items-center">
                            <Book className="w-8 h-8 mr-6"/>
                            <div className="mr-12">
                                <div className="text-2xl">{sec_action.title}</div>
                                <div className="text-sm">{sec_action.text}</div>
                            </div>
                        </div>
                        </Button>
                </div>
            </div>
         
    )
}