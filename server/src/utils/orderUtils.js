export const calculateOrderTotal = (items) => {
  return items.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);
};

export const applyDiscount = (amount, discountPercent) => {
  return amount - (amount * discountPercent) / 100;
};

export const applyTax = (amount, taxPercent = 5) => {
  return amount + (amount * taxPercent) / 100;
};

export const generateOrderNumber = () => {
  return `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
};
