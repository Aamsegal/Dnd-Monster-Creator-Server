CREATE TABLE monster_moves (
    action_name TEXT NOT NULL,
    action_details TEXT NOT NULL,
    monster_id INTEGER
        REFERENCES monsters(id) ON DELETE CASCADE NOT NULL
)