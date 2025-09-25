#!/usr/bin/env node

/**
 * Simple Webhook Test Script
 *
 * A quick script to test n8n webhook connectivity
 * Usage: node test-webhook-connectivity.js
 */

const https = require('https');
const http = require('http');

const WEBHOOK_URL = 'https://n8n.srv1024767.hstgr.cloud/webhook/fbdc5d15-3435-42f9-8047-891869aa9f7e';

// Parse URL
function parseUrl(url) {
    const urlObj = new URL(url);
    return {
        protocol: urlObj.protocol,
        hostname: urlObj.hostname,
        port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
        path: urlObj.pathname + urlObj.search
    };
}

// Make HTTP request
function makeRequest(url, payload) {
    return new Promise((resolve, reject) => {
        const parsedUrl = parseUrl(url);
        const isHttps = parsedUrl.protocol === 'https:';
        const httpModule = isHttps ? https : http;

        const postData = JSON.stringify(payload);
        const options = {
            hostname: parsedUrl.hostname,
            port: parsedUrl.port,
            path: parsedUrl.path,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData),
                'User-Agent': 'Webhook-Test-Script/1.0'
            },
            timeout: 15000
        };

        const req = httpModule.request(options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                resolve({
                    statusCode: res.statusCode,
                    headers: res.headers,
                    body: data
                });
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        req.on('timeout', () => {
            req.destroy();
            reject(new Error('Request timeout'));
        });

        req.write(postData);
        req.end();
    });
}

// Test payload
const testPayload = {
    type: 'test-connection',
    timestamp: new Date().toISOString(),
    source: 'simple-test-script',
    message: 'Simple connectivity test',
    testId: `test-${Date.now()}`
};

// Run test
async function runTest() {
    console.log('🔍 Testing webhook connectivity...');
    console.log('URL:', WEBHOOK_URL);
    console.log('Payload:', JSON.stringify(testPayload, null, 2));
    console.log('\n');

    try {
        console.log('📤 Sending request...');
        const startTime = Date.now();

        const response = await makeRequest(WEBHOOK_URL, testPayload);
        const responseTime = Date.now() - startTime;

        console.log('✅ Request completed!');
        console.log('Status Code:', response.statusCode);
        console.log('Response Time:', responseTime + 'ms');
        console.log('Response Headers:', JSON.stringify(response.headers, null, 2));
        console.log('Response Body:', response.body);

        if (response.statusCode >= 200 && response.statusCode < 300) {
            console.log('\n🎉 SUCCESS: Webhook is working correctly!');
        } else {
            console.log('\n⚠️  WARNING: Webhook responded with status code:', response.statusCode);
        }

    } catch (error) {
        console.error('\n❌ ERROR:', error.message);

        // Provide specific error analysis
        if (error.code === 'ECONNREFUSED') {
            console.log('\n📝 Analysis: Connection refused - n8n server may be down');
            console.log('💡 Solution: Check if n8n server is running');
        } else if (error.code === 'ENOTFOUND') {
            console.log('\n📝 Analysis: DNS resolution failed');
            console.log('💡 Solution: Check if the hostname is correct');
        } else if (error.code === 'ETIMEDOUT') {
            console.log('\n📝 Analysis: Request timeout');
            console.log('💡 Solution: Server is not responding or network issues');
        } else if (error.message === 'Request timeout') {
            console.log('\n📝 Analysis: Request timeout');
            console.log('💡 Solution: Increase timeout or check server performance');
        }
    }
}

// Execute test
runTest().catch(console.error);