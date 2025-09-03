-- Generated SQL schema for SQL Server
-- This script is generated from the SQLAlchemy models.

CREATE TABLE events (
    id INT NOT NULL IDENTITY,
    name NVARCHAR(255) NOT NULL,
    date DATETIME2 NOT NULL,
    location NVARCHAR(500) NOT NULL,
    description NVARCHAR(MAX),
    promotores NVARCHAR(MAX), -- JSON array de IDs de promotores
    contact NVARCHAR(MAX), -- JSON: {type: 'whatsapp'|'link', value: string}
    imageUrl NVARCHAR(500),
    genre NVARCHAR(100),
    price NVARCHAR(MAX), -- JSON: {min: number, max?: number, currency: string}
    tags NVARCHAR(MAX), -- JSON array de strings
    capacity INT,
    featured BIT DEFAULT 0,
    promotor NVARCHAR(MAX), -- JSON object para compatibilidad
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE(),
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

-- INSERTS DE PRUEBA

-- Usuarios (id como Firebase UID simulado)
INSERT INTO users (id, email, role) VALUES
('uid123firebase001', 'joisnerjoelpte63@gmail.com', 'admin'),
('uid123firebase002', 'promoter1@example.com', 'promoter'),
('uid123firebase003', 'user1@example.com', 'user'),
('uid123firebase004', 'user2@example.com', 'user');

-- Eventos
INSERT INTO events (
    name, 
    date, 
    location, 
    description, 
    promotores, 
    contact, 
    imageUrl, 
    genre, 
    price, 
    tags, 
    capacity, 
    featured, 
    promotor
) VALUES 
(
    'Festival de Música Electrónica 2024',
    '2024-12-15 20:00:00',
    'Estadio Nacional, Madrid',
    'El mejor festival de música electrónica del año con los DJs más reconocidos internacionalmente.',
    '["promoter_001", "promoter_002"]',
    '{"type": "whatsapp", "value": "+34666123456"}',
    'https://example.com/images/festival-electronica.jpg',
    'Electrónica',
    '{"min": 45, "max": 120, "currency": "EUR"}',
    '["música", "electrónica", "festival", "madrid", "nocturno"]',
    15000,
    1,
    '{"id": "promoter_001", "name": "EventPro Madrid", "email": "info@eventpro.es"}'
),
(
    'Concierto Acústico Indie',
    '2024-11-20 19:30:00',
    'Sala Riviera, Barcelona',
    'Una noche íntima con los mejores artistas indie en formato acústico.',
    '["promoter_003"]',
    '{"type": "link", "value": "https://tickets.example.com/indie-acoustic"}',
    'https://example.com/images/concierto-indie.jpg',
    'Indie',
    '{"min": 25, "max": 40, "currency": "EUR"}',
    '["indie", "acústico", "barcelona", "íntimo"]',
    800,
    0,
    '{"id": "promoter_003", "name": "Indie Sounds BCN", "email": "contact@indiesounds.com"}'
),
(
    'Fiesta de Reggaeton',
    '2024-10-30 23:00:00',
    'Discoteca Kapital, Madrid',
    'La mejor fiesta de reggaeton con los hits más actuales y clásicos del género.',
    '["promoter_004", "promoter_005"]',
    '{"type": "whatsapp", "value": "+34677987654"}',
    'https://example.com/images/reggaeton-party.jpg',
    'Reggaeton',
    '{"min": 15, "max": 25, "currency": "EUR"}',
    '["reggaeton", "fiesta", "madrid", "nocturno", "baile"]',
    1200,
    1,
    '{"id": "promoter_004", "name": "Latino Nights", "email": "info@latinonights.es"}'
),
(
    'Jazz en el Parque',
    '2024-11-05 17:00:00',
    'Parque del Retiro, Madrid',
    'Concierto de jazz al aire libre con entrada gratuita. Perfecto para disfrutar en familia.',
    '["promoter_006"]',
    '{"type": "link", "value": "https://madrid.es/eventos/jazz-parque"}',
    'https://example.com/images/jazz-parque.jpg',
    'Jazz',
    '{"min": 0, "currency": "EUR"}',
    '["jazz", "gratuito", "parque", "familia", "madrid"]',
    2000,
    0,
    '{"id": "promoter_006", "name": "Ayuntamiento de Madrid", "email": "cultura@madrid.es"}'
),
(
    'Techno Underground',
    '2024-12-01 01:00:00',
    'Warehouse District, Valencia',
    'Evento underground de techno en una ubicación secreta. Solo para verdaderos amantes del género.',
    '["promoter_007"]',
    '{"type": "whatsapp", "value": "+34655444333"}',
    'https://example.com/images/techno-underground.jpg',
    'Techno',
    '{"min": 20, "max": 30, "currency": "EUR"}',
    '["techno", "underground", "valencia", "secreto", "nocturno"]',
    500,
    1,
    '{"id": "promoter_007", "name": "Underground Valencia", "email": "info@undergroundvlc.com"}'
);
-- Promotores
INSERT INTO promoters (id, user_id, name, phone, whatsapp, profile_url, enabled) VALUES
('prom001', 'uid123firebase002', 'Promoter One', '+34987654321', '+34987654321', 'https://img.com/prom1.jpg', 1);

-- Ticket Stages
INSERT INTO ticket_stages (event_id, name, start_date, end_date, price, availability, active) VALUES
(1, 'Early Bird', '2025-05-01 00:00:00', '2025-06-01 23:59:59', 30, 500, 1),
(1, 'General Admission', '2025-06-02 00:00:00', '2025-10-14 23:59:59', 60, 2000, 1),
(2, 'VIP', '2025-05-15 00:00:00', '2025-07-19 23:59:59', 90, 300, 1);

-- Transacciones
INSERT INTO transactions (user_id, mercado_pago_id, status, amount, currency, description, created_at)
VALUES
('uid123firebase003', 'mp_abc123', 'approved', 60, 'EUR', 'Compra entrada Rock Festival', GETDATE()),
('uid123firebase004', 'mp_def456', 'pending', 90, 'EUR', 'Compra VIP Electronic Summer', GETDATE());

-- Descuentos
INSERT INTO discounts (code, description, type, value, active, start_date, end_date, promoter_id, ticket_stage_id)
VALUES
('ROCK10', '10% descuento Rock Festival', 'percent', 10, 1, '2025-05-01', '2025-06-15', 'prom001', 1),
('VIP20', '20 EUR descuento en entradas VIP', 'fixed', 20, 1, '2025-05-15', '2025-07-01', 'prom001', 3);

-- Relación evento-promotor
INSERT INTO event_promoters (event_id, promoter_id) VALUES
(1, 'prom001'),
(2, 'prom001');
