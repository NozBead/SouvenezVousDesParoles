package funetdelire.oublierparoles.resources;

import java.io.UnsupportedEncodingException;

import funetdelire.oublierparoles.database.SongsData;
import funetdelire.oublierparoles.lyrics.Theme;
import jakarta.ws.rs.GET;
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
    
    @Path("{id}")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getTheme(@PathParam("id") int id) throws UnsupportedEncodingException {
    	Theme theme = SongsData.getInstance().getSongByTheme(id);
    	return Response.ok(theme).build();
    }
}
