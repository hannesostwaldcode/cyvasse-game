import { useLearnString } from "@/contexts/text"
import { GuideInfoCard } from "./learn/GuideInfoCard"

export const CourseOverview = () => {
    const {sections} = useLearnString()
    return (
        <div className="mx-auto w-3/4">
        {sections.map(section => (
                    
            <div key={section.title} className="flex my-10 flex-col gap-6">
                 <div className="text-2xl font-bold">{section.title}</div>

            {section.courses.map((e) => (
                <GuideInfoCard
                title={e.title}
                extract={e.extract}
                lessonAmount={e.lessonCount}
                level={e.level}
                key={e.title}
                />
            ))}
        </div>

        ))}
 </div>
    )
}