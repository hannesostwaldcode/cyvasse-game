import { useLessonString } from "@/contexts/text"
import { useParams } from "react-router-dom"

export const LessonDisplay = () => {
    const params = useParams()
    if (!params.courseId || !params.lessonId){return null}
    const res = useLessonString(params.courseId, params.lessonId)
    if (!res) {return <div>Article not found</div>}
    return (
        <div className="w-full mx-auto">
        <div className="flex flex-row justify-around">
           
            <div className="w-[400px] ml-5 bg-slate-600 rounded-md">
            <div className="w-full bg-slate-700 font-bold text-2xl p-5 rounded-t-md">{res.title}</div>
                <div className="p-5">    {res.text} </div>
            </div>
        </div>
        </div>
    )
}