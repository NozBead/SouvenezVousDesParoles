
package funetdelire.oublierparoles;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.sql.SQLException;

import org.glassfish.jersey.grizzly2.httpserver.GrizzlyHttpServerFactory;
import org.glassfish.jersey.jsonb.JsonBindingFeature;
import org.glassfish.jersey.server.ResourceConfig;

import funetdelire.oublierparoles.database.SongsData;
import funetdelire.oublierparoles.filter.OriginFilter;

public class Main {

	public static final String BASE_URI = "http://0.0.0.0:8080";

	public static void main(String[] args) throws IOException, URISyntaxException, SQLException {
		SongsData.setInstance(new SongsData());
		ResourceConfig resourceConfig = new ResourceConfig().packages("funetdelire.oublierparoles.resources");
		resourceConfig.register(OriginFilter.class);
		resourceConfig.register(JsonBindingFeature.class);
        GrizzlyHttpServerFactory.createHttpServer(new URI(BASE_URI), resourceConfig);
	}
}
