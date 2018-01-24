# Design Doc for Rogue Two

### Goals

Rogue Two is a fairly standard, simple roguelike. As such, the player gets
 * character customization and leveling
 * interactions with NPCs
   * attack
   * con
   * bluff - pretend you're their faction
   * talk
* some tactically interesting combat
   * can decide to flee on any given turn
   * use of items
   * use of aether (the not-Force)
   * ranged attacks?
* exploration (of procedurally generated content)
* simple framing story
* a final battle/goal - get rich
* other standard roguelike experiences (permadeath, turn-based action, etc.)
  
### Story

A petty criminal has escaped prison and proceeds to ransack everything in sight. Initially armed with only a mop, basic skills in aether manipulation and their wits, the criminal wants to get rich through thievery and other illegal activities.

1. Escape the prison
     * Basic tutorial (movement, interaction, physical skills, aether skills)
2. Choices choices
     * Find transport
        * Steal things
        * Break things
    * Fight/con people
        * Ransack prison area
        * Steal things
        * Break things
        * Fight/con guards/prisoners
3. Continue until health depletes
        * Until level 66, health stats will increase
        * After level 66, old age kicks in and health stats decrease


### Mechanics

1. There is no win condition in this game - the goal is to get as rich as possible before all health is depleted. Success is measured in money, so a player can live long and do poorly, or pull off a daring heist, step on a bomb, and die rich.

2. Entropy mechanic (tentative) - every map will spawn at least one law enforcement officer, who will call for troops until the player successfully defeats them in combat or cons them into leaving them be. Non-officer, law-affiliated NPCs willa always move toward the player.

3. Leveling mechanic - a player gains XP by surviving fights, successfully conning, and successfully stealing. Rate of stat increase depends on the race, group, and type of a player.

NPC INTERACTION - for every NPC, be them enemy, neutral, or friendly, the player has the option of talking, conning/stealing from, or attacking

3. Combat - a player may engage any NPC in ranged or melee combat. An NPC attacked by ranged means will either move toward (law enforcement, other criminal or bounty hunter) or away from (merchant, average citizen, etc.) the player.
   * Ranged attack damage = target(endurance * agility * 1(luck, if below threshold)) - player(weapon base * intelligence * 1(luck, if below threshold))
   * Melee attack damage = target(endurance * agility * intelligence * 1(luck, if below threshold)) - player(weapon base * strength * 1(luck, if below threshold)) 
   * Aether attack = target(endurance * 1(luck, if below threshold)) - player(attack base * intelligence * 1(luck, if below threshold))

4. Thievery/bluffing - a player may not always be able to beat an NPC in a fight, but they might be able to steal from or con them. If a player encounters a daunting NPC and decides to con or steal, their rating is calculated as below. If the rating is above 0, the con or steal is a success. If the rating is less than or equal to 0, the target will attack if it's animosity level is high enough (so law enforcement or another criminal is likely to attack, but your average citizen or vender might just be upset and walk away).
   * Con rating = player(intelligence * charisma * 1(randomly-generated integer, if it is below the luck threshold)) -  target(intelligence * 1(randomly-generated integer, if it is below the luck threshold)
   * Steal rating = player(intelligence * stealth * 1(randomly-generated integer, if is below the luck threshold)) - target(intelligence * 1(randomly-generated integer, if it is below the luck threshold))
   
5. Factions - mostly so that law enforcement doesn't indiscriminately attack one another and the like
      We'll have four factions: criminals, law enforcement, neutrals, and player
