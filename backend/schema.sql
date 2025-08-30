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

CREATE TABLE etapas_boletas (
	id INTEGER NOT NULL IDENTITY,
	event_id INTEGER NOT NULL,
	nombre VARCHAR(max) NOT NULL,
	[fechaInicio] DATETIME NOT NULL,
	[fechaFin] DATETIME NOT NULL,
	precio FLOAT NOT NULL,
	disponibilidad INTEGER NOT NULL,
	activa BIT NULL,
	PRIMARY KEY (id),
	FOREIGN KEY(event_id) REFERENCES events (id)
);

CREATE TABLE promotores (
	id VARCHAR(max) NOT NULL,
	user_id VARCHAR(max) NOT NULL,
	nombre VARCHAR(max) NOT NULL,
	telefono VARCHAR(max) NULL,
	whatsapp VARCHAR(max) NULL,
	[perfilUrl] VARCHAR(max) NULL,
	habilitado BIT NULL,
	PRIMARY KEY (id),
	FOREIGN KEY(user_id) REFERENCES users (id)
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

CREATE TABLE descuentos (
	id INTEGER NOT NULL IDENTITY,
	codigo VARCHAR(max) NOT NULL,
	descripcion VARCHAR(max) NULL,
	tipo VARCHAR(8) NOT NULL,
	valor FLOAT NOT NULL,
	activo BIT NULL,
	[fechaInicio] DATETIME NULL,
	[fechaFin] DATETIME NULL,
	promotor_id VARCHAR(max) NULL,
	etapa_id INTEGER NULL,
	PRIMARY KEY (id),
	FOREIGN KEY(promotor_id) REFERENCES promotores (id),
	FOREIGN KEY(etapa_id) REFERENCES etapas_boletas (id)
);

CREATE TABLE event_promotores (
	event_id INTEGER NOT NULL,
	promotor_id VARCHAR(max) NOT NULL,
	PRIMARY KEY (event_id, promotor_id),
	FOREIGN KEY(event_id) REFERENCES events (id),
	FOREIGN KEY(promotor_id) REFERENCES promotores (id)
);
