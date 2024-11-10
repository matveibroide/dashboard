import React, { useMemo, useState } from "react";
import data from "../API/API"; // Import your mock data
import "./CircleWithSmallCircles.css";
import { swapCirclesUtil, getTextPosition } from "../utils/utils";
import LinesBetweenCircles from "../LinesBetweenCircles/LinesBetweemCircles";

const CircleWithSmallCircles = () => {
  const [activeFilter, setActiveFilter] = useState(null);
  const [innerSmallCircles, setInnerCircles] = useState(() =>
    data.map((item) => item.name)
  );
  const [outerSmallCircles, setOuterCircles] = useState(() =>
    Array.from(
      new Set(data.flatMap((item) => [...item.mainSkills, ...item.otherSkills]))
    )
  );

  // Get related skills
  const relatedSkills = useMemo(() => {
    if (innerSmallCircles.includes(activeFilter)) {
      const job = data.find((job) => job.name === activeFilter);
      return [...job.mainSkills, ...job.otherSkills];
    }
    return [];
  }, [activeFilter, innerSmallCircles]);

  //circles settings

  const innerRadius = 55;
  const outerRadius = 130;
  const smallCircleRadius = 7;
  const centerX = 150;
  const centerY = 150;

  //angle settings

  const innerAngleStep = (2 * Math.PI) / innerSmallCircles.length;
  const outerAngleStep = (2 * Math.PI) / outerSmallCircles.length;
  const startingAngle = -Math.PI / 2;

  const calculateClosestCircles = (activeFilter, circlesNumber, filterArr, findClosestArr,angleStep, angleStepSearched) => {
    const innerIndex = filterArr.indexOf(activeFilter);
    const innerAngle = startingAngle + innerIndex * angleStep;
    const innerX = centerX + innerRadius * Math.cos(innerAngle);
    const innerY = centerY + innerRadius * Math.sin(innerAngle);

    const distances = findClosestArr.map((skill, index) => {
      const outerAngle = startingAngle + index * angleStepSearched;
      const outerX = centerX + outerRadius * Math.cos(outerAngle);
      const outerY = centerY + outerRadius * Math.sin(outerAngle);

      const distance = Math.sqrt(
        Math.pow(outerX - innerX, 2) + Math.pow(outerY - innerY, 2)
      );
      return { skill, distance };
    });

    distances.sort((a, b) => a.distance - b.distance);
    return distances.slice(0, circlesNumber).map((item) => item.skill);
  };

  const swapCircles = (activeFilter) => {
    if (innerSmallCircles.includes(activeFilter)) {
      const selectedItem = data.find((item) => item.name === activeFilter);
      const { mainSkills, otherSkills } = selectedItem;
      const skillsNumber = mainSkills.length + otherSkills.length;
      const closestCircles = calculateClosestCircles(
        activeFilter,
        skillsNumber,
        innerSmallCircles,
        outerSmallCircles,
        innerAngleStep,
        outerAngleStep
      );
      const filteredClose = closestCircles.filter(
        (item) => ![...mainSkills, ...otherSkills].includes(item)
      );
      const filteredSkills = [...mainSkills, ...otherSkills].filter(
        (item) => !closestCircles.includes(item)
      );

      const outerSmallCirclesArr = swapCirclesUtil(
        outerSmallCircles,
        filteredClose,
        filteredSkills,
        outerAngleStep,
        innerAngleStep
      );

      setOuterCircles(outerSmallCirclesArr);
    }

    else if (outerSmallCircles.includes(activeFilter)) {
      const jobsMain = data.filter(item => item.mainSkills.includes(activeFilter))
      const jobsOther = data.filter(item => item.otherSkills.includes(activeFilter))
      const jobsAmount = jobsMain.length + jobsOther.length
      const closestCircles = calculateClosestCircles(activeFilter, jobsAmount,outerSmallCircles,innerSmallCircles)
      console.log(closestCircles)

    }
  };

  //handle change of the filter

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    swapCircles(filter);
  };

  return (
    <div className="container">
      <svg
        width="90%"
        height="80%"
        viewBox="0 -3 300 300"
        preserveAspectRatio="xMidYMid meet"
      >
        <LinesBetweenCircles
          data={data}
          activeFilter={activeFilter}
          innerSmallCircles={innerSmallCircles}
          outerSmallCircles={outerSmallCircles}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          centerX={centerX}
          centerY={centerY}
          startingAngle={startingAngle}
          innerAngleStep={innerAngleStep}
          outerAngleStep={outerAngleStep}
          
        />

        <circle
          cx={centerX}
          cy={centerY}
          r={innerRadius}
          fill="none"
          stroke="#ADADAD"
          strokeWidth="2"
        />
        <circle
          cx={centerX}
          cy={centerY}
          r={outerRadius}
          fill="none"
          stroke="#ADADAD"
          strokeWidth="2"
        />

        {/* Inner Circles */}
        {innerSmallCircles.map((name, index) => {
          const angle = startingAngle + index * innerAngleStep;
          const x = centerX + innerRadius * Math.cos(angle);
          const y = centerY + innerRadius * Math.sin(angle);
          const selected = name === activeFilter;

          const textX = centerX + 75 * Math.cos(angle);
          const textY = centerY + 75 * Math.sin(angle);
          const angleDegrees = (angle * 180) / Math.PI;
          let textAnchor =
            angleDegrees > 90 && angleDegrees < 270 ? "end" : "start";

          if (y === 95 || y === 95 + innerRadius * 2) {
            textAnchor = "middle";
          }

          const labels = name.split(" ");
          const updatedLabels = [];

          for (let i = 0; i < labels.length; i++) {
            let str = "";
            if (labels[i + 1] != undefined && labels[i + 1].length <= 3) {
              str = `${labels[i]} ${labels[i + 1]}`;
              updatedLabels.push(str);
            } else if (labels[i].length <= 3) {
              continue;
            } else {
              str = labels[i];
              updatedLabels.push(str);
            }
          }

          return (
            <g key={`inner-${index}`}>
              {selected ? (
                <svg>
                  {/* Outer Circle (Border) */}
                  <circle
                    cx={x}
                    cy={y}
                    r={smallCircleRadius + 1}
                    fill="none"
                    stroke="#00A372"
                    strokeWidth="1"
                  />
                  {/* Inner Circle (Selected) */}
                  <circle
                    cx={x}
                    cy={y}
                    r={smallCircleRadius}
                    fill="#00A372"
                    stroke="#fff"
                    strokeWidth="2"
                  />
                </svg>
              ) : (
                <circle
                  cx={x}
                  cy={y}
                  r={smallCircleRadius}
                  fill="#ADADAD"
                  onClick={() => handleFilterChange(name)}
                />
              )}
              {/* Adjusted Text positioned outside the circle */}
              <text
                x={textX}
                y={textY}
                textAnchor={textAnchor}
                fontSize="6"
                fill="black"
                dy="-12" // Push the text up by 12px to prevent overlap with the circle
              >
                {name.length > 16
                  ? updatedLabels.map((item, i) => (
                      <tspan
                        key={i}
                        x={textX}
                        textY={textY}
                        dy={i === 0 ? "0em" : "1.5em"} // Add space between lines
                      >
                        {item}
                      </tspan>
                    ))
                  : name}
              </text>
            </g>
          );
        })}

        {/* Outer Circles */}
        {outerSmallCircles.map((skill, index) => {
          const angle = startingAngle + index * outerAngleStep;
          const x = centerX + outerRadius * Math.cos(angle);
          const y = centerY + outerRadius * Math.sin(angle);
          const selected = skill === activeFilter;
          const related = relatedSkills.includes(skill);

          const textX = centerX + 147 * Math.cos(angle);
          const textY = centerY + 147 * Math.sin(angle);
          const angleDegrees = (angle * 180) / Math.PI;
          let textAnchor =
            angleDegrees > 90 && angleDegrees < 270 ? "end" : "start";

          if (y === 20 || y === 20 + innerRadius * 2) {
            textAnchor = "middle";
          }

          return (
            <g key={`outer-${index}`}>
              {selected ? (
                <svg>
                  {/* Outer Circle (Border) */}
                  <circle
                    cx={x}
                    cy={y}
                    r={smallCircleRadius + 1}
                    fill="none"
                    stroke="#FF7A00"
                    strokeWidth="1"
                  />
                  {/* Inner Circle (Selected) */}
                  <circle
                    cx={x}
                    cy={y}
                    r={smallCircleRadius}
                    fill="#FF7A00"
                    stroke="#fff"
                    strokeWidth="2"
                  />
                </svg>
              ) : (
                <circle
                  cx={x}
                  cy={y}
                  r={smallCircleRadius}
                  fill={related ? "#FF7A00" : "#FFD4AD"}
                  onClick={() => handleFilterChange(skill)}
                />
              )}
              {/* Adjusted Text positioned outside the circle */}
              <text
                x={textX}
                y={textY}
                textAnchor={textAnchor}
                fontSize="6"
                fill={related ? "#3A3A3A" : "#ADADAD"}
              >
                {skill}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default CircleWithSmallCircles;
