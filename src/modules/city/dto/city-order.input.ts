import { InputType, registerEnumType } from '@nestjs/graphql';
import { Order } from '../../common/order/order';

export enum CityOrderField {
  name = 'name',
  population = 'population',
}

registerEnumType(CityOrderField, {
  name: 'CityOrderField',
  description: 'Properties by which city connections can be ordered.',
});

@InputType()
export class CityOrder extends Order {
  field: CityOrderField;
}
