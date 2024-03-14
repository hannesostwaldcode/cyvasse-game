import default_image from "@/assets/testImage.jpeg"

type GuideInfoCardProps = {
    title:          string
    extract:        string
    lessonAmount:   number
    level:          number
    lesson_text?:    string
}

export const GuideInfoCard = ({
    title,
    extract,
    lessonAmount,
    level,
    lesson_text = "Lessons"
}:GuideInfoCardProps) => {
    return (
        <div className="w-[700px] p-2 h-[200px] flex flex-row bg-slate-300">
            <div className="w-5/12 h-full"><img className="object-cover h-full w-full" src={
                default_image
            }/></div>
            <div className="flex flex-col grow ml-2">
                <div className="text-2xl">{title}</div>
                <div>{extract}</div>
                <div className="flex flex-row justify-between mt-auto"> 
                    <div>{level}</div>
                    <div>{lessonAmount} {lesson_text}</div>
                </div>
            </div>
        </div>
    )
}