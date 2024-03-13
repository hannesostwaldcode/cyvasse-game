import { GuideInfoCard } from "@/components/GuideInfoCard"
import {useLearnString } from "@/contexts/text"

export function Learn() {
    const {subtitle, title, sections} = useLearnString()
    return (
            <div className="flex flex-col mx-auto mt-10">
                <div className="text-3xl font-semibold">{title}</div>
                <div className="text-2xl mb-10">{subtitle}</div>
                {sections.map(section => (
                    
                    <div key={section.title} className="flex flex-col gap-6">
                         <div className="text-2xl">{section.title}</div>
    
                    {section.articles.map((e) => (
                        <GuideInfoCard
                        title={e.title}
                        extract={e.extract}
                        lessonAmount={e["lesson-count"]}
                        level={e.level}
                        key={e.title}
                        />
                    ))}
                </div>

                ))}
                
            </div>
    )
}