DROP TABLE IF EXISTS song;
CREATE TABLE song (
	id INTEGER,
	name TEXT,
	url TEXT,
	CONSTRAINT pk_song PRIMARY KEY (id),
	CONSTRAINT forced_url CHECK (url NOT NULL),
	CONSTRAINT forced_name CHECK (name NOT NULL)
);

DROP TABLE IF EXISTS theme;
CREATE TABLE theme (
	name TEXT,
	CONSTRAINT pk_theme PRIMARY KEY (name)
);

DROP TABLE IF EXISTS song_per_theme;
CREATE TABLE song_per_theme (
	song_id INTEGER,
	theme_name TEXT,
	CONSTRAINT pk_song PRIMARY KEY (song_id, theme_name),
	CONSTRAINT fk_song FOREIGN KEY (song_id) REFERENCES song(id),
	CONSTRAINT fk_theme FOREIGN KEY (theme_name) REFERENCES theme(name)
);