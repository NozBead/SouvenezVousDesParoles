package funetdelire.oublierparoles.exception;

import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.Response;

public class ResourceSqlException extends WebApplicationException {
	public ResourceSqlException() {
		super(Response.serverError().build());
	}
}
