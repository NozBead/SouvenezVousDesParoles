package funetdelire.oublierparoles.utils;

import java.net.URI;
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
			return Response.seeOther(baseUri.resolve(itemRoot + '/' + mapper.apply(item))).build();
		} catch (NoSuchElementException e) {
			return Response.status(Status.NOT_FOUND).build();
		}
	}
}
