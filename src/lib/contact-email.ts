/**
 * 연락 폼(`/api/send-email`) 입력 검증과 메일 HTML 이스케이프.
 *
 * 서버 라우트와 클라이언트 폼(maxLength)이 같은 상한을 쓰도록 여기 한 곳에서 관리한다.
 * 서버 전용 의존성(nodemailer 등)을 import 하지 않는다(클라이언트 번들에 들어간다).
 */

/** 필드별 최대 글자 수. 이메일 254자는 SMTP 주소 길이 상한(RFC 5321). */
export const CONTACT_MAX_LENGTH = {
  name: 200,
  email: 254,
  subject: 200,
  message: 5000,
} as const;

export type ContactField = keyof typeof CONTACT_MAX_LENGTH;
export type ContactInput = Record<ContactField, string>;

const FIELD_LABEL: Record<ContactField, string> = {
  name: '이름은',
  email: '이메일은',
  subject: '제목은',
  message: '메시지는',
};

// 공백·@ 와 주소 목록 구분 문자(<>"(),;:[]\)를 막는다. replyTo 헤더에서 이름·다중 주소로 해석되지 않게 한다.
const EMAIL_PATTERN =
  /^[^\s@<>"(),;:[\]\\]+@[^\s@<>"(),;:[\]\\]+\.[^\s@<>"(),;:[\]\\]+$/;

const HTML_ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

/** HTML 본문·속성값에 넣을 문자열의 `&<>"'` 를 엔티티로 바꾼다. */
export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (ch) => HTML_ESCAPES[ch]);
}

/** 답장 버튼용 mailto 링크. 로컬·도메인 부분을 각각 인코딩해 `?cc=` 같은 파라미터 주입을 막는다. */
export function toMailtoHref(email: string): string {
  const at = email.lastIndexOf('@');
  return `mailto:${encodeURIComponent(email.slice(0, at))}@${encodeURIComponent(email.slice(at + 1))}`;
}

export type ContactValidation =
  { ok: true; input: ContactInput } | { ok: false; error: string };

/** 요청 본문(JSON 파싱 결과)을 검증한다. 실패 시 사용자에게 보여줄 메시지를 돌려준다. */
export function validateContactInput(body: unknown): ContactValidation {
  const fields = Object.keys(CONTACT_MAX_LENGTH) as ContactField[];
  const record = (
    typeof body === 'object' && body !== null ? body : {}
  ) as Partial<Record<ContactField, unknown>>;

  // 빈 값·누락·문자열이 아닌 값(객체·배열·숫자)은 모두 같은 안내로 거절한다.
  if (fields.some((f) => typeof record[f] !== 'string' || record[f] === '')) {
    return { ok: false, error: '모든 필드를 입력해주세요.' };
  }
  const input = record as ContactInput;

  for (const f of fields) {
    if (input[f].length > CONTACT_MAX_LENGTH[f]) {
      return {
        ok: false,
        error: `${FIELD_LABEL[f]} ${CONTACT_MAX_LENGTH[f]}자 이하로 입력해주세요.`,
      };
    }
  }

  if (!EMAIL_PATTERN.test(input.email)) {
    return { ok: false, error: '올바른 이메일 형식이 아닙니다.' };
  }

  return { ok: true, input };
}
