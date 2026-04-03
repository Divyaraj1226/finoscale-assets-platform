import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as financials from '../data/financials.json';
import { normalizeFinancials } from './utils/normalizer';

interface UpdateAssetDto {
  year: string;
  key: string;
  value: number;
}

@Injectable()
export class AssetsService {
  private rawData: any[] = (financials as any).default || financials;

  getAll() {
    return normalizeFinancials(this.rawData);
  }

  update(updateDto: UpdateAssetDto) {
    try {
      const { year, key, value } = updateDto;

      const record = this.rawData.find(d => d.year === year);
      if (!record) {
        throw new Error('Year not found');
      }

      if (!(key in record.bs.assets)) {
        throw new Error('Invalid field');
      }

      // Update value
      record.bs.assets[key] = value;

      // recalc total equity
      record.bs.subTotals.total_equity = Object.values(record.bs.assets).reduce(
        (sum:any, val) => sum + (val ?? 0),
        0,
      );

      // Return normalized data
      return normalizeFinancials(this.rawData);
    } catch (err: any) {
      // Structured exception for frontend
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }
}