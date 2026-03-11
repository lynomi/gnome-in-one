/*
* LEVEL CREATION REFERENCE
* canvas size 1000x500
* startpos and hole - x = pixels from left, y - pixels from top
* velocity
*   x = horizontal speed, positive right, negative left
*   y - vertical speed, positive down, negative up
* angle - radians
 */
export const LEVELS = [
    {
        id: 1,
        title: "Level 1 - Garden Start",
        maxBlocks: 3,
        startPos: { x: 50, y: 350 },
        velocity: { x: 7, y: -10 },
        hole: { x: 735, y: 330, radius: 12 },
        obstacles: [
            { x: 425, y: 400, width: 90, height: 18, angle: 0 }
        ]
    },
    {
        id: 2,
        title: "Level 2 - Hedge Hop",
        maxBlocks: 3,
        startPos: { x: 150, y: 160 },
        velocity: { x: 5, y: 0 },
        hole: { x: 900, y: 400, radius: 12 },
        obstacles: [
            { x: 250, y: 200, width: 100, height: 18, angle: 0 },
            { x: 450, y: 280, width: 100, height: 18, angle: 0 },
            { x: 650, y: 360, width: 100, height: 18, angle: 0 }
        ]
    },
    {
        id: 3,
        title: "Level 3 - Bridge Bounce",
        maxBlocks: 3,
        startPos: { x: 100, y: 300 },
        velocity: { x: 12, y: -8 },
        hole: { x: 800, y: 350, radius: 12 },
        obstacles: [
            { x: 250, y: 350, width: 200, height: 18, angle: 0 },
            { x: 700, y: 380, width: 200, height: 18, angle: 0 }
        ]
    },
    {
        id: 4,
        title: "Level 4 - Wishing Well",
        maxBlocks: 3,
        startPos: { x: 310, y: 300 },
        velocity: { x: 12, y: -8 },
        hole: { x: 300, y: 488, radius: 12 },
        obstacles: [
            { x: 240, y: 250, width: 20, height: 300, angle: 0 },
            { x: 200, y: 250, width: 20, height: 300, angle: 0 },
            { x: 260, y: 80, width: 20, height: 60, angle: 0.7 },
            { x: 390, y: 400, width: 20, height: 300, angle: 2.3 }
        ]
    },
    {
        id: 5,
        title: "Level 5 - Tall Hedge",
        maxBlocks: 3,
        startPos: { x: 100, y: 300 },
        velocity: { x: 12, y: 8 },
        hole: { x: 800, y: 350, radius: 12 },
        obstacles: [
            { x: 700, y: 380, width: 20, height: 500, angle: 0 }
        ]
    },
    {
        id: 6,
        title: "Level 6 - Mushroom Run",
        maxBlocks: 3,
        startPos: { x: 90, y: 430 },
        velocity: { x: 11, y: -7 },
        hole: { x: 910, y: 120, radius: 12 },
        obstacles: [
            { x: 260, y: 340, width: 20, height: 260, angle: 0 },
            { x: 500, y: 160, width: 20, height: 260, angle: 0 },
            { x: 740, y: 340, width: 20, height: 260, angle: 0 },
            { x: 900, y: 180, width: 180, height: 20, angle: 0 },
            { x: 830, y: 120, width: 20, height: 100, angle: 0 }
        ]
    },
    {
        id: 7,
        title: "Level 7 - Lantern Lane",
        maxBlocks: 3,
        startPos: { x: 100, y: 90 },
        velocity: { x: 10, y: 8 },
        hole: { x: 920, y: 420, radius: 12 },
        obstacles: [
            { x: 260, y: 160, width: 20, height: 260, angle: 0 },
            { x: 500, y: 340, width: 20, height: 260, angle: 0 },
            { x: 740, y: 160, width: 20, height: 260, angle: 0 },
            { x: 900, y: 350, width: 140, height: 20, angle: 0 },
            { x: 820, y: 420, width: 20, height: 120, angle: 0 },
            { x: 900, y: 490, width: 200, height: 20, angle: 0 }
        ]
    },
    {
        id: 8,
        title: "Level 8 - Garden Gate",
        maxBlocks: 3,
        startPos: { x: 80, y: 250 },
        velocity: { x: 12, y: -3 },
        hole: { x: 920, y: 250, radius: 12 },
        obstacles: [
            { x: 300, y: 120, width: 20, height: 180, angle: 0 },
            { x: 300, y: 380, width: 20, height: 180, angle: 0 },
            { x: 540, y: 250, width: 20, height: 240, angle: 0 },
            { x: 780, y: 120, width: 20, height: 180, angle: 0 },
            { x: 780, y: 380, width: 20, height: 180, angle: 0 },
            { x: 900, y: 180, width: 160, height: 20, angle: 0 },
            { x: 900, y: 320, width: 160, height: 20, angle: 0 }
        ]
    },
    {
        id: 9,
        title: "Level 9 - Bomb Gnome Alley",
        maxBlocks: 3,
        startPos: { x: 90, y: 420 },
        velocity: { x: 11, y: -8 },
        hole: { x: 920, y: 90, radius: 12 },
        obstacles: [
            { x: 280, y: 300, width: 20, height: 320, angle: 0 },
            { x: 560, y: 200, width: 20, height: 320, angle: 0 },
            { x: 420, y: 250, width: 70, height: 40, angle: 0, label: "bombgnome", color: "#cc3b3b" },
            { x: 760, y: 300, width: 20, height: 320, angle: 0 },
            { x: 910, y: 160, width: 180, height: 20, angle: 0 },
            { x: 820, y: 90, width: 20, height: 120, angle: 0 }
        ]
    },
    {
        id: 10,
        title: "Level 10 - Brook Boost",
        maxBlocks: 3,
        startPos: { x: 120, y: 100 },
        velocity: { x: 10, y: 8 },
        hole: { x: 900, y: 420, radius: 12 },
        obstacles: [
            { x: 260, y: 250, width: 20, height: 440, angle: 0 },
            { x: 430, y: 420, width: 20, height: 260, angle: 0 },
            { x: 600, y: 80, width: 20, height: 260, angle: 0 },
            { x: 770, y: 250, width: 20, height: 440, angle: 0 },
            { x: 350, y: 440, width: 120, height: 20, angle: -0.6, label: "speedRamp", color: "#00d2ff" },
            { x: 540, y: 60, width: 120, height: 20, angle: 0.6, label: "speedRamp", color: "#00d2ff" },
            { x: 900, y: 350, width: 120, height: 20, angle: 0 },
            { x: 830, y: 420, width: 20, height: 120, angle: 0 },
            { x: 900, y: 490, width: 200, height: 20, angle: 0 }
        ]
    },
    {
        id: 11,
        title: "Level 11 - Gnome Watch",
        maxBlocks: 3,
        startPos: { x: 80, y: 250 },
        velocity: { x: 13, y: 0 },
        hole: { x: 930, y: 250, radius: 12 },
        obstacles: [
            { x: 260, y: 130, width: 20, height: 200, angle: 0 },
            { x: 260, y: 370, width: 20, height: 200, angle: 0 },
            { x: 520, y: 250, width: 20, height: 220, angle: 0 },
            { x: 780, y: 130, width: 20, height: 200, angle: 0 },
            { x: 780, y: 370, width: 20, height: 200, angle: 0 },
            { x: 650, y: 430, width: 70, height: 40, angle: 0, label: "bombgnome", color: "#cc3b3b" },
            { x: 910, y: 180, width: 140, height: 20, angle: 0 },
            { x: 910, y: 320, width: 140, height: 20, angle: 0 }
        ]
    },
    {
        id: 12,
        title: "Level 12 - Totem Stack",
        maxBlocks: 3,
        startPos: { x: 500, y: 460 },
        velocity: { x: 0, y: -14 },
        hole: { x: 500, y: 80, radius: 12 },
        obstacles: [
            { x: 240, y: 380, width: 420, height: 20, angle: 0 },
            { x: 760, y: 300, width: 420, height: 20, angle: 0 },
            { x: 240, y: 220, width: 420, height: 20, angle: 0 },
            { x: 760, y: 140, width: 420, height: 20, angle: 0 },
            { x: 500, y: 300, width: 20, height: 120, angle: 0 },
            { x: 500, y: 180, width: 20, height: 120, angle: 0 },
            { x: 500, y: 260, width: 120, height: 18, angle: 0.55 },
            { x: 430, y: 80, width: 20, height: 100, angle: 0 },
            { x: 570, y: 80, width: 20, height: 100, angle: 0 }
        ]
    },
    {
        id: 13,
        title: "Level 13 - Bomb Ring",
        maxBlocks: 3,
        startPos: { x: 100, y: 250 },
        velocity: { x: 12, y: -2 },
        hole: { x: 900, y: 250, radius: 12 },
        obstacles: [
            { x: 250, y: 120, width: 20, height: 220, angle: 0 },
            { x: 250, y: 380, width: 20, height: 220, angle: 0 },
            { x: 450, y: 100, width: 20, height: 160, angle: 0 },
            { x: 450, y: 400, width: 20, height: 160, angle: 0 },
            { x: 650, y: 120, width: 20, height: 220, angle: 0 },
            { x: 650, y: 380, width: 20, height: 220, angle: 0 },
            { x: 840, y: 250, width: 70, height: 40, angle: 0, label: "bombgnome", color: "#cc3b3b" },
            { x: 900, y: 190, width: 70, height: 40, angle: 0, label: "bombgnome", color: "#cc3b3b" },
            { x: 960, y: 250, width: 70, height: 40, angle: 0, label: "bombgnome", color: "#cc3b3b" },
            { x: 900, y: 310, width: 70, height: 40, angle: 0, label: "bombgnome", color: "#cc3b3b" },
            { x: 900, y: 130, width: 240, height: 20, angle: 0 },
            { x: 900, y: 370, width: 240, height: 20, angle: 0 }
        ]
    },
    {
        id: 14,
        title: "Level 14 - Gnome Ski Jump",
        maxBlocks: 3,
        startPos: { x: 80, y: 430 },
        velocity: { x: 10, y: -6 },
        hole: { x: 920, y: 70, radius: 12 },
        obstacles: [
            { x: 210, y: 420, width: 140, height: 20, angle: -0.45, label: "speedRamp", color: "#00d2ff" },
            { x: 430, y: 320, width: 140, height: 20, angle: -0.35, label: "speedRamp", color: "#00d2ff" },
            { x: 650, y: 220, width: 140, height: 20, angle: -0.25, label: "speedRamp", color: "#00d2ff" },
            { x: 320, y: 260, width: 20, height: 260, angle: 0 },
            { x: 520, y: 180, width: 20, height: 260, angle: 0 },
            { x: 720, y: 260, width: 20, height: 260, angle: 0 },
            { x: 910, y: 140, width: 140, height: 20, angle: 0 },
            { x: 840, y: 70, width: 20, height: 120, angle: 0 }
        ]
    },
    {
        id: 15,
        title: "Level 15 - Hedge Maze",
        maxBlocks: 3,
        startPos: { x: 120, y: 90 },
        velocity: { x: 9, y: 9 },
        hole: { x: 920, y: 420, radius: 12 },
        obstacles: [
            { x: 240, y: 255, width: 20, height: 420, angle: 0 },
            { x: 430, y: 90, width: 20, height: 200, angle: 0 },
            { x: 620, y: 420, width: 20, height: 200, angle: 0 },
            { x: 810, y: 255, width: 20, height: 420, angle: 0 },
            { x: 340, y: 180, width: 150, height: 18, angle: 0.55 },
            { x: 540, y: 320, width: 150, height: 18, angle: -0.55 },
            { x: 910, y: 350, width: 130, height: 20, angle: 0 },
            { x: 840, y: 420, width: 20, height: 120, angle: 0 },
            { x: 900, y: 490, width: 200, height: 20, angle: 0 }
        ]
    },
    {
        id: 16,
        title: "Level 16 - Gnome Crossfire",
        maxBlocks: 3,
        startPos: { x: 120, y: 360 },
        velocity: { x: 11, y: -7 },
        hole: { x: 900, y: 110, radius: 12 },
        obstacles: [
            { x: 310, y: 170, width: 190, height: 18, angle: 0.6 },
            { x: 310, y: 340, width: 190, height: 18, angle: -0.6 },
            { x: 610, y: 170, width: 190, height: 18, angle: -0.6 },
            { x: 610, y: 340, width: 190, height: 18, angle: 0.6 },
            { x: 470, y: 255, width: 70, height: 40, angle: 0, label: "bombgnome", color: "#cc3b3b" },
            { x: 760, y: 255, width: 70, height: 40, angle: 0, label: "bombgnome", color: "#cc3b3b" },
            { x: 900, y: 180, width: 150, height: 20, angle: 0 },
            { x: 830, y: 110, width: 20, height: 120, angle: 0 }
        ]
    },
    {
        id: 17,
        title: "Level 17 - Courtyard Hop",
        maxBlocks: 3,
        startPos: { x: 70, y: 450 },
        velocity: { x: 11, y: -7 },
        hole: { x: 940, y: 80, radius: 12 },
        obstacles: [
            { x: 420, y: 250, width: 20, height: 340, angle: 0 },
            { x: 760, y: 250, width: 20, height: 340, angle: 0 },
            { x: 360, y: 460, width: 120, height: 20, angle: -0.5, label: "speedRamp", color: "#00d2ff" }
        ]
    },
    {
        id: 18,
        title: "Level 18 - Bomb Lane",
        maxBlocks: 3,
        startPos: { x: 80, y: 250 },
        velocity: { x: 13, y: 0 },
        hole: { x: 930, y: 250, radius: 12 },
        obstacles: [
            { x: 500, y: 80, width: 1000, height: 20, angle: 0 },
            { x: 500, y: 420, width: 1000, height: 20, angle: 0 },
            { x: 260, y: 250, width: 20, height: 240, angle: 0 },
            { x: 500, y: 250, width: 20, height: 240, angle: 0 },
            { x: 740, y: 250, width: 20, height: 240, angle: 0 },
            { x: 380, y: 170, width: 70, height: 40, angle: 0, label: "bombgnome", color: "#cc3b3b" },
            { x: 620, y: 330, width: 70, height: 40, angle: 0, label: "bombgnome", color: "#cc3b3b" },
            { x: 950, y: 180, width: 60, height: 20, angle: 0 },
            { x: 950, y: 320, width: 60, height: 20, angle: 0 },
            { x: 880, y: 250, width: 20, height: 180, angle: 0 }
        ]
    },
    {
        id: 19,
        title: "Level 19 - Flag Keep",
        maxBlocks: 3,
        startPos: { x: 60, y: 80 },
        velocity: { x: 10, y: 10 },
        hole: { x: 930, y: 420, radius: 12 },
        obstacles: [
            { x: 200, y: 250, width: 20, height: 430, angle: 0 },
            { x: 380, y: 90, width: 20, height: 180, angle: 0 },
            { x: 740, y: 120, width: 20, height: 160, angle: 0 },
            { x: 880, y: 120, width: 20, height: 200, angle: 0 },
            { x: 290, y: 430, width: 120, height: 20, angle: 0.28, label: "speedRamp", color: "#00d2ff" },
            { x: 650, y: 70, width: 120, height: 20, angle: 0.65, label: "speedRamp", color: "#00d2ff" },
            { x: 560, y: 320, width: 70, height: 40, angle: 0, label: "bombgnome", color: "#cc3b3b" },
            { x: 940, y: 490, width: 120, height: 20, angle: 0 }
        ]
    },
    {
        id: 20,
        title: "Level 20 - Gnome King's Gauntlet",
        maxBlocks: 3,
        startPos: { x: 70, y: 460 },
        velocity: { x: 11, y: -8 },
        hole: { x: 940, y: 110, radius: 12 },
        obstacles: [
            { x: 220, y: 250, width: 20, height: 420, angle: 0 },
            { x: 420, y: 90, width: 20, height: 220, angle: 0 },
            { x: 620, y: 410, width: 20, height: 220, angle: 0 },
            { x: 820, y: 100, width: 20, height: 180, angle: 0 },
            { x: 320, y: 190, width: 150, height: 18, angle: 0.6 },
            { x: 520, y: 330, width: 150, height: 18, angle: -0.6 },
            { x: 720, y: 190, width: 150, height: 18, angle: 0.6 },
            { x: 260, y: 460, width: 120, height: 20, angle: -0.8, label: "speedRamp", color: "#00d2ff" },
            { x: 570, y: 250, width: 120, height: 20, angle: 0, label: "speedRamp", color: "#00d2ff" },
            { x: 830, y: 60, width: 120, height: 20, angle: 0.75, label: "speedRamp", color: "#00d2ff" },
            { x: 760, y: 260, width: 70, height: 40, angle: 0, label: "bombgnome", color: "#cc3b3b" }
        ]
    }
];
