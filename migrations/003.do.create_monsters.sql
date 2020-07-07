CREATE TABLE monsters (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    challenge_rating TEXT NOT NULL,
    proficiencyBonus INTEGER NOT NULL,
    armorClass INTEGER NOT NULL,
    hitPoints TEXT NOT NULL,
    attackBonus INTEGER NOT NULL,
    saveDc INTEGER NOT NULL,
    strength INTEGER NOT NULL,
    strengthSave TEXT,
    dexterity INTEGER NOT NULL,
    dexteritySave TEXT,
    constitution INTEGER NOT NULL,
    constitutionSave TEXT,
    inteligence INTEGER NOT NULL,
    inteligenceSave TEXT,
    wisdom INTEGER NOT NULL,
    widsomSave TEXT,
    charisma INTEGER NOT NULL,
    charismaSave TEXT,
    damageVulnerability TEXT,
    senses TEXT,
    creature_language TEXT,
    user_id INTEGER
        REFERENCES user_table(id) ON DELETE CASCADE NOT NULL
)