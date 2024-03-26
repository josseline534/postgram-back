import { Sort, SortDirection } from 'mongodb'

export interface IOptionsFind {
  sortBy: Sort
  pageSize: number
  pageNumber: number
}

export enum SortOrderEnum {
  ASC = 'asc',
  DESC = 'desc'
}

export const SORT_ORDER_VALUES = {
  [SortOrderEnum.ASC]: 1,
  [SortOrderEnum.DESC]: -1
}

export interface IQueryParams extends Omit<IOptionsFind, 'sortBy'> {
  sortOrder: SortDirection
}
