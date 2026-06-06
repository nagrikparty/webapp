export const createVerificationSession = async () => {
  const res = await fetch('/api/verification/create', { method: 'POST' });
  return res.json();
};

export const checkVerificationStatus = async () => {
  const res = await fetch('/api/verification/status');
  return res.json();
};
