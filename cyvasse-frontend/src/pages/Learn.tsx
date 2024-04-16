import { Button } from "@/components/ui/button"
import {useLearnString } from "@/contexts/text"
import { ArrowLeft, GraduationCap } from "lucide-react"
import { Outlet, useNavigate } from "react-router-dom"

export function Learn() {
    const {title} = useLearnString()
    const navigate = useNavigate()
    
    return (
        <div className="flex flex-col h-screen">
            <div className="flex flex-row mt-5 mx-5">
            <Button className="" onClick={() => navigate(-1)}><ArrowLeft className="h-6 w-6"/></Button>
            <div className="w-full text-center justify-around mb-10">
                    <div className="text-5xl font-semibold inline-flex"><GraduationCap className="h-10 my-auto w-10 mr-5"/> {title}</div>  
            </div>
            </div>
           <div className="overflow-auto">
            <Outlet/>
            </div>
        </div>
    )
}