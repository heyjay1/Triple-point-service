import express from "express";
import {Review} from "./entities/Review";
import {Place} from "./entities/Place";
import repositories from "./repositories/repositories";
import {History} from "./entities/history";
import {User} from "./entities/User";
import { Files } from "./entities/Files";

const router = express.Router();

router.get("/:userId", async (req, res) => {
    const userRepository = (await repositories).userRepository;

    const user = await userRepository.findOneById(req.params.userId);

    if (!user) {
        res.json({
            result: "Failed",
            message: "해당 사용자는 존재하지 않습니다."
        });
        return;
    }

    res.json({
        result: "Succeed",
        point: user.point
    });
})

export default router;