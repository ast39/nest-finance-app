import { MetaInterface } from './meta.interface';

export interface PaginationInterface<T> {
  data: T[];
  meta: MetaInterface;
}
