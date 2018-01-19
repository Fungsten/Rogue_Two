# Rogue Two Project Plan

This is the project plan for Rogue Two. This covers general planning thoughts in addition to tasks and milestones. This is NOT a design document for the game.

1. dev environment
2. console displayed
3. basic UI modes & switching
4. player messages
5. persistence
    a. ui mode
    b. serializing
    c. save & restore
6. map & most basic movement
    a. symbol
    b. tile
    c. map gen
    d. map display
    e. map nav
    f. game datastore
        i. map factory
        ii. unique id
        iii. datatore module
        iv. persistence
        v. object state data
            1. rng state
        vi. saving and restoring datastore
        vii. re-building maps
    h. new game stuff
7. entities & avatar
    a. entity
        i. template-based instantiation
            1. refactoring symbol and tile 
        ii. general factory
        iii. templates
    b. avatar
    c. map presence
    d. solidity
    e. persistence
8. key binding system
    a. define bindings and action constants
    b. use in UI mode input handlers
    c. different binding sets for different UI modes
    d. create a help mode that shows the key binding / command info
9. mixins
    a. active symbol
    b. basic mixins
    c. movement mixin
    d. events and listeners
10. combat / bump-driven interaction
11. the timing engine
    a. player actor
    b. AI mixins
