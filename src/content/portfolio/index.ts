import type { PortfolioItem } from '@/types/portfolio.type';
import voidxPayment from './voidx-payment';
import voidxMainWeb from './voidx-main-web';
import voidxAddonSdk from './voidx-addon-sdk';
import booth3dWebapp from './booth-3d-webapp';
import kmaLms from './kma-lms';
import manil from './manil';
import doctorFriends from './doctor-friends';
import aresaFe from './aresa-fe';
import oneulSwim from './oneul-swim';
import playlistToMp3 from './playlist-to-mp3';
import helfit from './helfit';
import knockknock from './knockknock';
import ottogimall from './ottogimall';
import youandus from './youandus';
import anneklein from './anneklein';
import andbag from './andbag';

/**
 * 포트폴리오 정본. 배열 순서가 곧 노출 순서이고 상세 페이지의 이전·다음도 이 순서를 따릅니다.
 * 케이스를 추가하면 같은 폴더에 파일을 만들고 이 배열에 끼워 넣습니다.
 */
export const portfolioItems: PortfolioItem[] = [
  voidxPayment,
  voidxMainWeb,
  voidxAddonSdk,
  booth3dWebapp,
  kmaLms,
  manil,
  doctorFriends,
  aresaFe,
  oneulSwim,
  playlistToMp3,
  helfit,
  knockknock,
  ottogimall,
  youandus,
  anneklein,
  andbag,
];
