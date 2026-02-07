import http from 'http';

const BASE_URL = 'http://localhost:3000';

function request(path: string, method: string, body?: any, token?: string): Promise<{ status: number, data: any }> {
    return new Promise((resolve, reject) => {
        const url = new URL(path, BASE_URL);
        const options: http.RequestOptions = {
            hostname: url.hostname,
            port: url.port,
            path: url.pathname,
            method: method,
            headers: {
                'Content-Type': 'application/json',
            }
        };

        if (token) {
            (options.headers as any)['Authorization'] = `Bearer ${token}`;
        }

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    const parsed = data ? JSON.parse(data) : {};
                    resolve({ status: res.statusCode || 500, data: parsed });
                } catch (e) {
                    resolve({ status: res.statusCode || 500, data: { raw: data } });
                }
            });
        });

        req.on('error', reject);

        if (body) {
            req.write(JSON.stringify(body));
        }
        req.end();
    });
}

async function testProtectedFlow() {
    const testEmail = `user_${Date.now()}@example.com`;
    const testPass = "password123";

    console.log(`\n--- TEST START: Protected Flow ---`);

    // 1. REGISTER
    console.log(`1. Registering new user...`);
    await request('/auth/register', 'POST', {
        email: testEmail,
        password: testPass,
        retype_password: testPass
    });

    // 2. LOGIN (Get Token)
    console.log(`2. Logging in to get token...`);
    const loginRes = await request('/auth/login', 'POST', {
        email: testEmail,
        password: testPass
    });

    const token = loginRes.data.token;
    if (!token) {
        console.error('❌ Failed to get token');
        return;
    }
    console.log('   ✅ Valid Token Acquired');

    // 3. ACCESS PROTECTED ROUTE
    console.log(`\n3. Accessing /me with token...`);
    const protectedRes = await request('/me', 'GET', undefined, token); // Send Token!

    console.log('   Status:', protectedRes.status);
    console.log('   Response:', protectedRes.data);

    if (protectedRes.status === 200) {
        console.log('\n✅ SUCCESS: The server accepted our token and let us in!');
        console.log('   User data from token:', protectedRes.data.user);
    } else {
        console.log('\n❌ FAILED: Access denied.');
    }

    // 4. TEST INVALID TOKEN
    console.log(`\n4. Testing FAKE token...`);
    const fakeRes = await request('/me', 'GET', undefined, "fake.token.123");
    console.log('   Status:', fakeRes.status); // Should be 403
    if (fakeRes.status === 403) {
        console.log('   ✅ SUCCESS: Server correctly blocked the fake token.');
    }
}

testProtectedFlow().catch(console.error);
