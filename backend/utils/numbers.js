const roundTo = (value, decimals = 2) => {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return 0;
  }

  return Number(number.toFixed(decimals));
};

module.exports = { roundTo };
