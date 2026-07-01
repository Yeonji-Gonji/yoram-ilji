/**
 * Notion의 Select, Status, Multi-Select에서 사용되는 옵션
 */
export interface NotionSelectOption {
  id: string;
  name: string;
  color: string;
}

/**
 * Notion의 Date 속성
 */
export interface NotionDate {
  start: string;
  end: string | null;
  time_zone: string | null;
}

/**
 * Notion의 RichText (Title 포함) 내부의 텍스트 어노테이션
 */
export interface NotionAnnotations {
  bold: boolean;
  italic: boolean;
  strikethrough: boolean;
  underline: boolean;
  code: boolean;
  color: string; // "default" 등
}

/**
 * Notion의 RichText 객체 (Title, RichText 타입에서 사용)
 */
export interface RichTextItem {
  type: 'text'; // "mention", "equation" 등도 가능
  text: {
    content: string;
    link: { url: string } | null;
  };
  annotations: NotionAnnotations;
  plain_text: string;
  href: string | null;
}

/**
 * Notion 사용자 객체
 */
export interface NotionUser {
  object: 'user';
  id: string;
}

/**
 * Notion 아이콘 객체 (예시의 "external" 타입 기준)
 * "emoji", "file" 타입도 존재할 수 있습니다.
 */
export interface NotionIcon {
  type: 'external';
  external: {
    url: string;
  };
}

/**
 * Notion Parent 객체 (예시 기준)
 */
export interface NotionParent {
  type: 'data_source_id'; // "database_id", "page_id" 등도 가능
  data_source_id: string;
  database_id: string;
}
/**
 * 모든 Notion 속성 객체의 기본 형태
 */
export interface NotionPropertyBase {
  id: string;
}

/**
 * "제목" 속성 (type: "title")
 */
export interface NotionTitleProperty extends NotionPropertyBase {
  type: 'title';
  title: RichTextItem[];
}

/**
 * "카테고리" 속성 (type: "select")
 */
export interface NotionSelectProperty extends NotionPropertyBase {
  type: 'select';
  select: NotionSelectOption | null;
}

/**
 * "날짜" 속성 (type: "date") — 글의 실제 발행일
 */
export interface NotionDateProperty extends NotionPropertyBase {
  type: 'date';
  date: NotionDate | null;
}

/**
 * "수정일" 속성 (type: "last_edited_time")
 */
export interface NotionUpdateDateProperty extends NotionPropertyBase {
  id: string;
  last_edited_time: string;
  type: 'last_edited_time';
}

/**
 * "생성일" 속성 (type: "created_time")
 */
export interface NotionCreateDateProperty extends NotionPropertyBase {
  id: string;
  created_time: string;
  type: 'created_time';
}

/**
 * "조회수" 속성 (type: "number")
 */
export interface NotionNumberProperty extends NotionPropertyBase {
  type: 'number';
  number: number | null;
}

/**
 * "발행" 속성 (type: "checkbox")
 */
export interface NotionCheckboxProperty extends NotionPropertyBase {
  type: 'checkbox';
  checkbox: boolean;
}

export interface MyDatabaseProperties {
  카테고리: NotionSelectProperty;
  날짜: NotionDateProperty;
  생성일: NotionCreateDateProperty;
  조회수: NotionNumberProperty;
  발행: NotionCheckboxProperty;
  이름: NotionTitleProperty;
}

/**
 * Notion 페이지 객체 (Page Object)
 */
export interface NotionPage {
  object: 'page';
  id: string;
  created_time: string; // ISO 8601 date string
  last_edited_time: string; // ISO 8601 date string
  created_by: NotionUser;
  last_edited_by: NotionUser;
  cover: any | null; // cover 예시가 없어 any로 처리
  icon: NotionIcon;
  parent: NotionParent;
  archived: boolean;
  in_trash: boolean;
  is_locked: boolean;
  properties: MyDatabaseProperties; // ★ 데이터베이스 스키마 적용
  url: string;
  public_url: string | null;
}

/**
 * Notion 데이터베이스 Query API의 최상위 응답 객체
 */
export interface NotionQueryResponse {
  object: 'list';
  results: NotionPage[]; // 페이지 객체의 배열
  next_cursor: string | null;
  has_more: boolean;
  type: 'page_or_data_source';
  page_or_data_source: object; // 또는 Record<string, unknown>
  request_id: string;
}
