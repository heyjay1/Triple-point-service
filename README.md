# Triple-point-service# 클럽 마일리지 서비스

# 목차
- [1. 프로젝트 소개](#1.-프로젝트-소개)
- [2. 프로젝트 환경](#2.-프로젝트-환경)
- [3. 기능정의](#3.-기능정의)
- [4. 데이터베이스 설계](#4.-데이터베이스-설계)
- [5. API 정보](#5.-api-정보)

# 1. 프로젝트 소개
## SPECIFICATIONS
리뷰 작성이 이뤄질 때마다 리뷰 작성 이벤트가 발생하고, 아래 API로 이벤트를 전달합니다.
```json
    POST /events
    { 
    	"type": "REVIEW", "action": "ADD", /* "MOD", "DELETE" */ 
    	"reviewId": "240a0658-dc5f-4878-9381-ebb7b2667772", 
    	"content": "좋아요!", 
    	"attachedPhotoIds": ["e4d1a64e-a531-46de-88d0-ff0ed70c0bb8", "afb0cef2-851d-4a50-bb07-9cc15cbdc332"], 
    	"userId": "3ede0ef2-92b7-4817-a5f3-0c575361f745", 
    	"placeId": "2e4baf1c-5acb-4efb-a1af-eddada31b00f"
    }
```
한 사용자는 장소마다 리뷰를 1개만 작성할 수 있고, 리뷰는 수정 또는 삭제할 수 있습니다. 리뷰 작성 보상 점수는 아래와 같습니다.

- 내용 점수
    - 1자 이상 텍스트 작성: 1점
    - 1장 이상 사진 첨부: 1점
- 보너스 점수
    - 특정 장소에 첫 리뷰 작성: 1점

## REQUIREMENTS
- 이 서비스를 위한 SQL(MySQL 5.7) 스키마를 설계해 주세요. 테이블과 인덱스에 대한 DDL이 필요합니다.
- 아래에 대한 pseudo code를 작성해 주세요.
    - 포인트 적립 API
    - 포인트 조회 API

## 비고
- 포인트 증감이 있을 때마다 이력이 남아야 합니다.
- 포인트 부여 API 구현에 필요한 SQL 수행 시, 전체 테이블 스캔이 일어나지 않는 인덱스가 필요합니다.
- 사용자마다 현재 시점의 포인트 총점을 조회하거나 계산할 수 있어야 합니다.
- 리뷰를 작성했다가 삭제하면 해당 리뷰로 부여한 내용 점수와 보너스 점수는 회수합니다.
- 리뷰를 수정하면 수정한 내용에 맞는 내용 점수를 계산하여 점수를 부여하거나 회수합니다.
    - 글만 작성한 리뷰에 사진을 추가하면 1점을 부여합니다.
    - 글과 사진이 있는 리뷰에서 사진을 모두 삭제하면 1점을 회수합니다.
- 사용자 입장에서 본 '첫 리뷰'일 때 보너스 점수를 부여합니다.
    - 어떤 장소에 사용자 A가 리뷰를 남겼다가 삭제하고, 삭제 된 이후 사용자 B가 리뷰를 남기면 사용자 B에게 보너스 점수를 부여합니다.
    - 어떤 장소에 사용자 A가 리뷰를 남겼다가 삭제하는데, 삭제 되기 이전 사용자 B가 리뷰를 남기면 사용자 B에게 보너스 점수를 부여하지 않습니다.

# 2. 프로젝트 환경
- 백엔드
  - TypeScript
  - Mysql 8.0.29(Database)

# 3. 기능정의
## 기능 구현
- [x] 사용자가 리뷰를 작성하면 포인트를 계산하여 저장한다.
  - 내용점수
    - [X] 1자 이상 텍스트 작성 : `+1`
    - [x] 1장 이상 사진 첨부 : `+1`
  - 보너스 점수
    - [x] 특정 장소에 첫 리뷰 작성 시 : `+1`
- [x] 사용자가 리뷰를 삭제, 수정시 포인트를 다시 계산하여 저장한다.
  - 리뷰 수정
    - [x] 사진 추가 : `+1`
    - [x] 사진 삭제 : `-1`
  - 리뷰 삭제
    - [x] 리뷰 삭제 : `-1`
    - [x] 사진 삭제 : `-1`
    - [x] 첫 리뷰 : `-1`

# 4. 데이터베이스 설계
## 테이블 설계
- [Table DDL](/ddl.sql)
- `place` : 리뷰 이벤트 중인 특정 장소의 id와 장소에 달린 review id 저장한 테이블
- `review` : 리뷰id를 키로 갖고, 내용과 작성자를 저장한 테이블
- `file` : `review`의 리뷰id를 참조하여 각 리뷰에 대한 이미지 파일 아이디를 저장한 테이블
- `user` : 사용자id와 포인트 현황을 저장한 테이블
- `history` : 사용자의 리뷰 적립/삭제 내역을 저장한 테이블

![ERD](https://user-images.githubusercontent.com/22417025/176988628-0aa224fd-efca-428c-98fc-137a8358809d.png)

# 5. API 정보
## API 목록
Method|URL|description
-|-|-
POST|/events|(action: `ADD`, `DELETE`, `MOD`)
GET|/point/:userId|사용자 포인트 조회
