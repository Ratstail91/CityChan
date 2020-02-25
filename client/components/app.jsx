import React from 'react';

const SearchPanel = (props) => {
	if (props.result || !props.choices || props.choices.length == 0) {
		return (
			<div className='panel'>
				<input value={props.query} onChange={props.onChange} />
				<a href="#" onClick={props.onClear}>X</a>
			</div>
		);
	}

	return (
		<div className='panel'>
			<input value={props.query} onChange={props.onChange} />
			<a href="#" onClick={props.onClear}>X</a>

			<ul>
			{props.choices.map((choice, index) => {
				if (!choice) {
					return null;
				}

				if (!props.query || choice.toLowerCase().startsWith(props.query.toLowerCase())) {
					return (
						<li><a href="#" key={`${index}`} onClick={e => props.onClick(choice)}>{choice}</a></li>
					);
				} else {
					return null;
				}
			})}
			</ul>
		</div>
	);
};

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			countries: [],
			states: [],
			cities: [],
			Threads: [],

			countryQuery: '',
			countryResult: '',
			stateQuery: '',
			stateResult: '',
			cityQuery: '',
			cityResult: '',

			threadId: '',
			author: 'anonymous',
			body: '',
		};
	}

	componentDidMount() {
		this.getGraphData('query { Country }', data => {
			this.setState({ countries: data.Country });
		});
	}

	componentDidUpdate() {
		if ((!this.state.countries || this.state.countries.length == 0) && !this.state.countryResult) {
			this.getGraphData('query { Country }', data => {
				this.setState({ countries: data.Country });
			});
			return;
		}

		if ((!this.state.states || this.state.states.length == 0) && this.state.countryResult && !this.state.stateResult) {
			this.getGraphData(`query { State(country: "${this.state.countryResult}") }`, data => {
				this.setState({ states: data.State });
			});
			return;
		}

		if ((!this.state.cities || this.state.cities.length == 0) && this.state.countryResult && this.state.stateResult && !this.state.cityResult) {
			this.getGraphData(`query { City(country: "${this.state.countryResult}", state: "${this.state.stateResult}") }`, data => {
				this.setState({ cities: data.City });
			});
		}

		if (this.state.countryResult && this.state.stateResult && this.state.cityResult && (!this.state.Threads || this.state.Threads.length == 0)) {
			this.getGraphData(`query { Threads(country: "${this.state.countryResult}", state: "${this.state.stateResult}", city: "${this.state.cityResult}") { id posts { id author text } } }`, data => {
				this.setState({ Threads: data.Threads });
			});
		}
	}

	render() {
		return (
			<div className='central'>
				<div className='page'>
					<SearchPanel
						query={this.state.countryQuery}
						result={this.state.countryResult}
						choices={this.state.countries}
						onChange={this.updateCountryQuery.bind(this)}
						onClick={choice => this.setState({ countryQuery: choice, countryResult: choice })}
						onClear={this.clearCountry.bind(this)}
					/>

					{(() => {
						if (!this.state.countryResult) {
							return null;
						}

						return (
							<SearchPanel
								query={this.state.stateQuery}
								result={this.state.stateResult}
								choices={this.state.states}
								onChange={this.updateStateQuery.bind(this)}
								onClick={choice => this.setState({ stateQuery: choice, stateResult: choice })}
								onClear={this.clearState.bind(this)}
							/>
						);
					})()}

					{(() => {
						if (!this.state.countryResult || !this.state.stateResult) {
							return null;
						}

						return (
							<SearchPanel
								query={this.state.cityQuery}
								result={this.state.cityResult}
								choices={this.state.cities}
								onChange={this.updateCityQuery.bind(this)}
								onClick={choice => this.setState({ cityQuery: choice, cityResult: choice })}
								onClear={this.clearCity.bind(this)}
							/>
						);
					})()}

					{this.state.Threads.map(thread => {
						if (!thread) {
							return null;
						}

						return (
							<div className='panel'>
								<p>Thread #: {thread.id}</p>
								<ul>
								{thread.posts.map(post => {
									return (
										<p>{post.author}: {post.text}</p>
									);
								})}
								</ul>
							</div>
						);
					})}

					<hr />

					<div className='panel'>
						<div className='panel'>
							<span>Thread #: </span>
							<input value={this.state.threadId} onChange={this.changeThreadId.bind(this)} />
							<input value={this.state.author} onChange={this.changeAuthor.bind(this)} />
						</div>
						<textarea rows="4" cols="50" value={this.state.body} onChange={this.changeBody.bind(this)} />
						<div className='panel' style={{flexDirection: 'row'}}>
							<button onClick={this.reply.bind(this)}>Reply</button>
							<button onClick={this.newThread.bind(this)}>New Thread</button>
						</div>
					</div>
				</div>
			</div>
		);
	}

	reply() {
		const threadId = this.state.threadId || prompt('Enter the # of the thread to reply to:');
		this.getGraphData(`mutation { replyThread(id: ${threadId}, author: "${this.state.author}", text: "${this.state.body}") { id posts { id author text } } }`);
		this.setState({ body: '' });
	}

	newThread() {
		const country = this.state.countryResult || prompt('Enter country name');
		const state = this.state.stateResult || prompt('Enter state name');
		const city = this.state.cityResult || prompt('Enter city name');

		this.getGraphData(`mutation { createThread(country: "${country}", state: "${state}", city: "${city}", author: "${this.state.author}", text: "${this.state.body}") { id posts { id author text } } }`);
		this.setState({ body: '' });
	}

	getGraphData(query, onSuccess, onError = console.error) {
		fetch('/graphql', {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({'query': query}),
		})
			.then(res => res.json())
			.then(json => json.data)
			.then(onSuccess)
			.catch(onError)
		;
	}

	//utils
	updateCountryQuery(evt) {
		this.setState({ Threads: [], cityResult: '', cityQuery: '', stateResult: '', stateQuery: '', countryResult: '', countryQuery: evt.target.value });
	}

	updateStateQuery(evt) {
		this.setState({ Threads: [], cityResult: '', cityQuery: '', stateResult: '', stateQuery: evt.target.value });
	}

	updateCityQuery(evt) {
		this.setState({ Threads: [], cityResult: '', cityQuery: evt.target.value });
	}

	clearCountry() {
		this.setState({ Threads: [], cityResult: '', cityQuery: '', stateResult: '', stateQuery: '', countryResult: '', countryQuery: '' });
	}

	clearState() {
		this.setState({ Threads: [], cityResult: '', cityQuery: '', stateResult: '', stateQuery: '' });
	}

	clearCity() {
		this.setState({ Threads: [], cityResult: '', cityQuery: '' });
	}

	changeThreadId(evt) {
		this.setState({ threadId: evt.target.value });
	}

	changeAuthor(evt) {
		this.setState({ author: evt.target.value });
	}

	changeBody(evt) {
		this.setState({ body: evt.target.value });
	}
};

export default App;