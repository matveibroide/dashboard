import React, { useEffect, useMemo, useState } from "react";
import data from "./API/API"; // Import your mock data

const CircleWithSmallCircles = () => {
  const [activeFilter, setActiveFilter] = useState(null);
  const [closestToFilter, setClosestToFilter] = useState([]);
  const innerRadius = 55;
  const outerRadius = 135;
  const smallCircleRadius = 5;
  const centerX = 150;
  const centerY = 150;

  const innerSmallCirclesArr = useMemo(() => data.map((item) => item.name), [data]);
  const outerSmallCirclesArr = useMemo(() => {
    return data.reduce((acc, n) => {
      [...n.mainSkills, ...n.otherSkills].forEach((skill) => {
        if (!acc.includes(skill)) acc.push(skill);
      });
      return acc;
    }, []);
  }, [data]);

  const innerAngleStep = (2 * Math.PI) / innerSmallCirclesArr.length;
  const outerAngleStep = (2 * Math.PI) / outerSmallCirclesArr.length;

  const getClosestOuterCircles = (selectedInnerName, numberOfClosest) => {
    const innerIndex = innerSmallCirclesArr.indexOf(selectedInnerName);
    const innerAngle = innerIndex * innerAngleStep;
    const innerX = centerX + innerRadius * Math.cos(innerAngle);
    const innerY = centerY + innerRadius * Math.sin(innerAngle);

    const distances = outerSmallCirclesArr.map((skill, index) => {
      const outerAngle = index * outerAngleStep;
      const outerX = centerX + outerRadius * Math.cos(outerAngle);
      const outerY = centerY + outerRadius * Math.sin(outerAngle);

      const distance = Math.sqrt(
        Math.pow(outerX - innerX, 2) + Math.pow(outerY - innerY, 2)
      );
      return { skill, distance };
    });

    distances.sort((a, b) => a.distance - b.distance);
    return distances.slice(0, numberOfClosest).map((item) => item.skill);
  };

  const getRelatedItems = useMemo(() => {
    if (!activeFilter) return { mainSkills: [], otherSkills: [] };

    const selectedItem = data.find((item) => item.name === activeFilter);
    if (selectedItem) {
      return {
        mainSkills: selectedItem.mainSkills,
        otherSkills: selectedItem.otherSkills,
      };
    } else {
      const relatedNames = data
        .filter(
          (item) =>
            item.mainSkills.includes(activeFilter) ||
            item.otherSkills.includes(activeFilter)
        )
        .map((item) => item.name);
      return {
        mainSkills: relatedNames,
        otherSkills: [],
      };
    }
  }, [activeFilter, data]);

  useEffect(() => {
    const closestOuterCircles = getClosestOuterCircles(
      activeFilter,
      getRelatedItems.mainSkills.length + getRelatedItems.otherSkills.length
    );
    setClosestToFilter(closestOuterCircles);
  }, [activeFilter, getRelatedItems]);

  const closeIndex = [];
  const relatedIndex = [];

  closestToFilter.forEach((item) => {
    const index = outerSmallCirclesArr.indexOf(item);
    if (index !== -1) closeIndex.push(index);
  });

  [...getRelatedItems.mainSkills, ...getRelatedItems.otherSkills].forEach((item) => {
    const index = outerSmallCirclesArr.indexOf(item);
    if (index !== -1) relatedIndex.push(index);
  });

  if (closeIndex.length > 0 && closeIndex.length <= relatedIndex.length) {
    closeIndex.forEach((closeIdx, i) => {
      const relatedIdx = relatedIndex[i];
      if (relatedIdx !== undefined) {
        const temp = outerSmallCirclesArr[closeIdx];
        outerSmallCirclesArr[closeIdx] = outerSmallCirclesArr[relatedIdx];
        outerSmallCirclesArr[relatedIdx] = temp;
      }
    });
  }

  const innerSmallCircles = innerSmallCirclesArr.map((name, index) => {
    const angle = index * innerAngleStep;
    const x = centerX + innerRadius * Math.cos(angle);
    const y = centerY + innerRadius * Math.sin(angle);

    return (
      <g key={`inner-${index}`}>
        <circle
          cx={x}
          cy={y}
          r={smallCircleRadius}
          fill="blue"
          onClick={() => setActiveFilter(name)}
        />
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
  });

  const outerSmallCircles = outerSmallCirclesArr.map((skill, index) => {
    const angle = index * outerAngleStep;
    const x = centerX + outerRadius * Math.cos(angle);
    const y = centerY + outerRadius * Math.sin(angle);

    return (
      <g key={`outer-${index}`}>
        <circle
          cx={x}
          cy={y}
          r={smallCircleRadius}
          fill="red"
          onClick={() => setActiveFilter(skill)}
        />
        <text
          x={x}
          y={y - smallCircleRadius - 5}
          textAnchor="end"
          fontSize="6"
          fill="black"
        >
          {skill}
        </text>
      </g>
    );
  });

  const connectingLines = [
    ...getRelatedItems.mainSkills.map((relatedSkill) => {
      const outerIndex = outerSmallCirclesArr.indexOf(relatedSkill);
      const outerAngle = outerIndex * outerAngleStep;
      const outerX = centerX + outerRadius * Math.cos(outerAngle);
      const outerY = centerY + outerRadius * Math.sin(outerAngle);

      const innerIndex = innerSmallCirclesArr.indexOf(activeFilter);
      const innerAngle = innerIndex * innerAngleStep;
      const innerX = centerX + innerRadius * Math.cos(innerAngle);
      const innerY = centerY + innerRadius * Math.sin(innerAngle);

      const controlX = (innerX + outerX) / 2 + 20;
      const controlY = (innerY + outerY) / 2;

      return (
        <path
          key={`line-main-${relatedSkill}`}
          d={`M ${innerX} ${innerY} Q ${controlX} ${controlY}, ${outerX} ${outerY}`}
          stroke="orange"
          strokeWidth="1"
          fill="none"
        />
      );
    }),
    ...getRelatedItems.otherSkills.map((relatedSkill) => {
      const outerIndex = outerSmallCirclesArr.indexOf(relatedSkill);
      const outerAngle = outerIndex * outerAngleStep;
      const outerX = centerX + outerRadius * Math.cos(outerAngle);
      const outerY = centerY + outerRadius * Math.sin(outerAngle);

      const innerIndex = innerSmallCirclesArr.indexOf(activeFilter);
      const innerAngle = innerIndex * innerAngleStep;
      const innerX = centerX + innerRadius * Math.cos(innerAngle);
      const innerY = centerY + innerRadius * Math.sin(innerAngle);

      const controlX = (innerX + outerX) / 2 - 20;
      const controlY = (innerY + outerY) / 2;

      return (
        <path
          key={`line-other-${relatedSkill}`}
          d={`M ${innerX} ${innerY} Q ${controlX} ${controlY}, ${outerX} ${outerY}`}
          stroke="purple"
          strokeWidth="1"
          fill="none"
        />
      );
    }),
  ];

  return (
    <div style={{ width: "80vw", height: "80vh", margin: "auto" }}>
      <svg
        width="95%"
        height="95%"
        viewBox="0 0 300 300"
        preserveAspectRatio="xMidYMid meet"
      >
        <circle
          cx="150"
          cy="150"
          r={innerRadius}
          fill="none"
          stroke="black"
          strokeWidth="2"
        />
        <circle
          cx="150"
          cy="150"
          r={outerRadius}
          fill="none"
          stroke="gray"
          strokeWidth="2"
        />

        {innerSmallCircles}
        {outerSmallCircles}
        {connectingLines}
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
