import { EntityRepository, Repository } from 'typeorm';
import { History } from '../entities/history';

@EntityRepository()
export class HistoryRepository extends Repository<History> {

}
