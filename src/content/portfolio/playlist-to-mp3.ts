import type { PortfolioItem } from '@/types/portfolio.type';

const item: PortfolioItem = {
  "id": "playlist-to-mp3",
  "title": "Playlist → MP3",
  "subtitle": "유튜브 플레이리스트를 태그·앨범아트까지 담아 MP3로 저장하는 크로스 OS 데스크톱 앱",
  "description": "유튜브 플레이리스트(또는 단일 영상) URL을 넣으면 각 곡을 태그·앨범아트가 담긴 MP3로 저장하는 크로스 플랫폼(macOS·Windows·Linux) 데스크톱 앱입니다. 필요해서 직접 만들고 남들도 한 줄로 설치할 수 있게 다듬었습니다.",
  "category": "development",
  "period": "2026",
  "role": "기획 · 개발 (개인)",
  "skills": [
    "Python",
    "PySide6 (Qt)",
    "yt-dlp",
    "mutagen",
    "pyobjc",
    "uv",
    "PyInstaller"
  ],
  "metrics": [
    "기획 → 개발 → 배포 1인 풀사이클",
    "macOS·Windows·Linux 크로스 플랫폼",
    "워커 스레드 SIGSEGV 크래시 원인 규명·수정",
    "uv 원클릭 설치 스크립트 배포"
  ],
  "thumbnail": "/portfolio/playlist-to-mp3/cover.webp",
  "coverImage": "/portfolio/playlist-to-mp3/cover.webp",
  "coverWidth": 1600,
  "coverHeight": 900,
  "color": "#6b6864",
  "featured": false,
  "github": "https://github.com/MODAC0/playlist-to-mp3",
  "blocks": [
    {
      "type": "callout",
      "icon": "🎧",
      "text": [
        {
          "text": "웹이 아닌 "
        },
        {
          "text": "데스크톱 GUI",
          "bold": true
        },
        {
          "text": "를 Python·Qt로 만들고 macOS·Windows·Linux에 한 줄로 설치되는 배포까지 혼자 마무리한 개인 프로젝트입니다."
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
          "text": "개인적으로 필요해서 만든 도구입니다. 기존 도구들은 CLI뿐이거나 특정 OS만 지원하는 경우가 많았고 설치 과정에서 파이썬 환경을 직접 맞춰야 했습니다. "
        },
        {
          "text": "그래서 목표를 기능이 아니라 \"받아서 바로 쓰기\"에 두고",
          "bold": true
        },
        {
          "text": ", GUI와 패키징에 가장 많은 시간을 썼습니다. Python 약 1,000줄 규모의 단일 GUI 앱입니다."
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
              "text": "PySide6로 데스크톱 UI를 직접 설계",
              "bold": true
            },
            {
              "text": ": 라이트·다크를 시스템 설정에 따라 자동 전환하고 macOS에서는 신호등 버튼을 살린 프레임리스 글래스 창으로 네이티브 타이틀바와 통합되게 만들었습니다. 웹에서 다루던 디자인 기준을 데스크톱 환경으로 옮기는 작업이었습니다."
            }
          ]
        },
        {
          "text": [
            {
              "text": "앱이 불규칙하게 죽는 문제의 원인을 규명",
              "bold": true
            },
            {
              "text": ": 작업 도중 앱이 강제 종료됐습니다. 크래시 리포트 네 건이 모두 SIGSEGV였지만 죽는 위치가 매번 달라 원인을 좁히기 어려웠습니다. "
            },
            {
              "text": "리포트의 faulting thread가 워커 스레드인데 그 스택에 Qt 페인트 코드가 있는 것을 단서로",
              "bold": true
            },
            {
              "text": ", 진행률 시그널을 람다에 연결한 게 문제임을 확인했습니다. PySide6에서 시그널을 람다·일반 함수에 연결하면 큐잉 없이 워커 스레드에서 직접 실행돼 UI 위젯을 워커 스레드가 건드리게 됩니다. 시그널 슬롯을 전부 QObject 바운드 메서드로 바꿔 메인 스레드에서 실행되도록 고치자 재현이 사라졌습니다."
            }
          ]
        },
        {
          "text": [
            {
              "text": "설치까지를 제품으로 보고 패키징을 마무리",
              "bold": true
            },
            {
              "text": ": uv 기반 원클릭 설치 스크립트를 붙였습니다(macOS·Linux는 "
            },
            {
              "text": "curl | sh",
              "code": true
            },
            {
              "text": ", Windows는 PowerShell 한 줄). 외부 의존인 ffmpeg는 PATH에 있으면 그대로 쓰고 없으면 정적 빌드를 자동으로 받아 캐시에 두도록 해 사용자가 환경을 맞추지 않게 했습니다. macOS는 PyInstaller 번들도 지원합니다."
            }
          ]
        },
        {
          "text": [
            {
              "text": "장시간 작업을 다루는 스레드 구조",
              "bold": true
            },
            {
              "text": ": 작업을 별도 스레드에서 돌리고 진행률과 로그를 Qt 시그널로 UI에 전달하도록 분리했습니다. 처리한 항목은 아카이브 파일에 기록해 같은 입력을 다시 돌려도 중복 작업을 건너뛰고 결과 파일에는 mutagen으로 아티스트·제목·앨범아트를 임베드합니다."
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
              "text": "크로스 플랫폼",
              "bold": true
            },
            {
              "text": ": macOS·Windows·Linux 동작, uv 원클릭 설치 스크립트 배포"
            }
          ]
        },
        {
          "text": [
            {
              "text": "SIGSEGV 크래시 해결",
              "bold": true
            },
            {
              "text": ": 워커 스레드의 UI 접근을 원인으로 특정해 재현 제거"
            }
          ]
        },
        {
          "text": [
            {
              "text": "외부 의존 자동 해석",
              "bold": true
            },
            {
              "text": ": ffmpeg 없는 환경에서 정적 빌드 자동 확보·캐시"
            }
          ]
        },
        {
          "text": [
            {
              "text": "1인 풀사이클",
              "bold": true
            },
            {
              "text": ": 기획·구현·UI 디자인·배포 단독"
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
          "text": "웹 프론트엔드와 다른 환경에서도 같은 기준으로 만들 수 있는지 확인해 본 프로젝트입니다. 브라우저가 대신해 주던 것(렌더 스레드 관리, 의존성 설치, 새로고침)을 직접 다뤄야 했고 그 차이가 가장 큰 공부였습니다."
        }
      ]
    }
  ]
};

export default item;
