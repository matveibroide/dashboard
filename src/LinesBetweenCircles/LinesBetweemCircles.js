import React, { useEffect, useState } from "react";
import "./LinesBetweenCircles.css";
import { line } from "d3";

const LinesBetweenCircles = ({
  data,
  activeFilter,
  innerSmallCircles,
  outerSmallCircles,
  innerRadius,
  outerRadius,
  centerX,
  centerY,
  startingAngle,
  innerAngleStep,
  outerAngleStep,
}) => {
  if (!activeFilter) return null;

  const activeItem = data.find(
    (item) =>
      item.name === activeFilter ||
      item.mainSkills.includes(activeFilter) ||
      item.otherSkills.includes(activeFilter)
  );

  if (!activeItem) return null;

  // Function to calculate circle position
  const calculatePosition = (index, radius, angleStep) => {
    const angle = startingAngle + index * angleStep;
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    };
  };

  const lines = [];

  const createCurvedPath = (start, end, color, index) => {
    const controlX1 = (start.x + end.x) / 2;
    const controlY1 = start.y - Math.abs(start.x - end.x) / 342;
    const controlX2 = (start.x + end.x) / 2;
    const controlY2 = end.y + Math.abs(start.x - end.x) / 457;

    return (
      <path
        key={`line-${index}-${start.x}-${start.y}-${end.x}-${end.y}`}
        className="line"
        d={`M ${start.x},${start.y} C ${controlX1},${controlY1} ${controlX2},${controlY2} ${end.x},${end.y}`}
        stroke={color}
        strokeWidth="1.5"
        fill="none"
      />
    );
  };

  if (innerSmallCircles.includes(activeFilter)) {
    const innerIndex = innerSmallCircles.indexOf(activeFilter);
    const innerPos = calculatePosition(innerIndex, innerRadius, innerAngleStep);

    activeItem.mainSkills.forEach((skill, index) => {
      const outerIndex = outerSmallCircles.indexOf(skill);
      if (outerIndex !== -1) {
        const outerPos = calculatePosition(
          outerIndex,
          outerRadius,
          outerAngleStep
        );
        lines.push(createCurvedPath(innerPos, outerPos, "#FF7A00", index));
      }
    });

    activeItem.otherSkills.forEach((skill, index) => {
      const outerIndex = outerSmallCircles.indexOf(skill);
      if (outerIndex !== -1) {
        const outerPos = calculatePosition(
          outerIndex,
          outerRadius,
          outerAngleStep
        );
        lines.push(createCurvedPath(innerPos, outerPos, "#9C27B0", index));
      }
    });
  }

  return <g>{lines}</g>;
};

export default LinesBetweenCircles;
