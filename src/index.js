import { h, Component, createContext } from 'preact';
import { Router } from 'preact-router';
import { Link } from 'preact-router/match';

import './assets/styles/global.css';

// Routes
import Home from './routes/home.js';
import Form from './routes/form.js';

// Components
import { Dialog } from './components/dialog.js';
import { PWAPrompt } from './components/pwaPrompt';

export const Action = createContext({})

export default class App extends Component {

	state = {
		results: {},
		isHomepage: true,
		isPopupOpen: false,
		popupNumbers: [],
	}

	handleRoute = e => {
		this.currentUrl = e.url;
		this.setState({ isHomepage: e.url.replace(/\?.*/g, "") === "/" });
	};

	setPopupNumbers = (e, numberArray) => {
		e.preventDefault();

		this.setState({
			popupNumbers: numberArray,
			isPopupOpen: true
		})
	}

	closePopup = (e) => {
		if (e.currentTarget === e.target) {
			this.setState({ isPopupOpen: false })
		}
	}

	componentDidMount() {
		fetch(`${process.env.PREACT_APP_DATA_SOURCE}?c=${Math.random().toString(36).split('.')[1]}`)
			.then(r => r.json())
			.then(json => {
				this.setState({
					results: json,
					resultBkp: json
				});
			});
	}

	componentDidUpdate() {
		const { isPopupOpen } = this.state;

		const root = document.documentElement;
		root.style.setProperty('--popup-visible', isPopupOpen ? 'hidden': 'initial')
	}

	render(props, { isHomepage, results, popupNumbers, isPopupOpen }) {
		return (
			<Action.Provider value={{setPopupNumbers: this.setPopupNumbers}}>
				<div id="app" class="px-5 max-w-screen-md mx-auto">
					<nav class="flex justify-center md:justify-center items-center">
						{
							isHomepage
								? <Link class="m-5 bg-blue-500 inline-block hover:bg-blue-700 text-white font-bold px-2 py-1 rounded" href="/form">➕ Aggiungi un'attività</Link>
								: <Link class="m-5 text-blue-500 hover:text-blue-800" href="/">Ritorna alla ricerca</Link>
						}
					</nav>
                  <div class="text-center w-full">
                     <img class="block sm:inline-block" src="./assets/logo-large.jpg"/>
                  </div>
					<Router onChange={this.handleRoute}>
						<Home path="/" results={results} />
						<Form path="/form" />
					</Router>
				</div>
				<Dialog isOpen={isPopupOpen} closePopup={this.closePopup} telNumbers={popupNumbers} />
				<PWAPrompt />
			</Action.Provider>
		);
	}
}
