import { Text, H1, Div, WidgetApp, Widget, WidgetOption, StatefulWidget } from '../src/index';


interface MyState {
	text: string;
	style: string;
	range: number[];
}

interface ClockState {
	date: Date;
}

class Clock extends StatefulWidget<ClockState> {
	tiv!: any;
	constructor(options: WidgetOption) {
		super(options);
		this.store.setState((state) => {
			state.date = new Date();
		});
	}

	mounted() {
		console.log('mounted', new Date().toLocaleString(), this);
		this.tiv = setInterval(() => {
			this.store.setState((state) => {
				state.date = new Date();
			});
		}, 1000);
	}

	willUnmount() {
		clearInterval(this.tiv);
		console.log('will unmount', new Date().toLocaleString());
	}

	build(context: Widget) {
		return new Text(this.store.getters.date.toLocaleString());
	}
}

class MyWidget extends StatefulWidget<MyState> {
	constructor(options: WidgetOption) {
		super(options);
		console.log('create widget');
		this.store.setState((state) => {
			state.text = new Date().toLocaleString();
			state.style = 'color: blue';
			state.range = [1, 2, 3];
		});

		setTimeout(() => {
			this.store.setState((state) => {
				state.range = [1];
			});
		}, 3000);
	}

	build(context: Widget) {
		return new Div({
			children: this.store.getters.range.map((num) => new Clock({})),
			style: this.store.getters.style,
		});
	}
}

new WidgetApp(
	new Div({
		$blur: () => {
		},
		children: [
			new H1({
				child: new Text(Date.now().toString())
			}),
			new H1({
				child: new Text(Date.now().toString())
			}),
			new Div({
				child: new MyWidget({}),
			}),
		],
	})
).Start('#app');
