import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

interface User {
  totalUp: number;
  totalDown: number;
  auditRatio: number;
}

interface AuditRatioChartProps {
  user: User;
}

const AuditRatioChart: React.FC<AuditRatioChartProps> = ({ user }) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current || !user) return;

    const auditContainer = d3.select(chartRef.current);
    auditContainer.selectAll("*").remove(); // Clear any previous content

    const container = chartRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;
    const margin = { top: 30, right: 30, bottom: 70, left: 60 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    // Add SVG canvas
    const svg = auditContainer
      .append("svg")
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("viewBox", `0 0 ${width} ${height}`)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Add title
    svg.append("text")
      .attr("x", chartWidth / 2)
      .attr("y", 0 - (margin.top / 2))
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("fill", "var(--text-color)")
      .text("Audit Activity");

    // Data
    const data = [
      { name: "Done", value: user.totalUp },
      { name: "Received", value: user.totalDown },
    ];

    // X-axis
    const x = d3
      .scaleBand()
      .range([0, chartWidth])
      .domain(data.map((d) => d.name))
      .padding(0.2);

    svg
      .append("g")
      .attr("transform", `translate(0,${chartHeight})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end")
      .style("fill", "var(--text-color)")
      .style("font-size", "12px");

    // Y-axis
    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.value) || 0])
      .range([chartHeight, 0]);

    svg
      .append("g")
      .call(
        d3.axisLeft(y).tickFormat((d) => {
          const scaled = (d as number) / 1000;
          return scaled >= 1 ? scaled.toFixed(0) : scaled.toFixed(1);
        })
      )
      .selectAll("text")
      .style("fill", "var(--text-color)");

    // Colors
    const color = d3
      .scaleOrdinal<string>()
      .domain(["Done", "Received"])
      .range(["#FFA500", "#4682B4"]);

    // Bars
    svg
      .selectAll<SVGRectElement, typeof data[number]>("mybar")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (d) => x(d.name) || 0)
      .attr("y", (d) => y(d.value))
      .attr("width", x.bandwidth())
      .attr("height", (d) => chartHeight - y(d.value))
      .attr("fill", (d) => color(d.name) || "#000");

    // Labels
    svg
      .selectAll(".label")
      .data(data)
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("x", (d) => (x(d.name) || 0) + x.bandwidth() / 2)
      .attr("y", (d) => y(d.value) - 5)
      .attr("text-anchor", "middle")
      .style("fill", "var(--text-color)")
      .style("font-size", "12px")
      .text((d) => {
        const valueInMB = d.value / 1000000;
        return `${d.name}: ${valueInMB < 1 ? valueInMB.toFixed(3) : valueInMB.toFixed(2)} MB`;
      });

    // Audit Ratio Text
    svg
      .append("text")
      .attr("x", chartWidth / 2)
      .attr("y", chartHeight + margin.bottom - 10)
      .attr("text-anchor", "middle")
      .style("font-size", "14px")
      .style("fill", "var(--text-color)")
      .text(`Audit Ratio: ${user.auditRatio.toFixed(1)}`);

  }, [user]);

  if (!user) {
    return <div>No audit data available</div>;
  }

  return <div ref={chartRef} style={{ width: '100%', height: '100%' }}></div>;
};

export default AuditRatioChart;

