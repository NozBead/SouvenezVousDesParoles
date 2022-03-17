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