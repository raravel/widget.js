import { ElementGenerator, ElementExtends } from './element';

export interface IBaseElement {
	accesskey: string;
	class: string;
	contenteditable: string;
	dir: string;
	draggable: string;
	hidden: string;
	id: string;
	lang: string;
	spellcheck: string;
	style: string;
	tabindex: string;
	title: string;
	translate: string;
}

export const BaseElement = ElementGenerator<IBaseElement>({
	tag: '',
	attr: {
		accesskey: {
			default: '',
		},
		class: {
			default: '',
		},
		contenteditable: {
			default: '',
		},
		dir: {
			default: '',
		},
		draggable: {
			default: '',
		},
		hidden: {
			default: '',
		},
		id: {
			default: '',
		},
		lang: {
			default: '',
		},
		spellcheck: {
			default: '',
		},
		style: {
			default: '',
		},
		tabindex: {
			default: '',
		},
		title: {
			default: '',
		},
		translate: {
			default: '',
		},
	},
	event: [],
	methods: {},
});

export interface IAtag {
	href: string;
	hreflang: string;
	download: string;
	ping: string;
	media: string;
	rel: string;
	referrerpolicy: string;
	target: string;
	type: string;
}

export const Text = ElementExtends(BaseElement, {
	tag: 'text',
});

export const A = ElementExtends<IAtag>(BaseElement, {
	tag: 'a',
	attr: {
		href: { default: '' },
		hreflang: { default: '' },
		download: { default: '' },
		ping: { default: '' },
		media: { default: '' },
		rel: { default: '' },
		referrerpolicy: { default: '' },
		target: { default: '' },
		type: { default: '' },
	},
});

export const Div = ElementExtends(BaseElement, {
	tag: 'div',
});

export const H1 = ElementExtends(BaseElement, {
	tag: 'h1',
});
