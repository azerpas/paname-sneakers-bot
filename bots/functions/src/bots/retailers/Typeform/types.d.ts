/**
 * A block is equal to a field in a typeform. i.e: asking for last name (the page and its attribute)
 */
export type Block = {ref: string, type: string, index?: number, questionIntent?: string, prefilled?: boolean, required?: boolean}

/**
 * Variant of the form
 * i.e: 
 * variant_id: 3
 * variant_label: out-of-experiment
 * test_id: sb-3671-inline-submit-flow
 */
export type Variant = {testId: string, label: string | boolean, id?: number}

export type SegmentProps = {
    segment: "identify" | "track", 
    event?: string, 
    variant?: Variant, 
    block?: Block, 
    traits?: boolean,
	required?: boolean
}

export type EventProps = {
	event?: string, 
	variants?: Variant[], 
	block?: Block
}

export type InsightEventProps = {
	previousFieldId?: string, 
	fieldId: string,
	type: "view-form-open" | "see"
}

export interface Form {
    id: string;
    type: string;
    title: string;
    workspace: Workspace;
    theme: Theme;
    settings: Settings;
    thankyou_screens?: (ThankyouScreensEntity)[] | null;
    welcome_screens?: (WelcomeScreensEntity)[] | null;
    fields?: (FieldsEntity)[] | null;
    _links: Links;
}
export interface Workspace {
    href: string;
}
export interface Theme {
    id: string;
    font: string;
    name: string;
    has_transparent_button: boolean;
    colors: Colors;
    visibility: string;
    screens: ScreensOrFields;
    fields: ScreensOrFields;
}
export interface Colors {
    question: string;
    answer: string;
    button: string;
    background: string;
}
export interface ScreensOrFields {
    font_size: string;
    alignment: string;
}
export interface Settings {
    language: string;
    progress_bar: string;
    meta: Meta;
    hide_navigation: boolean;
    is_public: boolean;
    is_trial: boolean;
    show_progress_bar: boolean;
    show_typeform_branding: boolean;
    are_uploads_public: boolean;
    show_time_to_complete: boolean;
}
export interface Meta {
    allow_indexing: boolean;
}
export interface ThankyouScreensEntity {
    id: string;
    ref: string;
    title: string;
    properties: Properties;
    attachment?: Attachment | null;
}
export interface Properties {
    show_button: boolean;
    share_icons: boolean;
    button_mode?: string | null;
    button_text?: string | null;
}
export interface Attachment {
    type: string;
    href: string;
    properties: AttachmentProperties;
}
export interface AttachmentProperties {
}
export interface WelcomeScreensEntity {
    id: string;
    ref: string;
    title: string;
    properties: WelcomeScreensProperties;
    attachment: Attachment;
}
export interface WelcomeScreensProperties {
    show_button: boolean;
    button_text: string;
    description: string;
}
export interface FieldsEntity {
    id: string;
    title: string;
    ref: string;
    properties: FieldsProperties;
    validations: Validations;
    type: string; // \"text\", \"email\", \"url\", \"file_name\", \"date\", \"choices\", \"boolean\", \"number\", \"phone_number\", \"payment\", \"ranking\""
}
export interface FieldsProperties {
    description?: string | null;
    randomize?: boolean | null;
    alphabetical_order?: boolean | null;
    choices?: (ChoicesEntity)[] | null;
}
export interface ChoicesEntity {
    id: string;
    ref: string;
    label: string;
}
export interface Validations {
    required: boolean;
}
export interface Links {
    display: string;
}
  
export interface TrackInfos {
    segmentKey: string;
    accountId: number;
    accountLimitName: string;
    userId: number;
}

export interface StartSubmit {
    signature: string;
    submission: Submission;
}
export interface Submission {
    response_id: string;
    type: string;
    form_id: string;
    landed_at: number;
    metadata: Metadata;
}
export interface Metadata {
    user_agent: string;
    platform: string;
    referer: string;
    network_id: string;
    ip: string;
    browser: string;
    client: string;
    id_type: string;
    source: string;
    medium: string;
    medium_version: string;
    embed_trigger_type: string;
}

export interface Intent {
    id: string;
    intent: string;
    score: number;
}
  