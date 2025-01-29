import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

interface Skill {
    type: string;
    amount: number;
}

interface SkillsPieChartProps {
    skills: Skill[];
}

const SkillsPieChart: React.FC<SkillsPieChartProps> = ({ skills }) => {
    const chartRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!chartRef.current) return;

        // Clear previous chart
        d3.select(chartRef.current).selectAll("*").remove();

        const container = chartRef.current;
        const width = container.clientWidth;
        const height = container.clientHeight;
        const radius = Math.min(width, height) / 2 * 0.7;

        // Create SVG container
        const svg = d3.select(container)
            .append("svg")
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("viewBox", `0 0 ${width} ${height}`)
            .append("g")
            .attr("transform", `translate(${width / 2},${height / 2})`);

        const color = d3.scaleOrdinal<string>()
            .domain(skills.map(d => d.type.replace('skill_', '')))
            .range(['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40']);

        const pie = d3.pie<Skill>()
            .value(d => d.amount)
            .sort(null);

        const arc = d3.arc<d3.PieArcDatum<Skill>>()
            .innerRadius(radius * 0.5)
            .outerRadius(radius * 0.8);

        const outerArc = d3.arc<d3.PieArcDatum<Skill>>()
            .innerRadius(radius * 0.9)
            .outerRadius(radius * 0.9);

        const arcs = svg.selectAll<SVGGElement, d3.PieArcDatum<Skill>>("arc")
            .data(pie(skills))
            .enter()
            .append("g")
            .attr("class", "arc");

        // Draw chart segments
        arcs.append("path")
            .attr("d", arc)
            .attr("fill", d => color(d.data.type.replace('skill_', '')) || "#000")
            .attr("stroke", "white")
            .style("stroke-width", "2px");

        const labelArc = d3.arc<d3.PieArcDatum<Skill>>()
            .innerRadius(radius * 1.1)
            .outerRadius(radius * 1.1);

        // Add labels
        arcs.append("text")
            .attr("transform", d => {
                const pos = labelArc.centroid(d);
                const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
                pos[0] = radius * 1.1 * (midAngle < Math.PI ? 1 : -1);
                return `translate(${pos})`;
            })
            .attr("dy", ".35em")
            .style("text-anchor", d => {
                const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
                return midAngle < Math.PI ? "start" : "end";
            })
            .text(d => d.data.type.replace('skill_', ''))
            .style("font-size", "12px")
            .style("fill", "var(--text-color)");

        // Add connecting lines
        arcs.append("polyline")
            .attr("points", d => {
                const pos = labelArc.centroid(d);
                const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
                const x = radius * 1.25 * (midAngle < Math.PI ? 1 : -1);

                // Convert the points array to a string
                const points = [
                    arc.centroid(d), // Arc centroid
                    outerArc.centroid(d), // Outer arc centroid
                    [x, pos[1]] // Label position
                ].map(point => point.join(",")).join(" ");

                return points;
            })
            .style("fill", "none")
            .style("stroke", "#999")
            .style("stroke-width", "1px");

    }, [skills]); // Re-run effect when skills data changes

    return (
        <div ref={chartRef} style={{ width: '100%', height: '100%' }}></div>
    );
};

export default SkillsPieChart;

