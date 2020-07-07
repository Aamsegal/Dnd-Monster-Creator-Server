CREATE TABLE monster_moves (
    action_name TEXT NOT NULL,
    action_details TEXT NOT NULL,
    monster_id INTEGER
        REFERENCES monsters(id) ON DELETE CASCADE NOT NULL
)


/*CREATE TYPE action_type AS ENUM (
    'Skill',
    'Action',
    'Reaction'
);

ALTER TABLE monster_moves
  ADD COLUMN
    style action_type TEXT NOT NULL;*/