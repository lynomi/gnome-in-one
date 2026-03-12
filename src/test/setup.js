// audio context
class MockAudioContext {
    constructor() {
        this.state = 'running';
        this.destination = {};
    }
    resume() { return Promise.resolve(); }
    decodeAudioData() { return Promise.resolve({}); }
    createBufferSource() {
        return { buffer: null, connect: vi.fn(), start: vi.fn() };
    }
}
global.AudioContext = MockAudioContext;

// audio
global.Audio = class MockAudio {
    constructor() {
        this.volume = 1;
        this.currentTime = 0;
    }
    play() { return Promise.resolve(); }
    addEventListener() {}
    removeEventListener() {}
};

// fetch -used by Engine to load the swing audio buffer
global.fetch = vi.fn().mockResolvedValue({
    arrayBuffer: vi.fn().mockResolvedValue(new ArrayBuffer(0)),
});
