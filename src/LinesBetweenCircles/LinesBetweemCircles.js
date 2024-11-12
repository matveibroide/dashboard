import React from "react";
import "./LinesBetweenCircles.css";

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

  const innerCircleOffset = 5; // Offset to prevent overlap

  const calculatePosition = (index, radius, angleStep, offset = 0) => {
    const angle = startingAngle + index * angleStep;
    return {
      x: centerX + (radius + offset) * Math.cos(angle),
      y: centerY + (radius + offset) * Math.sin(angle),
    };
  };

  const lines = [];
  
  const createCurvedPath = (start, end, color, index, type) => {
    let curveSetting = start.y < centerY ? 4 : -4;
    let controlX1 = (start.x + end.x) / 2;
    let controlY1 = start.y - Math.abs(start.x - end.x) / curveSetting;
    let controlX2 = (start.x + end.x) / 2;
    let controlY2 = end.y + Math.abs(start.x - end.x) / 457;

    if (type === "outer") {
      controlY1 = start.y + Math.abs(start.x - end.x) / -4;
      controlY2 = end.y + Math.abs(start.x - end.x) / 457;
    }

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
    const innerPos = calculatePosition(innerIndex, innerRadius, innerAngleStep, innerCircleOffset);

    activeItem.mainSkills.forEach((skill, index) => {
      const outerIndex = outerSmallCircles.indexOf(skill);
      if (outerIndex !== -1) {
        const outerPos = calculatePosition(outerIndex, outerRadius, outerAngleStep);
        lines.push(createCurvedPath(innerPos, outerPos, "#FF7A00", index));
      }
    });

    activeItem.otherSkills.forEach((skill, index) => {
      const outerIndex = outerSmallCircles.indexOf(skill);
      if (outerIndex !== -1) {
        const outerPos = calculatePosition(outerIndex, outerRadius, outerAngleStep);
        lines.push(createCurvedPath(innerPos, outerPos, "#9C27B0", index));
      }
    });
  } else if (outerSmallCircles.includes(activeFilter)) {
    const outerIndex = outerSmallCircles.indexOf(activeFilter);
    const outerPos = calculatePosition(outerIndex, outerRadius, outerAngleStep);

    const jobsMain = data.filter((item) => item.mainSkills.includes(activeFilter)).map((item) => item.name);
    const jobsOther = data.filter((item) => item.otherSkills.includes(activeFilter)).map((item) => item.name);

    jobsMain.forEach((job, index) => {
      const innerIndex = innerSmallCircles.indexOf(job);
      if (innerIndex !== -1) {
        const innerPos = calculatePosition(innerIndex, innerRadius, innerAngleStep, innerCircleOffset);
        lines.push(createCurvedPath(outerPos, innerPos, "#FF7A00", index, "outer"));
      }
    });

    jobsOther.forEach((job, index) => {
      const innerIndex = innerSmallCircles.indexOf(job);
      if (innerIndex !== -1) {
        const innerPos = calculatePosition(innerIndex, innerRadius, innerAngleStep, innerCircleOffset);
        lines.push(createCurvedPath(outerPos, innerPos, "#9C27B0", index, "outer"));
      }
    });
  }

  return <g>{lines}</g>;
};

export default LinesBetweenCircles;
