# Server Details

`Name:` Dnd Monster Creator Server and Database

`Application Link:` [Dnd Monster Creator Link](https://dnd-monster-creator.vercel.app/application)

`Description:` This server runs all the backend for the application linked above. Contains all of the API endpoints for the database which stores the users info as well as their monsters and extra details for those monsters.

`Technologies:` Javascript, Express, CORS, PG

# Endpoints

There are 4 endpoints. Starting, Users, Monsters and Monster Moves.



## Starting Point Endpoint

`/api/monsterStartingPoint` This endpoint doesnt take any arguments and only had a **GET** request grabbing all of the monster starting point levels.

## Users Endpoint

`/api/users` This endpoint has a **POST** request. Requires a username and password in the body. (username: x, password: y). Then it generated a unique id on the server and saves a new user with a unique id, username and password (which is encrypted on the front end.)

`/api/users/:username/:userpass` This endpoint has a **GET** request. The call required a username and userpass to be in the url of the request. The database will return the user Id if there is a user with the username and userpass presented, the api will return the user id to be used in later api calls.

## Monsters Endpoint

`/api/monsters` This endpoint has a **POST** request. The call accepts a response body with many variables (listed below). The variables are either required or not required and will create a monster based on the data provided. <br />

**Required request body values**
    (id, monster_name, monster_type, challenge_rating, proficiencybonus, armorclass, hitpoints, speed, attackbonus, savedc, strength, dexterity, constitution, inteligence, wisdom, charisma, damagevulnerability, damageresistances, damageimmunities, senses, creature_language, notes, user_id)

**Non-Required request body values**
    (id, monster_name, monster_type, challenge_rating, proficiencybonus, armorclass, hitpoints, attackbonus, savedc, speed, strength, dexterity, constitution, inteligence, wisdom, charisma, user_id)

If any of the values that are required are missing, the server will respond with whatever value is missing. After validating all the required values are there, the required and non required will be combined and then the monster will be saved to the database.

`/api/monsters/monsterId/:id` This endpoint has a **DELETE** and **PATCH** request.

**DELETE Request:** The delete endpoint uses the monster id provided in the request url and then deletes that monster from the database.

**PATCH Request** The patch request takes any and all values from the front end and then changes than if any changes are detected. Request body required any values you wish to change in the monster.

`/api/monsters/userId/:id` This endpoint only has a **GET** request. This request required a user id and then returns all monsters saved with this user id as a reference to the user table id.

## Monster Moves Endpoint

`/api/monsterMoves` This endpoint only has a **POST** request. In the request body, the api must provide the following variables (action_name, action_details, damage_dice, style, monster_id). The server will then generate an unique id and post the attack in the server. For style, the only acceptable values are **Action**, **Reaction** or **Skill**. All body values are strings.

`/api/monsterMoves/:move_id` This endpoint has a **PATCH** and **DELETE** request.

**DELETE** The delete endpoint looks for a monster move with the id (string) provided in the url and then deletes it if it exists.

**PATCH** The patch endpoint takes any of the body values listed above and will save the new provided value if there is a change.

`/api/monsterMoves/specificMonster/:monster_id` This endpoint only has a **GET** request. In the request url, a monster id (string) must be provided. Then all moves and there data will be returns for that monster.