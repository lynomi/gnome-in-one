export const LEVELS = [
    {
        id: 1,
        title: "Level 1",
        startPos: { x: 200, y: 190 },
        velocity: { x: 10, y: -10 },
        hole: { x: 735, y: 330, radius: 12 },
        obstacles: [
            { id: "ramp-1", x: 240, y: 260, width: 130, height: 18, angle: -0.25 },
            { id: "ramp-2", x: 460, y: 160, width: 160, height: 18, angle: 0.3 },
            { id: "block-3", x: 620, y: 260, width: 90, height: 18, angle: 0 }
        ]
    },
    {
        id: 2,
        title: "Level 2",
        startPos: { x: 100, y: 300 },
        velocity: { x: 12, y: -8 },
        hole: { x: 800, y: 350, radius: 12 },
        obstacles: [
            { id: "block-1", x: 250, y: 350, width: 200, height: 18, angle: 0 },
            { id: "block-2", x: 700, y: 380, width: 200, height: 18, angle: 0 }
        ]
    },
    {
        id: 3,
        title: "Level 3",
        startPos: { x: 150, y: 150 },
        velocity: { x: 5, y: 0 },
        hole: { x: 900, y: 400, radius: 12 },
        obstacles: [
            { id: "block-1", x: 250, y: 200, width: 100, height: 18, angle: 0 },
            { id: "block-2", x: 450, y: 280, width: 100, height: 18, angle: 0 },
            { id: "block-3", x: 650, y: 360, width: 100, height: 18, angle: 0 }
        ]
    }
];
