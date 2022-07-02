use reviewdb;

 
-- 테이블 순서는 관계를 고려하여 한 번에 실행해도 에러가 발생하지 않게 정렬되었습니다.

-- user Table Create SQL
CREATE TABLE user
(
    `userID`  VARCHAR(36)    NOT NULL    COMMENT '사용자ID', 
    `point`   INT            NULL        COMMENT '적립된 포인트', 
     PRIMARY KEY (userID)
);

ALTER TABLE user COMMENT '사용자 정보';


use reviewdb;
-- board Table Create SQL
CREATE TABLE review
(
    `reviewID`  VARCHAR(36)    NOT NULL    COMMENT '리뷰ID', 
    `content`   VARCHAR(45)    NULL        COMMENT '내용', 
    `userID`    VARCHAR(36)    NOT NULL    COMMENT '작성자', 
     PRIMARY KEY (reviewID)
);

ALTER TABLE board COMMENT '작성한 리뷰';

ALTER TABLE board
    ADD CONSTRAINT FK_board_userID_user_userID FOREIGN KEY (userID)
        REFERENCES user (userID) ON DELETE RESTRICT ON UPDATE RESTRICT;


-- history Table Create SQL
CREATE TABLE history
(
    `historyIndex`  INT            NOT NULL    AUTO_INCREMENT COMMENT '히스토리Index', 
    `reviewID`      VARCHAR(36)    NOT NULL    COMMENT '리뷰ID', 
    `userID`        VARCHAR(36)    NOT NULL    COMMENT '사용자ID', 
    `action`        VARCHAR(3)     NULL        COMMENT '내역(add, mod..)', 
    `time`          DATETIME       NULL        COMMENT '시간', 
     PRIMARY KEY (historyIndex)
);

ALTER TABLE history COMMENT '포인트부여 히스토리';

ALTER TABLE history
    ADD CONSTRAINT FK_history_reviewID_board_reviewID FOREIGN KEY (reviewID)
        REFERENCES board (reviewID) ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE history
    ADD CONSTRAINT FK_history_userID_user_userID FOREIGN KEY (userID)
        REFERENCES user (userID) ON DELETE RESTRICT ON UPDATE RESTRICT;


-- Place Table Create SQL
CREATE TABLE Place
(
    `placeID`   VARCHAR(36)    NOT NULL    COMMENT '장소ID', 
    `reviewID`  VARCHAR(36)    NOT NULL    COMMENT '리뷰ID', 
     PRIMARY KEY (placeID)
);

ALTER TABLE Place COMMENT '리뷰 이벤트중인 특정 장소';

ALTER TABLE Place
    ADD CONSTRAINT FK_Place_reviewID_board_reviewID FOREIGN KEY (reviewID)
        REFERENCES board (reviewID) ON DELETE RESTRICT ON UPDATE RESTRICT;


-- file Table Create SQL
CREATE TABLE file
(
    `fileListID`  INT            NOT NULL    AUTO_INCREMENT COMMENT '파일리스트ID', 
    `reviewID`    VARCHAR(36)    NOT NULL    COMMENT '리뷰ID', 
    `photoID`     VARCHAR(36)    NULL        COMMENT '파일ID', 
     PRIMARY KEY (fileListID)
);

ALTER TABLE file COMMENT '작성한 리뷰에 첨부되는 이미지 파일';

ALTER TABLE file
    ADD CONSTRAINT FK_file_reviewID_board_reviewID FOREIGN KEY (reviewID)
        REFERENCES board (reviewID) ON DELETE RESTRICT ON UPDATE RESTRICT;
