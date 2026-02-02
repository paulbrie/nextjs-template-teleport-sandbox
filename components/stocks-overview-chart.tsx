"use client"

import { useMemo } from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
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

interface StockData {
  symbol: string
  price: number
  change: number
  changePercent: number
  volume: number
}

interface StocksOverviewChartProps {
  stocks: StockData[]
}

export function StocksOverviewChart({ stocks }: StocksOverviewChartProps) {
  const chartConfig = useMemo<ChartConfig>(() => ({
    changePercent: {
      label: "Change %",
      color: "hsl(215, 20%, 65%)",
    },
  }), [])

  const chartData = useMemo(() => {
    return stocks.map((stock) => ({
      symbol: stock.symbol,
      changePercent: stock.changePercent,
      price: stock.price,
      isPositive: stock.change >= 0,
    }))
  }, [stocks])

  const formatPercent = (value: number) => {
    const sign = value >= 0 ? '+' : ''
    return `${sign}${value.toFixed(2)}%`
  }

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader>
        <CardTitle className="text-white text-lg">Market Overview</CardTitle>
        <CardDescription className="text-slate-400">
          Today's performance across tracked stocks
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px]">
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
              tickFormatter={(value) => `${value}%`}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              stroke="hsl(215, 20%, 65%)"
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, name, props) => {
                    const data = props?.payload
                    return [
                      `${formatPercent(data?.changePercent || 0)}`,
                      "Change",
                    ]
                  }}
                  labelFormatter={(value) => value}
                />
              }
            />
            <Bar 
              dataKey="changePercent" 
              radius={[4, 4, 0, 0]}
              maxBarSize={60}
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.isPositive ? "hsl(142, 76%, 36%)" : "hsl(0, 84%, 60%)"}
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
