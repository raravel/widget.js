import { EventAttribute, EventAttributeCallback } from './events';
import { State } from './state';

let increment = 0;

const cyrb53 = function(str, seed = 0) {
	let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
	for (let i = 0, ch; i < str.length; i++) {
		ch = str.charCodeAt(i);
		h1 = Math.imul(h1 ^ ch, 2654435761);
		h2 = Math.imul(h2 ^ ch, 1597334677);
	}
	h1 = Math.imul(h1 ^ h1>>>16, 2246822507) ^ Math.imul(h2 ^ h2>>>13, 3266489909);
	h2 = Math.imul(h2 ^ h2>>>16, 2246822507) ^ Math.imul(h1 ^ h1>>>13, 3266489909);
	return 4294967296 * (2097151 & h2) + (h1>>>0);
};

type WidgetEventOption = {
	[K in EventAttribute as `$${K}`]?: EventAttributeCallback
}

type WidgetAnotherOption = {
	child?: Widget,
	children?: Widget[],
};

export type WidgetOption = WidgetAnotherOption & WidgetEventOption & {
	style?: string
};

export abstract class Widget {

	public options;
	public parent!: Widget;
	public $el!: Node;
	public tag = '';

	private _id: number;
	protected _children: Widget[] = [];
	public _widget!: Widget;

	constructor(options: WidgetOption) {
		this._id = cyrb53(this.tag + Date.now(), increment++);
		if ( increment >= 1 << 13 ) {
			increment = 0;
		}
		//this.options = new State<WidgetOption>(options);
		this.options = options;
	}

	public chaning(context: Widget|null) {
		if ( context ) {
			this.parent = context;
		}

		this._children = [];

		if ( this.options.child ) {
			const widget = this.options.child.chaning(this) as Widget;
			widget.parent = this;
			this._children.push(widget);
		} else if ( Array.isArray(this.options.children) ) {
			this._children = this.options.children.map((child) => {
				const widget = child.chaning(this);
				widget.parent = this;
				return widget;
			});
		} else {
			const widget = this.build(context);
			if ( widget._id !== this._id ) {
				widget.chaning(this);
				widget.parent = this;
				this._children.push(widget);
			}
		}

		return this;
	}

	abstract build(context: Widget|null);

	public mounted() {
		/* empty */
	}

	public willUnmount() {
		/* empty */
	}

	public builder(): Node {

		this.$el = document.createElement(this.tag || 'div');
		//for (const [key, value] of Object.entries(this.options.state)) {
		for (const [key, value] of Object.entries(this.options)) {
			if (key.startsWith('$')) {
				this.$el.addEventListener(key.replace('$', ''), value as EventAttributeCallback);
			} else {
				if (key !== 'child' && key !== 'children') {
					(this.$el as HTMLElement).setAttribute(key, value as string);
				}
			}
		}

		if ( this.parent ) {
			this.parent.$el.appendChild(this.$el);
			(async () => this.mounted())();
		}

		for ( const child of this._children ) {
			this.$el.appendChild(child.builder());
		}

		return this.$el;
	}

	public destroy() {

		for ( const child of this._children ) {
			child.destroy();
		}

		if ( this.$el ) {
			(this.$el as HTMLElement).remove();
		}

		(async () => this.willUnmount())();

	}

}

export abstract class StatefulWidget<T extends object> extends Widget {

	public store = new State<T>({});

	constructor(options: WidgetOption) {
		super(options);
		this.store.observe(() => {
			if ( this.$el ) {
				for (const child of this._children) {
					child.destroy();
				}
				(this.$el as HTMLElement).innerHTML = '';
				this.chaning(this.parent);
				for (const child of this._children) {
					this.$el.appendChild(child.builder());
				}
			}
		});
	}

}

export class Text extends Widget {

	constructor(private text: string) {
		super({});
	}

	public builder(): Node {
		return document.createTextNode(this.text);
	}

	public build() {
		return this;
	}

}

export class WidgetApp {

	constructor(private context: Widget) {
	}

	public Start(selector: string|Element): void {
		if ( typeof selector === 'string' ) {
			const tmp = document.querySelector(selector);
			if ( tmp ) {
				selector = tmp;
			}
		}


		this.context.chaning(null);
		(selector as Element).appendChild(this.context.build(null).builder());
	}
}
