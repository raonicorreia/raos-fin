CREATE TABLE [users] (
	id BIGINT IDENTITY(1,1) NOT NULL,
	active bit DEFAULT 1 NOT NULL,
	name varchar(100) NOT NULL,
	email varchar(200) NOT NULL,
	password varchar(50) NOT NULL,
  CONSTRAINT [PK_USER] PRIMARY KEY CLUSTERED
  (
  [id] ASC
  ) WITH (IGNORE_DUP_KEY = OFF)

)
GO
CREATE TABLE [transaction_types] (
	id BIGINT IDENTITY(1,1) NOT NULL,
	active bit DEFAULT 1 NOT NULL,
	user_id BIGINT NOT NULL,
	name varchar(100) NOT NULL,
	transaction_value decimal NOT NULL,
	type varchar(50) NOT NULL,
	installments integer NOT NULL,
	due_date integer NOT NULL,
	monthly_movement bit NOT NULL,
  CONSTRAINT [PK_TRANSACTION_TYPES] PRIMARY KEY CLUSTERED
  (
  [id] ASC
  ) WITH (IGNORE_DUP_KEY = OFF)

)
GO
CREATE TABLE [financial_transactions] (
	id BIGINT IDENTITY(1,1) NOT NULL,
	user_id BIGINT NOT NULL,
	account_id BIGINT NOT NULL,
	transaction_types_id BIGINT NOT NULL,
	status varchar(20) NOT NULL,
	due_date date NOT NULL,
	payment_date date,
	transaction_value decimal,
  CONSTRAINT [PK_FINANCIAL_TRANSACTIONS] PRIMARY KEY CLUSTERED
  (
  [id] ASC
  ) WITH (IGNORE_DUP_KEY = OFF)

)
GO
CREATE TABLE [account] (
	id BIGINT IDENTITY(1,1) NOT NULL,
	active  bit DEFAULT 1 NOT NULL,
	name varchar(100) NOT NULL,
	balance decimal NOT NULL,
	user_id BIGINT NOT NULL,
  CONSTRAINT [PK_ACCOUNT] PRIMARY KEY CLUSTERED
  (
  [id] ASC
  ) WITH (IGNORE_DUP_KEY = OFF)

)
GO

ALTER TABLE [transaction_types] WITH CHECK ADD CONSTRAINT [transaction_types_fk0] FOREIGN KEY ([user_id]) REFERENCES [users]([id])
ON UPDATE CASCADE
GO
ALTER TABLE [transaction_types] CHECK CONSTRAINT [transaction_types_fk0]
GO

ALTER TABLE [financial_transactions] WITH CHECK ADD CONSTRAINT [financial_transactions_fk0] FOREIGN KEY ([user_id]) REFERENCES [users]([id])
ON UPDATE CASCADE
GO
ALTER TABLE [financial_transactions] CHECK CONSTRAINT [financial_transactions_fk0]
GO
ALTER TABLE [financial_transactions] WITH CHECK ADD CONSTRAINT [financial_transactions_fk1] FOREIGN KEY ([account_id]) REFERENCES [account]([id])
ON UPDATE CASCADE
GO
ALTER TABLE [financial_transactions] CHECK CONSTRAINT [financial_transactions_fk1]
GO
ALTER TABLE [financial_transactions] WITH CHECK ADD CONSTRAINT [financial_transactions_fk2] FOREIGN KEY ([transaction_types_id]) REFERENCES [transaction_types]([id])
GO
ALTER TABLE [financial_transactions] CHECK CONSTRAINT [financial_transactions_fk2]
GO

ALTER TABLE [account] WITH CHECK ADD CONSTRAINT [account_fk0] FOREIGN KEY ([user_id]) REFERENCES [users]([id])
GO
ALTER TABLE [account] CHECK CONSTRAINT [account_fk0]
GO
