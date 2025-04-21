import { useState } from 'react'
import { Button } from './ui/button'
import { CommandDialog, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem, CommandSeparator } from './ui/command'
import { Clock, Loader2, Search, XCircle } from 'lucide-react'
import { useLocationSearch } from '@/hooks/use-weather'
import { useNavigate } from 'react-router-dom'
import { useSearchHistory } from '@/hooks/use-search-history'
import { format } from 'date-fns'


const CitySearch = () => {
    const [open, setOpen] = useState(false)
    const [query,setQuery] = useState("")
    const {data:locations,isLoading} = useLocationSearch(query)
    const navigate = useNavigate()
    const {history,addToHistory,clearHistory} = useSearchHistory()

   // console.log(locations)

   const handleSelect = (cityData: string) => {
    const [lat,lon,name,country] = cityData.split("|")

    addToHistory.mutate({
        query,
        name,
        lat: parseFloat(lat),
        lon: parseFloat(lon),
        country,
    })
    navigate(`/city/${name}?lat=${lat}&lon=${lon}`)
    setOpen(false)
   }

  return (
    <>
        <Button variant='outline' className="relative w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64" onClick={() => setOpen(true)}>
            <Search className='mr-2 h-4 w-4'/>
            Search Cities...
        </Button>
        <CommandDialog open={open} onOpenChange={setOpen}>
            <CommandInput placeholder="Search Cities..." value={query} onValueChange={setQuery}/>
            <CommandList>
                {query.length > 2 && !isLoading && <CommandEmpty>No cities found.</CommandEmpty>}
                {
                    history.length > 0 && (
                        <>
                            <CommandSeparator/>
                            <CommandGroup>
                                <div className="flex items-center justify-between px-2 my-2">
                                    <p className="text-xs text-muted-foreground">
                                    Recent Searches
                                    </p>
                                    <Button variant="ghost" size="sm" onClick={() => clearHistory.mutate()}>
                                        <XCircle className="h-4 w-4"/>
                                        Clear
                                    </Button>
                                </div>

                                {
                                    history.map((item) => (
                                    <CommandItem
                                        key={`${item.lat}-${item.lon}`}
                                        value={`${item.lat}|${item.lon}|${item.name}|${item.country}`}
                                        onSelect={handleSelect}
                                    >
                                        <Clock  className="mr-2 h-4 w-4"/>
                                        <span>{item.name}</span>
                                        {
                                            item.state && (
                                                <span className="text-sm text-muted-foreground">, {item.state}</span>
                                            )
                                        }
                                        <span className="text-sm text-muted-foreground">, {item.country}</span>
                                        <span className="ml-auto text-xs text-muted-foreground">
                                            {format(item.searchedAt, "MMM d, h:mm a")}
                                         </span>
                                    </CommandItem>
                                    ))
                                }
                            </CommandGroup>
                        </>
                    )
                }
            
            <CommandSeparator/>

            {
                locations && locations.length>0 && (
                    <CommandGroup heading="Suggestions">
                        {
                            isLoading && (
                                <div className="flex items-center justify-center p-4">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                </div>
                            )
                        }
                        {
                            locations?.map((loc) => (
                                <CommandItem
                                    key={`${loc.lat}-${loc.lon}`}
                                    value={`${loc.lat}|${loc.lon}|${loc.name}|${loc.country}`}
                                    onSelect={handleSelect}
                                >
                                    <Search  className="mr-2 h-4 w-4"/>
                                    <span>{loc.name}</span>
                                    {
                                        loc.state && (
                                            <span className="text-sm text-muted-foreground">, {loc.state}</span>
                                        )
                                    }
                                    <span className="text-sm text-muted-foreground">, {loc.country}</span>
                                </CommandItem>
                            ))
                        }
                    </CommandGroup>
                )
            }
            </CommandList>
        </CommandDialog>
    </>
  )
}

export default CitySearch