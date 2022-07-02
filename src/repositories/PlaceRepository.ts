import { EntityRepository, Repository } from 'typeorm';
import { Place } from '../entities/Place';

@EntityRepository()
export class PlaceRepository extends Repository<Place> {

}
