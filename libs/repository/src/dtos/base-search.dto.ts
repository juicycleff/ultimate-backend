import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
// import { Transform } from 'class-transformer';
// import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export abstract class BaseSearchDto {
  @ApiModelProperty()
  // @IsString()
  // @IsNotEmpty()
  q: string;

  @ApiModelProperty()
  // @IsNumber()
  // @IsNotEmpty()
  // @Transform(Number)
  page: number;

  get skip() {
    return (this.page - 1) * this.take;
  }

  get take() {
    return 10;
  }
}
