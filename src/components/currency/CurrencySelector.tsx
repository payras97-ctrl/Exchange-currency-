import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { getFlagEmoji } from "@/utils/currencyUtils"

interface CurrencySelectorProps {
  value: string;
  onChange: (value: string) => void;
  currencies: Record<string, string>;
  disabled?: boolean;
}

export function CurrencySelector({ value, onChange, currencies, disabled }: CurrencySelectorProps) {
  const [open, setOpen] = React.useState(false)

  const currencyList = React.useMemo(() => {
    return Object.entries(currencies).map(([code, name]) => ({
      value: code,
      label: `${code} - ${name}`,
      searchLabel: `${code} ${name}`,
    }))
  }, [currencies])

  if (Object.keys(currencies).length === 0) {
    return (
      <Button variant="outline" className="w-[140px] justify-between glass" disabled>
        Loading...
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        disabled={disabled}
        className="inline-flex items-center justify-between w-[140px] h-12 px-4 py-2 border border-input rounded-md text-base font-medium glass hover:bg-secondary/50 transition-colors disabled:pointer-events-none disabled:opacity-50"
      >
        <span className="flex items-center gap-2 truncate">
          <span className="text-xl">{getFlagEmoji(value)}</span>
          {value}
        </span>
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-0 glass-card border-none shadow-2xl" side="bottom" align="start">
        <Command className="bg-transparent">
          <CommandInput placeholder="Search currency..." className="h-11" />
          <CommandList className="max-h-[300px]">
            <CommandEmpty>No currency found.</CommandEmpty>
            <CommandGroup>
              {currencyList.map((currency) => (
                <CommandItem
                  key={currency.value}
                  value={currency.searchLabel}
                  onSelect={() => {
                    onChange(currency.value)
                    setOpen(false)
                  }}
                  className="cursor-pointer"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4 text-primary",
                      value === currency.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <span className="text-xl mr-2">{getFlagEmoji(currency.value)}</span>
                  <span className="font-semibold mr-2">{currency.value}</span>
                  <span className="text-muted-foreground truncate text-sm flex-1">{currencies[currency.value]}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
