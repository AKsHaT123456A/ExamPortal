const http = require('http');
const httpProxy = require('http-proxy');

function createLoadBalancerServer(app) {
    const proxy = httpProxy.createProxyServer({});

    const backendServers = [
        { target: 'http://localhost:3000' },
        { target: 'http://localhost:3001' }
    ];

    const loadBalancerServer = http.createServer((req, res) => {
        const backendServer = backendServers.shift();
        backendServers.push(backendServer);

        console.log(`Load Balancer: Request received. Forwarding to backend server: ${backendServer.target}`);

        proxy.web(req, res, backendServer, (error) => {
            console.error('Load Balancer Error:', error);
            res.statusCode = 500;
            res.end('Load Balancer Error');
        });
    });

    return loadBalancerServer;
}

module.exports = {
    createLoadBalancerServer
};
