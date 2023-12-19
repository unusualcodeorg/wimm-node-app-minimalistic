import { Request } from 'express';
import moment from 'moment';
import Logger from '../core/Logger';

export function findReqProtocol(req: Request) {
  // @ts-ignore
  let proto = req?.socket?.encrypted ? 'https' : 'http';
  // only do this if you trust the proxy
  proto = req.headers['x-forwarded-proto']?.toString() || proto;
  return proto.split(/\s*,\s*/)[0];
}

export function getBaseUrl(req: Request) {
  return `${findReqProtocol(req)}://${req.get('host')}`;
}

export function findIpAddress(req: Request) {
  try {
    if (req.headers['x-forwarded-for']) {
      return req.headers['x-forwarded-for'].toString().split(',')[0];
    } else if (req.connection && req.connection.remoteAddress) {
      return req.connection.remoteAddress;
    }
    return req.ip;
  } catch (e) {
    Logger.error(e);
    return undefined;
  }
}

export function addMillisToCurrentDate(millis: number) {
  return moment().add(millis, 'ms').toDate();
}

export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}