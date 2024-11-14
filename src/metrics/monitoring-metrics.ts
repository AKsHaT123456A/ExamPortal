import client from 'prom-client';
import  { Request, Response } from 'express';
import basicAuth from 'basic-auth';
import constants from "../config/constants";
import { log } from 'console';

export const monitoring = async (req: Request, res: Response) => { 
    const user = basicAuth(req);
    log(constants.PROMETHEUSER);
      if (!user || user.name !== constants.PROMETHEUSER || user.pass !== constants.PROMETHEPASS) {
        res.statusCode = 401;
        res.setHeader('WWW-Authenticate', 'Basic realm="Metrics"');
        return res.end('Access denied');
      }  
       
    res.set('Content-Type', client.register.contentType);
    res.end(await client.register.metrics());
};

