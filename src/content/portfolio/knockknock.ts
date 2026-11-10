import type { PortfolioItem } from '@/types/portfolio.type';

const item: PortfolioItem = {
  "id": "knockknock",
  "title": "일정관리 모바일앱",
  "subtitle": "모바일 스케줄 플래너 앱 (팀 프로젝트 · 출시 경험)",
  "description": "스케줄 보드와 달력으로 일정을 관리하는 모바일 애플리케이션입니다. 팀 프로젝트에서 프론트엔드로 참여해 iOS·Android 양 스토어 출시까지 경험했습니다.",
  "category": "development",
  "period": "2023.05 - 2023.11",
  "role": "프론트엔드 (팀장)",
  "team": "4인 팀",
  "skills": [
    "React Native",
    "TypeScript"
  ],
  "metrics": [
    "iOS·Android 양 스토어 심사 통과·출시",
    "4인 팀 팀장 (디자인 + 프론트엔드 겸임)",
    "약 6개월 개발 (2023.05 ~ 2023.11)",
    "커스텀 캘린더(multi dots)와 소셜 로그인 구현",
    "현재 백엔드 미운영으로 서비스는 동작하지 않음"
  ],
  "thumbnail": "/portfolio/knockknock/cover.webp",
  "coverImage": "/portfolio/knockknock/cover.webp",
  "coverWidth": 1024,
  "coverHeight": 500,
  "color": "#6b6864",
  "featured": false,
  "github": "https://github.com/4-Others/KnockKnock",
  "blocks": [
    {
      "type": "callout",
      "icon": "🚪",
      "text": [
        {
          "text": "기획·개발에서 끝나지 않고 iOS·Android 양쪽 스토어의 심사와 출시까지 직접 진행해 본 프로젝트입니다."
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
          "text": "일상 속 일정을 스케줄 보드와 달력으로 관리하는 모바일 앱입니다. 4인 팀에서 팀장 겸 프론트엔드(React Native)를 맡아 디자인과 개발을 함께 했고, 약 6개월간 개발해 양 스토어 출시(심사·스토어 등록·배포)까지 진행했습니다. Expo 대신 React Native CLI를 선택해 네이티브 라이브러리 제약을 피했습니다."
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
              "text": "디자인 + 공통 UI: ",
              "bold": true
            },
            {
              "text": "앱 디자인과 스타일 가이드를 직접 제작하고 UI/UX를 구현했습니다."
            }
          ]
        },
        {
          "text": [
            {
              "text": "커스텀 캘린더: ",
              "bold": true
            },
            {
              "text": "하루에 여러 일정을 점(multi dots)으로 표시하고 다중 일정 선택을 지원하는 커스텀 캘린더를 구현했습니다."
            }
          ]
        },
        {
          "text": [
            {
              "text": "회원가입·인증: ",
              "bold": true
            },
            {
              "text": "회원가입 프로세스와 에러 핸들링 시각화, Google·Kakao 소셜 로그인과 일반 로그인을 구현했습니다."
            }
          ]
        },
        {
          "text": [
            {
              "text": "일정 데이터: ",
              "bold": true
            },
            {
              "text": "회원·일정 데이터의 전역 상태 관리와 CRUD, 기간·일정 선택 검색 기능을 구현했습니다."
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
          "text": "트러블슈팅: 회원가입 4단계 화면의 데이터 유실"
        }
      ]
    },
    {
      "type": "paragraph",
      "text": [
        {
          "text": "회원가입을 4단계 Stack 화면 전환으로 만들었는데, 화면을 오가면 useState로 들고 있던 입력값이 컴포넌트 언마운트와 함께 사라졌고, 백엔드의 인증 순서(비밀번호 먼저·인증번호 방식)와도 흐름이 맞지 않았습니다. material-top-tabs로 구조를 바꾸고 navigation.setParams로 단계 간 데이터를 넘기도록 리팩터링해, API 설계와 화면 흐름을 맞췄습니다."
        }
      ]
    },
    {
      "type": "heading",
      "level": 2,
      "text": [
        {
          "text": "출시: 스토어 심사 대응"
        }
      ]
    },
    {
      "type": "paragraph",
      "text": [
        {
          "text": "iOS 빌드에서 여러 빌드 에러에 부딪혀 Xcode 설정을 직접 수정해 해결했고, 앱스토어 심사에 필요한 정책(policy) 문서와 스크린샷 등 심사용 자료도 직접 만들어 제출했습니다. 기능 구현이 끝나도 출시까지는 빌드 설정·심사 대응 같은 별도의 작업이 남아 있다는 걸 이때 배웠습니다."
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
              "text": "양 스토어: ",
              "bold": true
            },
            {
              "text": "iOS App Store · Google Play 심사 통과·출시"
            }
          ]
        },
        {
          "text": [
            {
              "text": "4인 팀장: ",
              "bold": true
            },
            {
              "text": "디자인 + 프론트엔드 겸임"
            }
          ]
        },
        {
          "text": [
            {
              "text": "약 6개월",
              "bold": true
            },
            {
              "text": ": 2023.05 ~ 2023.11 개발 후 출시까지 진행"
            }
          ]
        }
      ]
    },
    {
      "type": "paragraph",
      "text": [
        {
          "text": "현재는 백엔드 서버가 운영 중단되어 서비스는 동작하지 않습니다. 이 케이스는 성과보다는, 양 스토어 심사와 출시를 직접 진행해 본 경험으로 남겨둡니다."
        }
      ]
    }
  ]
};

export default item;
