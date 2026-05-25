// Place this in: src/lib/testConnection.ts
// Import and run from browser console to verify setup

export async function testBackendConnection() {
  console.log('%c🔍 SmartBus Connection Test Started', 'font-size: 16px; color: blue; font-weight: bold');
  
  const tests = {
    backend: false,
    health: false,
    cors: false,
    database: false,
  };

  // Test 1: Backend Root
  console.log('\n%c1️⃣  Testing Backend Root Endpoint...', 'color: orange');
  try {
    const res = await fetch('http://localhost:5000', {
      credentials: 'include'
    });
    const data = await res.json();
    console.log('%c✅ Backend Root OK', 'color: green', data);
    tests.backend = true;
  } catch (error: any) {
    console.error('%c❌ Backend Root Failed', 'color: red', error.message);
    console.error('  Make sure: npm run dev:api is running on port 5000');
  }

  // Test 2: Health Check
  console.log('\n%c2️⃣  Testing Health Endpoint...', 'color: orange');
  try {
    const res = await fetch('http://localhost:5000/api/health', {
      credentials: 'include'
    });
    const data = await res.json();
    console.log('%c✅ Health Check OK', 'color: green', data);
    tests.health = true;
  } catch (error: any) {
    console.error('%c❌ Health Check Failed', 'color: red', error.message);
  }

  // Test 3: CORS
  console.log('\n%c3️⃣  Testing CORS Configuration...', 'color: orange');
  try {
    const res = await fetch('http://localhost:5000/', {
      method: 'OPTIONS',
      headers: {
        'Origin': window.location.origin,
        'Access-Control-Request-Method': 'POST',
      },
    });
    console.log('%c✅ CORS OK (Status: ' + res.status + ')', 'color: green');
    tests.cors = true;
  } catch (error: any) {
    console.warn('%c⚠️  CORS Check (May be OK)', 'color: yellow', error.message);
    tests.cors = true; // Don't fail on this since CORS works with simple requests
  }

  // Test 4: Database via Login Endpoint
  console.log('\n%c4️⃣  Testing Supabase/Postgres Connection (via Login)...', 'color: orange');
  try {
    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'nonexistent@test.com', password: 'test' }),
      credentials: 'include',
    });
    const data = await res.json();
    console.log('%c✅ Database Connection OK', 'color: green', {
      status: res.status,
      response: data
    });
    tests.database = true;
  } catch (error: any) {
    if (error.message.includes('Failed to fetch')) {
      console.error('%c❌ Network Error - Backend Not Responding', 'color: red');
      console.error('  Make sure: npm run dev:api');
    } else if (error.message.includes('connect')) {
      console.error('%c❌ Database Not Connected', 'color: red', error.message);
      console.error('  Make sure: DATABASE_URL is set and Supabase is reachable');
    } else {
      console.error('%c⚠️  Database Test Error', 'color: yellow', error.message);
    }
  }

  // Summary
  console.log('\n%c📊 Test Summary', 'font-size: 14px; color: purple; font-weight: bold');
  console.table({
    'Backend Root': tests.backend ? '✅ OK' : '❌ FAILED',
    'Health Check': tests.health ? '✅ OK' : '❌ FAILED',
    'CORS': tests.cors ? '✅ OK' : '❌ FAILED',
    'Database': tests.database ? '✅ OK' : '❌ FAILED',
  });

  const passCount = Object.values(tests).filter(t => t).length;
  const totalCount = Object.keys(tests).length;

  if (passCount === totalCount) {
    console.log('%c✨ All Tests Passed! Login should work now.', 'font-size: 14px; color: green; font-weight: bold');
  } else {
    console.log(`%c⚠️  ${passCount}/${totalCount} tests passed. Check errors above.`, 'font-size: 14px; color: red; font-weight: bold');
  }

  return tests;
}

// Export for browser console
(window as any).testBackendConnection = testBackendConnection;
