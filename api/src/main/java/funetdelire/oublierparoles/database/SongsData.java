package funetdelire.oublierparoles.database;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.LinkedList;
import java.util.List;

import funetdelire.oublierparoles.exception.ResourceSqlException;
import funetdelire.oublierparoles.lyrics.Song;
import funetdelire.oublierparoles.lyrics.Theme;

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
	
	public List<Integer> getThemeByDifficulty(int diff) {
		List<Integer> themes = new LinkedList<>();
		try {
			PreparedStatement statement = sqliteCon.prepareStatement(
					"SELECT id FROM theme WHERE difficulty = ?");
			statement.setInt(1, diff);
			ResultSet result = statement.executeQuery();
			while (result.next()) {
				themes.add(result.getInt(1));
			}
			return themes;
		} catch (SQLException e) {
			e.printStackTrace();
			throw new ResourceSqlException();
		}
	}
	
	public InputStream getSongVideo(int songId) {
		try {
			PreparedStatement statement = sqliteCon.prepareStatement(
					"SELECT video FROM song WHERE id = ?");
			statement.setInt(1, songId);
			ResultSet result = statement.executeQuery();
			while (result.next()) {
				byte[] file = result.getBytes(1);
				return new ByteArrayInputStream(file);
			}
			return null;
		} catch (SQLException e) {
			e.printStackTrace();
			throw new ResourceSqlException();
		}
	}
	
	public Theme getSongByTheme(int themeId) {
		Theme theme = new Theme();
		try {
			PreparedStatement statement = sqliteCon.prepareStatement(
					"SELECT song.id, song.name, theme.name, lyrics, context, guess_time FROM song, theme WHERE theme = ? AND song.theme = theme.id");
			statement.setInt(1, themeId);
			ResultSet result = statement.executeQuery();
			while (result.next()) {
				Song s;
				s = new Song(result.getInt(1), result.getString(2), result.getString(4), result.getString(5), result.getInt(6));
				theme.addSong(s);
				theme.setName(result.getString(3));
			}
			return theme;
		} catch (SQLException e) {
			e.printStackTrace();
			throw new ResourceSqlException();
		}
	}

	public List<String> getThemes() {
		List<String> themes = new LinkedList<>();
		try {
			Statement statement = sqliteCon.createStatement();
			ResultSet result = statement.executeQuery("SELECT name FROM theme");
			while (result.next()) {
				themes.add(result.getString("name"));
			}
			return themes;
		} catch (SQLException e) {
			e.printStackTrace();
			throw new ResourceSqlException();
		}
	}
}
