package funetdelire.oublierparoles.resources;

import java.io.InputStream;

import funetdelire.oublierparoles.database.SongsData;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.Response;

@Path("/songs")
public class SongResource {
	@Path("{id}.mp4")
    @GET
    @Produces("video/mp4")
    public Response getTheme(@PathParam("id") int id) {
    	InputStream video = SongsData.getInstance().getSongVideo(id);
    	return Response.ok(video).build();
    }
}
