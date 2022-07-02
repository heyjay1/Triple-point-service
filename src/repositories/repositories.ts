import { PlaceRepository } from "./PlaceRepository"
import { createConnection } from "typeorm";
import { Place } from "../entities/Place";
import { Review } from "../entities/Review";
import { User } from "../entities/User";
import { History } from "../entities/history";
import { Files } from "../entities/Files";

const connection = createConnection({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "1234",
    database: "reviewdb",
    entities: [
      // __dirname + "../entities/**/*.ts"
      Place, Review, User, History, Files
    ]
});

async function getRepositories() {
    const placeRepository = (await connection).getRepository(Place);
    const reviewRepository = (await connection).getRepository(Review);
    const userRepository = (await connection).getRepository(User);
    const historyRepository = (await connection).getRepository(History);
    const filesRepository = (await connection).getRepository(Files);
    
    return {
      placeRepository,
      reviewRepository,
      userRepository,
      historyRepository,
      filesRepository
    };
}

export default getRepositories();
