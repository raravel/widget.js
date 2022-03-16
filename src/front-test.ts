import { Text, H1, Div, WidgetApp, Widget, WidgetOption, StatefulWidget } from '../src/index';

interface MyState {
	text: string;
	style: string;
}

class MyWidget extends StatefulWidget<MyState> {
	constructor(options: WidgetOption) {
		super(options);
		this.store.setState((state) => {
			state.text = new Date().toLocaleString();
			state.style = 'color: red';
		});

		setInterval(() => {
			this.store.setState((state) => {
				console.log('set state');
				state.text = new Date().toLocaleString();
			});
		}, 1000);

		setTimeout(() => {
			this.store.setState((state) => {
				state.style = 'color: green';
			});
		}, 3000);
	}

	build(context: Widget) {
		super.build(context);
		return new Div({
			child: new Text(this.store.getters.text),
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
