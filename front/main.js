class LyricsGame {
	themes = {};
	
	guessTimeoutId;
	contextTimeoutId;
	currentTheme;
	currentSong;
	
	currentSongView;
	
    songApi;

    spaces;
	
	guessManager;

    constructor (spaces, api, guessManager) {
		this.spaces = spaces;
        this.songApi = api;
		this.guessManager = guessManager;
    }
	
	clean() {
		this.spaces.buttonSpace.innerHTML = "";
		this.spaces.guessSpace.innerHTML = "";
		this.spaces.contextSpace.innerHTML = "";
		this.spaces.titleSpace.innerHTML = "";
		this.spaces.answerSpace.innerHTML = "";

		this.spaces.guessSpace.classList.remove("bg-success", "bg-danger");
		this.spaces.guessSpace.style.setProperty("color", "lightslategray");
		const video = document.querySelector("#karaoke");
		if (video) {
			video.remove();
		}
	}

	proposeThemes() {
		let view = new ThemesView(this, spaces, Object.entries(this.themes));
		view.draw();
	}

    chooseTheme(theme) {
		this.clean();
        this.currentTheme = this.themes[theme];
		let view = new SongsView(this, spaces, this.currentTheme['songs']);
		view.draw();
		delete this.themes[theme];
    }
	
	chooseSong(idx) {
		this.clean();
		if (idx == -1) {
			this.proposeThemes();
		}
		else {
			let song = this.currentTheme['songs'][idx]
			let url = this.songApi.getSongUrl(song['id'])
			this.currentSong = song;
			this.currentSongView = new SongView(game, spaces, url, song, this.currentTheme['difficulty']*10);
			this.currentSongView.draw();
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
		this.guessTimeoutId = setTimeout(this.currentSongView.drawGuess.bind(this.currentSongView), guessTime);
		this.contextTimeoutId = setTimeout(this.currentSongView.drawContext.bind(this.currentSongView), contextTime);
	}
}

class LyricsView {
	game;
	spaces;
	
	constructor(game, spaces) {
		this.game = game;
		this.spaces = spaces;
	}
	
	draw(){};	
}

class ThemesView extends LyricsView {
	themes;

	constructor (game, spaces, themes) {
		super(game, spaces);
		this.themes = themes;
	}
	
	draw() {
		for (let [key, value] of this.themes) {
			this.createThemeButton(key, value['difficulty']*10);
		}
	}
	
	createThemeButton(choice, points) {
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
	  
		button.addEventListener('click', e => this.game.chooseTheme(choice));
		this.spaces.buttonSpace.appendChild(button);
		button.appendChild(pts);
		button.appendChild(name);
	}
}

class SongsView extends LyricsView {
	songs;
	
	constructor (game, spaces, songs) {
		super(game, spaces);
		this.songs = songs;
	}
	
	draw() {
		let i = 0;
		for (let song of this.songs) {
			this.createSongButton(song['name'], i);
			i++;
		}
	}
	
	createSongButton(song, idx) {
		const button = document.createElement("button");
		button.classList.add("btn");
		button.classList.add("btn-outline-primary");
		button.classList.add("btn-lg");
		
		button.innerHTML = song;
	  
		button.addEventListener('click', e => this.game.chooseSong(idx));
		this.spaces.buttonSpace.appendChild(button);
	}
}

class SongView extends LyricsView {
	song;
	guessManager;
	
	constructor (game, spaces, url, song, pts) {
		super(game, spaces);
		this.song = song;
		this.space = spaces.space;
		this.titleSpace = spaces.titleSpace;
		this.url = url;
		this.pts = pts;
		this.guessManager = new GuessManagerView(game, spaces, song['lyrics']);
	}
	
	draw() {
		const video = document.createElement("video");
		video.classList.add("h-50");
		video.classList.add("w-50");
		video.id = "karaoke";
		video.setAttribute("controls", "");
		
		video.addEventListener("play", e => {
			const video = document.querySelector("#karaoke");
			this.game.startGuessTime(video.currentTime);
		});
		
		const source = document.createElement("source");
		source.type = "video/mp4";
		source.src = this.url;

		this.spaces.titleSpace.innerHTML = this.song['name'] + " " + this.pts + "pts";
		
		this.space.prepend(video);
		video.append(source);
	}
	
	drawGuess() {
		this.guessManager.draw();
	}

	drawContext() {
		this.spaces.contextSpace.innerHTML = this.song['context'];
		this.hideSong();
	}

	hideSong() {
		const video = document.querySelector("#karaoke");
		video.classList.add("visually-hidden");
	}
}

class GuessManagerView extends LyricsView {
	accuteReplacement = [ 	{regex:/[éèêë]/g, replacement:'e'}, 
							{regex:/[à]/g, replacement:'a'},
							{regex:/[ùû]/g, replacement:'u'}];
							
	normalCharRegex = '[a-zA-Zéêàèçùûë]';
	normalCharG = new RegExp(this.normalCharRegex,'g');
	normalCharI = new RegExp(this.normalCharRegex,'i');
	
	hiddenGuess;
	idxGuess;
	toGuess;
	
	kbdHandler;
	
	constructor(game, spaces, toGuess) {
		super(game, spaces);
		this.toGuess = toGuess;
		const hidden = toGuess.replaceAll(this.normalCharG, "_");
		this.hiddenGuess = Array.from(hidden);
		this.idxGuess = 0;
	}
	
	draw() {
		this.spaces.guessSpace.innerHTML = this.hiddenGuess.join("");
		const button = document.createElement("button");
		button.classList.add("btn");
		button.classList.add("btn-outline-primary");
		button.classList.add("btn-lg");
		this.kbdHandler = this.handleKeyboard.bind(this);
		document.addEventListener("keydown", this.kbdHandler);
	}
	
	refreshInput(inputChar) {
		let direction;
		if (inputChar == -1) {
			let notFound = true;
			while (this.idxGuess > 0 && notFound) {
				this.idxGuess--;
				if (this.normalCharI.test(this.hiddenGuess[this.idxGuess])) {
					notFound = false;
				}
			}
			this.hiddenGuess[this.idxGuess] = '_';
		}
		else if (this.idxGuess < this.hiddenGuess.length) {
			this.hiddenGuess[this.idxGuess] = inputChar;
			let notFound = true;
			while (notFound && this.idxGuess < this.hiddenGuess.length) {
				this.idxGuess++;
				if (this.hiddenGuess[this.idxGuess] == '_') {
					notFound = false;
				}
			}
		}
		
		
		this.spaces.guessSpace.innerHTML = this.hiddenGuess.join("");
	}
	
	handleKeyboard(e) {
		if (e.key == 'Backspace') {
			this.refreshInput(-1);
		}
		else if (e.key == 'Enter') {
			const normalInput = this.normalizeString(this.hiddenGuess.filter(c => c != '_').join(""));
			const normalToGuess = this.normalizeString(this.toGuess);
				
			let back = "bg-success";
			if (normalInput != normalToGuess) {
				back = "bg-danger";
			}
			this.spaces.guessSpace.classList.add(back);
			this.spaces.guessSpace.style.setProperty("color", "white");
					
			this.spaces.answerSpace.innerHTML = "Réponse :<br>" + this.toGuess;
			document.removeEventListener("keydown", this.kbdHandler);
			new SongsView(game, spaces, []).createSongButton("Round suivant", -1);
		}
		else {
			let c = e.key.at(0);
			if (this.normalCharI.test(c)) {
				this.refreshInput(c);
			}
		}
	}

	normalizeString(str) {
		let result = str;
		for (let t of this.accuteReplacement) {
			result = result.replaceAll(t.regex, t.replacement);
		}
		return result.toLowerCase();
	}
}

class SongApi {
    baseUrl;
	encounteredThemes = [];
    
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
	
	downloadThemes(nbr) {
		let promises = [];
		for (let i = 1 ; i <= nbr ; i++) {
			promises.push(this.getRandomTheme(this.encounteredThemes, i)
			.then(response => { 
					this.encounteredThemes.push(response.url.split('/').pop());
					return response.json();
				})
			.then(data => {
				let obj = {};
				obj['songs'] = data['songs'];
				obj['difficulty'] = i;
				return [data['name'], obj];
			}));
		}
		return Promise.all(promises);
    }
}

let spaces = {
	buttonSpace: document.querySelector("#buttonspace"),
	space: document.querySelector("#space"),
	guessSpace: document.querySelector("#guessspace"),
	contextSpace: document.querySelector("#contextspace"),
	titleSpace: document.querySelector("#titlespace"),
	answerSpace: document.querySelector("#answerspace")
}
let api = new SongApi("http://localhost:8080");
let game = new LyricsGame(spaces, api);
api.downloadThemes(5)
	.then(e => {
		game.themes = Object.fromEntries(e);
		game.proposeThemes();
	});
