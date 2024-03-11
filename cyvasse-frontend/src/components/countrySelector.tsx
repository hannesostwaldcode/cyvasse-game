import { useState } from "react";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "./ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { countryNameRecord, CountryCode } from "@/data/board";
import { cn } from "@/lib/utils";
import { getCountryFlagEmoji } from "@/lib/utils";

export function CountrySelector({
    onSelect
}:{
    onSelect: (selectedCountry: CountryCode) => void;
}) {
    const [value, setValue] = useState<CountryCode | null>(null)
    const [open, setOpen] = useState(false)
    const countryKeys: Array<CountryCode> =  Object.keys(countryNameRecord) as CountryCode[]
    return (
       <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger>
                <Button
                    type="button"
                    variant={"outline"}
                    role="combobox"
                    className="justify-between w-[200px]"
                >{value
                ? countryNameRecord[value] + " " + getCountryFlagEmoji(value)
                : "Select Country"
                }
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput placeholder="Search Country..."/>
                    <CommandEmpty>Country not found! Try your countries name in english</CommandEmpty>
                    <CommandGroup>
                        {countryKeys.map((keyName) => (
                            <CommandItem
                                key={keyName}
                                value={countryNameRecord[keyName]}
                                onSelect={(currenValue) => {
                                    onSelect(keyName)
                                    setValue(currenValue === value ? null : keyName)
                                    setOpen(false)
                                }}
                            >
                                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === keyName ? "opacity-100" : "opacity-0"
                  )}
                />
                           {countryNameRecord[keyName]}     
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    )
}