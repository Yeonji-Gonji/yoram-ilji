import type { PortfolioItem } from '@/types/portfolio.type';

const item: PortfolioItem = {
  "id": "manil",
  "title": "사주 기반 AI 대화 웹서비스",
  "subtitle": "모바일 웹 SPA의 프론트엔드 코어: 온보딩·인증·상담 채팅·리포트",
  "description": "생년월일을 등록하면 사주를 기반으로 AI와 상담하고 그 내용을 리포트로 정리해 공유하는 모바일 웹 서비스입니다. 3인 팀에서 프론트엔드 메인으로 라우팅·상담 채팅·등록 폼·소셜 로그인·리포트 렌더를 맡아 짧은 기간에 서비스 전체 동선을 붙였습니다. 백엔드와 사주 해석 엔진, 어드민과 OAuth 서버 연동은 다른 구성원이 맡았습니다.",
  "category": "development",
  "period": "2025",
  "role": "프론트엔드 (메인)",
  "team": "주식회사 업폴 (Upfall) · 3인",
  "skills": [
    "React 19",
    "TypeScript",
    "Vite 7",
    "Emotion",
    "TanStack Query",
    "React Hook Form",
    "Zustand",
    "React Router 7",
    "embla-carousel",
    "react-mobile-picker",
    "dayjs"
  ],
  "metrics": [
    "3인 팀에서 프론트엔드 메인 (라우팅·채팅·등록 폼·인증·리포트 렌더)",
    "약 2개월에 서비스 전체 동선 구축",
    "상담 채팅 하루 5회 사용량 제한",
    "Google·Naver OAuth 팝업 로그인"
  ],
  "thumbnail": "/portfolio/manil/cover.webp",
  "coverImage": "/portfolio/manil/cover.webp",
  "coverWidth": 1600,
  "coverHeight": 894,
  "color": "#6b6864",
  "featured": false,
  "blocks": [
    {
      "type": "callout",
      "icon": "🔮",
      "text": [
        {
          "text": "처음 들어온 사용자를 온보딩 → 로그인 → 생년월일 입력까지 끊김 없이 잇고 그 뒤의 채팅·리포트가 안정적으로 돌아가는 프론트엔드 구조를 맡았습니다."
        }
      ]
    },
    {
      "type": "heading",
      "level": 2,
      "text": [
        {
          "text": "배경"
        }
      ]
    },
    {
      "type": "paragraph",
      "text": [
        {
          "text": "manil은 사주(생년월일·태어난 시간) 기반의 AI 대화 서비스입니다. 사용자가 자기 정보를 등록하면 상담 봇과 여러 번 대화하고 그 대화를 리포트로 정리해 카카오톡으로 공유할 수 있는 모바일 웹 앱입니다. 3인 팀에서 프론트엔드 메인으로 라우팅·채팅·입력 폼 같은 코어 화면의 구조를 맡았습니다. 구축 기간은 약 2개월이고 "
        },
        {
          "text": "백엔드와 사주 해석 엔진, 어드민과 OAuth 서버 연동은 다른 구성원이 맡았습니다",
          "bold": true
        },
        {
          "text": "입니다."
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
      "type": "list",
      "ordered": true,
      "items": [
        {
          "text": [
            {
              "text": "생년월일 입력 폼: 양력/음력 토글·휠 피커·약관 게이팅",
              "bold": true
            },
            {
              "text": ": React Hook Form으로 구성. 양력/음력 토글에 따라 윤달 처리가 달라지고 날짜·시간은 react-mobile-picker 휠 피커를 모달로 띄워 손으로 돌려 고르게. \"태어난 시간 모름\" 체크, 약관 3종 전체 동의 연동, 음력↔양력 변환 API 연동."
            }
          ]
        },
        {
          "text": [
            {
              "text": "채팅: 하루 사용량 제한·날짜별 묶음·메시지 UI",
              "bold": true
            },
            {
              "text": ": 서버에서 평면 배열로 받아 날짜별 그룹핑(접이식 섹션). 하루 5회 사용량 제한을 조회 쿼리로 표시·차단하고 소진 시 새 방 대신 기존 대화로 보내는 useChatOpen 훅으로 흐름 정리. IME 조합 중 전송 방지, framer-motion 메시지 애니메이션."
            }
          ]
        },
        {
          "text": [
            {
              "text": "라우팅·인증: OAuth 팝업·토큰 관리·모달 라우팅",
              "bold": true
            },
            {
              "text": ": react-router 7로 인증 전/후 레이아웃 분리, Google·Naver OAuth를 팝업 + postMessage로 받아 토큰을 Zustand에 저장(localStorage 영속). axios 인터셉터로 토큰 주입·401 자동 로그아웃, location.state의 background로 모달 라우팅."
            }
          ]
        },
        {
          "text": [
            {
              "text": "리포트·공통 UI",
              "bold": true
            },
            {
              "text": ": 대화를 리포트로 만드는 화면(서버 JSON 파싱·렌더)과 카카오톡 공유. Promise 기반 공통 알림(commonAlert)으로 prop drilling 없이 확인/취소 호출, 체크박스 전체 동의해야 활성화되는 회원 탈퇴 확인 등 위험 동작 처리."
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
          "text": "결과"
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
              "text": "프론트엔드 메인",
              "bold": true
            },
            {
              "text": ": 라우팅·채팅·등록 폼·인증·리포트 렌더 담당"
            }
          ]
        },
        {
          "text": [
            {
              "text": "약 2개월",
              "bold": true
            },
            {
              "text": ": 서비스 전체 동선 구축"
            }
          ]
        },
        {
          "text": [
            {
              "text": "5회/일",
              "bold": true
            },
            {
              "text": ": 채팅 사용량 제한 처리"
            }
          ]
        },
        {
          "text": [
            {
              "text": "OAuth ×2",
              "bold": true
            },
            {
              "text": ": Google·Naver 팝업 로그인"
            }
          ]
        }
      ]
    },
    {
      "type": "paragraph",
      "text": [
        {
          "text": "새 사용자의 첫 진입부터 채팅·리포트까지 이어지는 프론트엔드 코어를, 폼 검증·서버 상태·라우팅을 분리해 구성한 작업입니다."
        }
      ]
    },
    {
      "type": "heading",
      "level": 2,
      "text": [
        {
          "text": "정리"
        }
      ]
    },
    {
      "type": "paragraph",
      "text": [
        {
          "text": "입력이 많고 모바일 인터랙션이 핵심인 서비스라, 폼·상태 관리·라우팅의 구조를 처음부터 정하는 일이 가장 중요했습니다. 양력/음력 같은 도메인 규칙은 화면과 분리해 다루고 인증·사용량 제한처럼 어긋나면 곤란한 부분은 한 곳에서 처리되도록 모은 데 공을 들였습니다."
        }
      ]
    }
  ]
};

export default item;
