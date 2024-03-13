import React, {createContext, useContext} from "react";
import baseLangStrings from "./base-text-state.json"
import { ChevronDown, ChevronUp } from "lucide-react";

type WithChildren = {
    children: React.ReactNode | React.ReactNode[] | JSX.Element | JSX.Element[];    
}

type LangKey = "en-US" | "de-DE";
type JsonLocalizedStrings = typeof baseLangStrings;
const baseTextContext = createContext<JsonLocalizedStrings>(baseLangStrings)
const TextProvidingWrapper = baseTextContext.Provider;

function LangBadge(props: {lang: LangKey, setLang: React.Dispatch<React.SetStateAction<LangKey>>}){
    const [open, setOpen]  = React.useState(false);
    return (
        <div className="absolute bottom-0 right-0">
            <div className="flex flex-row">
            <span className="text-lg">Change Language</span><span onClick={() => setOpen(!open)}>{!open ? <ChevronDown/> : <ChevronUp/>}</span>
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
        (async () => {
            const jsonStrings = await import(`./lng-${lang}.json`) as JsonLocalizedStrings;
            setLangStrings(jsonStrings);

        })();
    }, [lang])
    return (
        <TextProvidingWrapper value={baseLangStrings}>
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

export function useHomeAsset() {
    return useContext(baseTextContext).public.assets.home
}