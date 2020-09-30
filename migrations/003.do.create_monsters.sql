CREATE TABLE monsters (
    id TEXT PRIMARY KEY,
    monster_name TEXT NOT NULL,
    monster_type TEXT NOT NULL,
    challenge_rating TEXT NOT NULL,
    proficiencyBonus INTEGER NOT NULL,
    armorClass INTEGER NOT NULL,
    hitPoints INTEGER NOT NULL,
    speed TEXT NOT NULL,
    attackBonus INTEGER NOT NULL,
    saveDc INTEGER NOT NULL,
    strength INTEGER NOT NULL,
    dexterity INTEGER NOT NULL,
    constitution INTEGER NOT NULL,
    inteligence INTEGER NOT NULL,
    wisdom INTEGER NOT NULL,
    charisma INTEGER NOT NULL,
    damageVulnerability TEXT,
    damageResistances TEXT,
    damageImmunities TEXT,
    senses TEXT,
    creature_language TEXT,
    notes TEXT,
    user_id TEXT REFERENCES user_table(id) ON DELETE CASCADE NOT NULL
)