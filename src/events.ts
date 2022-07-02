import express from "express";
import {Review} from "./entities/Review";
import {Place} from "./entities/Place";
import repositories from "./repositories/repositories";
import {History} from "./entities/history";
import {User} from "./entities/User";
import { Files } from "./entities/Files";
import { getPositionOfLineAndCharacter } from "typescript";


const router = express.Router();

type Api = {
    type: "REVIEW",
    action: "ADD" | "MOD" | "DELETE",
    reviewId?: string,
    content: string,
    attachedPhotoIds: string[],
    userId: string,
    placeId: string
}

router.get("/", (req, res) => {
    res.send("/events page!");
})

router.post("/", async (req, res) => {
    const request: Api = req.body;

    switch (request.action) {
        case "ADD": {
            // 리뷰 작성
            const reviewId = await createReview(request.userId, request.content);
            // 파일 업로드
            addFile(request.attachedPhotoIds, reviewId);
            // 히스토리 작성
            createHistory(request.userId, reviewId, request.action);
            // 장소에 리뷰 추가
            createPlaceReview(request.placeId, reviewId);
            // 계산
            const point = await calculateReward(request.placeId, request.content, request.attachedPhotoIds);
            // 유저 테이블에 포인트 추가
            createUser(request.userId, point);
            break;
        }
        case "DELETE": {
            if (!request.reviewId) {
                res.send("해당 리뷰를 찾을 수 없습니다.");
                return;
            }
            // 파일 삭제
            removeFile(request.reviewId);
            // 리뷰 삭제
            removeReview(request.reviewId);
            // 히스토리 작성
            createHistory(request.userId, request.reviewId, request.action);
            // 장소 리뷰 삭제
            removePlaceReview(request.reviewId);
            // 계산
            // 유저 테이블의 포인트 삭제
            break;
        }
        case "MOD":
            // 파일 변경
            // 리뷰 변경
            // 히스토리 작성
            // 장소 리뷰 변경
            // 계산
            // 유저 테이블의 포인트 변경
            break;
    }

    res.send("/events page");
});

async function createReview(userId: string, content: string) {
    const review = new Review();
    review.userId = userId;
    review.content = content;

    const reviewRepository = (await repositories).reviewRepository;

    await reviewRepository.save(review);

    return review.id;
}

async function removeReview(reviewId: string) {
    const reviewRepository = (await repositories).reviewRepository;
    const review = await reviewRepository.findOneBy({id: reviewId});

    if (review === null) return;

    review.remove();
}

async function addFile(attachedPhotoIds: string[], reviewId: string) {
    const file = new Files();
    const filesRepository = (await repositories).filesRepository;

    for (let i = 0; i < attachedPhotoIds.length; i++) {
        file.reviewId = reviewId;
        file.photoId = attachedPhotoIds[i];

        filesRepository.save(file);
    }
}

async function removeFile(reviewId: string) {
    const reviewRepository = (await repositories).reviewRepository;
    const review = await reviewRepository.findOneBy({id: reviewId});

    if (review === null) return;

    for (const file of review.files) {
        file.remove();
    }
}

async function createHistory(userId: string, reviewId: string, action: string) {
    const history = new History();
    const now = new Date();
    history.reviewId = reviewId;
    history.userId = userId;
    history.action = action;
    history.time = now;

    const historyRepository = (await repositories).historyRepository;

    historyRepository.save(history);
}

async function createPlaceReview(placeId: string, reviewId : string) {
    const place = new Place();
    place.id = placeId;
    place.reviewId = reviewId;

    const PlaceRepository = (await repositories).placeRepository;

    PlaceRepository.save(place);
}

async function removePlaceReview(reviewId: string) {
    const placeRepository = (await repositories).placeRepository;
    const place = await placeRepository.findOneBy({reviewId: reviewId});

    place?.remove();
}


async function calculateReward(
  placeId: string,
  content: string,
  attachedPhotoIds: string[]
) {
    const placeRepository = (await repositories).placeRepository;

    const place = await placeRepository.findOneBy({id: placeId});

    if (place === null) {
        return 0;
    }

    let point = 0;

    if (content !== "") point++;
    if (attachedPhotoIds.length > 0) point++;

    if (place.reviews.length === 0) point++;

    return point;
}

async function createUser(userId: string, point: number) {
    const userRepository = (await repositories).userRepository;

    const user = await userRepository.findOneById(userId);

    if (user) {
        user.point = user.point + point;
    } else {
        const newUser = new User();
        newUser.id = userId;
        newUser.point = point;
        userRepository.save(newUser);
    }
}

export default router;
