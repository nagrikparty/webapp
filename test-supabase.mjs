const url = 'https://xlxanliztdzonbdrrriw.supabase.co/rest/v1/crimes?select=crime_type';
const key = 'sb_publishable_O3IWZfgdPhDfYXbF6AnEZw__ljeTMQn';
fetch(url, { headers: { apikey: key, Authorization: 'Bearer ' + key } })
  .then(r => r.json())
  .then(d => console.log(JSON.stringify(d).slice(0, 100)))
  .catch(console.error);
