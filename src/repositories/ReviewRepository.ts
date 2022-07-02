import { EntityRepository, Repository } from 'typeorm';
import { Review } from '../entities/Review';

@EntityRepository()
export class ReviewRepository extends Repository<Review> {

}
