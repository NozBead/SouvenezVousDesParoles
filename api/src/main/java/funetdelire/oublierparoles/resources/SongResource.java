
package funetdelire.oublierparoles.resources;

import funetdelire.oublierparoles.database.SongsData;
import funetdelire.oublierparoles.lyrics.Song;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.Response.Status;

@Path("/songs")
public class SongResource {

	@Path("{id}")
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public Response getSong(@PathParam("id") int id) {
		Song s = SongsData.getInstance().getSongById(id);
		if (s == null) {
			return Response.status(Status.NOT_FOUND).build();
		}
		return Response.ok(s).build();
	}
}
