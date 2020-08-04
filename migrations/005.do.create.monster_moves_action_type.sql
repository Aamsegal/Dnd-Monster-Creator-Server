CREATE TYPE action_type AS ENUM (
    'Skill',
    'Action',
    'Reaction'
);

ALTER TABLE monster_moves
  ADD COLUMN 
    style action_type NOT NULL;