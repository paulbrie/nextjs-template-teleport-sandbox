"use client"

import { useMemo } from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

interface StockVolume {
  symbol: string
  volume: number
  price: number
}

interface VolumeChartProps {
  stocks: StockVolume[]
}

export function VolumeChart({ stocks }: VolumeChartProps) {
  const chartConfig = useMemo<ChartConfig>(() => ({
    volume: {
      label: "Volume",
      color: "hsl(217, 91%, 60%)",
    },
  }), [])

  const chartData = useMemo(() => {
    return stocks.map((stock) => ({
      symbol: stock.symbol,
      volume: stock.volume,
      price: stock.price,
    }))
  }, [stocks])

  const formatVolume = (value: number) => {
    if (value >= 1e9) return `${(value / 1e9).toFixed(1)}B`
    if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`
    if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`
    return value.toLocaleString()
  }

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader>
        <CardTitle className="text-white text-lg">Trading Volume</CardTitle>
        <CardDescription className="text-slate-400">
          Volume comparison across stocks
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[200px]">
          <BarChart
            data={chartData}
            margin={{
              left: 12,
              right: 12,
              top: 12,
              bottom: 12,
            }}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              vertical={false} 
              stroke="hsl(215, 20%, 30%)"
            />
            <XAxis
              dataKey="symbol"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              stroke="hsl(215, 20%, 65%)"
            />
            <YAxis
              tickFormatter={formatVolume}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              stroke="hsl(215, 20%, 65%)"
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value) => [
                    formatVolume(value as number),
                    "Volume",
                  ]}
                  labelFormatter={(value) => value}
                />
              }
            />
            <Bar 
              dataKey="volume" 
              fill="hsl(217, 91%, 60%)"
              radius={[4, 4, 0, 0]}
              maxBarSize={50}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
