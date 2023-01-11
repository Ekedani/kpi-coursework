CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
DROP TYPE  IF EXISTS user_role;
CREATE TYPE user_role AS ENUM ('admin', 'user');

CREATE TABLE IF NOT EXISTS "user" (
    id  uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    api_key uuid UNIQUE,
    first_name varchar (64) NOT NULL,
    last_name varchar (64) NOT NULL,
    email varchar (64) UNIQUE NOT NULL,
    role user_role NOT NULL,
    password varchar (72) NOT NULL
);

CREATE TABLE IF NOT EXISTS "cinema" (
    id  uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name varchar (64) NOT NULL,
    description text,
    picture varchar (64),
    link varchar (128) NOT NULL
);
