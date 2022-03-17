import SongApi from "./SongApi.js"

class ParolesGame {
    encounteredThemes = [];
	themes = {};
	
	guessTimeoutId;
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
		let song = this.currentTheme['songs'][idx]
		let url = this.songApi.getSongUrl(song['id'])
		this.currentSong = song;
		this.parolesView.songDrawer(url, song);
	}
	
	startGuessTime(currentTime) {
		if (this.guessTimeoutId != undefined) {
			clearTimeout(this.guessTimeoutId);
		}
		
		let time = (this.currentSong['guessTime'] - currentTime) * 1000;
		this.guessTimeoutId = setTimeout(this.startGuess, time);
	}
	
	startGuess() {
		this.parolesView.songHider();
		
	}
}

class ParolesView {
	themesDrawer;
	songsDrawer;
	songDrawer;
	guessDrawer
	songHider;
	cleaner;
	
	constructor (themesDrawer, songsDrawer, songDrawer, songHider, guessDrawer, cleaner) {
		this.themesDrawer = themesDrawer;
		this.songsDrawer = songsDrawer;
		this.songDrawer = songDrawer;
		this.songHider = songHider;
		this.cleaner = cleaner;
	}
}