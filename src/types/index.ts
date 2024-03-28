export type ID = string;

export type Role = 'editor' | 'reader' | 'none' | 'read_and_write';

export type Color =
  | 'gray'
  | 'brown'
  | 'orange'
  | 'yellow'
  | 'teal'
  | 'blue'
  | 'purple'
  | 'pink'
  | 'red'
  | 'gray_background'
  | 'brown_background'
  | 'orange_background'
  | 'yellow_background'
  | 'teal_background'
  | 'blue_background'
  | 'purple_background'
  | 'pink_background'
  | 'red_background';

export type BoldFormat = ['b'];
export type ItalicFormat = ['i'];
export type StrikeFormat = ['s'];
export type CodeFormat = ['c'];
export type UnderlineFormat = ['_'];
export type LinkFormat = ['a', string];
export type ExternalObjectInstanceFormat = ['eoi', string];
export type ColorFormat = ['h', Color];
export type UserFormat = ['u', string];
export type PageFormat = ['p', string];
export type InlineEquationFormat = ['e', string];
export type DiscussionFormat = ['m', string];
export type ExternalLinkFormat = ['‣', [string, string]];
export type DateFormat = ['d', FormattedDate];

export interface FormattedDate {
  type: 'date' | 'daterange' | 'datetime' | 'datetimerange';
  start_date: string;
  start_time?: string;
  end_date?: string;
  end_time?: string;
  date_format?: string;
  time_zone?: string;
}

export type SubDecoration =
  | BoldFormat
  | ItalicFormat
  | StrikeFormat
  | CodeFormat
  | UnderlineFormat
  | LinkFormat
  | ColorFormat
  | DateFormat
  | UserFormat
  | InlineEquationFormat
  | PageFormat
  | ExternalLinkFormat
  | DiscussionFormat
  | ExternalObjectInstanceFormat;

export type BaseDecoration = [string];
export type AdditionalDecoration = [string, SubDecoration[]];

export type Decoration = BaseDecoration | AdditionalDecoration;

export type PropertyType =
  | 'title'
  | 'text'
  | 'number'
  | 'select'
  | 'status'
  | 'multi_select'
  | 'date'
  | 'person'
  | 'file'
  | 'checkbox'
  | 'url'
  | 'email'
  | 'phone_number'
  | 'formula'
  | 'relation'
  | 'created_time'
  | 'created_by'
  | 'last_edited_time'
  | 'last_edited_by';

/** Types of number formatting supported by Notion */
export type NumberFormat =
  | 'number_with_commas'
  | 'percent'
  | 'dollar'
  | 'euro'
  | 'pound'
  | 'yen'
  | 'rupee'
  | 'won'
  | 'yuan';

export type BlockType =
  | 'page'
  | 'text'
  | 'bookmark'
  | 'bulleted_list'
  | 'numbered_list'
  | 'header'
  | 'sub_header'
  | 'sub_sub_header'
  | 'quote'
  | 'equation'
  | 'to_do'
  | 'table_of_contents'
  | 'divider'
  | 'column_list'
  | 'column'
  | 'callout'
  | 'toggle'
  | 'image'
  | 'embed'
  | 'gist'
  | 'video'
  | 'figma'
  | 'typeform'
  | 'replit'
  | 'codepen'
  | 'excalidraw'
  | 'tweet'
  | 'maps'
  | 'pdf'
  | 'audio'
  | 'drive'
  | 'file'
  | 'code'
  | 'collection_view'
  | 'collection_view_page'
  | 'transclusion_container'
  | 'transclusion_reference'
  | 'alias'
  | 'table'
  | 'table_row'
  | 'external_object_instance'
  | 'breadcrumb'
  | 'miro'
  // fallback for unknown blocks
  | string;

/** The different block values a block can have. */
export type Block =
  | TextBlock
  | PageBlock
  | BulletedListBlock
  | NumberedListBlock
  | HeaderBlock
  | SubHeaderBlock
  | SubSubHeaderBlock
  | TodoBlock
  | TableOfContentsBlock
  | DividerBlock
  | ColumnListBlock
  | ColumnBlock
  | QuoteBlock
  | EquationBlock
  | CodeBlock
  | ImageBlock
  | VideoBlock
  | FigmaBlock
  | TypeformBlock
  | ReplitBlock
  | CodepenBlock
  | ExcalidrawBlock
  | TweetBlock
  | PdfBlock
  | MapsBlock
  | AudioBlock
  | GoogleDriveBlock
  | FileBlock
  | EmbedBlock
  | GistBlock
  | CalloutBlock
  | BookmarkBlock
  | ToggleBlock
  | CollectionViewBlock
  | CollectionViewPageBlock
  | SyncBlock
  | SyncPointerBlock
  | PageLink
  | TableBlock
  | TableRowBlock
  | ExternalObjectInstance
  | BreadcrumbInstance;

/**
 * Base properties shared by all blocks.
 */
export interface BaseBlock {
  id: ID;
  type: BlockType;
  properties?: any;
  format?: any;
  content?: ID[];

  space_id?: ID;
  parent_id: ID;
  parent_table: string | 'space' | 'block' | 'table';

  version: number;
  created_time: number;
  last_edited_time: number;
  alive: boolean;
  created_by_table: string;
  created_by_id: ID;
  last_edited_by_table: string;
  last_edited_by_id: ID;
}

export interface BaseTextBlock extends BaseBlock {
  // some text blocks occasionally have children
  content?: ID[];
  properties?: {
    title: Decoration[];
  };
  format?: {
    block_color: Color;
  };
}

export interface BaseContentBlock extends BaseBlock {
  properties: {
    source: string[][];
    caption?: Decoration[];
  };
  format?: {
    block_alignment: 'center' | 'left' | 'right';
    block_width: number;
    block_height: number;
    display_source: string;
    block_full_width: boolean;
    block_page_width: boolean;
    block_aspect_ratio: number;
    block_preserve_scale: boolean;
  };
  file_ids?: string[];
}

export interface BasePageBlock extends BaseBlock {
  properties?: {
    title: Decoration[];
  };
  format: {
    page_full_width?: boolean;
    page_small_text?: boolean;
    page_cover_position?: number;
    block_locked?: boolean;
    block_locked_by?: string;
    page_cover?: string;
    page_icon?: string;
    block_color?: Color;
  };
  permissions: { role: Role; type: string }[];
  file_ids?: string[];
}

export interface PageBlock extends BasePageBlock {
  type: 'page';
}

export interface BookmarkBlock extends BaseBlock {
  type: 'bookmark';
  properties: {
    link: Decoration[];
    title: Decoration[];
    description: Decoration[];
  };
  format: {
    block_color?: string;
    bookmark_icon: string;
    bookmark_cover: string;
  };
}

export interface TextBlock extends BaseTextBlock {
  type: 'text';
}

export interface BulletedListBlock extends BaseTextBlock {
  type: 'bulleted_list';
}

export interface NumberedListBlock extends BaseTextBlock {
  type: 'numbered_list';
}

export interface HeaderBlock extends BaseTextBlock {
  type: 'header';
  format?: {
    block_color: Color;
    toggleable?: boolean;
  };
}

export interface SubHeaderBlock extends BaseTextBlock {
  type: 'sub_header';
  format?: {
    block_color: Color;
    toggleable?: boolean;
  };
}

export interface SubSubHeaderBlock extends BaseTextBlock {
  type: 'sub_sub_header';
  format?: {
    block_color: Color;
    toggleable?: boolean;
  };
}

export interface QuoteBlock extends BaseTextBlock {
  type: 'quote';
}

export interface EquationBlock extends BaseTextBlock {
  type: 'equation';
}

// TODO
export interface TodoBlock extends BaseTextBlock {
  type: 'to_do';
  properties: {
    title: Decoration[];
    checked: (['Yes'] | ['No'])[];
  };
}

export interface TableOfContentsBlock extends BaseBlock {
  type: 'table_of_contents';
  format?: {
    block_color: Color;
  };
}

export interface DividerBlock extends BaseBlock {
  type: 'divider';
}

export interface ColumnListBlock extends BaseBlock {
  type: 'column_list';
}

export interface ColumnBlock extends BaseBlock {
  type: 'column';
  format: {
    column_ratio: number;
  };
}

export interface CalloutBlock extends BaseBlock {
  type: 'callout';
  format: {
    page_icon: string;
    block_color: Color;
  };
  properties: {
    title: Decoration[];
  };
}

export interface ToggleBlock extends BaseBlock {
  type: 'toggle';
  properties: {
    title: Decoration[];
  };
}

export interface ImageBlock extends BaseContentBlock {
  type: 'image';
}

export interface EmbedBlock extends BaseContentBlock {
  type: 'embed';
}

export interface GistBlock extends BaseContentBlock {
  type: 'gist';
}

export interface VideoBlock extends BaseContentBlock {
  type: 'video';
}

export interface FigmaBlock extends BaseContentBlock {
  type: 'figma';
}

export interface TypeformBlock extends BaseContentBlock {
  type: 'typeform';
}

export interface ReplitBlock extends BaseContentBlock {
  type: 'replit';
}

export interface CodepenBlock extends BaseContentBlock {
  type: 'codepen';
}

export interface ExcalidrawBlock extends BaseContentBlock {
  type: 'excalidraw';
}

export interface TweetBlock extends BaseContentBlock {
  type: 'tweet';
}

export interface MapsBlock extends BaseContentBlock {
  type: 'maps';
}

export interface PdfBlock extends BaseContentBlock {
  type: 'pdf';
}

export interface AudioBlock extends BaseContentBlock {
  type: 'audio';
}

export interface MiroBlock extends BaseContentBlock {
  type: 'miro';
}

export interface FileBlock extends BaseBlock {
  type: 'file';
  properties: {
    title: Decoration[];
    size: Decoration[];
    source: string[][];
  };
  file_ids?: string[];
}

export interface GoogleDriveBlock extends BaseContentBlock {
  type: 'drive';
  format: {
    drive_status: {
      authed: boolean;
      last_fetched: number;
    };
    drive_properties: {
      url: string;
      icon: string;
      title: string;
      file_id: string;
      trashed: boolean;
      version: string;
      thumbnail: string;
      user_name: string;
      modified_time: number;
    };
    block_alignment: 'center' | 'left' | 'right';
    block_width: number;
    block_height: number;
    display_source: string;
    block_full_width: boolean;
    block_page_width: boolean;
    block_aspect_ratio: number;
    block_preserve_scale: boolean;
  };
  file_ids?: string[];
}

export interface CodeBlock extends BaseBlock {
  type: 'code';
  properties: {
    title: Decoration[];
    language: Decoration[];
    caption: Decoration[];
  };
}

export interface CollectionViewBlock extends BaseContentBlock {
  type: 'collection_view';
  collection_id?: ID;
  view_ids: ID[];
  format?: BaseContentBlock['format'] & {
    collection_pointer?: {
      id: ID;
      spaceId: ID;
      table: string;
    };
  };
}

export interface CollectionViewPageBlock extends BasePageBlock {
  type: 'collection_view_page';
  collection_id?: ID;
  view_ids: ID[];
  format: BasePageBlock['format'] & {
    collection_pointer?: {
      id: ID;
      spaceId: ID;
      table: string;
    };
  };
}

export interface SyncBlock extends BaseBlock {
  type: 'transclusion_container';
}

export interface SyncPointerBlock extends BaseBlock {
  type: 'transclusion_reference';
  format: {
    copied_from_pointer: {
      id: string;
      spaceid: string;
    };
    transclusion_reference_pointer: {
      id: string;
      spaceId: string;
    };
  };
}

export interface PageLink extends BaseBlock {
  type: 'alias';
  format: {
    alias_pointer: {
      id: string;
    };
  };
}

export interface TableBlock extends BaseBlock {
  type: 'table';
  collection_id: ID;
  format: {
    collection_pointer: {
      id: ID;
      table: string;
      spaceId: ID;
    };
    table_block_column_format?: {
      [column: string]: { width?: number; color?: Color };
    };
    table_block_column_header: boolean;
    table_block_column_order: string[];
  };
  view_ids: ID[];
}

export interface TableRowBlock extends BaseBlock {
  type: 'table_row';
  properties: {
    [column: string]: Decoration[];
  };
}

export interface ExternalObjectInstance extends BaseBlock {
  type: 'external_object_instance';
  format: {
    domain: string;
    original_url: string;
  };
}

export interface BreadcrumbInstance extends BaseBlock {
  type: 'breadcrumb';
}

export type PropertyID = string;

export interface User {
  id: ID;
  version: number;
  email: string;
  given_name: string;
  family_name: string;
  profile_photo: string;
  onboarding_completed: boolean;
  mobile_onboarding_completed: boolean;
}

export interface SelectOption {
  id: ID;
  color: Color;
  value: string;
}

export interface CollectionPropertySchema {
  name: string;
  type: PropertyType;
  options?: SelectOption[];
  number_format?: NumberFormat;
  formula?: Formula;
}

export interface CollectionPropertySchemaMap {
  [key: string]: CollectionPropertySchema;
}

export interface Collection {
  id: ID;
  version: number;
  name: Decoration[];
  schema: CollectionPropertySchemaMap;
  icon: string;
  parent_id: ID;
  parent_table: string;
  alive: boolean;
  copied_from: string;
  template_pages?: Array<ID>;

  format?: {
    collection_page_properties?: Array<{
      property: PropertyID;
      visible: boolean;
    }>;
    property_visibility?: Array<{
      property: PropertyID;
      visibility: 'show' | 'hide';
    }>;
    hide_linked_collection_name?: boolean;
  };
}

export type FormulaType =
  | 'constant'
  | 'property'
  | 'operator'
  | 'function'
  | 'symbol';

export type FormulaConstantType = 'e' | 'false' | 'true' | 'pi';

export type FormulaValueType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'date'
  | FormulaConstantType;

export type FormulaResult = string | number | boolean | Date;
export type FormulaResultType =
  | 'text'
  | 'number'
  | 'boolean'
  | 'date'
  | 'checkbox';

export type FormulaOperatorType =
  // arithmetic
  | '-'
  | '*'
  | '%'
  | '/'
  | '+'

  // comparison
  | '!='
  | '<='
  | '=='
  | '>'
  | '<'
  | '>=';

export type FormulaFunctionType =
  // logic
  | 'and'
  | 'empty'
  | 'equal'
  | 'if'
  | 'larger'
  | 'largerEq'
  | 'not'
  | 'or'
  | 'smaller'
  | 'smallerEq'
  | 'unequal'

  // numeric
  | 'abs'
  | 'add'
  | 'cbrt'
  | 'ceil'
  | 'divide'
  | 'exp'
  | 'floor'
  | 'ln'
  | 'log10'
  | 'log2'
  | 'max'
  | 'min'
  | 'mod'
  | 'multiply'
  | 'pow'
  | 'round'
  | 'sign'
  | 'sqrt'
  | 'subtract'
  | 'toNumber'
  | 'unaryMinus'
  | 'unaryPlus'

  // text
  | 'concat'
  | 'contains'
  | 'format'
  | 'join'
  | 'length'
  | 'replace'
  | 'replaceAll'
  | 'slice'
  | 'test'

  // date & time
  | 'date'
  | 'dateAdd'
  | 'dateBetween'
  | 'dateSubtract'
  | 'day'
  | 'end'
  | 'formatDate'
  | 'fromTimestamp'
  | 'hour'
  | 'minute'
  | 'month'
  | 'now'
  | 'start'
  | 'timestamp'
  | 'year';

export interface BaseFormula {
  type: FormulaType;
  result_type: FormulaResultType;
}

export interface ConstantFormula extends BaseFormula {
  type: 'constant';
  value: any; // TODO
  value_type: FormulaValueType;
}

export interface PropertyFormula extends BaseFormula {
  type: 'property';
  id: PropertyID;
  name: string;
}

export interface SymbolFormula extends BaseFormula {
  type: 'symbol';
  name: string;
}

export interface FunctionFormula extends BaseFormula {
  type: 'function';
  name: FormulaFunctionType;
  args: Array<Formula>;
}

export interface OperatorFormula extends BaseFormula {
  type: 'operator';
  operator: FormulaOperatorType;
  name: FormulaFunctionType;
  args: Array<Formula>;
}

export type Formula =
  | FunctionFormula
  | OperatorFormula
  | ConstantFormula
  | PropertyFormula
  | SymbolFormula;

export type CollectionViewType =
  | 'table'
  | 'gallery'
  | 'list'
  | 'board'
  | 'calendar';

export type CollectionCardCoverType =
  | 'page_cover'
  | 'page_content'
  | 'property'
  | 'none'
  | 'file';

export type CollectionCardCoverSize = 'small' | 'medium' | 'large';
export type CollectionCardCoverAspect = 'cover' | 'contain';

export interface BaseCollectionView {
  id: ID;
  type: CollectionViewType;
  name: string;
  format: any;

  version: number;
  alive: boolean;
  parent_id: ID;
  parent_table: string;

  query?: any;

  query2: {
    // TODO
    filter?: any;
    aggregations?: object[];
    group_by: PropertyID;
  };
}

export interface TableCollectionView extends BaseCollectionView {
  type: 'table';
  format: {
    table_wrap: boolean;
    table_properties: Array<{
      property: PropertyID;
      visible: boolean;
      width: number;
    }>;
  };
  page_sort: ID[];
}

export interface GalleryCollectionView extends BaseCollectionView {
  type: 'gallery';
  format: {
    gallery_cover: CollectionCardCover;
    gallery_cover_size: CollectionCardCoverSize;
    gallery_cover_aspect: CollectionCardCoverAspect;

    gallery_properties: Array<{
      property: PropertyID;
      visible: boolean;
    }>;
  };
}

export interface ListCollectionView extends BaseCollectionView {
  type: 'list';
  format: {
    list_properties: Array<{
      property: PropertyID;
      visible: boolean;
    }>;
  };
}

export interface CollectionCardCover {
  type: CollectionCardCoverType;
  property?: PropertyID;
}

export interface BoardCollectionView extends BaseCollectionView {
  type: 'board';
  format: {
    board_cover: CollectionCardCover;
    board_cover_size: CollectionCardCoverSize;
    board_cover_aspect: CollectionCardCoverAspect;

    board_properties: Array<{
      property: PropertyID;
      visible: boolean;
    }>;

    board_groups2: Array<{
      property: PropertyID;
      hidden: boolean;
      value: {
        type: PropertyType;
        value: string;

        // TODO: needs testing for more cases
      };
    }>;

    board_columns: Array<{
      property: PropertyID;
      hidden: boolean;
      value: {
        type: PropertyType;
        value: string;

        // TODO: needs testing for more cases
      };
    }>;
  };
}

export interface CalendarCollectionView extends BaseCollectionView {
  type: 'calendar';

  // TODO
}

export type CollectionView =
  | TableCollectionView
  | GalleryCollectionView
  | ListCollectionView
  | BoardCollectionView
  | CalendarCollectionView;

export interface NotionMap<T> {
  [key: string]: {
    role: Role;
    value: T;
  };
}

export type BlockMap = NotionMap<Block>;
export type UserMap = NotionMap<User>;
export type CollectionMap = NotionMap<Collection>;
export type CollectionViewMap = NotionMap<CollectionView>;

export interface RecordMap {
  block: BlockMap;
  collection?: CollectionMap;
  collection_view?: CollectionViewMap;
  notion_user?: UserMap;
}

export interface PreviewImage {
  originalWidth: number;
  originalHeight: number;
  dataURIBase64: string;
}

export interface PreviewImageMap {
  [url: string]: PreviewImage | null;
}

export interface CollectionQueryResult {
  type: CollectionViewType;
  total: number;

  blockIds: ID[];
  aggregationResults: Array<AggregationResult>;

  // only used for board collection views
  groupResults?: Array<{
    value: AggregationResult;
    blockIds: ID[];
    total: number;
    aggregationResult: AggregationResult;
  }>;

  collection_group_results?: {
    type: string;
    blockIds: ID[];
    hasMore: boolean;
  };
}

export interface AggregationResult {
  type: PropertyType;
  value: any;
}

export interface ExtendedRecordMap extends RecordMap {
  collection: CollectionMap;
  collection_view: CollectionViewMap;
  notion_user: UserMap;
  collection_query: {
    [collectionId: string]: {
      [collectionViewId: string]: CollectionQueryResult;
    };
  };
  signed_urls: {
    [blockId: string]: string;
  };
  preview_images?: PreviewImageMap;
}

export interface TableOfContentsEntry {
  id: ID;
  type: BlockType;
  text: string;
  indentLevel: number;
}
