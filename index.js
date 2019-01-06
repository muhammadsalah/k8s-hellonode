'use strict';
/*HTTP NodeJS builtin package*/
const HTTP = require('http');
/*Chained Service URL*/
const CHAIN_URL = process.env.CHAIN_URL;
/*Server handler function*/
const handler = (req, res) => {
    try {
        /*Log the request*/
        console.log('[INFO] Incomming request: URL [', req.url, '] METHOD: [', req.method, ']');
        /*Dispatch the request*/
        switch (req.url) {
            case '/':
                index(req, res);
                break;
            case '/health':
                health(req,res);
                break;
            default:
                console.log('[INFO] Route is not served');
                res.writeHead(404, {'Content-Type': 'text/plain; charset=utf-8', 'X-Content-Type-Options': 'nosniff'});
                res.end('Content not found');
        }
    } catch (err) {
        console.log(err);
    }
};
/*Index handler function*/
const index = (req,res) => {
    if (req.method !== 'GET') {
        res.writeHead(500, {'Content-Type': 'text/plain; charset=utf-8', 'X-Content-Type-Options': 'nosniff'});
        res.end('Only GET method is allowed');
        Console.log('[INFO] Request rejected for not using GET method');
    }
    let data;
    HTTP.get(CHAIN_URL, (svcRes) => {
        svcRes.on('data', (chunk) => {
           data += chunk;
        });
        svcRes.on('end', () => {
           console.log('[INFO] Recieved the following data from the chaned service: ', data.toString());
           data = 'Chained service response: ' + data.toString();
           res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8', 'X-Content-Type-Options': 'nosniff'});
           res.end('Hello, Node! ' + data);
        });
    }).on('error', (err) => {
        console.log('[INFO] Could not reach the chained service');
        data = 'No chained service response';
        res.writeHead(500, {'Content-Type': 'text/plain; charset=utf-8', 'X-Content-Type-Options': 'nosniff'});
        res.end('Hello, Node! ' + data);
    });
};

/*Health check handler function*/
const health = (req, res) => {
  if (req.method !== 'GET') {
      res.writeHead(500, {'Content-Type': 'text/plain; charset=utf-8', 'X-Content-Type-Options': 'nosniff'});
      res.end('Only GET method is allowed');
      console.log('[INFO] Request rejected for not using GET method');
  }
  res.writeHead(204, {'Content-Type': 'text/plain; charset=utf-8', 'X-Content-Type-Options': 'nosniff'});
  res.end();
};

/*Create the server, and listen to port 8000*/
HTTP.createServer(handler).listen(8000);