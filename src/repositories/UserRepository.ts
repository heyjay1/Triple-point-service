import { EntityRepository, Repository } from 'typeorm';
import { User } from '../entities/User';

@EntityRepository()
export class UserRepository extends Repository<User> {

}
