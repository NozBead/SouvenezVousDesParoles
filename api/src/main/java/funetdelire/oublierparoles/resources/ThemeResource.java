package funetdelire.oublierparoles.resources;

import java.util.Collections;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.function.Function;

import funetdelire.oublierparoles.database.SongsData;
import funetdelire.oublierparoles.lyrics.Song;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
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
    
    @Path("{name}")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getTheme(@PathParam("name") String theme) {
    	return Response.ok(SongsData.getInstance().getSongByTheme(theme)).build();
    }
    
    public <R,T> R pickupRandom(List<R> items, List<T> excluded, Function<R, T> mapper) {
		Collections.shuffle(items);
		R item;
		if (excluded == null) {
			item = items.get(0);
		}
		else {
			item = items.stream()
					.filter(s -> !excluded.contains(mapper.apply(s)))
					.findAny()
					.get();
		}
		return item;
    }
    
    public <R,T> Response randomItemResponse(List<R> items, List<T> excluded, Function<R, T> mapper, String itemRoot) {
    	try {
    		R item = pickupRandom(items, excluded, mapper);
			return Response.seeOther(currentUri.getBaseUri().resolve(itemRoot + '/' + mapper.apply(item))).build();
		} catch (NoSuchElementException e) {
			return Response.status(Status.NOT_FOUND).build();
		}
    }
    
    @Path("/random")
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response getRandomTheme(List<String> excludeList) {
    	List<String> themes = SongsData.getInstance().getThemes();
		return randomItemResponse(themes, excludeList, s->s, ThemeResource.class.getAnnotation(Path.class).value());
    }
    
    @Path("{name}/random")
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response getRandomSongInTheme(@PathParam("name") String name, List<Integer> excludeList) {
		List<Song> songs = SongsData.getInstance().getSongByTheme(name);
		return randomItemResponse(songs, excludeList, s->s.getId(), SongResource.class.getAnnotation(Path.class).value());
    }
}
