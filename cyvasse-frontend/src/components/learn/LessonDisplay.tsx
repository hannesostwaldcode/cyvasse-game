import { useLessonString } from "@/contexts/text"
import { useParams } from "react-router-dom"
import video from "@/assets/Overview_ENG.mp4"

export const LessonDisplay = () => {
    const params = useParams()
    if (!params.courseId || !params.lessonId){return null}
    const res = useLessonString(params.courseId, params.lessonId)
    if (!res) {return <div>Article not found</div>}
    return (
        <div className="w-full mx-auto">
        <div className="flex flex-row justify-around">
            <video width={900} height={720} autoPlay controls src={video}/>
            
            <div className="w-[400px] ml-5 bg-slate-800 rounded-md">
            <div className="w-full bg-slate-900 font-bold text-2xl rounded-t-md">{res.title}</div>
                    {res.text}
            </div>
        </div>
        </div>
    )
}