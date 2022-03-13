class ParolesGame {
    encounteredSongs = [];
    encounteredThemes = [];

    currentSong;
    currentTheme;

    songApi;

    buttonCreator;

    constructor (buttonCreator) {
        this.songApi = new SongApi("http://localhost:8080");
        this.buttonCreator = buttonCreator;
    }

    async proposeTheme() {
        let theme = await this.songApi.getRandomTheme(this.encounteredThemes);
        theme = theme.split("/").pop();
        this.buttonCreator(theme);
        this.encounteredThemes.push(theme);
        return theme;
    }

    proposeThemes() {
        this.proposeTheme().then(r => this.proposeTheme());
    }

    chooseTheme(theme) {
        let song = this.songApi.getRandomSong(theme, this.encounteredSongs);
        this.currentTheme = theme;
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

    async getRandomTheme(exclusionList) {
        this.init.body = JSON.stringify(exclusionList);
        const themeResponse = await fetch(this.baseUrl + "/themes/random", this.init);
        if (themeResponse.status != 404) {
            return themeResponse.url;
        }
        else {
            return undefined;
        }
    }

    async getRandomSong(theme, exclusionList) {
        this.init.body = JSON.stringify(exclusionList);
        const themeResponse = await fetch(this.baseUrl + "/themes/" + theme + "/random", this.init);
        return themeResponse.json();
    }
}

game = new ParolesGame(createButton);
game.proposeThemes();

const buttonSpace = document.querySelector("#buttonspace");
function createButton(choice) {
    const button = document.createElement("button");
    button.classList.add("btn");
    button.classList.add("btn-outline-primary");
    button.classList.add("btn-lg");
    button.innerHTML = choice;
    button.addEventListener('click', e => game.chooseTheme(choice));
    buttonSpace.appendChild(button);
}