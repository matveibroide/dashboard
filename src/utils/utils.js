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
