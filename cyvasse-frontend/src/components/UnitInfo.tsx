import { unitKeys } from "./Unit"

interface UnitInfoProps {
    unit: unitKeys
}

type UnitInfo = {
    
}

const unitInfo = {
    C: {
        name: "Catapult",
        description: "A mighty unit that can capture two units per move"
    },
    K: {
        name: "",
        description: ""
    },

}

export function UnitInfo({unit}: UnitInfoProps) {
    
    return (
        <div className="flex flex-col w-[200px] bg-slate-200">
            {unit}
            <div>{unitInfo.C.name}</div>
            <div>{unitInfo.C.description}</div>
        </div>
    )
}