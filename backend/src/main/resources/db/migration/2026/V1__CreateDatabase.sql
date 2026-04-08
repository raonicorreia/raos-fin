CREATE TABLE users (
	id BIGINT AUTO_INCREMENT NOT NULL,
	active TINYINT(1) DEFAULT 1 NOT NULL,
	name varchar(100) NOT NULL,
	email varchar(200) NOT NULL,
	password varchar(250) NOT NULL,
	CONSTRAINT PK_USER PRIMARY KEY (id)
);
CREATE TABLE transaction_types (
	id BIGINT AUTO_INCREMENT NOT NULL,
	user_id BIGINT NOT NULL,
	account_id BIGINT NOT NULL,
	active TINYINT(1) DEFAULT 1 NOT NULL,
	name varchar(100) NOT NULL,
	transaction_value decimal(10, 2) NOT NULL,
	type varchar(50) NOT NULL,
	installments int NOT NULL,
	due_date int NOT NULL,
	monthly_movement TINYINT(1) NOT NULL,
	CONSTRAINT PK_TRANSACTION_TYPES PRIMARY KEY (id)
);
CREATE TABLE financial_transactions (
	id BIGINT AUTO_INCREMENT NOT NULL,
	user_id BIGINT NOT NULL,
	account_id BIGINT NOT NULL,
	transaction_types_id BIGINT NOT NULL,
	status varchar(20) NOT NULL,
	due_date date NOT NULL,
	payment_date date,
	transaction_value decimal(10, 2),
	CONSTRAINT PK_FINANCIAL_TRANSACTIONS PRIMARY KEY (id)
);
CREATE TABLE account (
	id BIGINT AUTO_INCREMENT NOT NULL,
	active TINYINT(1) DEFAULT 1 NOT NULL,
	name varchar(100) NOT NULL,
	balance decimal(10, 2) NOT NULL,
	user_id BIGINT NOT NULL,
	CONSTRAINT PK_ACCOUNT PRIMARY KEY (id)
);

ALTER TABLE transaction_types ADD CONSTRAINT transaction_types_fk0 FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE;
ALTER TABLE transaction_types ADD CONSTRAINT transaction_types_fk1 FOREIGN KEY (account_id) REFERENCES account(id) ON UPDATE CASCADE;
ALTER TABLE financial_transactions ADD CONSTRAINT financial_transactions_fk0 FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE;
ALTER TABLE financial_transactions ADD CONSTRAINT financial_transactions_fk1 FOREIGN KEY (account_id) REFERENCES account(id) ON UPDATE CASCADE;
ALTER TABLE financial_transactions ADD CONSTRAINT financial_transactions_fk2 FOREIGN KEY (transaction_types_id) REFERENCES transaction_types(id) ON UPDATE CASCADE;
ALTER TABLE account ADD CONSTRAINT account_fk0 FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE;
