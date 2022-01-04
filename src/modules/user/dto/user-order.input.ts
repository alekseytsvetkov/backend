import { InputType, registerEnumType } from '@nestjs/graphql';
import { Order } from '../../common/order/order';

export enum UserOrderField {
  username = 'username',
}

registerEnumType(UserOrderField, {
  name: 'UserOrderField',
  description: 'Properties by which user connections can be ordered.',
});

@InputType()
export class UserOrder extends Order {
  field: UserOrderField;
}
