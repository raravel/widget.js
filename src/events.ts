// Reference: https://www.w3schools.com/tags/ref_eventattributes.asp

export type WindowEventAttribute =
	'afterprint'|'beforeprint'|'beforeunload'|'error'|
	'hashchange'|'offline'|'online'|'pagehide'|
	'pageshow'|'popstate'|'resize'|'storage'|
	'unload';

export type FormEventAttribute =
	'blur'|'change'|'contextmenu'|'focus'|
	'input'|'invalid'|'reset'|'search'|
	'select'|'submit';

export type KeyboardEventAttribute =
	'keydown'|'keypress'|'keyup';

export type MouseEventAttribute =
	'click'|'dblclick'|'mousedown'|'mousemove'|
	'mouseout'|'mouseover'|'mouseup'|'mousewheel'|
	'wheel';

export type DragEventAttribute =
	'drag'|'dragend'|'dragenter'|'dragleave'|
	'dragover'|'dragstart'|'drop'|'scroll';

export type ClipboardEventAttribute =
	'copy'|'cut'|'paste';

export type MediaEventAttribute =
	'abort'|'canplay'|'canplaythrough'|'cuechange'|
	'emptied'|'ended'|'error'|'loadeddata'|
	'loadedmetadata'|'loadstart'|'pause'|'play'|
	'playing'|'progress'|'ratechange'|'seeked'|
	'seeking'|'stalled'|'timeupdate'|'volumechange'|
	'waiting';

export type MiscEventAttribute =
	'toggle';

export type EventAttribute =
	MiscEventAttribute|MediaEventAttribute|
	ClipboardEventAttribute|DragEventAttribute|
	MouseEventAttribute|KeyboardEventAttribute|
	FormEventAttribute|WindowEventAttribute;

export type EventAttributeCallback = (...args: any[]) => void;
