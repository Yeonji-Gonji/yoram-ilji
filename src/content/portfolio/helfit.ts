import type { PortfolioItem } from '@/types/portfolio.type';

const item: PortfolioItem = {
  "id": "helfit",
  "title": "헬스케어 대시보드",
  "subtitle": "헬스 종합 플랫폼 (팀 프로젝트 · FE 팀장)",
  "description": "신체정보 통계·건강관리, 커뮤니티, 위치 기반 운동시설 안내를 제공하는 헬스 종합 플랫폼입니다. 6인 팀에서 프론트엔드 팀장으로 메인·캘린더·챗봇·할 일 관리 등을 맡았습니다.",
  "category": "development",
  "period": "2023.03",
  "role": "프론트엔드 (팀장)",
  "team": "6인 팀",
  "skills": [
    "Next.js",
    "React",
    "Redux Toolkit",
    "d3",
    "Semantic UI",
    "OpenAI (ChatGPT)"
  ],
  "metrics": [
    "6인 팀 프론트엔드 팀장",
    "4주 데드라인 안에 기획 의사결정 수렴",
    "주 1회 QA·진행 미팅 리드",
    "ChatGPT 챗봇·식단 추천 (SSE 스트리밍)",
    "d3 기반 신체정보 시각화"
  ],
  "thumbnail": "/portfolio/helfit/cover.webp",
  "coverImage": "/portfolio/helfit/cover.webp",
  "coverWidth": 1202,
  "coverHeight": 658,
  "color": "#6b6864",
  "featured": false,
  "github": "https://github.com/sixman-s/helfit",
  "live": "https://www.helfit.life/",
  "blocks": [
    {
      "type": "paragraph",
      "text": [
        {
          "text": "부트캠프 팀 프로젝트로, 6인 팀에서 프론트엔드 팀장을 맡아 "
        },
        {
          "text": "디자인과 프론트엔드를 모두 수행",
          "bold": true
        },
        {
          "text": "했습니다. 화면 설계부터 공통 컴포넌트, 핵심 기능까지 담당했습니다."
        }
      ]
    },
    {
      "type": "image",
      "src": "/portfolio/helfit/01.webp",
      "width": 864,
      "height": 662
    },
    {
      "type": "image",
      "src": "/portfolio/helfit/02.webp",
      "width": 1600,
      "height": 791
    },
    {
      "type": "image",
      "src": "/portfolio/helfit/03.webp",
      "width": 1202,
      "height": 658
    },
    {
      "type": "heading",
      "level": 2,
      "text": [
        {
          "text": "맡은 일"
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
              "text": "메인·캘린더 페이지",
              "bold": true
            },
            {
              "text": "와 LNB·레이아웃 등 공통 컴포넌트 설계"
            }
          ]
        },
        {
          "text": [
            {
              "text": "ChatGPT 기반 챗봇·식단 추천",
              "bold": true
            },
            {
              "text": ": "
            },
            {
              "text": "@microsoft/fetch-event-source",
              "code": true
            },
            {
              "text": "로 SSE 스트리밍 응답 처리"
            }
          ]
        },
        {
          "text": [
            {
              "text": "캘린더 연동 할 일(TodoList) CRUD",
              "bold": true
            }
          ]
        },
        {
          "text": [
            {
              "text": "d3 기반 데이터 시각화",
              "bold": true
            },
            {
              "text": ": 사용자의 신체정보 통계를 그래프로 표현"
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
          "text": "팀장으로서 한 일"
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
              "text": "의견을 결정으로: ",
              "bold": true
            },
            {
              "text": "6인 팀에서 쏟아지는 수많은 의견과 제안을 정리해 4주라는 데드라인 안에 만들 수 있는 범위로 기획 의사결정을 수렴하는 일이 가장 어려웠고 가장 중요했습니다."
            }
          ]
        },
        {
          "text": [
            {
              "text": "매주 QA·진행 미팅: ",
              "bold": true
            },
            {
              "text": "주 1회 QA와 진행사항 미팅을 리드하며 프로젝트 진척도를 점검하고 막히는 부분을 그 자리에서 함께 풀어 일정이 밀리지 않게 관리했습니다."
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
          "text": "부딪힌 문제들"
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
              "text": "캘린더 라이브러리 교체: ",
              "bold": true
            },
            {
              "text": "fullcalendar의 커스텀 CSS 한계에 부딪혀 react-datepicker로 교체하고 디자인에 맞게 다시 입혔습니다."
            }
          ]
        },
        {
          "text": [
            {
              "text": "ChatGPT 응답 지연: ",
              "bold": true
            },
            {
              "text": "챗봇·식단 추천의 API 응답이 느려 대기 구간을 로딩 상태 UI로 처리해 사용자가 멈춘 것으로 느끼지 않게 했습니다."
            }
          ]
        },
        {
          "text": [
            {
              "text": "게시글 마크업 노출: ",
              "bold": true
            },
            {
              "text": "커뮤니티 게시글에 마크업이 그대로 노출되는 문제를 이스케이프 처리 컴포넌트로 해결했습니다. 돌아보면 더 단순한 방법이 있었다는 것도 회고로 남겼습니다."
            }
          ]
        },
        {
          "text": [
            {
              "text": "비회원 UX 리팩터링: ",
              "bold": true
            },
            {
              "text": "로그인 유도 문구가 반복 노출되는 흐름을 피그마로 먼저 다시 설계한 뒤, 로그인/비로그인 조건부 렌더링으로 리팩터링했습니다."
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
          "text": "남은 것"
        }
      ]
    },
    {
      "type": "paragraph",
      "text": [
        {
          "text": "신입 이전, 처음으로 팀의 프론트를 이끌며 화면을 끝까지 책임져 본 경험입니다. SSE 스트리밍·상태관리(Redux)·데이터 시각화(d3)를 한 프로젝트 안에서 처음 묶어봤습니다."
        }
      ]
    },
    {
      "type": "paragraph",
      "text": [
        {
          "text": "실사용자는 없었지만 함께했던 다년차 개발자 팀원이 최근 사내 프로젝트에 참고하려고 이 프로젝트를 다시 열어봤다는 이야기를 들었습니다."
        }
      ]
    }
  ]
};

export default item;
