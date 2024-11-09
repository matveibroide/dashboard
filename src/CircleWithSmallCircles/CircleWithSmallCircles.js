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

  //get related skills

  const relatedSkills = useMemo(() => {
    if (innerSmallCircles.includes(activeFilter)) {
      const job = data.find((job) => job.name === activeFilter);
      return [...job.mainSkills, ...job.otherSkills];
    }

    return [];
  }, [activeFilter, innerSmallCircles]);
  console.log(relatedSkills);

  //circles

  const innerRadius = 55;
  const outerRadius = 130;
  const smallCircleRadius = 7;
  const centerX = 150;
  const centerY = 150;

  const innerAngleStep = (2 * Math.PI) / innerSmallCircles.length;
  const outerAngleStep = (2 * Math.PI) / outerSmallCircles.length;
  const startingAngle = -Math.PI / 2; // Set the starting angle

  //find close circles

  const calculateClosestCircles = (activeFilter, circlesNumber) => {
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
    return distances.slice(0, circlesNumber).map((item) => item.skill);
  };

  //swap circles

  const swapCircles = (activeFilter) => {
    console.log(activeFilter);
    if (innerSmallCircles.includes(activeFilter)) {
      const selectedItem = data.find((item) => item.name === activeFilter);
      const { mainSkills, otherSkills } = selectedItem;
      const skillsNumber = mainSkills.length + otherSkills.length;
      const closestCircles = calculateClosestCircles(
        activeFilter,
        skillsNumber
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
        filteredSkills
      );

      setOuterCircles(outerSmallCirclesArr);
    } else if (outerSmallCircles.includes(activeFilter)) {
      const relatedJobsMain = data
        .filter((item) => item.mainSkills.includes(activeFilter))
        .map((item) => item.name);

      const relatedJobsOther = data
        .filter((item) => item.otherSkills.includes(activeFilter))
        .map((item) => item.name);

      const closestJobCircles = calculateClosestCircles(
        activeFilter,
        relatedJobsMain.length + relatedJobsOther.length
      );
      console.log(relatedJobsMain, relatedJobsOther);
      console.log(closestJobCircles);

      /*   const innerSmallCirclesArr = swapCirclesUtil(
        innerSmallCircles,
        closestJobCircles,
        [...relatedJobsMain, relatedJobsOther]
      );

      setInnerCircles(innerSmallCirclesArr); */
    }
  };

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

        {innerSmallCircles.map((name, index) => {
          const angle = startingAngle + index * innerAngleStep; // Apply startingAngle
          const x = centerX + innerRadius * Math.cos(angle);
          const y = centerY + innerRadius * Math.sin(angle);
          const selected = name === activeFilter;
          console.log(x, name);
          const { textAnchor, dx, dy } = getTextPosition(angle, "inner");
          const type = "inner";

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
                  onClick={() => handleFilterChange(name)}
                />
              )}
              <text
                x={x}
                y={y - smallCircleRadius - 5}
                textAnchor={textAnchor}
                fontSize="6"
                fill="black"
              >
                {name.split(" ").map((item, i) => (
                  <tspan
                    key={i}
                    x={x} // Align horizontally
                    dy={i === 0 ? "0em" : "1.5em"} // Vertical spacing for each line, adjust this for proper line spacing
                  >
                    {item}
                  </tspan>
                ))}
              </text>
            </g>
          );
        })}
        {outerSmallCircles.map((skill, index) => {
          const angle = startingAngle + index * outerAngleStep; // Apply startingAngle
          const x = centerX + outerRadius * Math.cos(angle);
          const y = centerY + outerRadius * Math.sin(angle);
          const selected = skill === activeFilter;
          const related = relatedSkills.includes(skill);

          const { textAnchor, dx, dy } = getTextPosition(angle);

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
                  onClick={() => handleFilterChange(skill)}
                />
              )}
              <text
                className="circle-text"
                x={x}
                y={y}
                textAnchor={textAnchor}
                dy={dy}
                dx={dx}
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
