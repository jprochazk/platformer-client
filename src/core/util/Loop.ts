export function run(
    update: () => void,
    render: (time: number) => void,
    rate = 30,
    max_consecutive_updates = 5
) {
    const update_time_delta = 1000 / rate;
    let next_game_tick = Date.now();
    let processed_update_count;

    const loop = () => {
        const T = Date.now();
        processed_update_count = 0;
        while (T > next_game_tick && processed_update_count < max_consecutive_updates) {
            update();

            next_game_tick += update_time_delta;
            processed_update_count++;
        }

        render(T);

        window.requestAnimationFrame(loop);
    }
    window.requestAnimationFrame(loop);
}
