"use client"

import { useMemo } from "react"
import {
  Area,
  AreaChart,
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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

interface PricePoint {
  time: string
  price: number
  volume: number
}

interface StockChartProps {
  data: PricePoint[]
  symbol: string
  currentPrice: number
  change: number
  changePercent: number
}

export function StockChart({ 
  data, 
  symbol, 
  currentPrice, 
  change, 
  changePercent 
}: StockChartProps) {
  const isPositive = change >= 0

  const chartConfig = useMemo<ChartConfig>(() => ({
    price: {
      label: "Price",
      color: isPositive ? "hsl(142, 76%, 36%)" : "hsl(0, 84%, 60%)",
    },
    volume: {
      label: "Volume",
      color: "hsl(215, 20%, 65%)",
    },
  }), [isPositive])

  const chartData = useMemo(() => {
    return data.map((point) => ({
      time: point.time,
      price: point.price,
      volume: point.volume,
    }))
  }, [data])

  const formatTime = (time: string) => {
    const date = new Date(time)
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    })
  }

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`
  }

  const minPrice = useMemo(() => {
    if (chartData.length === 0) return 0
    const prices = chartData.map(d => d.price)
    return Math.min(...prices) * 0.995
  }, [chartData])

  const maxPrice = useMemo(() => {
    if (chartData.length === 0) return 100
    const prices = chartData.map(d => d.price)
    return Math.max(...prices) * 1.005
  }, [chartData])

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-white text-lg">{symbol} Price Chart</CardTitle>
          <CardDescription className="text-slate-400">
            Real-time price movement
          </CardDescription>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-white">{formatPrice(currentPrice)}</p>
          <p className={`text-sm font-medium ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
            {isPositive ? '+' : ''}{change.toFixed(2)} ({isPositive ? '+' : ''}{changePercent.toFixed(2)}%)
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <AreaChart
            data={chartData}
            margin={{
              left: 12,
              right: 12,
              top: 12,
              bottom: 12,
            }}
          >
            <defs>
              <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop 
                  offset="5%" 
                  stopColor={isPositive ? "hsl(142, 76%, 36%)" : "hsl(0, 84%, 60%)"} 
                  stopOpacity={0.3}
                />
                <stop 
                  offset="95%" 
                  stopColor={isPositive ? "hsl(142, 76%, 36%)" : "hsl(0, 84%, 60%)"} 
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid 
              strokeDasharray="3 3" 
              vertical={false} 
              stroke="hsl(215, 20%, 30%)"
            />
            <XAxis
              dataKey="time"
              tickFormatter={formatTime}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              stroke="hsl(215, 20%, 65%)"
            />
            <YAxis
              tickFormatter={formatPrice}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              domain={[minPrice, maxPrice]}
              stroke="hsl(215, 20%, 65%)"
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => formatTime(value as string)}
                  formatter={(value) => [formatPrice(value as number), "Price"]}
                />
              }
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke={isPositive ? "hsl(142, 76%, 36%)" : "hsl(0, 84%, 60%)"}
              strokeWidth={2}
              fill="url(#priceGradient)"
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
