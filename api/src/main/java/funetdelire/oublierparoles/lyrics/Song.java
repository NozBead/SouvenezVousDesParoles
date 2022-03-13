package funetdelire.oublierparoles.lyrics;

import java.net.URL;

public class Song {
	private int id;
	private String name;
	private URL instrumentalVideo;
	
	public Song(int id, String name, URL instrumentalVideo) {
		this.name = name;
		this.id = id;
		this.instrumentalVideo = instrumentalVideo;
	}

	public String getName() {
		return name;
	}
	
	public int getId() {
		return id;
	}
	
	public URL getInstrumentalVideo() {
		return instrumentalVideo;
	}
}
