CREATE TABLE IF NOT EXISTS levels (
        id INTEGER PRIMARY KEY,
        title VARCHAR(255),
        description TEXT,
        hint TEXT,
        question VARCHAR(255)
);


INSERT OR IGNORE INTO levels(id, title, description, hint, question)
VALUES(
                1,
                'The Basics',
                'This is the most basic exploit,
we can use this to explain how this whole thing works.
The initial query could be',
                'Some hint goes here',
                "SELECT * FROM users WHERE username = ',' AND password = ',';"
        );

INSERT OR IGNORE INTO levels(id, title, description, hint, question)
VALUES(
                2,
                'Exercise 2',
                "The premise here is that the user can search for items or smth but since it 's vulnerable to injection, we could UNION the result with a malicious query like so",
                'Some hint goes here',
                "SELECT (name, price) FROM items WHERE name LIKE '%,%';"
        );

INSERT OR IGNORE INTO levels(id, title, description, hint, question)
VALUES(
                3,
                'Exercise 3',
                'If the application naively executes multiple commands, we can simply run a destructive command after the first command, by cleverly using semicolons.',
                'Some hint goes here',
                "SELECT * FROM users WHERE username=',' AND password=',';"
        );

INSERT OR IGNORE INTO levels(id, title, description, hint, question)
VALUES(
                4,
                'Exercise 4',
                'This exercise utilises the same principle as the previous one, except, instead of simply causing harm by deleting data, we update an existing record with custom credentials. One could possibly even take over a specific account by changing the password.',
                'Some hint goes here',
                "SELECT * FROM users WHERE username=',' AND password=',';"
        );