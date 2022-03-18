class ParolesGame {
    encounteredThemes = [];
	themes = {};
	
	guessTimeoutId;
	contextTimeoutId;
	currentTheme;
	currentSong;
	
    songApi;

    parolesView;

    constructor (parolesView) {
		this.parolesView = parolesView;
        this.songApi = new SongApi("http://localhost:8080");
    }

    downloadThemes() {
	let promises = [];
		for (let i = 1 ; i <= 5 ; i++) {
			promises.push(this.songApi.getRandomTheme(this.encounteredThemes, i)
			.then(response => { 
					this.encounteredThemes.push(response.url.split('/').pop());
					return response.json();
				})
			.then(data => {
				let name = data['name'];
				this.themes[name] = {};
				this.themes[name]['songs'] = data['songs'];
				this.themes[name]['difficulty'] = i;
				return name;
			}));
		}
		return Promise.all(promises);
    }
	
	proposeThemes() {
		for (let [key, value] of Object.entries(this.themes)) {
			this.parolesView.themesDrawer(key, value['difficulty']*10);
		}
	}

    chooseTheme(theme) {
		this.parolesView.cleaner();
        this.currentTheme = this.themes[theme];
		let i = 0;
		for (let song of this.currentTheme['songs']) {
			this.parolesView.songsDrawer(song['name'], i);
			i++;
		}
		delete this.themes[theme];
    }
	
	chooseSong(idx) {
		this.parolesView.cleaner();
		if (idx == -1) {
			this.proposeThemes();
		}
		else {
			let song = this.currentTheme['songs'][idx]
			let url = this.songApi.getSongUrl(song['id'])
			this.currentSong = song;
			this.parolesView.songDrawer(url, song, this.currentTheme['difficulty']*10);
		}
	}
	
	startGuessTime(currentTime) {
		if (this.guessTimeoutId != undefined) {
			clearTimeout(this.guessTimeoutId);
		}
		if (this.contextTimeoutId != undefined) {
			clearTimeout(this.contextTimeoutId);
		}
		
		let contextTime = (this.currentSong['contextTime'] - currentTime) * 1000;
		let guessTime = (this.currentSong['guessTime'] - currentTime) * 1000;
		this.guessTimeoutId = setTimeout(this.startGuess.bind(this), guessTime);
		this.contextTimeoutId = setTimeout(this.startContext.bind(this), contextTime);
	}
	
	startGuess() {
		this.parolesView.guessDrawer(this.currentSong['lyrics']);
	}
	
	startContext() {
		this.parolesView.songHider();
		this.parolesView.contextDrawer(this.currentSong['context']);
	}
}

class ParolesView {
	themesDrawer;
	songsDrawer;
	songDrawer;
	guessDrawer;
	contextDrawer
	songHider;
	cleaner;
	
	constructor (themesDrawer, songsDrawer, songDrawer, songHider, guessDrawer, contextDrawer, cleaner) {
		this.themesDrawer = themesDrawer;
		this.songsDrawer = songsDrawer;
		this.songDrawer = songDrawer;
		this.songHider = songHider;
		this.guessDrawer = guessDrawer;
		this.contextDrawer = contextDrawer;
		this.cleaner = cleaner;
	}
}

class SongApi {
    baseUrl;
    
    init = {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'omit',
        headers: {
          'Content-Type': 'application/json'
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: undefined
    };

    constructor(url) {
        this.baseUrl = url;
    }

	getRandomTheme(exclusionList, difficulty) {
        this.init.body = JSON.stringify(exclusionList);
        return fetch(this.baseUrl + "/difficulties/" + difficulty + "/random", this.init);
    }
	
	getSongUrl(id) {
		return this.baseUrl + "/songs/" + id + ".mp4";
	}
}


let view = new ParolesView(createThemeButton, createSongButton, drawSong, hideSong, drawGuess, drawContext, clean);
let game = new ParolesGame(view);
game.downloadThemes()
	.then(e => game.proposeThemes());

const buttonSpace = document.querySelector("#buttonspace");
const space = document.querySelector("#space");
const guessSpace = document.querySelector("#guessspace");
const contextSpace = document.querySelector("#contextspace");
const titleSpace = document.querySelector("#titlespace");
const answerSpace = document.querySelector("#answerspace");

function clean() {
	buttonSpace.innerHTML = "";
	guessSpace.innerHTML = "";
	contextSpace.innerHTML = "";
	titleSpace.innerHTML = "";
	answerSpace.innerHTML = "";
	hiddenGuess = "";
	inputGuess = [];
	const video = document.querySelector("#karaoke");
	if (video) {
		video.remove();
	}
}

let hiddenGuess = "";
let inputGuess = [];
function refreshInput() {
	let display = "";
	const inputIt = inputGuess.entries();
	for (let c of hiddenGuess) {
		if (c == '_') {
			const result = inputIt.next();
			if (result.done) {
				display += '_';
			}
			else {
				display += result.value[1];
			}
		}
		else {
			display += c;
		}
	}

	guessSpace.innerHTML = display;
}

const regex = '[a-zA-Zéêàèçù]';
const regexG = new RegExp(regex,'g');
const regexI = new RegExp(regex,'i');
function drawGuess(toGuess) {
	hiddenGuess = toGuess.replaceAll(regexG, "_");
	guessSpace.innerHTML = hiddenGuess;

	const button = document.createElement("button");
    button.classList.add("btn");
    button.classList.add("btn-outline-primary");
    button.classList.add("btn-lg");
	let handler = e => {
		if (e.key == 'Backspace') {
			inputGuess.pop();
			refreshInput();
		}
		else if (e.key == 'Enter') {
			answerSpace.innerHTML = "Réponse :<br>" + toGuess;
			document.removeEventListener("keydown", handler);
			createSongButton("Round suivant", -1);
		}
		else {
			let c = e.key.at(0);
			if (regexI.test(c)) {
				inputGuess.push(c);
				refreshInput();
			}
		}
	};
	document.addEventListener("keydown", handler);
}

function drawContext(context) {
	contextSpace.innerHTML = context;
}

function drawSong(url, song, pts) {
	const video = document.createElement("video");
	video.classList.add("h-50");
	video.classList.add("w-50");
	video.id = "karaoke";
	video.setAttribute("controls", "");
	
	video.addEventListener("play", e => {
		const video = document.querySelector("#karaoke");
		game.startGuessTime(video.currentTime);
	});
	
	const source = document.createElement("source");
	source.type = "video/mp4";
	source.src = url;

	titleSpace.innerHTML = song['name'] + " " + pts + "pts";
	
	space.prepend(video);
	video.append(source);
}

function hideSong() {
	const video = document.querySelector("#karaoke");
	video.classList.add("visually-hidden");
}

function createSongButton(song, idx) {
    const button = document.createElement("button");
    button.classList.add("btn");
    button.classList.add("btn-outline-primary");
    button.classList.add("btn-lg");
	
	button.innerHTML = song;
  
    button.addEventListener('click', e => game.chooseSong(idx));
    buttonSpace.appendChild(button);
}

function createThemeButton(choice, points) {
    const button = document.createElement("button");
    button.classList.add("btn");
    button.classList.add("btn-outline-primary");
    button.classList.add("btn-lg");
	button.classList.add("d-flex");
	button.classList.add("p-0");
	
	const pts = document.createElement("div");
	pts.classList.add("p-2");
	pts.classList.add("border-end");
	pts.classList.add("border-primary");
	pts.innerHTML = points + "pts";
	
	const name = document.createElement("div");
	name.classList.add("p-1");
	name.classList.add("flex-grow-1");
	name.innerHTML = choice;
  
    button.addEventListener('click', e => game.chooseTheme(choice));
    buttonSpace.appendChild(button);
	button.appendChild(pts);
	button.appendChild(name);
}