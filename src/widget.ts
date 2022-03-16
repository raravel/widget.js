import { EventAttribute, EventAttributeCallback } from './events';
import { State } from './state';

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

	constructor(options: WidgetOption) {
		this.options = new State<WidgetOption>(options);
	}

	public build(context: Widget|null): Widget {
		if ( context ) {
			this.parent = context;
		}
		if ( this.options.child ) {
			this.options.child.build(this);
		}

		if ( Array.isArray(this.options.children) ) {
			for ( const child of this.options.children ) {
				child.build(this);
			}
		}
		return this;
	}

	public builder(onlyChildRender = false): Node {
		if ( !onlyChildRender ) {
			if (this.$el) {
				(this.$el as HTMLElement).remove();
			}

			this.$el = document.createElement(this.tag || 'div');
			for (const [key, value] of Object.entries(this.options.state)) {
				if (key.startsWith('$')) {
					this.$el.addEventListener(key.replace('$', ''), value as EventAttributeCallback);
				} else {
					if (key !== 'child' && key !== 'children') {
						(this.$el as HTMLElement).setAttribute(key, value as string);
					}
				}
			}
		}

		(this.$el as HTMLElement).innerHTML = '';

		let child = this.options.child;
		if ( child ) {
			child = child.build(this);
			this.$el.appendChild((child as Widget).builder());
		}

		if ( Array.isArray(this.options.children) ) {
			for ( let child of this.options.children ) {
				child = child.build(this);
				this.$el.appendChild((child as Widget).builder());
			}
		}

		if ( this.parent ) {
			this.parent.$el.appendChild(this.$el);
		}
		return this.$el;
	}

}

export class StatefulWidget<T extends object> extends Widget {

	public store = new State<T>({});

	constructor(options: WidgetOption) {
		super(options);
		this.store.observe(() => {
			if ( this.parent ) {
				this.parent.builder(true);
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


		const element = this.context.build(null) as Widget;
		(selector as Element).appendChild(element.builder());
	}
}
