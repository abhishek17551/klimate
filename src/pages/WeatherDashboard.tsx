import CurrentWeather from "@/components/CurrentWeather"
import HourlyTemperature from "@/components/HourlyTemperature"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import WeatherDetails from "@/components/WeatherDetails"
import WeatherSkeleton from "@/components/WeatherSkeleton"
import { useGeolocation } from "@/hooks/use-geolocation"
import { useForecastQuery, useReverseGeocodeQuery, useWeatherQuery } from "@/hooks/use-weather"
import { AlertTriangle, MapPin, RefreshCw } from "lucide-react"


const WeatherDashboard = () => {
  const {coordinates, error:locationError, isLoading:locationLoading, getLocation}= useGeolocation()

  const weatherQuery = useWeatherQuery(coordinates)
  const forecastQuery = useForecastQuery(coordinates)
  const locationQuery = useReverseGeocodeQuery(coordinates)

  // console.log(weatherQuery.data)
  // console.log(forecastQuery.data)
  // console.log(locationQuery.data)

  const handleRefresh = () => {
    getLocation();
    if(coordinates) {
      weatherQuery.refetch()
      forecastQuery.refetch()
      locationQuery.refetch()
    }
  }

  if(locationLoading) (
    <WeatherSkeleton/>
  )
  
  //Error in fetching location
  if(locationError) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Location Error</AlertTitle>
        <AlertDescription className="flex flex-col gap-4">
          <p>{locationError}</p>
          <Button variant="outline" onClick={getLocation} className="w-fit">
            <MapPin className="mr-2 h-4 w-4" />
            Enable Location
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  //Error in fetching coordinates
  if(!coordinates) {
    return (
      <Alert>
      <MapPin className="h-4 w-4" />
      <AlertTitle>Location Required</AlertTitle>
      <AlertDescription className="flex flex-col gap-4">
        <p>Please enable location access to see your local weather.</p>
        <Button variant="outline" onClick={getLocation} className="w-fit">
          <MapPin className="mr-2 h-4 w-4" />
          Enable Location
        </Button>
      </AlertDescription>
    </Alert>
    )
  }

  const locationName = locationQuery.data?.[0]

  //Error in fetching weather,forecast data
  if(weatherQuery.error || forecastQuery.error){
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription className="flex flex-col gap-4">
          <p>Failed to fetch weather data. Please try again.</p>
          <Button variant="outline" onClick={handleRefresh} className="w-fit">
            <RefreshCw className={`h-4 w-4 ${weatherQuery.isFetching ? "animate-spin" : ""}`} />
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  //While fetching weather,forecast data
  if (!weatherQuery.data || !forecastQuery.data) {
    return <WeatherSkeleton />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight">My Location</h1>
        <Button variant={"outline"} onClick={handleRefresh} disabled={weatherQuery.isFetching || forecastQuery.isFetching}>
          <RefreshCw className="h-4 w-4"/>
        </Button>
      </div>

      <div className="grid gap-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <CurrentWeather data={weatherQuery.data} locationName={locationName}/>
          <HourlyTemperature data={forecastQuery.data}/>
        </div>

        <div>
          <WeatherDetails data={weatherQuery.data}/>
        </div>
      </div>
    </div>
  )
}

export default WeatherDashboard