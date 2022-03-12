package funetdelire.oublierparoles.database;

import java.net.MalformedURLException;
import java.net.URL;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.LinkedList;
import java.util.List;

import funetdelire.oublierparoles.lyrics.Song;

public class SongsData {
	private static SongsData instance;
	
	private Connection sqliteCon;
	
	public static void setInstance(SongsData newInstance) {
		instance = newInstance;
	}
	
	public static SongsData getInstance() {
		return instance;
	}
	
	public SongsData() throws SQLException {
		sqliteCon = DriverManager.getConnection("jdbc:sqlite:.paroles.db");
	}
	
	public List<Song> getSongByTheme(String theme) throws SQLException {
		List<Song> songs = new LinkedList<>();
		PreparedStatement statement = sqliteCon.prepareStatement("SELECT id, name, url FROM song, song_per_theme WHERE id = song_id AND theme_name = ?");
		statement.setString(1, theme);
		ResultSet result = statement.executeQuery();
		while (result.next()) {
			Song s;
			try {
				s = new Song(result.getInt("id"), result.getString("name"), new URL(result.getString("url")));
			} catch (MalformedURLException e) {
				throw new SQLException();
			} 
			songs.add(s);
		}
		return songs;
	}
	
	public List<String> getThemes() throws SQLException {
		List<String> themes = new LinkedList<>();
		Statement statement = sqliteCon.createStatement();
		ResultSet result = statement.executeQuery("SELECT name FROM theme");
		while (result.next()) {
			themes.add(result.getString("name"));
		}
		return themes;
	}
}
 