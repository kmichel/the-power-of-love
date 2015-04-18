function init_game(game, canvas) {
    canvas.setAttribute("width", game.width);
    canvas.setAttribute("height", game.height);
    var context = canvas.getContext("2d");

    game.current_level = 0;
    init_level(game, game.levels[game.current_level]);

    (function draw_loop() {
        draw_game(game, context);
        requestAnimationFrame(draw_loop, canvas);
    })();

    setInterval(function () {
        tick_game(game);
    }, 1000 / game.tick_fps);

    canvas.addEventListener('mousemove', function (event) {
        var x = event.offsetX !== undefined ? event.offsetX : event.layerX;
        var y = event.offsetY !== undefined ? event.offsetY : event.layerY;
        game.cursor.position.x = x;
        game.cursor.position.y = y;
    });

    canvas.addEventListener('mousedown', function (event) {
        if (event.button == 0 && !event.ctrlKey && !event.metaKey && !event.shiftKey) {
            game.cursor.just_pressed = true;
            game.cursor.pressed = true;
        }
    });

    document.addEventListener('mouseup', function (event) {
        if (event.button == 0) {
            game.cursor.just_released = true;
            game.cursor.pressed = false;
        }
    });

    canvas.className += ' loaded';
}

function init_level(game, level) {
    game.platforms.list = [];
    for (var i = 0; i < level.platforms.length; ++i) {
        var platform = level.platforms[i];
        game.platforms.list.push({
            y: platform.y,
            x_min: platform.x_min,
            x_max: platform.x_max
        });
    }
    game.peoples.list = [];
    for (i = 0; i < level.peoples.length; ++i) {
        var people = level.peoples[i];
        game.peoples.list.push({
            state: 'falling',
            has_target: false,
            orientation: people.orientation,
            previous_dx: 0,
            previous_dy: 0,
            dx: 0,
            dy: 0,
            x: people.x,
            y: people.y,
            platform: null
        });
    }
}