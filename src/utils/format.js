export const formatCurrency = (value) => {
  const number = Number(value || 0);
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(number);
};

export const normalizePhoneNumber = (value = "") => {
  const digits = value.replace(/[^\d+]/g, "").trim();
  if (!digits) return "";
  if (digits.startsWith("+")) return digits;
  if (digits.startsWith("0")) return `+84${digits.slice(1)}`;
  if (digits.startsWith("84")) return `+${digits}`;
  return `+${digits}`;
};

export const isValidEmail = (value = "") => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

export const isStrongPassword = (value = "") => /^(?=.*[A-Za-z])(?=.*\d).{6,}$/.test(value);

export const buildSlug = (value = "") =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

export const formatDate = (value) => {
  if (!value?.seconds) return "";
  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value.seconds * 1000));
};
