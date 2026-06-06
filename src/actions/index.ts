export const updateProfile = async (data: any) => {
  const res = await fetch('/api/profile', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
};

export const getLiveIssues = async (limit?: number, offset?: number) => {
  const url = new URL('/api/reports/live', window.location.origin);
  if (limit) url.searchParams.set('limit', limit.toString());
  if (offset) url.searchParams.set('offset', offset.toString());
  const res = await fetch(url.toString());
  return res.json();
};
