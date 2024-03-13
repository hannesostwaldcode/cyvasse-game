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
        <div className="w-[600px] h-[150px] flex flex-row bg-slate-300">
            <div className="w-1/3">Image</div>
            <div className="flex flex-col grow m-3">
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