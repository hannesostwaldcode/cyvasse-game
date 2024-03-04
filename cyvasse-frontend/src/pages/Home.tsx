import { Button } from "@/components/ui/button";
import Board from "@/assets/Board.png"
import { Book, Gamepad } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function Home() {
    const navigate = useNavigate()
    return (
        <div className="w-full mx-20 mt-10">
            <div className="flex flex-row space-x-5">
                <img width={500} height={500} src={Board}></img>
                <div className="flex flex-col text-center items-center space-y-10">
                    <div className="text-3xl text-white">Play Cyvasse! A game inspired by Game of Thrones</div>
                    <div>Stats Row</div>
                    <Button onClick={() => navigate('/createGame')} className="h-auto">
                        <div className="flex-row flex items-center">
                            <Gamepad className="w-8 h-8 mr-6"/>
                            <div className="mr-12">
                                <div className="text-2xl">Play Online</div>
                                <div className="text-sm">Play against someone on your level</div>
                            </div>
                        </div>
                        </Button>

                    <Button onClick={() => navigate('/learn')} className="h-auto" variant={"secondary"}>
                            <div className="flex-row flex items-center">
                            <Book className="w-8 h-8 mr-6"/>
                            <div className="mr-12">
                                <div className="text-2xl">Learn</div>
                                <div className="text-sm">Use our tutorials to get started</div>
                            </div>
                        </div>
                        </Button>
                </div>
            </div>
            
        </div>
    )
}