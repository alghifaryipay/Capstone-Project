export const parseEnergy = (value) => {
  const normalized = String(value ?? "").replace(",", ".");
  const parsed = Number.parseFloat(normalized);

  return Number.isFinite(parsed) ? parsed : 0;
};

export const formatNumber = (
  value,
  locale = "id-ID",
  maximumFractionDigits = 2,
) => {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return "0";
  }

  return new Intl.NumberFormat(locale, {
    maximumFractionDigits,
  }).format(number);
};

export const formatEnergy = (value, locale = "id-ID") =>
  `${formatNumber(value, locale, 2)} kWh`;
