import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { PageOptionsDto } from './page-options.dto';

interface IPageMetaDtoParameters {
  pageOptionsDto: PageOptionsDto;
  itemCount: number;
}

export class PageMetaDto {
  @ApiModelProperty()
  readonly page: number;

  @ApiModelProperty()
  readonly take: number;

  @ApiModelProperty()
  readonly itemCount: number;

  @ApiModelProperty()
  readonly pageCount: number;

  constructor({ pageOptionsDto, itemCount }: IPageMetaDtoParameters) {
    this.page = pageOptionsDto.page;
    this.take = pageOptionsDto.take;
    this.itemCount = itemCount;
    this.pageCount = Math.ceil(itemCount / this.take);
  }
}
