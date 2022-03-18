DROP TABLE IF EXISTS song;
CREATE TABLE song (
	id INTEGER,
	theme INTEGER,
	name TEXT,
	lyrics TEXT,
	context TEXT,
	guess_time INTEGER,
	video BLOB,
	CONSTRAINT pk_song PRIMARY KEY (id),
	CONSTRAINT fk_theme FOREIGN KEY (theme) REFERENCES theme(id),
	CONSTRAINT forced_name CHECK (name NOT NULL)
	CONSTRAINT forced_lyrics CHECK (lyrics NOT NULL),
	CONSTRAINT forced_context CHECK (context NOT NULL),
	CONSTRAINT forced_guess_time CHECK (guess_time NOT NULL)
);

DROP TABLE IF EXISTS theme;
CREATE TABLE theme (
	id INTEGER,
	name TEXT,
	difficulty INTEGER,
	CONSTRAINT pk_theme PRIMARY KEY (id),
	CONSTRAINT forced_difficulty CHECK (difficulty NOT NULL)
	CONSTRAINT forced_name CHECK (name NOT NULL)
);