package funetdelire.oublierparoles.resources;

import java.util.List;

import funetdelire.oublierparoles.database.SongsData;
import funetdelire.oublierparoles.lyrics.Song;
import funetdelire.oublierparoles.utils.RandomItemUtils;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.UriInfo;

@Path("/themes")
public class ThemeResource {
	@Context
	private UriInfo currentUri;
    
    @Path("{name}")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getTheme(@PathParam("name") String theme) {
    	return Response.ok(SongsData.getInstance().getSongByTheme(theme)).build();
    }
    
    @Path("/random")
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response getRandomTheme(List<String> excludeList) {
    	List<String> themes = SongsData.getInstance().getThemes();
		return RandomItemUtils.randomItemResponse(currentUri.getBaseUri(), themes, excludeList, s->s, ThemeResource.class.getAnnotation(Path.class).value());
    }
    
    @Path("{name}/random")
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response getRandomSongInTheme(@PathParam("name") String name, List<Integer> excludeList) {
		List<Song> songs = SongsData.getInstance().getSongByTheme(name);
		return RandomItemUtils.randomItemResponse(currentUri.getBaseUri(), songs, excludeList, s->s.getId(), SongResource.class.getAnnotation(Path.class).value());
    }
}
