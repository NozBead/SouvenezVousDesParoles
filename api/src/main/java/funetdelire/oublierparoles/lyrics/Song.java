package funetdelire.oublierparoles.lyrics;

public class Song {
	private int id;
	private String name;
	private String lyrics;
	private String context;
	private int contextTime;
	private int guessTime;
	
	public Song(int id, String name, String lyrics, String context, int contextTime, int guessTime) {
		this.id = id;
		this.name = name;
		this.lyrics = lyrics;
		this.context = context;
		this.contextTime = contextTime;
		this.guessTime = guessTime;
	}

	public int getId() {
		return id;
	}
	
	public void setId(int id) {
		this.id = id;
	}
	
	public String getName() {
		return name;
	}
	
	public void setName(String name) {
		this.name = name;
	}
	
	public String getContext() {
		return context;
	}
	
	public void setContext(String context) {
		this.context = context;
	}
	
	public String getLyrics() {
		return lyrics;
	}
	
	public void setLyrics(String lyrics) {
		this.lyrics = lyrics;
	}
	
	public int getGuessTime() {
		return guessTime;
	}
	
	public void setGuessTime(int guessTime) {
		this.guessTime = guessTime;
	}

	public int getContextTime() {
		return contextTime;
	}

	public void setContextTime(int contextTime) {
		this.contextTime = contextTime;
	}
}
