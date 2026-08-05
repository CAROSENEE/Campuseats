export const makeOrderNumber = () => `CE${Date.now().toString().slice(-8)}${Math.floor(Math.random() * 90 + 10)}`;

export const toOrderStatus = (status) => {
  const allowed = ['preparing', 'ready'];
  return allowed.includes(status) ? status : null;
};
