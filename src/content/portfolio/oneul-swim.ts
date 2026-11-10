import type { PortfolioItem } from '@/types/portfolio.type';

const item: PortfolioItem = {
  "id": "oneul-swim",
  "title": "오늘수영",
  "subtitle": "오늘수영: 전국 수영장 안내 PWA 1인 기획·개발·운영 (개인 프로젝트)",
  "description": "\"지금 자유수영 가면 되는지\"를 알려주는 서비스입니다. 기획, 디자인, 프론트, 백엔드, 전국 603곳 데이터 파이프라인, 실서버 운영까지 1인으로 개발해 월 서버 비용 0원으로 운영 중입니다. \"백엔드가 중단되어도 앱은 동작한다\"를 원칙으로 전 계층에 폴백을 두고, 데이터는 dry-run 계획을 서버가 apply하는 2단계·멱등 적재로 관리합니다.",
  "category": "development",
  "period": "2026.06 - 운영 중",
  "role": "1인 (기획 · 디자인 · 프론트엔드 · 백엔드 · 데이터 · 운영)",
  "skills": [
    "Next.js 16",
    "React 19",
    "TypeScript",
    "Tailwind CSS v4",
    "Kakao Maps",
    "PWA",
    "NestJS",
    "Prisma",
    "PostgreSQL",
    "Docker",
    "Oracle Cloud",
    "GitHub Actions"
  ],
  "metrics": [
    "전국 공공 수영장 603곳",
    "요금 545곳",
    "시간표 완비 82곳",
    "월 서버 비용 0원",
    "프론트 단위 테스트 35케이스",
    "CI 4단 게이트",
    "일일 DB 백업 7일 롤링",
    "헬스체크 5분 감시",
    "구축기 긱뉴스 공유 (업보트 14",
    "댓글 10)",
    "라이트·다크 AA 대비 유지"
  ],
  "thumbnail": "/portfolio/oneul-swim/cover.webp",
  "coverImage": "/portfolio/oneul-swim/cover.webp",
  "coverWidth": 1600,
  "coverHeight": 900,
  "color": "#6b6864",
  "featured": false,
  "github": "https://github.com/Yeonji-Gonji/oneul-swim-frontend",
  "live": "https://oneul-swim.vercel.app",
  "blocks": [
    {
      "type": "callout",
      "icon": "🏊",
      "text": [
        {
          "text": "기획부터 서버 운영까지 혼자 끝낸 개인 프로덕트입니다. \"백엔드가 중단되어도 앱은 동작한다\"를 원칙으로 세우고, 데이터 정확성과 월 0원 운영을 함께 지키는 구조를 만들었습니다."
        }
      ]
    },
    {
      "type": "heading",
      "level": 2,
      "text": [
        {
          "text": "결론"
        }
      ]
    },
    {
      "type": "paragraph",
      "text": [
        {
          "text": "백엔드가 중단되어도 앱은 동작한다는 원칙으로 API·지도·푸시 전 계층에 폴백을 두었고, 이름 매칭을 좌표 매칭으로, LLM 자동 추출을 제보·검수 적재로 바꿔 전국 603곳을 채웠으며, 월 0원 서버에서 배포·백업·감시를 무인화했습니다."
        }
      ]
    },
    {
      "type": "heading",
      "level": 2,
      "text": [
        {
          "text": "담당 범위"
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
              "text": "직접 구현",
              "bold": true
            },
            {
              "text": ": 기획, 프론트(Next.js PWA·폴백 계층·지도·단위 테스트 35케이스), 백엔드(NestJS·PostgreSQL), 데이터 파이프라인, 무인 배포·백업·감시 전부"
            }
          ]
        },
        {
          "text": [
            {
              "text": "다른 담당",
              "bold": true
            },
            {
              "text": ": 없음"
            }
          ]
        },
        {
          "text": [
            {
              "text": "하지 않은 것",
              "bold": true
            },
            {
              "text": ": 다중 사용자 동시성과 장시간 구동 검증은 하지 않았습니다."
            }
          ]
        },
        {
          "text": [
            {
              "text": "의미",
              "bold": true
            },
            {
              "text": ": 실무에서 백엔드·인프라와의 경계를 판단하는 근거가 된 경험입니다."
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
          "text": "배경"
        }
      ]
    },
    {
      "type": "paragraph",
      "text": [
        {
          "text": "\"오늘 이 시간에 자유수영을 할 수 있는 수영장이 어디지?\"라는 생활 속 질문에서 시작한 개인 프로젝트입니다. 수영장의 자유수영 가능 여부·요금·위치를 한 화면에서 보여주며, 기획·디자인·프론트엔드·백엔드·전국 603곳 데이터 파이프라인·인프라를 전부 혼자 맡아 운영 중입니다. 1인 운영이라 백엔드 장애, API 키 미설정, 데이터 형태 변경 어느 것도 새벽에 즉시 대응할 수 없다는 전제가 설계의 출발점이었습니다."
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
              "text": "폴백 우선 아키텍처: API · 지도 · 푸시 전 계층 강등 설계",
              "bold": true
            },
            {
              "text": ": "
            },
            {
              "text": "\"백엔드가 중단되어도 앱은 동작한다\"를 설계 원칙으로 명문화",
              "bold": true
            },
            {
              "text": "하고 모든 외부 의존성에 폴백 계층을 뒀습니다. API가 없거나 실패하거나 응답 검증에 실패하면 오류 화면 없이 정적 pools.json으로 전환하고, 지도 키가 없으면 지역 목록 UI로, 푸시 키가 없으면 안내 문구로 대체합니다. 이 구조 덕분에 정적 JSON MVP로 먼저 검증을 마친 뒤, 백엔드가 있어야만 가능한 기능(오류 제보 수집, 내 제보 내역, 아침 요약 푸시)이 생긴 시점에 NestJS + Prisma + PostgreSQL을 증설했습니다. 회원가입은 만들지 않았습니다. 익명 기기 ID로 제보를 묶는 것으로 충분했고, "
            },
            {
              "text": "이 앱에 로그인은 과설계",
              "bold": true
            },
            {
              "text": "라고 판단했습니다."
            }
          ]
        },
        {
          "text": [
            {
              "text": "데이터 파이프라인: 4곳 MVP에서 전국 603곳으로",
              "bold": true
            },
            {
              "text": ": 공공데이터(KSPO)에서 공공 수영장 602곳을 필터·적재했고, 시설 정보 결합은 오매칭이 심한 이름 매칭을 폐기하고 "
            },
            {
              "text": "좌표 거리 매칭(250m 이내)",
              "bold": true
            },
            {
              "text": "으로 했습니다. "
            },
            {
              "text": "\"공공 수영장 요금은 지자체 도시공사 단위로 동일하다\"",
              "bold": true
            },
            {
              "text": "는 관찰에서, 시설별이 아닌 도시공사 단위 조사로 545곳의 요금을 확보했습니다. 원본의 갱신일 표기는 날조 방지를 위해 원문 문자열 그대로 보존하고 운영 추적용 타임스탬프는 별도 컬럼으로 분리했으며, 확인하지 못한 값은 지어내는 대신 화면에 \"시설 확인\"으로 명시하고 확인 날짜를 함께 노출합니다. 적재는 "
            },
            {
              "text": "dry-run이 계획 JSON을 만들고 서버는 그 계획만 apply하는 2단계·멱등 설계",
              "bold": true
            },
            {
              "text": "라 같은 스크립트를 몇 번 돌려도 데이터가 어긋나지 않습니다."
            }
          ]
        },
        {
          "text": [
            {
              "text": "뺀 결정: LLM 시간표 자동 추출 폐기",
              "bold": true
            },
            {
              "text": ": AI로 시간표를 자동 추출하는 파이프라인을 만들었다가 폐기했습니다. 표면적 원인은 API rate limit이었지만, 추적해 보니 실제 원인은 추출 결과가 앱이 읽는 데이터 계약과 불일치해 추출에 성공해도 화면에 표시되지 않는 것이었습니다. 나아가 홈페이지가 없는 약 530곳은 원천 자체가 없어 자동 수집이 구조적으로 불가능하다고 판단했고, "
            },
            {
              "text": "제보 크라우드소싱 + 검수된 벌크 적재",
              "bold": true
            },
            {
              "text": "로 전략을 바꿨습니다. 남겨둔 AI 추출도 DB에 직접 쓰지 않고 관리자 승인 큐를 거쳐서만 반영됩니다."
            }
          ]
        },
        {
          "text": [
            {
              "text": "iOS 스타일 디자인 시스템과 다크모드를 토큰으로 직접 설계",
              "bold": true
            },
            {
              "text": ": "
            },
            {
              "text": ":root",
              "code": true
            },
            {
              "text": "에 시맨틱 CSS 변수(색·간격·elevation)를 정의하고 "
            },
            {
              "text": "prefers-color-scheme: dark",
              "code": true
            },
            {
              "text": "에서 값만 뒤집어 다크모드가 자동 전환되게 했고, 수동 토글은 "
            },
            {
              "text": "[data-theme]",
              "code": true
            },
            {
              "text": " 훅으로 병설했습니다. 중복되던 그림자를 elevation 토큰으로 통합하고, 상태색(영업중·곧열림·마감)을 soft와 ink 페어로 묶어 "
            },
            {
              "text": "라이트·다크 양쪽에서 대비 기준(AA)을 지켰습니다.",
              "bold": true
            }
          ]
        },
        {
          "text": [
            {
              "text": "목록 중심 화면을 지도 중심으로 재설계",
              "bold": true
            },
            {
              "text": ": 홈을 내 위치 기반 풀스크린 지도로 바꾸고, 상태색 마커에 클러스터러를 붙여 600곳 이상을 끊김 없이 보여줍니다. 필터는 지도 위 글라스 플로팅 패널로, 목록은 지도 앱식 3단(peek/half/full) 드래그 바텀시트로 재구성했습니다. 지도 SDK의 "
            },
            {
              "text": "yAnchor",
              "code": true
            },
            {
              "text": "가 React 포털 렌더 전 0×0 div에서 오프셋이 굳는 문제는, 디자인을 포기하고 마커 위치를 타협하는 대신 CSS "
            },
            {
              "text": "transform",
              "code": true
            },
            {
              "text": " 앵커로 바꿔 렌더 타이밍과 무관하게 마커 카드가 정확히 붙게 했습니다."
            }
          ]
        },
        {
          "text": [
            {
              "text": "품질: 억제 대신 원인 수정",
              "bold": true
            },
            {
              "text": ": 하이드레이션 에러(React #418)는 억제하지 않고 "
            },
            {
              "text": "useSyncExternalStore",
              "code": true
            },
            {
              "text": " 게이트로 원인을 수정했고, Playwright로 콘솔 에러 0건과 라이트·다크 화면을 시각 확인합니다. 격주 휴관 주차 규칙 같은 도메인 시간 로직은 "
            },
            {
              "text": "프론트 단위 테스트 35케이스",
              "bold": true
            },
            {
              "text": "로 고정했고, CI는 lint → typecheck → test → build 4단 게이트입니다."
            }
          ]
        },
        {
          "text": [
            {
              "text": "월 0원 실서버 운영: 무인 배포 · 백업 · 감시",
              "bold": true
            },
            {
              "text": ": Oracle Cloud 무료 ARM 인스턴스에 Docker Compose 3컨테이너(Caddy 자동 HTTPS + API + PostgreSQL)로 배포했습니다. GitHub Actions CD는 "
            },
            {
              "text": "QEMU arm64 크로스 빌드 → GHCR sha 태그 → SSH 배포",
              "bold": true
            },
            {
              "text": "로 이어지며, DB 마이그레이션이 실패하면 컨테이너를 교체하지 않고 구 버전을 유지합니다. 일일 DB 백업 7일 롤링 + 외부 감시 서비스 성공 핑, 헬스체크 5분 감시, DB 포트는 로컬호스트에만 바인딩(외부 노출 차단), 실수 과금을 막는 쿼터 잠금과 예산 알림까지 절차를 전부 운영 런북으로 문서화했습니다. 매일 오전 8시 크론이 오늘의 자유수영 세션을 계산해 Web Push로 발송하고, 매주 원본 페이지의 변경을 해시로 감지하는 크론은 "
            },
            {
              "text": "자동 반영하지 않고 관리자 알림까지만",
              "bold": true
            },
            {
              "text": " 보냅니다(human-in-the-loop). 구축 기록(무료 ARM 용량 부족 → PAYG 전환 → 과금 차단)은 기술 블로그로 정리해 긱뉴스(GeekNews)에 공유했습니다."
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
              "text": "전국 공공 수영장 603곳 · 요금 545곳 · 시간표 완비 82곳",
              "bold": true
            },
            {
              "text": ": 운영 중 확장"
            }
          ]
        },
        {
          "text": [
            {
              "text": "월 서버 비용 0원",
              "bold": true
            },
            {
              "text": ": 자동 배포 + 실패 시 구버전 유지 · 일일 백업 7일 롤링 · 헬스체크 5분 감시"
            }
          ]
        },
        {
          "text": [
            {
              "text": "단독 완주",
              "bold": true
            },
            {
              "text": ": 기획·디자인·프론트엔드·백엔드·데이터·인프라·운영"
            }
          ]
        },
        {
          "text": [
            {
              "text": "프론트 단위 테스트 35케이스 · CI 4단 게이트 · 콘솔 에러 0건",
              "bold": true
            }
          ]
        },
        {
          "text": [
            {
              "text": "지도 중심 재설계 · 다크모드 AA 대비",
              "bold": true
            },
            {
              "text": ": 시맨틱 토큰으로 라이트·다크 양쪽 유지"
            }
          ]
        },
        {
          "text": [
            {
              "text": "구축기 긱뉴스 공유",
              "bold": true
            },
            {
              "text": ": 업보트 14 · 댓글 10"
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
          "text": "정리"
        }
      ]
    },
    {
      "type": "paragraph",
      "text": [
        {
          "text": "화면보다 데이터의 정확성이 제품 신뢰를 만든다는 걸 확인한 프로젝트입니다. 처음부터 풀스택으로 짓는 대신 정적 MVP로 먼저 검증하고 필요가 생긴 시점에 백엔드를 증설하면서, 제품의 생애주기를 기획부터 서버 운영까지 혼자 겪어봤습니다. 배포 실패, arm64/x86 아키텍처 불일치, 패키지 매니저 이슈 같은 서버 운영의 실전 문제를 직접 겪고 해결했고, 실무에서 SDK 릴리즈·CMS 배포 파이프라인을 구축할 때 이 경험을 그대로 적용했습니다."
        }
      ]
    }
  ]
};

export default item;
