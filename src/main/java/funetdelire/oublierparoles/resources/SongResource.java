
package funetdelire.oublierparoles.resources;

import java.sql.SQLException;

import funetdelire.oublierparoles.database.SongsData;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/songs")
public class SongResource {

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public Response getSongs() {
		try {
			return Response.ok(SongsData.getInstance().getSongByTheme("")).build();
		} catch (SQLException e) {
			return Response.serverError().build();
		}
	}

//    @Path("{name}")
//    @GET 
//    @Produces(MediaType.APPLICATION_JSON)
//    public String getSong() {
//        return "Got it!";
//    }
}
