"use client";

import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useTheme } from "next-themes";

interface DonationData {
  created_at: string;
  amount: number;
}

interface DonationsChartProps {
  data: DonationData[];
}

export default function DonationsChart({ data }: DonationsChartProps) {
  const { resolvedTheme } = useTheme();
  
  const chartData = useMemo(() => {
    // Group donations by date
    const grouped = data.reduce((acc, curr) => {
      // created_at is typically an ISO string like "2023-10-25T12:00:00Z"
      // we'll slice it to "YYYY-MM-DD"
      const date = new Date(curr.created_at).toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
      });
      if (!acc[date]) {
        acc[date] = 0;
      }
      acc[date] += curr.amount;
      return acc;
    }, {} as Record<string, number>);

    // Convert object to array for recharts
    // Reverse it to show chronological order if data came in descending
    return Object.entries(grouped)
      .map(([date, amount]) => ({ date, amount }))
      .reverse();
  }, [data]);

  const isDark = resolvedTheme === "dark";
  const strokeColor = isDark ? "#ff4444" : "#e50000";
  const gridColor = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)";
  const textColor = isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.6)";

  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center font-mono text-xs uppercase tracking-widest text-black/40 dark:text-white/40">
        No data available
      </div>
    );
  }

  return (
    <div className="h-72 w-full mt-8">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
          <XAxis 
            dataKey="date" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: textColor, fontSize: 12, fontFamily: "monospace" }} 
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: textColor, fontSize: 12, fontFamily: "monospace" }} 
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: isDark ? "#1a1a1a" : "#ffffff", 
              border: `1px solid ${gridColor}`,
              borderRadius: "8px",
              fontFamily: "monospace",
              fontSize: "12px"
            }} 
            itemStyle={{ color: strokeColor }}
          />
          <Line
            type="monotone"
            dataKey="amount"
            stroke={strokeColor}
            strokeWidth={3}
            dot={{ r: 4, fill: strokeColor, strokeWidth: 0 }}
            activeDot={{ r: 6, fill: strokeColor, strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
