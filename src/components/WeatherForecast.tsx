import type { ForecastData } from "@/api/types";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ArrowDown, ArrowUp, Droplets, Wind } from "lucide-react";

interface WeatherDetailsProps {
    data: ForecastData;
  }

interface DailyForecast {
    date: number;
    temp_min: number;
    temp_max: number;
    humidity: number;
    wind: number;
    weather: {
      id: number;
      main: string;
      description: string;
      icon: string;
    };
  }

const WeatherForecast = ({data} : WeatherDetailsProps) => {
    const dailyForecasts = data.list.reduce((acc,currForecast) => {
        const date = format(new Date(currForecast.dt * 1000), "yyyy-mm-dd" )
        if(!acc[date]){
            acc[date] = {
                temp_min: currForecast.main.temp_min,
                temp_max: currForecast.main.temp_max,
                humidity: currForecast.main.humidity,
                wind: currForecast.wind.speed,
                weather: currForecast.weather[0],
                date: currForecast.dt,
            }
        }
        else {
            acc[date].temp_min = Math.min(acc[date].temp_min, currForecast.main.temp_min)
            acc[date].temp_max = Math.max(acc[date].temp_max, currForecast.main.temp_max)
        }
        return acc
    },{} as Record<string,DailyForecast>) 

    //console.log(dailyForecasts)
    const nextdays = Object.values(dailyForecasts).slice(1,6)
    //console.log(nextdays)

    const formatTemp = (temp: number) => `${Math.round(temp)}°`;
  return (
    <Card>
        <CardHeader>
            <CardTitle>
                5 Day Forecast
            </CardTitle>
        </CardHeader>
        <CardContent>
            <div className="grid gap-4">
                {
                    nextdays.map((day) => (
                        <div key={day.date} className="grid grid-cols-3 items-center gap-4 rounded-4xl border p-4">
                            <div>
                                <p className="font-medium">{format(new Date(day.date * 1000), "EEE, MMM d")}</p>
                                <p  className="text-sm text-muted-foreground capitalize">{day.weather.description}</p>
                            </div>

                            <div className="flex justify-center gap-4">
                                <span className="flex items-center text-blue-500">
                                    <ArrowDown  className="mr-1 h-5 w-5" />
                                    {formatTemp(day.temp_min)}
                                </span>
                                <span className="flex items-center text-red-500">
                                    <ArrowUp className="mr-1 h-5 w-5"/>
                                    {formatTemp(day.temp_max)}
                                </span>
                            </div>

                            <div className="flex justify-end gap-4">
                                <span className="flex items-center gap-1">
                                    <Droplets className="h-4 w-4 text-blue-500"/>
                                    <span className="text-sm">{day.humidity}%</span>
                                </span>
                                <span className="flex items-center gap-1">
                                    <Wind className="h-4 w-4 text-blue-500" />
                                    <span className="text-sm">{day.wind} m/s</span>
                                </span>
                            </div>
                        </div>
                    ))
                }
            </div>
        </CardContent>
    </Card>
  )
}

export default WeatherForecast