import React, {createContext, useContext} from "react";
import baseLangStrings from "./base-text-state.json"
import { ChevronDown, ChevronUp, Flag } from "lucide-react";

type WithChildren = {
    children: React.ReactNode | React.ReactNode[] | JSX.Element | JSX.Element[];    
}

export type Course =  {
    title: string;
    level: number;
    lessonCount: number;
    extract: string;
    text: string
    listTitle: string,
    listItems: string[],
    lessons: Lesson[]
}
type Lesson = { 
    title: string;
    extract: string;
    text: string;
}
type LangKey = "en-US" | "de-DE";
type JsonLocalizedStrings = typeof baseLangStrings;
const baseTextContext = createContext<JsonLocalizedStrings>(baseLangStrings)
const TextProvidingWrapper = baseTextContext.Provider;

function LangBadge(props: {lang: LangKey, setLang: React.Dispatch<React.SetStateAction<LangKey>>}){
    const [open, setOpen]  = React.useState(false);
    return (
        <div className="fixed bottom-3 right-3">
            <div className="flex flex-row">
            <span onClick={() => setOpen(!open)}>{!open ? <ChevronDown/> : <ChevronUp/>}</span>
            <span><Flag/></span>
            </div>
            {open && <div>
                <p onClick={() => props.setLang("en-US")} className={props.lang === "en-US" ? 'text-blue-400' : "text-black"}>English</p>
                <p onClick={() => props.setLang("de-DE")} className={props.lang === "de-DE" ? 'text-blue-400' : "text-black"}>German</p>
            </div>}
        </div>
    )
}

export function AggregateTextProvider({ children}: WithChildren){
    const [lang, setLang] = React.useState<LangKey>("de-DE");
    const [langStrings, setLangStrings] = React.useState<JsonLocalizedStrings>(baseLangStrings);
    React.useEffect(() => {
        setLangStrings(baseLangStrings)
       
/* FOR DEV COMMENTED OUT 
        if (lang == "de-DE") {setLangStrings(german);}
        else if (lang == "en-US") {setLangStrings(english);}
        else {setLangStrings(baseLangStrings);}
        (async () => {
            const jsonStrings = await import(`./lng-${lang}.json`) as JsonLocalizedStrings;
            setLangStrings(jsonStrings);

        })();*/
    }, [lang])
    return (
        <TextProvidingWrapper value={langStrings}>
            {children}
            <LangBadge lang={lang} setLang={setLang}/>
        </TextProvidingWrapper>
    )
}

export function useHomeString() {
    return useContext(baseTextContext).public.pages.home;
}

export function useLearnString() {
    return useContext(baseTextContext).public.pages.learn;
}

export function useArticleString(article: string) {
    let res: Course | undefined
    useContext(baseTextContext).public.pages.learn.sections.forEach((course) =>  {
        const local = course.courses.find((e) => e.title == article)
        if (local){
        res = local
    }
        
    })
    return res
}

export function useLessonString(courseSelected: string, lesson: string) {
    let res: Lesson | undefined
    useContext(baseTextContext).public.pages.learn.sections.forEach((course) =>  {
        const local = course.courses.find((e) => e.title == courseSelected)?.lessons.find((f) => f.title == lesson)
        if (local){
        res = local
    }
        
    })
    return res
}

export function useHomeAsset() {
    return useContext(baseTextContext).public.assets.home
}