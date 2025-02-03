import styles from "./SafetyScoreTrends.module.css";
import React, { useState, useMemo } from "react";
import Percentage from "../Percentage";
import ArrowIcon from "../icons/ArrowIcon";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function SafetyScoreTrends() {
  const [timeframe, setTimeframe] = useState("24 hours");

  const data = {
    chart: {
      "24 hours": [
        { time: "6:00 AM", score: 85.2 },
        { time: "7:00 AM", score: 87.1 },
        { time: "8:00 AM", score: 86.4 },
        { time: "9:00 AM", score: 88.3 },
        { time: "10:00 AM", score: 85.9 },
        { time: "1:00 PM", score: 86.5 },
        { time: "2:00 PM", score: 87.4 },
        { time: "3:00 PM", score: 86.8 },
        { time: "4:00 PM", score: 87.0 },
        { time: "5:00 PM", score: 89.3 },
        { time: "7:00 PM", score: 86.9 },
      ],
      "7 days": [
        { time: "Mon", score: 85.2 },
        { time: "Tue", score: 87.1 },
        { time: "Wed", score: 86.4 },
        { time: "Thu", score: 88.3 },
        { time: "Fri", score: 85.9 },
        { time: "Sat", score: 86.7 },
        { time: "Sun", score: 87.7 },
      ],
      "30 days": [
        { time: "1 Jan", score: 85.4 },
        { time: "2 Jan", score: 86.1 },
        { time: "3 Jan", score: 85.9 },
        { time: "4 Jan", score: 87.2 },
        { time: "5 Jan", score: 86.5 },
        { time: "6 Jan", score: 88.0 },
        { time: "7 Jan", score: 85.8 },
        { time: "8 Jan", score: 86.9 },
        { time: "9 Jan", score: 87.4 },
        { time: "10 Jan", score: 85.6 },
        { time: "11 Jan", score: 86.3 },
        { time: "12 Jan", score: 87.8 },
        { time: "13 Jan", score: 86.7 },
        { time: "14 Jan", score: 85.5 },
        { time: "15 Jan", score: 87.0 },
        { time: "16 Jan", score: 86.2 },
        { time: "17 Jan", score: 88.1 },
        { time: "18 Jan", score: 86.8 },
        { time: "19 Jan", score: 87.3 },
        { time: "20 Jan", score: 85.7 },
        { time: "21 Jan", score: 86.9 },
        { time: "22 Jan", score: 87.5 },
        { time: "23 Jan", score: 85.8 },
        { time: "24 Jan", score: 86.4 },
        { time: "25 Jan", score: 87.2 },
        { time: "26 Jan", score: 86.0 },
        { time: "27 Jan", score: 88.2 },
        { time: "28 Jan", score: 85.9 },
        { time: "29 Jan", score: 86.7 },
        { time: "30 Jan", score: 87.1 },
      ],
      "12 months": [
        { time: "Jan", score: 85.9 },
        { time: "Feb", score: 86.7 },
        { time: "Mar", score: 87.5 },
        { time: "Apr", score: 85.8 },
        { time: "May", score: 86.3 },
        { time: "Jun", score: 87.1 },
        { time: "Jul", score: 86.4 },
        { time: "Aug", score: 86.8 },
        { time: "Sep", score: 87.6 },
        { time: "Oct", score: 86.7 },
        { time: "Nov", score: 87.3 },
        { time: "Dec", score: 85.8 },
      ],
    },
    best: {
      "24 hours": { name: "Vest", score: 96.0 },
      "7 days": { name: "Helmet", score: 94.5 },
      "30 days": { name: "Gloves", score: 95.2 },
      "12 months": { name: "Boots", score: 93.8 },
    },
    worst: {
      "24 hours": { name: "Scaffold", score: 75.0 },
      "7 days": { name: "Harness", score: 78.3 },
      "30 days": { name: "Footwear", score: 79.1 },
      "12 months": { name: "Guardrail", score: 76.4 },
    },
  };

  const chartData = useMemo(() => data.chart[timeframe] || [], [timeframe]);

  const growth = useMemo(() => {
    if (chartData.length < 2) return { number: 0, positive: true };
    const last = chartData[chartData.length - 1].score;
    const secondLast = chartData[chartData.length - 2].score;
    return {
      number: Math.abs(last - secondLast).toFixed(1),
      positive: last > secondLast,
    };
  }, [chartData]);

  const growthColor = growth.positive ? "#0FD7A5" : "#D21616";

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h2>Safety Score Trends</h2>
        <div className={styles.options}>
          {Object.keys(data.chart).map((option) => (
            <span
              key={option}
              className={`${styles.timeOption} ${
                timeframe === option ? styles.active : ""
              }`}
              onClick={() => setTimeframe(option)}
            >
              Last {option}
            </span>
          ))}
        </div>
      </div>
      <div className={styles.content}>
        <div>
          <div
            className={`${styles.growthContainer} ${
              growth.positive ? styles.growth : styles.decline
            }`}
          >
            <span>
              <ArrowIcon color={growthColor} className={styles.arrow} />
              <Percentage
                number={growth.number}
                numberSize={22}
                symbolSize={15}
              />
            </span>
            <p>
              vs 1{" "}
              {
                {
                  "24 hours": "hour",
                  "7 days": "day",
                  "30 days": "day",
                  "12 months": "month",
                }[timeframe]
              }{" "}
              ago
            </p>
          </div>
          <div className={styles.bestMetricContainer}>
            <Percentage
              number={data.best[timeframe].score}
              label="Best Metric"
              label2={data.best[timeframe].name}
              numberSize={20}
              symbolSize={16}
            />
          </div>
          <div className={styles.bestMetricContainer}>
            <Percentage
              number={data.worst[timeframe].score}
              label="Worst Metric"
              label2={data.worst[timeframe].name}
              numberSize={20}
              symbolSize={16}
            />
          </div>
        </div>
        <ResponsiveContainer width="100%" height={182}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="20%" stopColor="var(--primary)" stopOpacity={1} />
                <stop
                  offset="100%"
                  stopColor="var(--primary)"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={true}
              horizontal={false}
              stroke="var(--neutral)"
            />

            <XAxis
              dataKey="time"
              fontSize={11}
              fontWeight={600}
              tick={{ fill: "var(--neutral)" }}
            />
            <YAxis
              domain={[80, 90]}
              fontSize={11}
              fontWeight={600}
              tick={{ fill: "var(--neutral)" }}
            />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="score"
              stroke="none"
              fill="url(#colorGradient)"
              fillOpacity={1}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
