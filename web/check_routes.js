const axios = require('axios');

const routes = [
  '/',
  '/login',
  '/signup',
  '/dashboard',
  '/profile',
  '/learning',
  '/career',
  '/jobs',
  '/connect',
  '/groups',
  '/rankings',
  '/settings',
  '/admin',
  '/mentor',
  '/teacher',
  '/teacher/ai-tools',
  '/recruiter',
  '/recruiter/pipeline'
];

async function runAudit() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🤖 RESUMEVERIFY X™ — PROGRAMMATIC ROUTE STABILITY AUDIT');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  let successCount = 0;
  let failCount = 0;

  for (const route of routes) {
    const url = `http://localhost:3000${route}`;
    try {
      const response = await axios.get(url, { timeout: 3000 });
      console.log(`✅ [200 OK]  Route: ${route.padEnd(20)} | Server Response: Stable`);
      successCount++;
    } catch (error) {
      if (error.response) {
        // If 401/403, it means the middleware authentication redirect is working correctly!
        if (error.response.status === 307 || error.response.status === 302 || error.response.status === 401) {
          console.log(`🔒 [SECURE]  Route: ${route.padEnd(20)} | Middleware Auth Shield: Active (Redirected)`);
          successCount++;
        } else {
          console.log(`❌ [ERROR]   Route: ${route.padEnd(20)} | Status: ${error.response.status}`);
          failCount++;
        }
      } else {
        console.log(`⚠️ [TIMEOUT] Route: ${route.padEnd(20)} | Connection Timeout`);
        failCount++;
      }
    }
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`📊 AUDIT COMPLETE: ${successCount} Routes Stable | ${failCount} Issues Found`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

runAudit();
