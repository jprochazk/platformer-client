import 'core/util';
import { Game } from 'core/Game';

window.addEventListener('DOMContentLoaded', async () => {
    const canvas: HTMLCanvasElement | null = document.querySelector(`canvas#display`);
    if (!canvas) throw new Error(`Failed to find canvas with id display`);

    new Game(canvas).run();
});

