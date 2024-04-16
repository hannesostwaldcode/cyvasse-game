import { useArticleString } from "@/contexts/text"
import {useParams } from "react-router-dom"
import { CourseHeader } from "./learn/Course.Header"
import { GuideInfoCard } from "./learn/GuideInfoCard"

export const CourseDetail = () => {
    const params = useParams()
    if (!params.courseId){return null}
    const res = useArticleString(params.courseId)
    if (!res) {return <div>Article not found</div>}
    return (
        <div className="w-full mx-auto md:w-3/4">
        <div className="gap-3 flex flex-col">
            <CourseHeader course={res} imgUrl="lol"/>
            {res.lessons.map((e) => (
                <GuideInfoCard extract={e.extract} title={e.title} course={params.courseId}/>
            ))}
        </div>
        </div>
    )
}