-- Generated SQL schema for SQL Server
-- This script is generated from the SQLAlchemy models.

CREATE TABLE events (
	id INTEGER NOT NULL IDENTITY,
	name VARCHAR(max) NOT NULL,
	date DATETIME NOT NULL,
	location VARCHAR(max) NOT NULL,
	description TEXT NULL,
	contact_type VARCHAR(max) NULL,
	contact_value VARCHAR(max) NULL,
	[imageUrl] VARCHAR(max) NULL,
	genre VARCHAR(max) NULL,
	price_min FLOAT NULL,
	price_max FLOAT NULL,
	price_currency VARCHAR(max) NULL,
	tags VARCHAR(max) NULL,
	capacity INTEGER NULL,
	featured BIT NULL,
	PRIMARY KEY (id)
);

CREATE TABLE users (
	id VARCHAR(max) NOT NULL,
	email VARCHAR(max) NOT NULL,
	role VARCHAR(9) NOT NULL,
	PRIMARY KEY (id)
);

CREATE TABLE promoters (
	id VARCHAR(max) NOT NULL,
	user_id VARCHAR(max) NOT NULL,
	name VARCHAR(max) NOT NULL,
	phone VARCHAR(max) NULL,
	whatsapp VARCHAR(max) NULL,
	profile_url VARCHAR(max) NULL,
	enabled BIT NULL,
	PRIMARY KEY (id),
	FOREIGN KEY(user_id) REFERENCES users (id)
);

CREATE TABLE ticket_stages (
	id INTEGER NOT NULL IDENTITY,
	event_id INTEGER NOT NULL,
	name VARCHAR(max) NOT NULL,
	start_date DATETIME NOT NULL,
	end_date DATETIME NOT NULL,
	price FLOAT NOT NULL,
	availability INTEGER NOT NULL,
	active BIT NULL,
	PRIMARY KEY (id),
	FOREIGN KEY(event_id) REFERENCES events (id)
);

CREATE TABLE transactions (
	id INTEGER NOT NULL IDENTITY,
	user_id VARCHAR(max) NOT NULL,
	mercado_pago_id VARCHAR(max) NULL,
	status VARCHAR(max) NOT NULL,
	amount FLOAT NOT NULL,
	currency VARCHAR(max) NULL,
	description VARCHAR(max) NULL,
	created_at DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at DATETIME NULL,
	purchase_details NVARCHAR(max) NULL,
	PRIMARY KEY (id),
	FOREIGN KEY(user_id) REFERENCES users (id)
);

CREATE TABLE discounts (
	id INTEGER NOT NULL IDENTITY,
	code VARCHAR(max) NOT NULL,
	description VARCHAR(max) NULL,
	type VARCHAR(8) NOT NULL,
	value FLOAT NOT NULL,
	active BIT NULL,
	start_date DATETIME NULL,
	end_date DATETIME NULL,
	promoter_id VARCHAR(max) NULL,
	ticket_stage_id INTEGER NULL,
	PRIMARY KEY (id),
	FOREIGN KEY(promoter_id) REFERENCES promoters (id),
	FOREIGN KEY(ticket_stage_id) REFERENCES ticket_stages (id)
);

CREATE TABLE event_promoters (
	event_id INTEGER NOT NULL,
	promoter_id VARCHAR(max) NOT NULL,
	PRIMARY KEY (event_id, promoter_id),
	FOREIGN KEY(event_id) REFERENCES events (id),
	FOREIGN KEY(promoter_id) REFERENCES promoters (id)
);
