import { ForecastData } from "@/api/types"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { LineChart,Line,XAxis,YAxis,ResponsiveContainer } from "recharts"
import {format} from "date-fns" 

interface HourlyTemperatureProps {
    data : ForecastData
}
const HourlyTemperature = ({data} : HourlyTemperatureProps) => {

  //The interval between temperatures is 3 hours,hence 8 items for 24 hrs
  const chartData = data.list.slice(0,8).map((item) => ({
    time: format(new Date(item.dt * 1000), "ha"),
    temp: Math.round(item.main.temp),
    feels_like: Math.round(item.main.feels_like),
  }))
  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle>Today's Temperature</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis
                dataKey='time'
                stroke="#65a30d"
                fontSize={13}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                dataKey='temp'
                stroke="#65a30d"
                fontSize={13}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}°`}
              />
              <Line
                type='monotone'
                dataKey='temp'
                stroke="#245456"
                strokeWidth={3}
                dot={false}
              />
              <Line
                type='monotone'
                dataKey='feels_like'
                stroke="#d1d5db"
                strokeWidth={3}
                strokeDasharray="5 5"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
  </Card>
  )
}

export default HourlyTemperature