import type { PortfolioItem } from '@/types/portfolio.type';

const item: PortfolioItem = {
  "id": "voidx-addon-sdk",
  "title": "임베드형 AI 에이전트 SDK",
  "subtitle": "3채널 모노레포 아키텍처 전환과 무인 릴리즈 파이프라인",
  "description": "호스트 사이트에 script 한 줄로 삽입되는 서드파티 AI 에이전트 위젯 SDK입니다. UMD standalone · closed Shadow DOM · self-init 3중 격리로 호스트 충돌을 원천 차단하고 채널별로 갈라진 위젯 리포 4종을 단일 모노레포(앱 3 · 공용 패키지 3, 25.3k LOC, 단위 테스트 1,271건)와 이기종 백엔드 스트림 어댑터로 통합해 4개 CDN 경로 무인 발행과 카페24 유료앱 출시까지 완주했습니다.",
  "category": "development",
  "period": "2025.10 - 운영 중",
  "role": "SDK 단독 개발 · 모노레포 전환 주도 · 카페24 앱 PM 겸임 3개월",
  "team": "주식회사 업폴 (Upfall)",
  "skills": [
    "React 19",
    "Vite (UMD standalone)",
    "Shadow DOM",
    "pnpm · Turborepo",
    "WebRTC",
    "GitHub Actions",
    "Vitest",
    "CDN"
  ],
  "metrics": [
    "채널 리포 4종을 단일 모노레포로 통합 (앱 3 · 공용 패키지 3)",
    "프로덕션 303파일 · 25,360 LOC",
    "단위 테스트 1,271건 (빌드 게이트) · 타입 오류 0 · 계층 위반 0",
    "이기종 백엔드 3종의 스트림 어휘를 어댑터 2계보로 번역 (테스트 48건)",
    "CDN 4경로를 영향 범위 판정으로 단일 워크플로 발행",
    "버전 경로 3종 (/latest/ · /v{semver}/ · /build-{N}/)",
    "PR마다 실제 브라우저 스모크",
    "카페24 무료앱 출시 후 유료앱 심사 통과 (7일 무료 체험 · 인앱 정기결제)",
    "번들 gzip 196KB · 스프라이트 245KB에서 8.4KB",
    "데모 demo-fashion.voidx.ai"
  ],
  "thumbnail": "/portfolio/voidx-addon-sdk/cover.webp",
  "coverImage": "/portfolio/voidx-addon-sdk/cover.webp",
  "coverWidth": 1600,
  "coverHeight": 900,
  "color": "#6b6864",
  "featured": true,
  "live": "https://demo-fashion.voidx.ai",
  "blocks": [
    {
      "type": "callout",
      "text": [
        {
          "text": "서드파티 임베드 SDK는 호스트 환경에서 충돌 없이 가볍게 도는 것이 기능 구현보다 먼저입니다. 호환을 맞추는 대신 충돌이 생길 수 없는 구조로 바꾸고 배포는 사람이 아니라 파이프라인이 검사하게 했습니다."
        }
      ],
      "icon": "🧩"
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
          "text": "script 태그 한 줄로 고객사 사이트에 AI 에이전트를 설치하는 SDK입니다. 고객사는 React든 Vue든 순수 HTML이든 무엇이든 쓰고 전역 CSS와 업데이트 시점도 우리가 통제할 수 없습니다. 임베드 코드라 전제가 셋입니다. 호스트의 React·라이브러리와 충돌하지 않아야 하고 외부에서 불러오므로 가벼워야 하며 여러 고객사에 한 번에 반영되므로 배포가 안전하고 자동이어야 합니다."
        }
      ]
    },
    {
      "type": "paragraph",
      "text": [
        {
          "text": "SDK 코드는 단독으로 맡았고 카페24 앱은 3개월간 PM을 겸해 요구사항 정의부터 플랫폼 심사·PG 심사 창구까지 담당했습니다. 17.9k LOC 단일 리포로 시작해 채널마다 갈라져 있던 위젯 리포 4종을 모노레포 하나로 합친 지금은 프로덕션 303파일 25,360 LOC이고 단위 테스트 1,271건이 빌드 선행 조건입니다."
        }
      ]
    },
    {
      "type": "heading",
      "level": 2,
      "text": [
        {
          "text": "호스트 환경 3중 격리 아키텍처"
        }
      ]
    },
    {
      "type": "paragraph",
      "text": [
        {
          "text": "처음에는 NPM 패키지로 배포했는데 호스트 사이트의 React 버전과 충돌했습니다. 고객사에 React 버전을 맞춰 달라고 요구하면 그 조건을 맞추지 못하는 곳만큼 도입 범위가 줄어듭니다. 충돌을 건건이 대응하는 대신 "
        },
        {
          "text": "배포 방식을 CDN standalone 번들로 갈아엎어 버전 의존 자체를 끊었습니다.",
          "bold": true
        },
        {
          "text": " 처음 세운 전제가 틀렸다는 것을 인정하는 일이 먼저였습니다."
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
              "text": "UMD standalone 번들",
              "bold": true
            },
            {
              "text": ": React를 externals로 빼지 않고 통째로 포함하고 "
            },
            {
              "text": "NODE_ENV",
              "code": true
            },
            {
              "text": "를 프로덕션으로 인라인해 "
            },
            {
              "text": "호스트에 요구하는 런타임이 0",
              "bold": true
            },
            {
              "text": "입니다."
            }
          ]
        },
        {
          "text": [
            {
              "text": "closed Shadow DOM",
              "bold": true
            },
            {
              "text": ": 외부 스크립트가 shadowRoot에 접근할 수 없는 closed 모드 안에 React를 마운트하고 스타일은 CSS를 문자열로 임포트해 shadow 내부에만 주입하며 호스트 CSS 상속은 "
            },
            {
              "text": "initial",
              "code": true
            },
            {
              "text": " 리셋으로 끊어 양방향 간섭을 막았습니다."
            }
          ]
        },
        {
          "text": [
            {
              "text": "self-init 부트스트랩",
              "bold": true
            },
            {
              "text": ": 카페24 ScriptTags API는 script src 태그 한 줄만 주입할 수 있어 초기화 코드를 실행할 자리가 없습니다. 스크립트가 "
            },
            {
              "text": "document.currentScript.src",
              "code": true
            },
            {
              "text": "의 쿼리스트링에서 토큰과 몰 ID를 스스로 읽어 초기화하도록 해결했습니다."
            }
          ]
        }
      ]
    },
    {
      "type": "paragraph",
      "text": [
        {
          "text": "격리의 대가로 DOM 조회만으로는 렌더 여부를 확인할 수 없게 되어 렌더 검증은 스크린샷으로만 판정한다는 절차를 런북에 적어 두었습니다. 번들과 에셋은 도구로 진단하되 무엇을 적용할지는 직접 판단했습니다. standalone 번들 gzip 196KB, 도트아트 스프라이트는 245KB에서 8.4KB, 매니페스트 의존을 걷어내 초기 요청은 2회에서 1회입니다."
        }
      ]
    },
    {
      "type": "heading",
      "level": 2,
      "text": [
        {
          "text": "3채널 모노레포 전환: 이기종 스트림 어댑터와 4계층 구조"
        }
      ]
    },
    {
      "type": "paragraph",
      "text": [
        {
          "text": "인하우스·카페24·쇼피파이가 리포를 따로 두면서 같은 기능이 채널 수만큼 따로 구현되고 있었습니다. 트리거 스택 하나가 채널별로 2,662줄·768줄·90줄, 같은 개념이 서로 다른 완성도로 세 벌 있는 상태였습니다. 공통화를 시작한 날 기능 하나를 이식하면서 한 채널 코드가 하루 만에 두 배로 늘었고 규칙 없는 공통화는 중복을 키운다는 것을 보고 구조부터 정했습니다."
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
              "text": "통신: 이기종 백엔드를 어댑터 2계보로 번역",
              "bold": true
            },
            {
              "text": ": 백엔드 3종(Go 1계열·Node.js 2계열)의 스트림 종료 어휘가 서로 달라 공용 패키지를 만들 수 없었습니다. 백엔드에 통일을 요청해 프론트엔드 일정을 묶는 대신 "
            },
            {
              "text": "프론트엔드가 번역 어댑터를 두는 쪽",
              "bold": true
            },
            {
              "text": "으로 방향을 바꾸고 대안 3개 비교와 되돌리는 비용(어댑터 하나 삭제)을 결정 기록에 남겼습니다. 파서 세 벌이 한 벌이 됐고 어댑터 테스트는 48건입니다."
            }
          ]
        },
        {
          "text": [
            {
              "text": "구조: 의존 방향으로 정의한 4계층",
              "bold": true
            },
            {
              "text": ": 통신 → 변환 → 표현 → 배포 네 계층을 디렉터리 구분 대신 "
            },
            {
              "text": "의존 방향과 금지 사항",
              "bold": true
            },
            {
              "text": "으로 정의했습니다. 역방향 참조가 생기면 그 시점에 계층이 무너진 것입니다. 채널 차이는 배포 계층이 어댑터·옵션·주입값 세 가지로만 표현하고 셋으로 표현되지 않는 차이는 코드로 감추지 않고 결정 항목으로 올립니다."
            }
          ]
        },
        {
          "text": [
            {
              "text": "계측: 호스트와 도메인이 분리된 환경의 3축 사용자 식별",
              "bold": true
            },
            {
              "text": ": 위젯은 호스트 사이트와 도메인이 달라 일반 웹 계측 전제가 서지 않습니다. 방문자 ID, 플랫폼 서명 회원 키 해시, 대화방 ID 세 축으로 식별하고 직접 식별값은 싣지 않으며 공용 기기를 쓰는 사용자를 보호하려고 신원이 바뀌면 방문자 ID를 다시 발급합니다."
            }
          ]
        },
        {
          "text": [
            {
              "text": "남은 빚도 같이 기록",
              "bold": true
            },
            {
              "text": ": 앱 간 사본 1,938줄, 300줄을 넘는 파일 14개, 앱 층 테스트 커버리지(카페24 39% · 인하우스 31%)를 정량 평가에 그대로 적고 층별 착수 순서까지 남겼습니다."
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
          "text": "불변 버전 무인 릴리즈와 카페24 유료앱 완주"
        }
      ]
    },
    {
      "type": "paragraph",
      "text": [
        {
          "text": "SDK는 고객사 사이트에 직접 로드되는 코드라 잘못된 배포 한 번이 SDK를 설치한 모든 사이트에 그대로 나갑니다. 수동 배포로는 어떤 고객사가 어떤 버전을 쓰는지 보장할 수 없어 Jenkins에서 GitHub Actions로 옮기고 패키지 매니저를 pnpm으로 통일했습니다."
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
              "text": "테스트가 빌드 앞단을 지키는 구조",
              "bold": true
            },
            {
              "text": ": 빌드 스크립트 자체가 "
            },
            {
              "text": "vitest run → tsc → vite build",
              "code": true
            },
            {
              "text": " 순서라 테스트가 깨지면 빌드가 멈춥니다. 번들 내용 가드 2종을 두어 신규 API 클라이언트 마커가 번들에 없으면 실패하고 개발용 목(mock) 코드가 프로덕션 번들에 섞이면 실패합니다."
            }
          ]
        },
        {
          "text": [
            {
              "text": "버전 경로 3종과 사후 변경 차단",
              "bold": true
            },
            {
              "text": ": "
            },
            {
              "text": "/latest/",
              "code": true
            },
            {
              "text": "(가변) · "
            },
            {
              "text": "/v{semver}/",
              "code": true
            },
            {
              "text": "(불변 핀) · "
            },
            {
              "text": "/build-{N}/",
              "code": true
            },
            {
              "text": "(재현·롤백용)을 동시에 발행하고 동시 실행 충돌을 막았습니다. 버전을 올리지 않은 푸시는 불변 핀을 건드리지 않아 "
            },
            {
              "text": "이미 발행된 버전이 나중에 바뀌는 사고가 구조적으로 생기지 않습니다.",
              "bold": true
            },
            {
              "text": " Conventional Commits로 semver 단계를 자동 판정("
            },
            {
              "text": "feat!",
              "code": true
            },
            {
              "text": "→major, "
            },
            {
              "text": "feat",
              "code": true
            },
            {
              "text": "→minor, "
            },
            {
              "text": "fix",
              "code": true
            },
            {
              "text": "→patch)하고 CHANGELOG 갱신과 릴리즈 커밋까지 자동화했으며 릴리즈 커밋은 검사를 전부 통과한 뒤에만 생성됩니다."
            }
          ]
        },
        {
          "text": [
            {
              "text": "CDN 4경로 단일 워크플로 발행",
              "bold": true
            },
            {
              "text": ": 공용 패키지 한 줄 수정이 네 채널 번들을 모두 바꾸는 구조라, 변경 패키지와 그 의존자를 계산해 해당 채널만 발행하는 단일 워크플로로 묶었습니다. 사람 규칙으로 막다가 하루 만에 한 채널이 빠진 것을 보고 파이프라인으로 옮겼습니다. PR마다 실제 브라우저로 위젯을 띄워 콘솔 오류와 외부 요청이 없는지도 확인합니다."
            }
          ]
        },
        {
          "text": [
            {
              "text": "카페24 수명주기 완주",
              "bold": true
            },
            {
              "text": ": 무료앱 출시(06-18) → PG 심사 → 유료앱 심사 통과(10-13) → 7일 무료 체험·인앱 정기결제 → 무료앱 종료(10-31 공지, 11-02 작업)까지 PM으로 창구를 맡았습니다. 플랜을 바꿀 때 정기결제 행이 제자리에서 교체되는 문서 밖 동작은 테스트 몰에서 한 사이클 결제로 확인했습니다."
            }
          ]
        },
        {
          "text": [
            {
              "text": "위젯이 사라진 장애와 되돌린 절차",
              "bold": true
            },
            {
              "text": ": 실제 운영 중인 몰에서 "
            },
            {
              "text": "위젯이 뜨지 않는 상태가 29시간 30분 이어졌습니다.",
              "bold": true
            },
            {
              "text": " 인지한 날 원인을 특정해 복구했지만 그때까지 아무도 몰랐다는 점이 더 아팠습니다. 원인은 짐작으로 판정하지 않고 몰이 실제로 불러가는 주소, 토큰 발급 응답, 배포된 번들 내용물 셋을 실측해 서로 맞을 때만 결론을 냈습니다. 이후 실서비스 채널 반영은 수동 승인으로 되돌리고 되돌릴 때는 다시 빌드하는 대신 "
            },
            {
              "text": "검증이 끝난 CDN 스냅샷(",
              "bold": true
            },
            {
              "text": "/build-{N}/",
              "bold": true,
              "code": true
            },
            {
              "text": ")을 복사하는 방식",
              "bold": true
            },
            {
              "text": "으로 정리했습니다. 라이브 번들에 개발 호스트 주소가 기본값으로 남아 있던 것도 찾아 상수를 지우고 "
            },
            {
              "text": "apiUrl",
              "code": true
            },
            {
              "text": "을 필수 인자로 바꿨습니다."
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
          "text": "WebRTC 음성 상담과 인챗 커머스 액션"
        }
      ]
    },
    {
      "type": "paragraph",
      "text": [
        {
          "text": "고객사 페이지에서 실행되는 코드라 기능 확장도 리소스 회수와 격리 제약을 지키는 범위에서 구현했습니다. 정리되지 않은 타이머·미디어 스트림·전역 상태는 그대로 고객사 사이트의 버그가 됩니다."
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
              "text": "WebRTC 음성 에이전트",
              "bold": true
            },
            {
              "text": ": "
            },
            {
              "text": "getUserMedia",
              "code": true
            },
            {
              "text": " → "
            },
            {
              "text": "RTCPeerConnection",
              "code": true
            },
            {
              "text": " → DataChannel SDP 교환으로 OpenAI Realtime에 연결하고 지수 백오프 재연결과 페이지 리로드 후 자동 복구를 구현했습니다. "
            },
            {
              "text": "세션을 파기할 때 타이머와 미디어 스트림을 전부 회수",
              "bold": true
            },
            {
              "text": "해 호스트 페이지에 리소스를 남기지 않습니다. 2026-08-26 상용화 범위에서 빠져 현재는 인하우스 앱에만 코드가 남아 있습니다."
            }
          ]
        },
        {
          "text": [
            {
              "text": "인챗 커머스 액션",
              "bold": true
            },
            {
              "text": ": 대화 안에서 상품 탐색 → 옵션 선택 → 장바구니 담기까지 끝나는 UI를 만들고 프로모션 슬롯 엔진으로 몰별 노출 정책을 분리했으며 같은 발화가 반복되지 않도록 antiRepeat 로직을 뒀습니다. 장바구니는 호스트 몰의 기능이라 격리 경계를 넘지 않는 브리지로 연결했습니다."
            }
          ]
        },
        {
          "text": [
            {
              "text": "세대 교체를 흡수하는 어댑터 레이어",
              "bold": true
            },
            {
              "text": ": 백엔드 API 세대가 바뀔 때 호출부를 재작성하는 대신 응답 형상을 변환하는 "
            },
            {
              "text": "어댑터 레이어 413줄",
              "bold": true
            },
            {
              "text": "을 두어 계약 변경으로 생기는 오류를 한 곳에서 흡수하고 화면 코드는 수정 없이 유지했습니다."
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
              "text": "프로덕션 303파일 · 25,360 LOC · 단위 테스트 1,271건",
              "bold": true
            },
            {
              "text": ": 빌드 선행 조건이라 테스트가 깨지면 배포가 멈추고 타입 오류와 계층 위반은 0입니다"
            }
          ]
        },
        {
          "text": [
            {
              "text": "채널 리포 4종 → 모노레포 1개",
              "bold": true
            },
            {
              "text": ": 앱 3종과 공용 패키지 3종, 중복률 5.8%, 파일 순환 1건"
            }
          ]
        },
        {
          "text": [
            {
              "text": "CDN 4경로 단일 워크플로 발행",
              "bold": true
            },
            {
              "text": ": 영향 범위를 계산해 해당 채널만 발행, 버전 경로 3종으로 사후 변경 차단"
            }
          ]
        },
        {
          "text": [
            {
              "text": "카페24 유료앱 심사 통과",
              "bold": true
            },
            {
              "text": ": 무료앱 출시에서 7일 무료 체험·인앱 정기결제까지 한 사이클 완주"
            }
          ]
        },
        {
          "text": [
            {
              "text": "번들 gzip 196KB",
              "bold": true
            },
            {
              "text": ": 스프라이트 245KB에서 8.4KB, 초기 요청 2회에서 1회"
            }
          ]
        },
        {
          "text": [
            {
              "text": "실서비스 채널 수동 승인",
              "bold": true
            },
            {
              "text": ": 위젯 소실 장애 이후 검증된 스냅샷 승격만 허용"
            }
          ]
        },
        {
          "text": [
            {
              "text": "데모",
              "bold": true
            },
            {
              "text": ": "
            },
            {
              "text": "demo-fashion.voidx.ai",
              "href": "https://demo-fashion.voidx.ai"
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
          "text": "처음 다루는 배포 구조라 도구 선정부터 직접 결정했고 그 결정이 틀렸을 때는 건건이 대응하며 버티는 대신 전제를 뒤집었습니다. 모노레포 전환에서도 백엔드 통일을 기다리는 길과 프론트엔드가 번역하는 길을 비교해 되돌리는 비용이 싼 쪽을 골랐습니다. 규칙은 사람이 지키는 약속에서 파이프라인이 거르는 조건으로 옮겼고 장애를 겪은 뒤에는 편의를 줄이더라도 안전한 경로로 되돌리는 쪽을 택했습니다."
        }
      ]
    }
  ]
};

export default item;
