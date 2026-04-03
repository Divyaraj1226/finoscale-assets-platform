import { Controller, Get, Patch, Body, HttpException, HttpStatus } from '@nestjs/common';
import { AssetsService } from './assets.service';
import { UpdateAssetDto } from './dto/update-asset.dto';

@Controller('assets')
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Get()
  getAssets() {
    try {
      return this.assetsService.getAll();
    } catch (err: any) {
      throw new HttpException(err.message || 'Failed to fetch assets', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch()
  updateAsset(@Body() payload: UpdateAssetDto) {
    try {
      return this.assetsService.update(payload);
    } catch (err: any) {
      throw new HttpException(err.message || 'Failed to update asset', HttpStatus.BAD_REQUEST);
    }
  }
}