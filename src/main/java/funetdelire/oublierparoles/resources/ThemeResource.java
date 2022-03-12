package funetdelire.oublierparoles.resources;

import java.sql.SQLException;
import java.util.Collections;
import java.util.List;
import java.util.NoSuchElementException;

import funetdelire.oublierparoles.database.SongsData;
import funetdelire.oublierparoles.lyrics.Song;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.Response.Status;
import jakarta.ws.rs.core.UriInfo;

@Path("/themes")
public class ThemeResource {
	@Context
	private UriInfo currentUri;

    @GET 
    @Produces(MediaType.APPLICATION_JSON)
    public String getThemes() {
        return "Got it!";
    }
    
    @Path("{name}")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public String getTheme() {
        return "Got it!";
    }
    
    @Path("/random")
    @GET
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response getRandomTheme(List<String> excludeList) {
    	try {
    		List<String> themes = SongsData.getInstance().getThemes();
			Collections.shuffle(themes);
			
			String theme;
			if (excludeList == null) {
				theme = themes.get(0);
			}
			else {
				theme = themes.stream()
						.filter(s -> excludeList.contains(s))
						.findAny()
						.get();
			}
			return Response.seeOther(currentUri.getRequestUri().resolve(theme)).build();
		} catch (SQLException e) {
			return Response.serverError().build();
		} catch (NoSuchElementException e) {
			return Response.status(Status.NOT_FOUND).build();
		}
    }
    
    @Path("{name}/random")
    @GET
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response getRandomSongInTheme(@PathParam("name") String name, List<Integer> excludeList) {
    	try {
			List<Song> songs = SongsData.getInstance().getSongByTheme(name);
			Collections.shuffle(songs);
			
			Song s;
			if (excludeList == null) {
				s = songs.get(0);
			}
			else {
				s = songs.stream()
						.filter(song -> excludeList.contains(song.getId()))
						.findAny()
						.get();
			}
			return Response.seeOther(currentUri.getRequestUri().resolve("../../songs/" + s.getId())).build();
		} catch (SQLException e) {
			return Response.serverError().build();
		} catch (NoSuchElementException | IndexOutOfBoundsException e) {
			return Response.status(Status.NOT_FOUND).build();
		}
    }
}
