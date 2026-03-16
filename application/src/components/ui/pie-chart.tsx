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
      className="flex flex-col bg-[#EFEEFC] border shadow text-blue-500 rounded-xl overflow-hidden relative"
      style={{ width, height }}
    >
      <CardHeader className="items-center pb-2 pt-6 shrink-0 relative z-10">
        <CardTitle className="font-Rubik text-black text-2xl font-semibold leading-9 ">
          {title}
        </CardTitle>
        {label && <CardDescription>{label}</CardDescription>}
      </CardHeader>
      
      <CardContent className="flex-1 pb-0 flex items-center justify-center shrink-0 min-h-[220px]">
        <ChartContainer
          config={config}
          className="mx-auto aspect-square w-full max-w-[220px]"
        >
          <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent nameKey="value" hideLabel />}
            />
            <Pie
              data={data}
              dataKey="value"
              innerRadius={45}
              outerRadius={90}
              paddingAngle={2}
              stroke="none"
              labelLine={false}
              nameKey="label"
              className="drop-shadow-sm"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
      
      <div className="w-full max-h-[110px] overflow-y-auto shrink-0 px-6 pb-4 pt-2 custom-pie-scrollbar">
        <div className="flex flex-col gap-2.5 text-left text-sm w-full">
          {data.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between w-full hover:bg-black/5 p-1.5 rounded-md transition-colors whitespace-nowrap"
            >
              {/* Color & Label on the Left */}
              <div className="flex items-center gap-2.5">
                <div
                  className="w-3.5 h-3.5 rounded-full shadow-sm border border-black/10"
                  style={{ background: item.fill }}
                ></div>
                <span className="truncate text-slate-700 font-medium">{item.label}</span>
              </div>

              {/* Value on the Right */}
              <div className="text-right font-bold text-black bg-black/5 px-2 py-0.5 rounded-md text-xs">{item.value}</div>
            </div>
          ))}
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .custom-pie-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-pie-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-pie-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(0, 0, 0, 0.1);
          border-radius: 10px;
        }
        .custom-pie-scrollbar:hover::-webkit-scrollbar-thumb {
          background-color: rgba(0, 0, 0, 0.2);
        }
      `}} />
    </Card>
  );
}
