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
        title: "Level 1",
        startPos: { x: 50, y: 350 },
        velocity: { x: 7, y: -10 },
        hole: { x: 735, y: 330, radius: 12 },
        obstacles: [
            { id: "block-1", x: 425, y: 400, width: 90, height: 18, angle: 0 }
        ]
    },
    {
        id: 2,
        title: "Level 2",
        startPos: { x: 150, y: 160 },
        velocity: { x: 5, y: 0 },
        hole: { x: 900, y: 400, radius: 12 },
        obstacles: [
            { id: "block-1", x: 250, y: 200, width: 100, height: 18, angle: 0 },
            { id: "block-2", x: 450, y: 280, width: 100, height: 18, angle: 0 },
            { id: "block-3", x: 650, y: 360, width: 100, height: 18, angle: 0 }
        ]
    },
    {
        id: 3,
        title: "Level 3",
        startPos: { x: 100, y: 300 },
        velocity: { x: 12, y: -8 },
        hole: { x: 800, y: 350, radius: 12 },
        obstacles: [
            { id: "block-1", x: 250, y: 350, width: 200, height: 18, angle: 0 },
            { id: "block-2", x: 700, y: 380, width: 200, height: 18, angle: 0 }
        ]
    },
    {
        id: 4,
        title: "Level 4",
        startPos: { x: 310, y: 300 },
        velocity: { x: 12, y: -8 },
        hole: { x: 300, y: 488, radius: 12 },
        obstacles: [
            { id: "block-1", x: 240, y: 250, width: 20, height: 300, angle: 0 },
            { id: "block-1", x: 200, y: 250, width: 20, height: 300, angle: 0 },
            { id: "block-1", x: 260, y: 80, width: 20, height: 60, angle: 0.7 },
            { id: "block-2", x: 390, y: 400, width: 20, height: 300, angle: 2.3 }
            
        ]
    },
    {
        id: 5,
        title: "Level 5",
        startPos: { x: 100, y: 300 },
        velocity: { x: 12, y: 8 },
        hole: { x: 800, y: 350, radius: 12 },
        obstacles: [
            { id: "wall", x: 700, y: 380, width: 20, height: 500, angle: 0 }
        ]
    },
];
