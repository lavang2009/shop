export const formatCurrency = (value) => {
  const number = Number(value || 0);

  if (Number.isNaN(number)) return "0 ₫";

  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(number);
};

export const normalizePhoneNumber = (value = "") => {
  const raw = String(value).trim();
  if (!raw) return "";

  const digits = raw.replace(/[^\d+]/g, "");

  if (!digits) return "";

  if (digits.startsWith("+")) return digits;
  if (digits.startsWith("0")) return `+84${digits.slice(1)}`;
  if (digits.startsWith("84")) return `+${digits}`;
  return `+${digits}`;
};

export const isValidEmail = (value = "") => {
  const email = String(value).trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const isStrongPassword = (value = "") => {
  const password = String(value);
  return /^(?=.*[A-Za-z])(?=.*\d).{6,}$/.test(password);
};

export const buildSlug = (value = "") => {
  return String(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
};

export const formatDate = (value) => {
  if (!value) return "";

  let date = null;

  if (value?.seconds) {
    date = new Date(value.seconds * 1000);
  } else if (value instanceof Date) {
    date = value;
  } else {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) date = parsed;
  }

  if (!date || Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};
