package funetdelire.oublierparoles.utils;

import java.io.UnsupportedEncodingException;
import java.net.URI;
import java.net.URLEncoder;
import java.util.Collections;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.function.Function;

import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.Response.Status;

public class RandomItemUtils {
	public static <R, T> R pickupRandom(List<R> items, List<T> excluded, Function<R, T> mapper) {
		Collections.shuffle(items);
		R item;
		if (excluded == null) {
			item = items.get(0);
		} else {
			item = items.stream().filter(s -> !excluded.contains(mapper.apply(s))).findAny().get();
		}
		return item;
	}

	public static <R, T> Response randomItemResponse(URI baseUri, List<R> items, List<T> excluded, Function<R, T> mapper,
			String itemRoot) {
		try {
			R item = pickupRandom(items, excluded, mapper);
			String itemEncoded =  URLEncoder.encode(mapper.apply(item).toString(), "UTF-8");
			return Response.seeOther(baseUri.resolve(itemRoot + '/' + itemEncoded)).build();
		} catch (NoSuchElementException e) {
			return Response.status(Status.NOT_FOUND).build();
		} catch (UnsupportedEncodingException e) {
			return Response.serverError().build();
		}
	}
}
