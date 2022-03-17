package funetdelire.oublierparoles.lyrics;

import java.util.LinkedList;
import java.util.List;

public class Theme {
	private String name;
	private List<Song> songs;
	
	public Theme() {
		this.songs = new LinkedList<>();
	}
	
	public Theme(String name) {
		this.name = name;
	}
	
	public void addSong(Song s) {
		songs.add(s);
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public List<Song> getSongs() {
		return songs;
	}

	public void setSongs(List<Song> songs) {
		this.songs = songs;
	}
}
