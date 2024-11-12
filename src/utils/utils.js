export const swapCirclesUtil = (circleArr, closeCircles, distantCircles) => {
  const res = [...circleArr];
  for (let i = 0; i < closeCircles.length; i++) {
    const close = res.indexOf(closeCircles[i]);
    const skill = res.indexOf(distantCircles[i]);
    let temp = res[close];
    res[close] = res[skill];
    res[skill] = temp;
  }

  return res;
};

export const calculateClosestCircles = (
  activeFilter, // The selected circle (either inner or outer)
  circlesNumber, // Number of closest circles to find
  sourceCircles, // The group of circles to calculate from (either inner or outer)
  targetCircles, // The group of circles to calculate distances to
  sourceRadius, // Radius of the source circles
  targetRadius, // Radius of the target circles
  sourceAngleStep, // Angle step between source circles
  targetAngleStep, // Angle step between target circles
  centerX, // X coordinate of the center
  centerY, // Y coordinate of the center
  startingAngle = 0 // Starting angle for both inner and outer circles
) => {
  const sourceIndex = sourceCircles.indexOf(activeFilter);
  const sourceAngle = startingAngle + sourceIndex * sourceAngleStep;
  const sourceX = centerX + sourceRadius * Math.cos(sourceAngle);
  const sourceY = centerY + sourceRadius * Math.sin(sourceAngle);

  const distances = targetCircles.map((circle, index) => {
    const targetAngle = startingAngle + index * targetAngleStep;
    const targetX = centerX + targetRadius * Math.cos(targetAngle);
    const targetY = centerY + targetRadius * Math.sin(targetAngle);

    const distance = Math.sqrt(
      Math.pow(targetX - sourceX, 2) + Math.pow(targetY - sourceY, 2)
    );
    return { circle, distance };
  });

  distances.sort((a, b) => a.distance - b.distance);
  return distances.slice(0, circlesNumber).map((item) => item.circle);
};

export const getTextPosition = (angle, type) => {
  let textAnchor, dx, dy;

  const isInnerType = type === "inner";
  const baseDx = isInnerType ? "5.5em" : "1em";
  const baseDy = isInnerType ? "5em" : "3em";

  if (angle >= 0 && angle < Math.PI / 2) {
    // Bottom-right quadrant
    textAnchor = "start";
    dx = baseDx;
    dy = baseDy;
  } else if (angle >= Math.PI / 2 && angle < Math.PI) {
    // Bottom-left quadrant
    textAnchor = "end";
    dx = `-${baseDx}`;
    dy = baseDy;
  } else if (angle >= Math.PI && angle < (3 * Math.PI) / 2) {
    // Top-left quadrant
    textAnchor = "end";
    dx = `-${baseDx}`;
    dy = `-${baseDy}`;
  } else {
    // Top-right quadrant
    textAnchor = "start";
    dx = baseDx;
    dy = `-${baseDy}`;
  }

  return { textAnchor, dx, dy };
};
