import { EntityRepository, Repository } from 'typeorm';
import { Files } from '../entities/Files';

@EntityRepository()
export class FilesRepository extends Repository<Files> {

}
