import { request as httpRequest } from 'http';
import { request as httpsRequest } from 'https';
import { parse as parsUrl } from 'url';
import * as querystring from 'querystring';

const requestTypes = {
  'https:': httpsRequest,
  'http:': httpRequest,
}

const request = (url: string, requestOptions: any, body?: any) => {
    const urlParts = parsUrl(url, true, true) as { protocol: string };
    let request = (requestTypes as any)[urlParts.protocol];
    if (!request) {
      throw `Protocol ${urlParts.protocol} not supported`;
    }

    return new Promise((resolve, reject) => {
        console.info('HTTP REQUEST BEFORE TRANSFORM: ', url, { ...urlParts, ...requestOptions, ...{ body } });
        let req = request(
            { ...urlParts, ...requestOptions},
            stringResponseParser((resp: any, err: any) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(resp);
                }
            })
        );

        req.on('abort', (error: any) => {
            console.error('REQUEST ABORT ERROR', error);
            reject(error);
        });

        req.on('error', (error: any) => {
            console.error('REQUEST ABORT ERROR', error);
            reject(error);
        })

        switch (requestOptions.method) {
            case 'POST':
            case 'PUT': {
                const strBody = typeof body === 'object' ? JSON.stringify(body) : body;
                req.write(strBody);
                break;
            }
        }

        req.end();
    });
}

const stringResponseParser = (callback: any) => {
    return (response: any, h: any) => {
        let resp = '';
        let err = '';
        response.on('data', (chunk: any) => {
            resp += chunk;
        });

        response.on('error', (error: any) => {
            err += error;
        });

        response.on('end', () => {
            const isSuccessOrRedirect = response.statusCode >= 200 || response.statusCode < 399;
            if (!err && isSuccessOrRedirect) {
              console.info(`HTTP RESPONSE [${response.statusCode}]`, );
              callback({ data: resp, headers: response.headers, statusCode: response.statusCode }, err);
            } else {
              console.error(`HTTP RESPONSE ERROR [${response.statusCode}]`, err);
              callback(undefined, { statusCode: response.statusCode, response: resp });
            }
        });
    }
}

export class HttpClient {

    constructor(private defaultHttpClientOptions = {}) { }

    get<T>(url: string, options = {}) {
        return request(url, Object.assign({}, this.defaultHttpClientOptions, options, { method: 'GET' })) as Promise<T>;
    }

    getBinary<T>(url: string) {
      const urlParts = parsUrl(url, true, true) as { protocol: string };
      let request = (requestTypes as any)[urlParts.protocol];
      if (!request) {
        throw `Protocol ${urlParts.protocol} not supported`;
      }

      return new Promise((resolve, reject) => {
        console.info('HTTP REQUEST BEFORE TRANSFORM: ', url, { ...urlParts });
        let req = request(
            { ...urlParts },
            (response: any, error: any) => {
              response.setEncoding('binary');
              let resp: any[] = [];
              let err = '';
              response.on('data', (chunk: any) => {
                  resp.push(Buffer.from(chunk, 'binary'));
              });
      
              response.on('error', (error: any) => {
                  err += error;
              });
      
              response.on('end', () => {
                  // var buffer = Buffer.concat(resp);
                  const isSuccessOrRedirect = response.statusCode >= 200 || response.statusCode < 399;
                  if (!err && isSuccessOrRedirect) {
                    console.info(`HTTP RESPONSE [${response.statusCode}]`, );

                    resolve({ data: Buffer.concat(resp), headers: response.headers, statusCode: response.statusCode });
                  } else {
                    console.error(`HTTP RESPONSE ERROR [${response.statusCode}]`, err);
                    reject({ statusCode: response.statusCode, response: resp });
                  }
              });
            }
        );

        req.on('abort', (error: any) => {
            console.error('REQUEST ABORT ERROR', error);
            reject(error);
        });

        req.on('error', (error: any) => {
            console.error('REQUEST ABORT ERROR', error);
            reject(error);
        });

        req.end();
      });

      // return request(url, {
      //   parser: (resolve: any, reject: any) => {
      //     return (response: any, h: any) => {
            
      //     }
      //   }
      // })
    }

    post(url: string, body: any, options = {}) {
        return request(url, Object.assign({}, this.defaultHttpClientOptions, options, { method: 'POST' }), body);
    }

    put(url: string, body: any, options = {}) {
        return request(url, Object.assign({}, this.defaultHttpClientOptions, options, { method: 'PUT' }), body);
    }

    request(method: string, url: string, options = {}, body = '') {
        return request(
            url,
            Object.assign({}, this.defaultHttpClientOptions, options, { method: method.toUpperCase() }),
            body
        )
    }

    stringifyQuery(query: any) {
        if (!Object.keys(query || {}).length) {
            return '';
        } else {
            return `?${querystring.stringify(query)}`;
        }
    }

}