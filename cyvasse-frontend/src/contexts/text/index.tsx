import React, {createContext, useContext} from "react";
import baseLangStrings from "./base-text-state.json"
import { ChevronDown, ChevronUp, Flag } from "lucide-react";
import german from "./lng-de-DE.json"
import english from "./lng-en-US.json"

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
        <div className="absolute top-5 right-14 md:top-3 md:right-3">
            <div className="flex flex-row">
            <span onClick={() => setOpen(!open)}>{!open ? <ChevronDown/> : <ChevronUp/>}</span>
            <span><Flag/></span>
            </div>
            {open && <div className="bg-slate-200 opacity-90 md:bg-transparent">
                <p onClick={() => props.setLang("en-US")} className={props.lang === "en-US" ? 'text-gray-400' : "text-black"}>English</p>
                <p onClick={() => props.setLang("de-DE")} className={props.lang === "de-DE" ? 'text-gray-400' : "text-black"}>German</p>
            </div>}
        </div>
    )
}

export function AggregateTextProvider({ children}: WithChildren){
    const [lang, setLang] = React.useState<LangKey>("en-US");
    const [langStrings, setLangStrings] = React.useState<JsonLocalizedStrings>(baseLangStrings);
    React.useEffect(() => {
        setLangStrings(baseLangStrings)
       

        if (lang == "de-DE") {setLangStrings(german);}
        else if (lang == "en-US") {setLangStrings(english);}
        else {setLangStrings(baseLangStrings);}
       /* (async () => {
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

export function useDashboardString() {
    return useContext(baseTextContext).privat.pages.dashboard;
}
export function usePlayGameString() {
    return useContext(baseTextContext).privat.pages.playgame;
}
export function useCreateGameString() {
    return useContext(baseTextContext).privat.pages.creategame;
}
export function useSocialString() {
    return useContext(baseTextContext).privat.pages.social;
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
export function useUnitInfoString(unit_key: string) {
    let res = useContext(baseTextContext).privat.pages.playgame.unit_info_default
    useContext(baseTextContext).privat.pages.playgame.unit_info.forEach((unit) => {
        
        if (unit.key == unit_key) {
            res = unit
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

export function useNavString() {
    return useContext(baseTextContext).public.pages.nav
}

export function useHomeAsset() {
    return useContext(baseTextContext).public.assets.home
}