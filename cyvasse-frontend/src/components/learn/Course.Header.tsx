import default_bg from "@/assets/Board.png"
import { Course } from "@/contexts/text"
type CourseHeaderProps = {
    imgUrl:         string
    course:       Course
}

export const CourseHeader = ({
    course,
    imgUrl,
} : CourseHeaderProps) => {
    return (
        <div className="h-auto overflow-hidden rounded-md bg-slate-700 flex flex-col">
            <div><img src={default_bg} className="w-full object-cover object-top h-[350px] " alt={imgUrl}/></div>
            <div className="p-3">
            <div className="font-bold text-3xl">{course.title}</div>
            <div className="font-semibold text-md">{course.extract}</div>
            <div>{course.text}</div>
            <div className="font-semibold text-md">{course.listTitle}</div>
            <ul className="list-inside list-disc">
                {course.listItems.map((e) => (
                    <li>{e}</li>
                ))}
            </ul>
            </div>
        </div>
    )
}