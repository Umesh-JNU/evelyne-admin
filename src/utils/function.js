export const getDateTime = (dt) => {
  console.log({ dt })
  if (!dt || typeof dt === "number") return;

  const dT = dt.split(".")[0].split("T");
  return `${dT[0]} ${dT[1]}`;
};
