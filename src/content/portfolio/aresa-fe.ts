import type { PortfolioItem } from '@/types/portfolio.type';

const item: PortfolioItem = {
  "id": "aresa-fe",
  "title": "부동산 진단·계산 모바일앱",
  "subtitle": "신입 시기, 데이터가 많은 실서비스 화면으로 쌓은 프론트엔드 기초",
  "description": "부동산 전세안전진단·DSR 계산 서비스에서 지도·대출 계산기·관리자처럼 데이터가 많은 화면을 맡았습니다. 뷰포트 경계가 바뀔 때마다 그 범위만 다시 조회하는 지도, 대출 유형 9종·상환 방식 3종을 클라이언트에서 계산하는 대출 계산기, 관리 테이블 6개를 공용 서비스 하나로 묶은 관리자 사이트를 만들었습니다.",
  "category": "development",
  "period": "2023.12 - 2024.07",
  "role": "프론트엔드",
  "team": "ARESA Korea",
  "skills": [
    "Angular 17",
    "Ionic 7 (Angular 16)",
    "RxJS",
    "TypeScript",
    "Tailwind CSS",
    "Leaflet",
    "amCharts 5",
    "Chart.js"
  ],
  "metrics": [
    "지도·계산기·관리자 등 데이터 집약 화면",
    "대출 유형 9종 · 상환 방식 3종 클라이언트 계산",
    "관리자 사이트 신규 개발 (관리 테이블 6개)"
  ],
  "thumbnail": "/portfolio/aresa-fe/cover.webp",
  "coverImage": "/portfolio/aresa-fe/cover.webp",
  "coverWidth": 2500,
  "coverHeight": 1563,
  "color": "#6b6864",
  "featured": false,
  "blocks": [
    {
      "type": "callout",
      "icon": "📌",
      "text": [
        {
          "text": "주력 케이스만큼 정량으로 방어되지는 않지만, 실서비스의 데이터 집약 화면을 다룬 기록을 화면과 코드로 보여주는 보조 케이스입니다."
        }
      ]
    },
    {
      "type": "heading",
      "level": 2,
      "text": [
        {
          "text": "한 일"
        }
      ]
    },
    {
      "type": "heading",
      "level": 3,
      "text": [
        {
          "text": "부동산 지도: 뷰포트 기준 재조회와 마커 클러스터링"
        }
      ]
    },
    {
      "type": "paragraph",
      "text": [
        {
          "text": "Leaflet 지도에서 확대·축소나 드래그로 보이는 범위가 바뀔 때마다 그 경계만 서버에 다시 조회하고, 매물이 몰리는 구간은 클러스터로 묶어 표시했습니다. 직전과 같은 응답이면 마커를 다시 만들지 않도록 비교를 넣어 불필요한 재렌더를 막았습니다. 마커를 누르면 기본정보·인프라·매물 탭이 있는 상세로 이동해 인프라 분포와 실거래 추이를 함께 보여줍니다."
        }
      ]
    },
    {
      "type": "heading",
      "level": 3,
      "text": [
        {
          "text": "대출 계산기: DSR·신DTI 계산을 클라이언트에서"
        }
      ]
    },
    {
      "type": "paragraph",
      "text": [
        {
          "text": "대출 유형 9종(DSR 적용 6종·미적용 3종)과 주택담보대출 상환 방식 3종, 신DTI까지 계산을 클라이언트에서 처리하는 서비스 모듈을 구현했습니다. 계산 입력값은 쿠키에 저장해 다시 들어와도 결과가 복원되고, JWT로 회원·비회원을 구분해 소득 대비 대출 가능 금액을 즉시 보여줍니다. "
        },
        {
          "text": "타입은 서브모듈로 공유하는 DTO 42종을 그대로 써서 서버와 어긋나지 않게 했습니다.",
          "bold": true
        },
        {
          "text": " 대출 정보 등록·수정·삭제도 같은 화면에서 다뤘습니다."
        }
      ]
    },
    {
      "type": "heading",
      "level": 3,
      "text": [
        {
          "text": "관리자 사이트 (신규 개발)"
        }
      ]
    },
    {
      "type": "paragraph",
      "text": [
        {
          "text": "Angular 17로 새로 만든 어드민입니다. 회원·문의·공지·FAQ·전세안전분석 등 관리 테이블 6개가 정렬·검색·페이지네이션·탭을 똑같이 쓰는데, 조작 이력을 공용 서비스 한 곳에 쌓아 순서대로 다시 적용하는 구조로 두고 각 페이지는 초기화와 구독만 하게 했습니다. 만료된 토큰으로 로그인 화면을 맴도는 문제는 인증 실패 처리를 한 곳으로 모아 끊었고, 레이아웃도 인증 여부에 따라 분기했습니다."
        }
      ]
    },
    {
      "type": "heading",
      "level": 2,
      "text": [
        {
          "text": "이 케이스의 역할"
        }
      ]
    },
    {
      "type": "list",
      "ordered": false,
      "items": [
        {
          "text": [
            {
              "text": "데이터 집약 화면 경험",
              "bold": true
            },
            {
              "text": ": 지도·계산기·관리자처럼 데이터가 많고 상태가 복잡한 화면을 다뤘습니다."
            }
          ]
        },
        {
          "text": [
            {
              "text": "도메인 계산 로직",
              "bold": true
            },
            {
              "text": ": 금융 규제 계산처럼 틀리면 곤란한 규칙을 화면에서 다뤄 본 경험입니다."
            }
          ]
        },
        {
          "text": [
            {
              "text": "정직한 한계",
              "bold": true
            },
            {
              "text": ": 재직 중 커밋 로그가 남아 있지 않아 기여를 커밋으로 분리해 보여주기 어렵습니다. 그래서 주력이 아닌 보조 케이스로 둡니다."
            }
          ]
        }
      ]
    },
    {
      "type": "heading",
      "level": 2,
      "text": [
        {
          "text": "이미지"
        }
      ]
    },
    {
      "type": "image",
      "src": "/portfolio/aresa-fe/01.webp",
      "width": 1600,
      "height": 1741
    },
    {
      "type": "image",
      "src": "/portfolio/aresa-fe/02.webp",
      "width": 1600,
      "height": 1732
    },
    {
      "type": "image",
      "src": "/portfolio/aresa-fe/03.webp",
      "width": 1600,
      "height": 1734
    },
    {
      "type": "image",
      "src": "/portfolio/aresa-fe/04.webp",
      "width": 1600,
      "height": 1733
    },
    {
      "type": "image",
      "src": "/portfolio/aresa-fe/05.webp",
      "width": 1600,
      "height": 1730
    },
    {
      "type": "image",
      "src": "/portfolio/aresa-fe/06.webp",
      "width": 1600,
      "height": 4468
    }
  ]
};

export default item;
