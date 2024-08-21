//@ts-nocheck
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Card, CardHeader, CardDescription, CardTitle, CardFooter, CardContent } from "@/components/ui/card"
import { CartesianGrid, XAxis, Line, LineChart } from "recharts"
import { ChartTooltipContent, ChartTooltip, ChartContainer } from "@/components/ui/chart"

export function Analytics() {
  const [users, setUsers] = useState([])
  const [purchasedCourses, setPurchasedCourses] = useState(0)
  const [completedCourses, setCompletedCourses] = useState(0)
  const [chartData, setChartData] = useState([])
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("YOUR_API_URL")
        const data = await response.json()
        setUsers(data)
        let purchased = 0
        let completed = 0
        data.forEach((user) => {
          purchased += user.courses.length
          completed += user.courses.filter((course) => course.completed).length
        })
        setPurchasedCourses(purchased)
        setCompletedCourses(completed)
        const chartData = data.map((user) => ({
          name: user.name,
          purchased: user.courses.length,
          completed: user.courses.filter((course) => course.completed).length,
        }))
        setChartData(chartData)
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }
    fetchData()
  }, [])
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
        <Link href="#" className="mr-6 hidden lg:flex" prefetch={false}>
          <span className="sr-only">Course Platform</span>
        </Link>
        <div className="relative ml-auto flex-1 md:grow-0">
          <div className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild />
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Users</CardDescription>
                <CardTitle className="text-4xl">{users.length}</CardTitle>
              </CardHeader>
              <CardFooter>
                <div className="text-xs text-muted-foreground">
                  {purchasedCourses} purchased, {completedCourses} completed
                </div>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Purchased Courses</CardDescription>
                <CardTitle className="text-4xl">{purchasedCourses}</CardTitle>
              </CardHeader>
              <CardFooter>
                <div className="text-xs text-muted-foreground">
                  {((purchasedCourses / users.length) * 100).toFixed(2)}% of total users
                </div>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Completed Courses</CardDescription>
                <CardTitle className="text-4xl">{completedCourses}</CardTitle>
              </CardHeader>
              <CardFooter>
                <div className="text-xs text-muted-foreground">
                  {((completedCourses / purchasedCourses) * 100).toFixed(2)}% of purchased
                </div>
              </CardFooter>
            </Card>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Courses Trend</CardTitle>
                <CardDescription>Purchased vs Completed</CardDescription>
              </CardHeader>
              <CardContent>
                <LinechartChart className="aspect-[9/4]" />
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}

function LinechartChart(props) {
  return (
    <div {...props}>
      <ChartContainer
        config={{
          desktop: {
            label: "Desktop",
            color: "hsl(var(--chart-1))",
          },
        }}
      >
        <LineChart
          accessibilityLayer
          data={[
            { month: "January", desktop: 186 },
            { month: "February", desktop: 305 },
            { month: "March", desktop: 237 },
            { month: "April", desktop: 73 },
            { month: "May", desktop: 209 },
            { month: "June", desktop: 214 },
          ]}
          margin={{
            left: 12,
            right: 12,
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
          <Line dataKey="desktop" type="natural" stroke="var(--color-desktop)" strokeWidth={2} dot={false} />
        </LineChart>
      </ChartContainer>
    </div>
  )
}
