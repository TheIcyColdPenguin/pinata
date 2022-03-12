CREATE TABLE IF NOT EXISTS levels (
        id INTEGER PRIMARY KEY,
        title VARCHAR(255),
        description TEXT,
        hint TEXT,
        question VARCHAR(255),
        initialise_db TEXT,
        flag VARCHAR(255),
        checker TEXT
);


INSERT OR IGNORE INTO levels(id, title, description, hint, question, initialise_db, flag, checker) VALUES(
                0,
                'The Basics',
                'This is the most basic exploit. It works because single quotes are not escaped by the application. Try entering a single quote into the input.',
                'Add a comment at the end of your malicious input using -- to ignore the rest of the query',
                'SELECT * FROM users WHERE username = '',,'' AND password = '',,'';',
                'CREATE TABLE users(
                        id INTEGER PRIMARY KEY,
                        username VARCHAR(255),
                        password VARCHAR(255)
                );

                INSERT INTO users(username, password) VALUES (''tinmanfall'', ''tinmanbruh'');
                INSERT INTO users(username, password) VALUES (''ayaya'', ''amogsus'');
                INSERT INTO users(username, password) VALUES (''frenkeldefects'', ''sadcatthumb'');
                INSERT INTO users(username, password) VALUES (''midorisensei'', ''wolf gupta'');
                INSERT INTO users(username, password) VALUES (''flag_is_here'', ''flag{sql_1nj3ct10n_15_co0l}'');
                ',
                'flag{sql_1nj3ct10n_15_co0l}',
                NULL
        );

INSERT OR IGNORE INTO levels(id, title, description, hint, question, initialise_db, flag, checker)
VALUES(
                1,
                'Unions',
                'Why execute just one query when we can execute two? Try using a UNION to also show the values in the secret table',
                'The sqlite_master table should come in handy',
                'SELECT name, price FROM items WHERE name LIKE ''%,,%'';',
                'CREATE TABLE items(
                        id INTEGER PRIMARY KEY,
                        name VARCHAR(255),
                        price INTEGER
                );
                CREATE TABLE secret(
                        id INTEGER PRIMARY KEY,
                        name VARCHAR(255),
                        value VARCHAR(255)
                );

                INSERT INTO items(name, price) VALUES (''purple jacket'', 420000);
                INSERT INTO items(name, price) VALUES (''fnaf donut poster'', 1300);
                INSERT INTO items(name, price) VALUES (''pacman memorial'', 5000000);
                INSERT INTO items(name, price) VALUES (''ayaya'', 0);
                INSERT INTO secret(name, value) VALUES (''flag'', ''flag{j01n_4_un10n_t0d4y!}'');
                ',
                'flag{j01n_4_un10n_t0d4y!}',
                NULL
        );

INSERT OR IGNORE INTO levels(id, title, description, hint, question, initialise_db, flag, checker)
VALUES(
                2,
                'Bobby Tables',
                'If the application naively executes multiple commands, we can simply run a destructive command after the first command, by cleverly using semicolons.',
                'Try dropping the users table',
                'SELECT * FROM users WHERE username='',,'' AND password='',,'';',
                'CREATE TABLE users(
                        id INTEGER PRIMARY KEY,
                        username VARCHAR(255),
                        password VARCHAR(255)
                );

                INSERT INTO users(username, password) VALUES (''tinmanfall'', ''tinmanbruh'');
                INSERT INTO users(username, password) VALUES (''ayaya'', ''amogsus'');
                INSERT INTO users(username, password) VALUES (''frenkeldefects'', ''sadcatthumb'');
                INSERT INTO users(username, password) VALUES (''midorisensei'', ''wolf gupta'');
                ',
                'flag{l1ttl3_b0bby_t4bl3s_w3_c4ll_h1m}',
                'SELECT name FROM sqlite_master WHERE name=''users'';'
        );

INSERT OR IGNORE INTO levels(id, title, description, hint, question, initialise_db, flag, checker)
VALUES(
                3,
                'Secrets No More',
                'This exercise utilises the same principle as the previous one, except instead of simply causing harm by deleting data, we update existing records by changing the passwords of users.',
                'Use an UPDATE commmand to change the passwrod of the user `ayaya`',
                'SELECT * FROM users WHERE username='',,'' AND password='',,'';',
                'CREATE TABLE users(
                        id INTEGER PRIMARY KEY,
                        username VARCHAR(255),
                        password VARCHAR(255)
                );

                INSERT INTO users(username, password) VALUES (''idlisambhar'', ''dosavada'');
                INSERT INTO users(username, password) VALUES (''tinmanfall'', ''tinmanbruh'');
                INSERT INTO users(username, password) VALUES (''ayaya'', ''amogsus'');
                INSERT INTO users(username, password) VALUES (''frenkeldefects'', ''sadcatthumb'');
                INSERT INTO users(username, password) VALUES (''midorisensei'', ''wolf gupta'');
                ',
                'flag{upd4t3_y0ur_s0ftw4r3_n0w}',
                'SELECT username from users where username = ''ayaya'' and password = ''amogsus'';'
        );