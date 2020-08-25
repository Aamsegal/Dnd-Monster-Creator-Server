CREATE TABLE monster_moves (
    id TEXT PRIMARY KEY,
    action_name TEXT NOT NULL,
    action_details TEXT NOT NULL,
    damage_dice TEXT NOT NULL,
    monster_id TEXT REFERENCES monsters(id) ON DELETE CASCADE NOT NULL
)