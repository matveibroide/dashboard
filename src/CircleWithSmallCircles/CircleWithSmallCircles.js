import React, { useEffect, useState } from "react";
import data from "../API/API"; // Import your mock data
import "./CircleWithSmallCircles.css";

const CircleWithSmallCircles = () => {
  const [activeFilter, setActiveFilter] = useState(null);
  const [innerSmallCircles, setInnerSmallCircles] = useState(() =>
    data.map((item) => item.name)
  );
  const [outerSmallCircles, setOuterSmallCircles] = useState(() =>
    Array.from(
      new Set(data.flatMap((item) => [...item.mainSkills, ...item.otherSkills]))
    )
  );
  const [lines, setLines] = useState([]);

  const innerRadius = 55;
  const outerRadius = 135;
  const smallCircleRadius = 5;
  const centerX = 150;
  const centerY = 150;

  const innerAngleStep = (2 * Math.PI) / innerSmallCircles.length;
  const outerAngleStep = (2 * Math.PI) / outerSmallCircles.length;

  useEffect(() => {
    if (!activeFilter) {
      setLines([]);
      return;
    }

    const selectedItem = data.find((item) => item.name === activeFilter);
    if (selectedItem) {
      const { mainSkills, otherSkills } = selectedItem;
      const skillsNumber = mainSkills.length + otherSkills.length;

      const innerIndex = innerSmallCircles.indexOf(activeFilter);
      const innerAngle = innerIndex * innerAngleStep;
      const innerX = centerX + innerRadius * Math.cos(innerAngle);
      const innerY = centerY + innerRadius * Math.sin(innerAngle);

      const distances = outerSmallCircles.map((skill, index) => {
        const outerAngle = index * outerAngleStep;
        const outerX = centerX + outerRadius * Math.cos(outerAngle);
        const outerY = centerY + outerRadius * Math.sin(outerAngle);

        const distance = Math.sqrt(
          Math.pow(outerX - innerX, 2) + Math.pow(outerY - innerY, 2)
        );
        return { skill, distance };
      });

      distances.sort((a, b) => a.distance - b.distance);
      const closestCircles = distances
        .slice(0, skillsNumber)
        .map((item) => item.skill);

      const filteredClose = closestCircles.filter(
        (item) => ![...mainSkills, ...otherSkills].includes(item)
      );
      const filteredSkills = [...mainSkills, ...otherSkills].filter(
        (item) => !closestCircles.includes(item)
      );

      const outerSmallCirclesArr = [...outerSmallCircles];
      for (let i = 0; i < filteredClose.length; i++) {
        const close = outerSmallCirclesArr.indexOf(filteredClose[i]);
        const skill = outerSmallCirclesArr.indexOf(filteredSkills[i]);
        let temp = outerSmallCirclesArr[close];
        outerSmallCirclesArr[close] = outerSmallCirclesArr[skill];
        outerSmallCirclesArr[skill] = temp;
      }

      setOuterSmallCircles(outerSmallCirclesArr);
      setLines([
        ...mainSkills.map((relatedSkill) => {
          const outerIndex = outerSmallCirclesArr.indexOf(relatedSkill);
          const outerAngle = outerIndex * outerAngleStep;
          const outerX = centerX + outerRadius * Math.cos(outerAngle);
          const outerY = centerY + outerRadius * Math.sin(outerAngle);

          const controlX = (innerX + outerX) / 2 + 20;
          const controlY = (innerY + outerY) / 2;

          return (
            <path
              key={`line-main-${relatedSkill}`}
              d={`M ${innerX} ${innerY} Q ${controlX} ${controlY}, ${outerX} ${outerY}`}
              className="line"
              stroke="#FF7A00"
              strokeWidth="1"
              fill="none"
            />
          );
        }),
        ...otherSkills.map((relatedSkill) => {
          const outerIndex = outerSmallCirclesArr.indexOf(relatedSkill);
          const outerAngle = outerIndex * outerAngleStep;
          const outerX = centerX + outerRadius * Math.cos(outerAngle);
          const outerY = centerY + outerRadius * Math.sin(outerAngle);

          const controlX = (innerX + outerX) / 2 - 20;
          const controlY = (innerY + outerY) / 2;

          return (
            <path
              key={`line-other-${relatedSkill}`}
              d={`M ${innerX} ${innerY} Q ${controlX} ${controlY}, ${outerX} ${outerY}`}
              className="line"
              stroke="purple"
              strokeWidth="1"
              fill="none"
            />
          );
        }),
      ]);
    }
  }, [activeFilter]);

  return (
    <div style={{ width: "80vw", height: "80vh", margin: "auto" }}>
      <svg width="95%" height="95%" viewBox="0 0 300 300" preserveAspectRatio="xMidYMid meet">
        <circle cx="150" cy="150" r={innerRadius} fill="none" stroke="black" strokeWidth="2" />
        <circle cx="150" cy="150" r={outerRadius} fill="none" stroke="gray" strokeWidth="2" />

        {innerSmallCircles.map((name, index) => {
          const angle = index * innerAngleStep;
          const x = centerX + innerRadius * Math.cos(angle);
          const y = centerY + innerRadius * Math.sin(angle);

          return (
            <g key={`inner-${index}`}>
              <circle cx={x} cy={y} r={smallCircleRadius} fill="blue" onClick={() => setActiveFilter(name)} />
              <text x={x} y={y - smallCircleRadius - 5} textAnchor="middle" fontSize="6" fill="black">
                {name}
              </text>
            </g>
          );
        })}
        {outerSmallCircles.map((skill, index) => {
          const angle = index * outerAngleStep;
          const x = centerX + outerRadius * Math.cos(angle);
          const y = centerY + outerRadius * Math.sin(angle);

          return (
            <g key={`outer-${index}`}>
              <circle cx={x} cy={y} r={smallCircleRadius} fill="#FF7A00" onClick={() => setActiveFilter(skill)} />
              <text x={x} y={y - smallCircleRadius - 5} textAnchor="end" fontSize="6" fill="black">
                {skill}
              </text>
            </g>
          );
        })}
        {lines}
      </svg>
      {activeFilter && (
        <p style={{ position: "absolute", top: 10, left: 10 }}>
          Selected Filter: {activeFilter}
        </p>
      )}
    </div>
  );
};

export default CircleWithSmallCircles;
