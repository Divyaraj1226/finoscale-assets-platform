import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class UpdateAssetDto {
  @IsString()
  @IsNotEmpty()
  year!: string;

  @IsString()
  @IsNotEmpty()
  key!: string;

  @IsNumber()
  value!: number;
}