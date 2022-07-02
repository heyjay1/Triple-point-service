//index.js
// const express = require("express");
// const app = express();

let add = require("./actionAdd");
let mod = require("./actionMod");

// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));

/*
  @path {GET} http://localhost:5000/
  @description 요청 데이터 값이 없고 반환 값이 있는 GET Method
*/
app.get("/", (req, res, next) => {
    res.send("hellow world");
});

/*
  @path {POST} http://localhost:5000/events
  @description POST Method
  type에 맞춰서 쿼리를 날려 값을 입력, 수정, 삭제한다.
*/
app.post("/events", (req, res, next) => {
    let action = req.body.action;    

    console.log(action);

    if (action === '"ADD"') {
        add.actionAdd(req.body);
    } else if (action === '"MOD"') {
        mod.modBoard(req.body);
    }

    res.send("post");
});

app.listen(5000, () => console.log("start the server"));



//ActionADD
const mysql = require('mysql');
const config = require('./db_config.json');
const pool = mysql.createPool(config);

//query 실행 함수
function doQurey(sql, bShowResult) {
    console.log(sql);

    pool.getConnection((err, connection) => {
        if(err) {
            console.log(err.code);
        }
        else {
            connection.query(sql, (err, rows) => {
                if (bShowResult)
                    console.log(rows);                
            });
        }
        connection.release();
    });
}

//로그남기기
function addHistory(req) {
    let {reviewId, userId, action} = req;

    let sql = "Insert into reviewdb.history values(NULL, ";
    sql += reviewId + ", ";
    sql += userId + ", ";
    sql += action + ", ";
    sql += "now());";

    doQurey(sql, false);
}

//user 테이블에 point추가
function addUser(req) {
    let {reviewId, content, userId} = req;

    let sql = "Insert into reviewdb.board Values(";
    sql += reviewId + ", ";
    sql += content + ", ";
    sql += userId + ");";

    // doQurey(sql, false);
}

//board, file, place 테이블에 추가
//user에게 부여될 포인트 계산
function addBoard (req) {
    let {reviewId, content, userId, attachedPhotoIds} = req;

    let sql = "Insert into reviewdb.board Values(";
    sql += reviewId + ", ";
    sql += content + ", ";
    sql += userId + ");";

    doQurey(sql, false);

    sql = "";
    photoIds = attachedPhotoIds.split(',');
    photoIds.forEach(id => {
        sql = "Insert into reviewdb.file values(NULL, ";
        sql += reviewId + ", ";
        sql += id + ");";

        doQurey(sql, false);
    });
}

function addPlace(req) {
    let {reviewId, placeId} = req;

    let sql = "Insert into reviewdb.place Values(";
    sql += placeId + ", ";
    sql += reviewId + ");";

    doQurey(sql, false);
}

function calcPoint(req, point) {
    let {content, attachedPhotoIds, placeId} = req;

    if (content != '') 
        point++;
    if (attachedPhotoIds != '')
        point++;
    
    let sql = "select count(*) as count from reviewdb.place where placeId = ";
    sql += placeId + ";";

    // doQurey(sql, true);
    pool.getConnection((err, connection) => {
        if(err) {
            console.log(err.code);
        }
        else {
            connection.query(sql, (err, rows) => {
                if (bShowResult)
                    console.log(rows);
                    
                
            });
        }
        connection.release();
    });

    return point;
}

exports.actionAdd = function (req) {
    let point = 0;
    calcPoint(req, point);
    addBoard(req);
    addPlace(req);
    addHistory(req);
    // addUser(req);
}



//actionMOD
const mysql = require('mysql');
const config = require('./db_config.json');
const pool = mysql.createPool(config);

exports.modBoard = function (req) {
    console.log('actionMod');
    let {reviewId, content, userId} = req;

    let sql = "Update reviewdb.board Set content = ";
    sql += content;
    sql += " Where reviewId = ";
    sql += reviewId + ";";

    console.log(sql);

    pool.getConnection((err, connection) => {
        if(err) {
            console.log(err.code);
        }
        else {
            connection.query(sql, (err, rows) => {
                console.log(rows);                
            });
        }
        connection.release();
    });
};

exports.b = function () {
    console.log("b");
}

// module.exports = actionMOD;