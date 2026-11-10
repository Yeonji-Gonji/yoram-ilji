import type { PortfolioItem } from '@/types/portfolio.type';

const item: PortfolioItem = {
  "id": "anneklein",
  "title": "ANNE KLEIN Promotion",
  "subtitle": "앤클라인 프로모션 페이지 디자인",
  "description": "2021 시즌 룩북 촬영 현장을 보조하고, 선별한 컷으로 프로모션 페이지를 디자인했습니다.",
  "category": "design",
  "period": "2021",
  "role": "웹 디자인",
  "skills": [
    "Figma",
    "Adobe Photoshop"
  ],
  "type": "Promotion Design",
  "metrics": [],
  "thumbnail": "/portfolio/anneklein/cover.webp",
  "coverImage": "/portfolio/anneklein/cover.webp",
  "coverWidth": 1600,
  "coverHeight": 754,
  "color": "#6b6864",
  "featured": false,
  "blocks": [
    {
      "type": "paragraph",
      "text": [
        {
          "text": "룩북 촬영 현장을 보조하며 얻은 감각을 살려, 시즌 무드와 셀링 포인트가 한눈에 들어오도록 컷을 선별·배치했습니다."
        }
      ]
    },
    {
      "type": "callout",
      "icon": "🖼️",
      "text": [
        {
          "text": "아래는 주요 작업 화면입니다."
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
      "src": "/portfolio/anneklein/01.webp",
      "width": 1600,
      "height": 2997
    },
    {
      "type": "image",
      "src": "/portfolio/anneklein/02.webp",
      "width": 1600,
      "height": 3080
    },
    {
      "type": "image",
      "src": "/portfolio/anneklein/03.webp",
      "width": 1600,
      "height": 3081
    }
  ]
};

export default item;
