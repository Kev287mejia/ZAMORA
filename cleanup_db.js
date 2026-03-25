const https = require('https');

const SUPABASE_URL = 'https://cxsfqpuzzovqjmvtrnqo.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_JONrWU2YDH3VRv9nlkAZxA_dTq18pkW';

function request(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      method: method,
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      }
    };
    if (data) options.headers['Content-Length'] = Buffer.byteLength(JSON.stringify(data));
    
    const req = https.request(`${SUPABASE_URL}/rest/v1/${path}`, options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          resolve(body ? JSON.parse(body) : {});
        } catch(e) { resolve(body); }
      });
    });
    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function clean() {
  console.log("Cleaning Supabase Data...");
  
  // 1. Clean Properties
  const props = await request('GET', 'properties?select=*');
  console.log(`Found ${props.length} properties.`);
  
  for (const p of props) {
    let dirty = false;
    let update = {};
    
    // Check neighborhood
    if (p.neighborhood && p.neighborhood.includes('Ã')) {
      update.neighborhood = p.neighborhood.replace(/Ã°Å¸â€œÂ/g, '').replace(/Ã/g, '').trim();
      dirty = true;
    }
    
    // Check other fields
    if (p.title_es && p.title_es.includes('Ã')) {
      update.title_es = p.title_es.replace(/Ã/g, '').trim(); // Broad clean
      dirty = true;
    }

    if (dirty) {
      console.log(`Updating property ${p.id}:`, update);
      await request('PATCH', `properties?id=eq.${p.id}`, update);
    }
  }
  
  // 2. Clean Testimonials
  const tests = await request('GET', 'testimonials?select=*');
  console.log(`Found ${tests.length} testimonials.`);
  for (const t of tests) {
    let dirty = false;
    let update = {};
    if (t.name && t.name.includes('Ã')) {
       update.name = t.name.replace(/Ã/g, ''); dirty = true;
    }
    if (t.role_es && t.role_es.includes('Ã')) {
       update.role_es = t.role_es.replace(/Ã/g, ''); dirty = true;
    }
    if (t.content_es && t.content_es.includes('Ã')) {
       update.content_es = t.content_es.replace(/Ã/g, ''); dirty = true;
    }
    if (dirty) {
      console.log(`Updating testimonial ${t.id}:`, update);
      await request('PATCH', `testimonials?id=eq.${t.id}`, update);
    }
  }
  
  console.log("Cleanup finished.");
}

clean();
