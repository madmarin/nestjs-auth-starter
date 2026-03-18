import { UserCreateService } from './user-create.service';
import { UserFindOneService } from './user-find-one.service';

export { UserCreateService, UserFindOneService };

export const USER_CORE_SERVICES = [UserCreateService, UserFindOneService];
