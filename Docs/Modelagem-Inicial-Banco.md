users:

id
name
email
password
avatar
created_at
updated_at

tournaments:

id
owner_id
name
description
max_players
status
created_at
updated_at

status:

WAITING
STARTED
FINISHED

tournament_participants

id
tournament_id
user_id
joined_at

matches:

id
tournament_id
player_one_id
player_two_id
winner_id
round
status
created_at

status:

PENDING
FINISHED

tournament_history:

id
tournament_id
champion_id
finished_at
