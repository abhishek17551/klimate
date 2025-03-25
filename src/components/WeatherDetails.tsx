import type { WeatherData } from "@/api/types"
import { format } from "date-fns";
import { Compass, Gauge, Sunrise, Sunset } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";

interface WeatherDetailProps {
    data: WeatherData
}

const WeatherDetails = ({data} : WeatherDetailProps) => {
    const {wind,main,sys} = data;

    const formatTime = (timestamp: number) => {
        return format(new Date(timestamp * 1000), "h:mm a");
      };

    // Convert wind degree to direction
    const getWindDirection = (degree: number) => {
        const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
        const index =
          Math.round(((degree %= 360) < 0 ? degree + 360 : degree) / 45) % 8;
        return directions[index];
      };

    const details = [
        {
            title: "Sunrise",
            value: formatTime(sys.sunrise),
            icon: Sunrise,
            color: "text-orange-500",
          },
          {
            title: "Sunset",
            value: formatTime(sys.sunset),
            icon: Sunset,
            color: "text-blue-500",
          },
          {
            title: "Wind Direction",
            value: `${getWindDirection(wind.deg)} (${wind.deg}°)`,
            icon: Compass,
            color: "text-green-500",
          },
          {
            title: "Pressure",
            value: `${main.pressure} hPa`,
            icon: Gauge,
            color: "text-purple-500",
          },    
    ]
  return (
    <Card>
        <CardHeader>
            <CardTitle>Weather Details</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="grid gap-6 sm:grid-cols-2">
            {
                details.map((detail) => {
                    return (
                        <div  key={detail.title} className="flex items-center gap-7 rounded-lg border p-4" >
                            <detail.icon className={`h-7 w-7 ${detail.color}`}/>
                            <div>
                                <p className="text-sm font-medium leading-none m-1">{detail.title}</p>
                                <p className="text-sm text-muted-foreground m-1">{detail.value}</p>
                            </div>
                        </div>
                    )
                })
            }
               </div>
        </CardContent>
    </Card>
  )
}

export default WeatherDetails