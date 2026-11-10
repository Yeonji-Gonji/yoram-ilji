import type { PortfolioItem } from '@/types/portfolio.type';

const item: PortfolioItem = {
  "id": "voidx-addon-sdk",
  "title": "임베드형 AI 에이전트 SDK",
  "subtitle": "임베드 SDK: 고객사 환경 격리와 릴리즈 자동화",
  "description": "AI 챗봇을 script 한 줄로 임베드하는 SDK입니다. 프레임워크·전역 CSS·업데이트 시점을 통제할 수 없는 고객사 사이트에서 충돌 없이 실행되어야 하고, 잘못된 빌드가 배포되면 안 됩니다. 이 제약을 UMD standalone · closed Shadow DOM · self-init의 3중 격리와 불변 버전 릴리즈 파이프라인으로 해결했습니다. 카페24 판은 3개월간 PM을 겸해 스토어 출시까지 완료했고, 챗봇 서버는 별도 담당자 소관입니다.",
  "category": "development",
  "period": "2025.10 - 운영 중",
  "role": "SDK 단독 개발 · 모노레포 전환 주도 · 카페24 판 PM 겸임 3개월",
  "team": "주식회사 업폴 (Upfall)",
  "skills": [
    "React 19",
    "Vite (UMD standalone)",
    "Shadow DOM",
    "WebRTC",
    "GitHub Actions",
    "Vitest",
    "pnpm",
    "CDN"
  ],
  "metrics": [
    "채널 리포 4종 → 단일 모노레포 (앱 3 · 공용 패키지 3)",
    "프로덕션 303파일 · 25,360 LOC",
    "단위 테스트 1,271건 (빌드 게이트) · 계층 위반 0",
    "이기종 백엔드 3종의 스트림 어휘를 어댑터 2계보로 번역",
    "PR마다 실제 브라우저 스모크",
    "버전 경로 3종 자동 발행 (/latest/ · /v{semver}/ · /build-{N}/)",
    "실운영 쇼핑몰 동작 검증",
    "카페24 무료앱 출시 후 유료앱 심사 통과 (인앱 정기결제)",
    "번들 gzip 196KB",
    "스프라이트 245KB → 8.4KB",
    "초기 요청 2회 → 1회",
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
      "icon": "🧩",
      "text": [
        {
          "text": "서드파티 임베드 SDK는 호스트 환경에서 충돌 없이 가볍게 동작하는 것이 기능 구현보다 우선입니다. 호환을 \"맞추는\" 대신 충돌 자체가 불가능한 구조로 바꾸고, 배포는 사람이 아니라 파이프라인이 검사하게 했습니다."
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
          "text": "호환을 맞추는 대신 충돌이 불가능한 구조로 바꿨습니다. 번들 내장, closed Shadow DOM, self-init 세 겹의 격리와, 푸시 한 번으로 끝나고 발행된 버전은 사후에 바뀌지 않는 무인 릴리즈, 두 가지입니다."
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
              "text": ": SDK 코드 전체(단독). 3중 격리 아키텍처, 무인 릴리즈 파이프라인, WebRTC 음성, 커머스 액션, v2→v1 어댑터"
            }
          ]
        },
        {
          "text": [
            {
              "text": "전체 구조 이해·조율",
              "bold": true
            },
            {
              "text": ": 카페24 앱 심사·PG 심사 창구(PM 겸임 3개월), 인증 헤더 불일치(401)를 가짜 토큰 호출로 실측해 백엔드 가드 원인으로 특정, 채널·백엔드 2축 발행 구조 운영"
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
              "text": ": 챗 백엔드·토큰 발급 API, 카페24 연동 백엔드, PG 심사 자료, 온보딩 화면 일부(동료)"
            }
          ]
        },
        {
          "text": [
            {
              "text": "하지 않은 것·설계안(미구현)",
              "bold": true
            },
            {
              "text": ": SDK 원격 오류 수집이 없어 오류가 고객사 콘솔에만 남습니다. 격리 경계 안에서 오류를 배치 전송하는 리포터가 다음 단계입니다."
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
          "text": "AI 챗봇을 script 한 줄로 고객사 사이트에 임베드하는 SDK입니다. 고객사는 React든 Vue든 순수 HTML이든 무엇이든 쓸 수 있고, 전역 CSS와 업데이트 시점도 우리가 통제할 수 없습니다. 임베드 코드라 세 가지가 전제입니다. 호스트의 React·라이브러리와 충돌하면 안 되고, 외부에서 불러오므로 가벼워야 하며, 여러 고객사에 동시 배포되므로 배포가 안전하고 자동이어야 합니다. "
        },
        {
          "text": "SDK 개발은 단독으로 맡았고, 카페24 판은 3개월간 PM을 겸해 요구사항 정의부터 플랫폼 심사·PG 심사 창구까지 담당했습니다.",
          "bold": true
        },
        {
          "text": " 챗봇 서버(LLM·대화 엔진) 구현은 별도 담당자 소관입니다. 17.9k LOC 단일 리포로 시작해, 채널마다 갈라져 있던 위젯 리포 4종을 모노레포 하나로 합친 뒤에는 프로덕션 303파일 25,360 LOC에 단위 테스트 1,271건이 빌드 선행 조건입니다."
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
              "text": "내 선택을 뒤집어 충돌의 원인을 제거",
              "bold": true
            },
            {
              "text": ": 처음엔 NPM 패키지로 배포했는데 호스트 React 버전과 충돌했습니다. 고객사에 React 버전을 맞춰달라고 요구하면 그 조건을 못 맞추는 고객사만큼 도입 범위가 줄어듭니다. 충돌을 개별 대응하는 대신 "
            },
            {
              "text": "CDN standalone 번들로 갈아엎어 버전 의존 자체를 끊었습니다.",
              "bold": true
            },
            {
              "text": " 내 판단이 전제부터 틀렸다는 걸 인정하는 게 먼저였습니다."
            }
          ]
        },
        {
          "text": [
            {
              "text": "3중 격리 아키텍처: UMD standalone · closed Shadow DOM · self-init",
              "bold": true
            },
            {
              "text": ": UMD standalone 번들은 React를 externals로 빼지 않고 통째로 포함하고 "
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
              "text": "입니다. 외부 스크립트가 shadowRoot에 접근할 수 없는 closed Shadow DOM 안에 React를 마운트하고, 스타일은 CSS를 문자열로 임포트해 shadow 내부에만 주입하며 호스트 CSS 상속은 "
            },
            {
              "text": "initial",
              "code": true
            },
            {
              "text": " 리셋으로 차단했습니다. 카페24 ScriptTags API는 script src 태그 한 줄만 주입할 수 있어 init 코드를 실행할 자리가 없는데, 스크립트가 "
            },
            {
              "text": "document.currentScript.src",
              "code": true
            },
            {
              "text": "의 쿼리스트링에서 토큰·몰 ID를 스스로 읽어 초기화하는 "
            },
            {
              "text": "self-init 부트스트랩",
              "bold": true
            },
            {
              "text": "으로 해결했습니다. 격리의 대가로 DOM 조회로는 렌더 여부를 확인할 수 없게 돼서, 렌더 검증은 스크린샷으로만 판정한다는 절차를 런북에 명시했습니다."
            }
          ]
        },
        {
          "text": [
            {
              "text": "테스트가 깨지면 빌드가 불가능한 무인 릴리즈 파이프라인",
              "bold": true
            },
            {
              "text": ": Jenkins에서 GitHub Actions로 옮기고 패키지 매니저를 pnpm으로 통일했습니다. 빌드 스크립트 자체가 "
            },
            {
              "text": "vitest run → tsc → vite build",
              "code": true
            },
            {
              "text": " 순서라 "
            },
            {
              "text": "테스트가 깨지면 빌드가 불가능한 구조",
              "bold": true
            },
            {
              "text": "입니다. 번들 내용 가드 2종을 두어, 신규 API 클라이언트 마커가 번들에 없으면 실패하고 개발용 목(mock) 코드가 프로덕션 번들에 포함되면 실패합니다. Conventional Commits 메시지로 semver 단계를 자동 판정("
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
              "text": "→patch)하고 CHANGELOG 갱신과 릴리즈 커밋까지 자동화했으며, 릴리즈 커밋은 빌드와 가드를 전부 통과한 뒤에만 생성됩니다."
            }
          ]
        },
        {
          "text": [
            {
              "text": "CDN 3경로 발행으로 발행된 버전의 사후 변경을 차단",
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
              "text": "(재현·롤백용) 세 경로를 동시에 발행하고 동시 실행 충돌을 막았습니다. 버전을 올리지 않은 푸시는 불변 핀을 건드리지 않아, "
            },
            {
              "text": "이미 발행된 버전이 나중에 바뀌는 사고를 구조적으로 차단",
              "bold": true
            },
            {
              "text": "했습니다. 카페24 Lite 판은 같은 파이프라인을 개발·운영 CDN 분리와 롤백 워크플로까지 확장해 재사용했습니다."
            }
          ]
        },
        {
          "text": [
            {
              "text": "번들과 에셋 축소",
              "bold": true
            },
            {
              "text": ": 최적화 지점은 도구로 진단하되 무엇을 적용할지는 직접 판단했습니다. standalone 번들 gzip 196KB, 도트아트 스프라이트 245KB에서 8.4KB, 매니페스트 의존 제거로 초기 요청 2회에서 1회입니다."
            }
          ]
        },
        {
          "text": [
            {
              "text": "실서비스 몰에서 위젯이 사라진 장애와 재발 방지",
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
              "text": " 인지한 날 원인을 특정해 복구했지만, 그때까지 아무도 몰랐다는 게 더 문제였습니다. 원인은 짐작으로 판정하지 않고 몰이 실제로 불러가는 주소, 토큰 발급 응답, 배포된 번들 내용물 세 가지를 실측해 서로 맞을 때만 결론을 내렸습니다. 이후 실서비스 채널 반영은 수동 승인으로 되돌리고, 되돌릴 때는 다시 빌드하는 대신 "
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
              "text": "으로 정리했습니다. 계약 계층이 v1·목업·v2 세 갈래로 갈려 있던 것도 v2 단일로 정리하고, 정리 전후 배포 산출물이 바이트 단위로 같은지 대조했습니다. 라이브 번들에 개발 호스트 주소가 기본값으로 남아 있던 것도 찾아 상수를 제거하고 "
            },
            {
              "text": "apiUrl",
              "code": true
            },
            {
              "text": "을 필수 인자로 바꿨습니다."
            }
          ]
        },
        {
          "text": [
            {
              "text": "기능 확장: WebRTC 음성 · 커머스 액션 · 어댑터 레이어",
              "bold": true
            },
            {
              "text": ": 고객사 페이지에서 실행되는 코드라, 음성·커머스 같은 기능 확장도 리소스 회수와 격리 제약을 지키는 범위에서 구현했습니다. 음성 에이전트는 "
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
              "text": " → DataChannel SDP 교환으로 OpenAI Realtime에 연결하고, 지수 백오프 재연결과 페이지 리로드 후 자동 복구를 구현했습니다. "
            },
            {
              "text": "세션 파기 시 타이머·미디어 스트림을 전부 회수",
              "bold": true
            },
            {
              "text": "해 호스트 페이지에 리소스 누수를 남기지 않습니다. 챗 대화 안에서 상품 탐색 → 옵션 선택 → 장바구니 담기까지 완결되는 커머스 액션 UI를 만들고, 프로모션 슬롯 엔진으로 몰별 노출 정책을 분리하고 같은 발화가 반복되지 않도록 antiRepeat 로직을 뒀습니다. 백엔드 API 세대 교체 때는 호출부를 재작성하는 대신 "
            },
            {
              "text": "응답 형상을 변환하는 어댑터 레이어(413줄)",
              "bold": true
            },
            {
              "text": "를 두어, 계약 변경으로 생기는 오류를 한 곳에서 흡수하고 화면 코드는 수정 없이 유지했습니다."
            }
          ]
        },
        {
          "text": [
            {
              "text": "채널마다 갈라진 위젯 리포 4종을 모노레포 하나로 합침",
              "bold": true
            },
            {
              "text": ": 인하우스·카페24·쇼피파이가 리포를 따로 두면서 같은 기능이 채널 수만큼 따로 구현되고 있었습니다. 트리거 스택 하나가 채널별로 2,662줄·768줄·90줄, 즉 같은 개념의 서로 다른 완성도 세 벌이었습니다. 순서를 셋으로 잡았습니다. 먼저 백엔드 3종(Go 1계열·Node.js 2계열)의 스트림 종료 어휘가 서로 달라 공용 패키지를 만들 수 없었는데, 백엔드에 통일을 요청해 프론트 일정을 묶는 대신 "
            },
            {
              "text": "프론트엔드 어댑터 2계보가 번역하는 쪽",
              "bold": true
            },
            {
              "text": "으로 방향을 바꿨습니다(어댑터 테스트 48건). 다음으로 계층을 API·변환·표현·배포 넷으로 나누되 디렉터리가 아니라 의존 방향과 금지 사항으로 정의하고, 채널 차이는 어댑터·옵션·주입값 세 수단으로만 표현하게 했습니다. 마지막으로 공용 패키지 한 줄 수정이 모든 채널로 나가므로, 변경의 영향 범위를 계산해 CDN 4경로에 순서대로 발행하는 단일 워크플로로 묶었습니다. PR마다 실제 브라우저로 위젯을 띄워 콘솔 오류와 외부 요청이 없는지도 확인합니다."
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
              "text": "단위 테스트 1,271건 · 프로덕션 303파일 25,360 LOC",
              "bold": true
            },
            {
              "text": ": 빌드 선행 조건이라 테스트가 깨지면 배포가 불가능하고, 계층 위반은 0입니다"
            }
          ]
        },
        {
          "text": [
            {
              "text": "CDN 3경로 자동 발행",
              "bold": true
            },
            {
              "text": ": /latest/ · /v{semver}/ · /build-{N}/, 발행된 버전의 사후 변경 차단"
            }
          ]
        },
        {
          "text": [
            {
              "text": "실운영 쇼핑몰 동작 검증",
              "bold": true
            },
            {
              "text": ": 프레임워크 충돌 없이 동작, 카페24 앱으로 선출시"
            }
          ]
        },
        {
          "text": [
            {
              "text": "196KB",
              "bold": true
            },
            {
              "text": ": standalone 번들 (gzip) · 스프라이트 245KB → 8.4KB · 초기 요청 2회 → 1회"
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
              "href": "http://demo-fashion.voidx.ai/"
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
          "text": "처음 다루는 배포 구조라 도구 선정부터 직접 결정했고, 그 결정이 틀렸을 때 개별 대응으로 버티는 대신 전제를 뒤집었습니다. 임베드 SDK의 기능 확장은 일반 웹앱과 기준이 다릅니다. 고객사 페이지에서 실행되므로 정리되지 않은 타이머·미디어 스트림·전역 상태가 그대로 고객사 사이트의 버그가 됩니다. 음성처럼 무거운 기능도 같은 격리 제약 아래에서 세션 종료 시 모든 리소스를 회수하도록 설계했고, 장애를 겪은 뒤에는 편의를 줄이더라도 안전한 경로로 되돌리는 쪽을 택했습니다."
        }
      ]
    }
  ]
};

export default item;
