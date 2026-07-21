export const formatCurrency = (price) => {
  return `₦ ${Number(price).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}` ;
};
