function getPlanningById(data, targetId) {
  const result = data.reduce((acc, curr) => {
    if (curr.Planning) {
      Object.entries(curr.Planning).forEach(([jour, slots]) => {
        Object.entries(slots).forEach(([slot, content]) => {
          if (content && content._id === targetId) {
            const { Prénom, _id } = curr;
            acc[jour] = { ...acc[jour], [slot]: { Prénom, _id } };
          }
        });
      });
    }
    return acc;
  }, {});
  return { Planning: result };
}
export { getPlanningById}


  