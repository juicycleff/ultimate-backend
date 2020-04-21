import { ApiModelPropertyOptional } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
// import { Type } from 'class-transformer';
// import { IsEnum, IsInt, Min, IsOptional, Max, IsString, IsNotEmpty } from 'class-validator';

import { Order } from '../enums';

export class PageOptionsDto {
  @ApiModelPropertyOptional({
    enum: Object.values(Order),
    default: Order.ASC,
  })
  // @IsEnum(Order)
  // @IsOptional()
  readonly order: Order = Order.ASC;

  @ApiModelPropertyOptional({
    minimum: 1,
    default: 1,
  })
  // @Type(() => Number)
  // @IsInt()
  // @Min(1)
  // @IsOptional()
  readonly page: number = 1;

  @ApiModelPropertyOptional({
    minimum: 1,
    maximum: 50,
    default: 10,
  })
  // @Type(() => Number)
  // @IsInt()
  // @Min(10)
  // @Max(50)
  // @IsOptional()
  readonly take: number = 10;

  get skip(): number {
    return (this.page - 1) * this.take;
  }

  @ApiModelPropertyOptional()
  // @IsString()
  // @IsNotEmpty()
  // @IsOptional()
  readonly q?: string;
}
