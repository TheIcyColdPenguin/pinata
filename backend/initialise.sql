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
                'This is the most basic exploit,
we can use this to explain how this whole thing works.
The initial query could be',
                'Some hint goes here',
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
                'Exercise 2',
                'The premise here is that the user can search for items or smth but since it''s vulnerable to injection, we could UNION the result with a malicious query like so',
                'Some hint goes here',
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
                'Exercise 3',
                'If the application naively executes multiple commands, we can simply run a destructive command after the first command, by cleverly using semicolons.',
                'Some hint goes here',
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
                'flag{l1ttl3_b0bby_t4bl3s}',
                'SELECT name FROM sqlite_master WHERE name=''users'';'
        );

INSERT OR IGNORE INTO levels(id, title, description, hint, question, initialise_db, flag, checker)
VALUES(
                3,
                'Exercise 4',
                'This exercise utilises the same principle as the previous one, except, instead of simply causing harm by deleting data, we update an existing record with custom credentials. One could possibly even take over a specific account by changing the password.',
                'Some hint goes here',
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
                'flag{gr0wn_up_b0bby_t4bl3s}',
                'SELECT username from users where username = ''ayaya'' and password = ''amogsus'';'
        );