// Turns a local Israeli number into the international form wa.me expects
export const toWhatsappNumber = (phone: string) => {
  const digits = phone.replace(/\D/g, "");
  return digits.startsWith("0") ? `972${digits.slice(1)}` : digits;
};