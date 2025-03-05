'use client';

import { Pie, PieChart } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

export function PieChartComponent({
  width,
  height,
  title,
  label,
  data,
  config,
}: {
  width?: number;
  height?: number;
  title?: string;
  showPercentage?: boolean;
  label?: string;
  data: { label: string; value: number; fill: string }[];
  config?: ChartConfig;
}) {
  config = config || {};
  return (
    <Card
      className="flex flex-col bg-[#EFEEFC] text-blue-500 rounded-xl"
      style={{ width, height }}
    >
      <CardHeader className="items-center pb-0">
        <CardTitle className="font-Rubik text-black text-2xl font-semibold leading-9 ">
          {title}
        </CardTitle>
        {label && <CardDescription>{label}</CardDescription>}
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={config}
          className="mx-auto aspect-square max-h-[250px] px-0 "
        >
          <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent nameKey="value" hideLabel />}
            />
            <Pie
              data={data}
              dataKey="value"
              labelLine={false}
              label={({ payload, ...props }) => {
                return (
                  <text
                    cx={props.cx}
                    cy={props.cy}
                    x={props.x}
                    y={props.y}
                    textAnchor={props.textAnchor}
                    dominantBaseline={props.dominantBaseline}
                    fill="hsla(var(--foreground))"
                  >
                    {payload.visitors}
                  </text>
                );
              }}
              nameKey="label"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex flex-col gap-2 text-left text-sm w-full">
        {data.map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between w-full whitespace-nowrap"
          >
            {/* Color & Label on the Left */}
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full"
                style={{ background: item.fill }}
              ></div>
              <span className="truncate">{item.label}</span>
            </div>

            {/* Value on the Right */}
            <div className="text-right">{item.value}</div>
          </div>
        ))}
      </CardFooter>
    </Card>
  );
}
