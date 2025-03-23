export class PageOptionsDto {
  readonly page: number = 1;

  readonly take?: number = 10;

  constructor(query: any) {
    this.page = parseInt(query.page) || 1;
    this.take = parseInt(query.take) || 10;
  }

  get skip(): number {
    return (this.page - 1) * (this.take ?? 10);
  }
}
