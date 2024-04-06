import default_image from "@/assets/testImage.jpeg"
import { useNavigate } from "react-router-dom"

type GuideInfoCardProps = {
    title:          string
    extract:        string
    lessonAmount?:   number
    level?:          number
    lesson_text?:    string
    course?:          string
}

export const GuideInfoCard = ({
    title,
    extract,
    lessonAmount,
    level,
    course,
    lesson_text = "Lessons"
}:GuideInfoCardProps) => {
    const navigate = useNavigate()
    const calcURL = () => {
        if(course) {
            navigate(`/learn/${course}/${title}`)
        } else {
            navigate(`/learn/${title}`)
        }
    }
    return (
        <div onClick={() => calcURL()} className="p-2 h-[200px] rounded-md flex flex-row bg-slate-300">
            <div className="w-5/12 h-full"><img className="object-cover h-full w-full" src={
                default_image
            }/></div>
            <div className="flex flex-col grow ml-2">
                <div className="text-2xl">{title}</div>
                <div>{extract}</div>
                <div className="flex flex-row justify-between mt-auto"> 
                  {level &&  <div>{level}</div> }
                  {lessonAmount &&  <div>{lessonAmount} {lesson_text}</div>}
                </div>
            </div>
        </div>
    )
}