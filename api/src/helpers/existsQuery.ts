import { SelectQueryBuilder } from "typeorm";

export const existsQuery = <T>(builder: SelectQueryBuilder<T>) => `EXISTS (${builder.getQuery()})`;