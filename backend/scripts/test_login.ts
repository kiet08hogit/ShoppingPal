import http from 'http';

const BASE_URL = 'http://localhost:3000';

function request(path: string, method: string, body?: any): Promise<{ status: number, data: any }> {
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

async function testLoginFlow() {
    const testEmail = `user_${Date.now()}@example.com`;
    const testPass = "password123";

    console.log(`\n--- TEST START: Login Flow ---`);
    console.log(`Target: ${BASE_URL}\n`);

    // 1. REGISTER
    console.log(`1. Registering: ${testEmail}`);
    const regRes = await request('/auth/register', 'POST', {
        email: testEmail,
        password: testPass,
        retype_password: testPass
    });
    console.log('   Status:', regRes.status);
    console.log('   Response:', regRes.data);

    if (regRes.status !== 201) {
        console.error('❌ Registration failed, stopping.');
        return;
    }

    // 2. LOGIN
    console.log(`\n2. Logging in...`);
    const loginRes = await request('/auth/login', 'POST', {
        email: testEmail,
        password: testPass
    });
    console.log('   Status:', loginRes.status);
    console.log('   Response:', loginRes.data);

    if (loginRes.status === 200 && loginRes.data.token) {
        console.log('\n✅ SUCCESSS: Token received!');
        console.log('Token:', loginRes.data.token.substring(0, 30) + '...');
    } else {
        console.log('\n❌ FAILED: Did not receive token.');
    }
}

testLoginFlow().catch(console.error);
