import { Injectable, Logger } from '@nestjs/common';
import { Request } from 'express';
import axios from 'axios';
import * as parser from 'ua-parser-js';

import requestIp = require('request-ip');

@Injectable()
export class DeviceService {
  private readonly logger = new Logger(DeviceService.name);

  private async getIPLocation(ipAddr: string): Promise<string> {
    try {
      const { city, country } = await this.getCityAndCountryFromIPAddr(ipAddr);
      if (!city && !country) {
        return 'Unknown Location';
      } else if (!city && country) {
        return country;
      }
      return `${city}, ${country}`;
    } catch (err) {
      this.logger.error(err);
      return 'Unknown Location';
    }
  }

  getDeviceIPAddr(req: Request) {
    return requestIp.getClientIp(req);
  }

  async getCityAndCountryFromIPAddr(
    ipAddr: string,
  ): Promise<{ city: string; country: string }> {
    const geoLocationApiUrl = `https://get.geojs.io/v1/ip/geo/${ipAddr}.json`;
    const response = await axios.get(geoLocationApiUrl);
    const { city, country } = response.data;
    return { city, country };
  }

  private getDeviceDetails(userAgent: string) {
    const client = parser(userAgent);
    const { browser, os, device } = client;
    const isBrowser = browser.name && browser.version;
    if (isBrowser) {
      return `${browser.name} ${browser.version} on ${os.name}`;
    }
    const isMobile =
      device.type === 'mobile' || (device.vendor && device.model);
    if (isMobile) {
      const [appInfo, _] = client.ua.split(' ');
      return `${appInfo.split('/').join(' ')} on ${os.name}`;
    }
    return 'Unknown Device';
  }

  async getLoginDeviceInfo(req: Request) {
    const ipAddr = this.getDeviceIPAddr(req);
    const location = await this.getIPLocation(ipAddr);
    return { ipAddr, deviceDetails: req.headers['user-agent'], location };
  }
}
