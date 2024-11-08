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
  const [activeSkills, setActiveSkills] = useState([]);

  const innerRadius = 55;
  const outerRadius = 130;
  const smallCircleRadius = 7;
  const centerX = 150;
  const centerY = 150;

  const innerAngleStep = (2 * Math.PI) / innerSmallCircles.length;
  const outerAngleStep = (2 * Math.PI) / outerSmallCircles.length;
  const startingAngle = -Math.PI / 2; // Set the starting angle

  const calculateClosestCircles = (filter, circlesNumber) => {};

  useEffect(() => {
    if (!activeFilter) {
      setLines([]);
      return;
    }

    if (innerSmallCircles.includes(activeFilter)) {
      const selectedItem = data.find((item) => item.name === activeFilter);
      if (selectedItem) {
        const { mainSkills, otherSkills } = selectedItem;
        setActiveSkills([...mainSkills, ...otherSkills]);
        const skillsNumber = mainSkills.length + otherSkills.length;

        const innerIndex = innerSmallCircles.indexOf(activeFilter);
        const innerAngle = startingAngle + innerIndex * innerAngleStep;
        const innerX = centerX + innerRadius * Math.cos(innerAngle);
        const innerY = centerY + innerRadius * Math.sin(innerAngle);

        const distances = outerSmallCircles.map((skill, index) => {
          const outerAngle = startingAngle + index * outerAngleStep;
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
            const outerAngle = startingAngle + outerIndex * outerAngleStep;
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
            const outerAngle = startingAngle + outerIndex * outerAngleStep;
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
    } else if (outerSmallCircles.includes(activeFilter)) {
    }
  }, [activeFilter]);

  return (
    <div className="container">
      <svg
        width="90%"
        height="90%"
        viewBox="0 0 300 300"
        preserveAspectRatio="xMidYMid meet"
      >
        <circle
          cx="150"
          cy="150"
          r={innerRadius}
          fill="none"
          stroke="#ADADAD"
          strokeWidth="2"
        />
        <circle
          cx="150"
          cy="150"
          r={outerRadius}
          fill="none"
          stroke="#ADADAD"
          strokeWidth="2"
        />
        {lines}

        {innerSmallCircles.map((name, index) => {
          const angle = startingAngle + index * innerAngleStep; // Apply startingAngle
          const x = centerX + innerRadius * Math.cos(angle);
          const y = centerY + innerRadius * Math.sin(angle);
          const selected = name === activeFilter;

          return (
            <g key={`inner-${index}`}>
              {selected ? (
                <svg>
                  {/* Outer Circle (First colored border) */}
                  <circle
                    cx={x}
                    cy={y}
                    r={smallCircleRadius + 1} // Adjust the radius to make the border visible
                    fill="none"
                    stroke="#00A372" // Green border for selected state
                    strokeWidth="1" // Outer border width
                  />
                  {/* Inner Circle (Second colored border) */}
                  <circle
                    cx={x}
                    cy={y}
                    r={smallCircleRadius} // Original small circle radius
                    fill="#00A372" // Green fill when selected
                    stroke="#fff" // White border inside the green
                    strokeWidth="2" // Inner border width
                  />
                </svg>
              ) : (
                <circle
                  cx={x}
                  cy={y}
                  r={smallCircleRadius}
                  fill="#ADADAD" // Gray fill when not selected
                  onClick={() => setActiveFilter(name)}
                />
              )}
              <text
                x={x}
                y={y - smallCircleRadius - 5}
                textAnchor="middle"
                fontSize="6"
                fill="black"
              >
                {name}
              </text>
            </g>
          );
        })}
        {outerSmallCircles.map((skill, index) => {
          const angle = startingAngle + index * outerAngleStep; // Apply startingAngle
          const x = centerX + outerRadius * Math.cos(angle);
          const y = centerY + outerRadius * Math.sin(angle);
          const selected = skill === activeFilter;
          const related = activeSkills.includes(skill);

          // Adjust text positioning based on angle
          let textAnchor = "middle";
          let dy = 0;

          // Determine text position based on angle
          if (angle >= 0 && angle < Math.PI / 2) {
            // Bottom-right quadrant
            textAnchor = "start";
            dy = "1em";
          } else if (angle >= Math.PI / 2 && angle < Math.PI) {
            // Bottom-left quadrant
            textAnchor = "end";
            dy = "1em";
          } else if (angle >= Math.PI && angle < (3 * Math.PI) / 2) {
            // Top-left quadrant
            textAnchor = "end";
            dy = "-0.5em";
          } else {
            // Top-right quadrant
            textAnchor = "start";
            dy = "-0.5em";
          }

          return (
            <g key={`outer-${index}`}>
              {selected ? (
                <svg>
                  {/* Outer Circle (First colored border) */}
                  <circle
                    cx={x}
                    cy={y}
                    r={smallCircleRadius + 1} // Adjust the radius to make the border visible
                    fill="none"
                    stroke="#FF7A00" // Green border for selected state
                    strokeWidth="1" // Outer border width
                  />
                  {/* Inner Circle (Second colored border) */}
                  <circle
                    cx={x}
                    cy={y}
                    r={smallCircleRadius} // Original small circle radius
                    fill="#FF7A00" // Green fill when selected
                    stroke="#fff" // White border inside the green
                    strokeWidth="2" // Inner border width
                  />
                </svg>
              ) : (
                <circle
                  cx={x}
                  cy={y}
                  r={smallCircleRadius}
                  fill={related ? "#FF7A00" : "#FFD4AD"} // Gray fill when not selected
                  onClick={() => setActiveFilter(skill)}
                />
              )}
              <text
                x={x}
                y={y}
                textAnchor={textAnchor}
                dy={dy}
                fontSize="6"
                fill="black"
              >
                {skill}
              </text>
            </g>
          );
        })}
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
