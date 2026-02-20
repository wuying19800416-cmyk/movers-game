
// Story Data Types and Scripts
export interface GameState {
    hp: number;
    inventory: string[];
    [key: string]: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export interface Choice {
    text: string;
    nextNodeId: string;
    requiredItem?: string;
    requiredWord?: string; // Player must have "collected" this word to see/pick this choice
    effect?: (gameState: GameState) => Partial<GameState>; // Update HP, add item, etc.
}

export interface StoryNode {
    id: string;
    text: string;
    background?: string; // Emoji or image URL
    choices: Choice[];
    image?: string;
}

export interface AdventureScript {
    id: string;
    title: string;
    nodes: Record<string, StoryNode>;
    initialState?: {
        inventory: string[];
        hp: number;
    };
}

export const MANSION_SCRIPT: AdventureScript = {
    id: 'mansion',
    title: 'The Mystery of the Mansion',
    nodes: {
        'start': {
            id: 'start',
            text: "You receive a strange {email} 📧. It has an {address} 🏠📍. You arrive at the {city} 🏙️ and see a huge {building} 🏗️.",
            background: '🏙️',
            choices: [
                { text: "Enter the building", nextNodeId: 'entrance' },
                { text: "Go back home", nextNodeId: 'game_over_scared' }
            ]
        },
        'entrance': {
            id: 'entrance',
            text: "At the door, a {grown-up} 👨‍💼 stops you. He is a {famous} 📸 architect. He looks very {busy} 🤯. He says: 'Please take this letter {upstairs} 🪜⬆️.'",
            background: '🏢',
            choices: [
                { text: "Take the elevator", nextNodeId: 'elevator' },
                { text: "Climb the stairs", nextNodeId: 'stairs' }
            ]
        },
        'elevator': {
            id: 'elevator',
            text: "You chose the {elevator} 🛗. It's fast! You arrive at the {balcony} 🏢. A {clown} 🤡 is there. He lost his {ticket} 🎟️.",
            background: '🛗',
            choices: [
                { text: "Help him find it", nextNodeId: 'find_ticket' }, // Grants ticket item
                { text: "Ignore him", nextNodeId: 'hallway' }
            ]
        },
        'stairs': {
            id: 'stairs',
            text: "The stairs are long... You feel tired. Suddenly, you get a {toothache} 🦷💥. You need a {dentist} 🦷👨‍⚕️ but you only see a {nurse} 👩‍⚕️.",
            background: '🪜',
            choices: [
                { text: "Ask the nurse for help", nextNodeId: 'nurse_help' }, // Heals HP
                { text: "Keep going", nextNodeId: 'hallway_pain' } // Lose HP
            ]
        },
        'nurse_help': {
            id: 'nurse_help',
            text: "The {nurse} gives you a {toothbrush} 🪥✨ and some water. You feel better! She points to the {basement} 🔦.",
            background: '🏥',
            choices: [
                { text: "Go to the basement", nextNodeId: 'basement' }
            ]
        },
        'find_ticket': {
            id: 'find_ticket',
            text: "You caught the {ticket} 🎟️ flying in the wind! The clown gives you a {blanket} 🛌 as thanks.",
            background: '🎪',
            choices: [
                { text: "Go to the basement", nextNodeId: 'basement_warm' } // Has blanket
            ]
        },
        'basement': {
            id: 'basement',
            text: "The {basement} 🔦 is cold and dark. You hear a {noise} 🔊⚡. It's very {quiet} 🤫... suddenly you see a {kitten} 🐱🍼!",
            background: '🔦',
            choices: [
                { text: "Pet the kitten", nextNodeId: 'kitten_friend' },
                { text: "Run away", nextNodeId: 'game_over_run' }
            ]
        },
        'basement_warm': {
            id: 'basement_warm',
            text: "The {basement} 🔦 is cold, but you have a {blanket} 🛌! You hear a {noise} 🔊⚡. A small {kitten} 🐱🍼 is shivering.",
            background: '🔦',
            choices: [
                { text: "Give blanket to kitten", nextNodeId: 'kitten_happy' },
                { text: "Keep walking", nextNodeId: 'secret_door' }
            ]
        },
        'kitten_happy': {
            id: 'kitten_happy',
            text: "The {kitten} stops crying. It gives you a key! You found the {treasure} 🏴‍☠️💎! (Wait, wrong story? No, it's just a golden key!)",
            background: '🐱',
            choices: [
                { text: "Finish Mission", nextNodeId: 'victory' }
            ]
        },
        'victory': {
            id: 'victory',
            text: "Congratulations! You solved the mystery. The architect thanks you for finding his cat.",
            background: '🎉',
            choices: [
                { text: "Play Again", nextNodeId: 'start' },
                { text: "Next Adventure", nextNodeId: 'next_chapter' } // Hook to Wild Trail
            ]
        },
        'hallway': { id: 'hallway', text: "You walk past the clown. The hallway is boring.", choices: [{ text: "Go down", nextNodeId: 'basement' }] },
        'hallway_pain': { id: 'hallway_pain', text: "Ouch, your tooth really hurts. (-10 HP)", choices: [{ text: "Go down", nextNodeId: 'basement' }] },
        'game_over_scared': { id: 'game_over_scared', text: "You went home. The mystery remains unsolved.", choices: [{ text: "Try Again", nextNodeId: 'start' }] },
        'game_over_run': { id: 'game_over_run', text: "You ran away from a cute kitten. Mission failed!", choices: [{ text: "Try Again", nextNodeId: 'start' }] },
        'secret_door': { id: 'secret_door', text: "You found a secret door, but it's locked.", choices: [{ text: "Go back", nextNodeId: 'basement' }] }
    }
};

export const WILD_TRAIL_SCRIPT: AdventureScript = {
    id: 'wild_trail',
    title: 'The Wild Trail',
    nodes: {
        'start': {
            id: 'start',
            text: "You leave the city for the {country} 🏞️. {Yesterday} ⏮️📅 you were city-bound, but now you feel {brave} 🦸.",
            background: '🏞️',
            choices: [
                { text: "Go to the farm", nextNodeId: 'farm' },
                { text: "Go to the jungle", nextNodeId: 'jungle' }
            ]
        },
        'farm': {
            id: 'farm',
            text: "You see a {farm} 🚜. A {farmer} 👨‍🌾 is driving a {tractor} 🚜🌾. He warns: 'The {forest} 🌲🌳 is {dangerous} ☠️.'",
            background: '🚜',
            choices: [
                { text: "Enter the forest anyway", nextNodeId: 'forest_danger' },
                { text: "Ask for a ride", nextNodeId: 'tractor_ride' }
            ]
        },
        'jungle': {
            id: 'jungle',
            text: "In the {jungle} 🌴🐅, a {kangaroo} 🦘 is {skipping} 🏃‍♀️🪢. You see a {whale} 🐋 in a... {lake} 🏞️💧?",
            background: '🌴',
            choices: [
                { text: "Investigate the whale", nextNodeId: 'whale_talk' },
                { text: "Climb a tree", nextNodeId: 'tree_climb' }
            ]
        },
        'whale_talk': {
            id: 'whale_talk',
            text: "The whale says 'I'm lost!'. You guide it to the {river} 🏞️🌊. It swims to the {waterfall} 🏞️⏬. Safe!",
            background: '🐋',
            choices: [{ text: "Continue", nextNodeId: 'bus_stop' }]
        },
        'tree_climb': {
            id: 'tree_climb',
            text: "You {climb} 🧗 high. Below, a {lion} 🦁 roars! You are safe up here.",
            background: '🦁',
            choices: [{ text: "Wait it out", nextNodeId: 'bus_stop' }]
        },
        'bus_stop': {
            id: 'bus_stop',
            text: "You reach a {bus stop} 🚌🛑. Will you take the bus or {ride} 🚴‍♂️ a bike?",
            background: '🚏',
            choices: [
                { text: "Take the bus", nextNodeId: 'weather_change' },
                { text: "Ride a bike", nextNodeId: 'weather_change_bike' }
            ]
        },
        'weather_change': {
            id: 'weather_change',
            text: "Sudden weather change! It's {windy} 🌬️🍃. Then... {snow} ☃️❄️! You need a {coat} 🧥 and {scarf} 🧣❄️.",
            background: '❄️',
            choices: [
                { text: "Put on clothes", nextNodeId: 'victory_wild' }
            ]
        },
        'weather_change_bike': {
            id: 'weather_change_bike',
            text: "Riding in the {snow} ☃️❄️ is hard! You fall and get {cold} 🥶. (-10 HP)",
            background: '❄️',
            choices: [
                { text: "Walk the rest", nextNodeId: 'victory_wild' }
            ]
        },
        'victory_wild': {
            id: 'victory_wild',
            text: "You survived the wild trail! The sea is ahead.",
            background: '🌊',
            choices: [
                { text: "Go to Pirate Island", nextNodeId: 'next_chapter' }
            ]
        },
        'tractor_ride': { id: 'tractor_ride', text: "The farmer gives you a lift. Fun!", choices: [{ text: "Go to bus stop", nextNodeId: 'bus_stop' }] },
        'forest_danger': { id: 'forest_danger', text: "It was too dangerous. You got lost.", choices: [{ text: "Restart", nextNodeId: 'start' }] }
    }
};

export const PIRATE_SCRIPT: AdventureScript = {
    id: 'pirate_island',
    title: "The Pirate's Prize",
    nodes: {
        'start': {
            id: 'start',
            text: "You arrive at the {island} 🏝️. Legend says there is {treasure} 🏴‍☠️💎 here.",
            background: '🏝️',
            choices: [{ text: "Go to the market", nextNodeId: 'market' }]
        },
        'market': {
            id: 'market',
            text: "At the {market} 🥦🏪, a {pirate} 🏴‍☠️ with a {beard} 🧔 is buying {cheese} 🧀 and {noodles} 🍜🥢. He looks {hungry} 🍽️🤤.",
            background: '🏪',
            choices: [
                { text: "Offer to cook", nextNodeId: 'cooking' },
                { text: "Fight him", nextNodeId: 'game_over_fight' }
            ]
        },
        'cooking': {
            id: 'cooking',
            text: "He wants {soup} 🥣🥄 and {pancake} 🥞🍁. And a {milkshake} 🥤🍓. Can you make them?",
            background: '🍳',
            choices: [
                { text: "Cook everything", nextNodeId: 'tea_time' },
                { text: "Burn the food", nextNodeId: 'game_over_burn' }
            ]
        },
        'tea_time': {
            id: 'tea_time',
            text: "He is happy! He offers you {tea} 🍵🫖. 'The treasure is hidden under the {moon} 🌙✨', he says.",
            background: '🍵',
            choices: [{ text: "Wait for night", nextNodeId: 'night_ritual' }]
        },
        'night_ritual': {
            id: 'night_ritual',
            text: "At night, you must draw a {circle} ⭕ on the {ground} 🟫. Don't get it {wrong} ❌🙅 or he will be {naughty} 👿.",
            background: '🌙',
            choices: [
                { text: "Draw a Circle", nextNodeId: 'treasure_found' },
                { text: "Draw a Square", nextNodeId: 'game_over_wrong' }
            ]
        },
        'treasure_found': {
            id: 'treasure_found',
            text: "You found it! A {rainbow} 🌈 appears. What a {brilliant} 💡 {holiday} 🏖️🌴. You write a story on your {laptop} 💻.",
            background: '💎',
            choices: [
                { text: "Finish Adventure", nextNodeId: 'credits' }
            ]
        },
        'credits': {
            id: 'credits',
            text: "Thank you for playing Movers Adventure! You learned many words today.",
            background: '🏁',
            choices: [
                { text: "Back to Menu", nextNodeId: 'menu' }
            ]
        },
        'game_over_fight': { id: 'game_over_fight', text: "Never fight a pirate!", choices: [{ text: "Try Again", nextNodeId: 'start' }] },
        'game_over_burn': { id: 'game_over_burn', text: "The pirate is angry about his burnt pancakes.", choices: [{ text: "Try Again", nextNodeId: 'start' }] },
        'game_over_wrong': { id: 'game_over_wrong', text: "Wrong shape! The pirate chases you.", choices: [{ text: "Try Again", nextNodeId: 'start' }] }
    }
};
