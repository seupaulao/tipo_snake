import kaboom from "kaboom"

kaboom()

const block_size = 20

const mapa = addLevel(
	[
		"========================================",
		"=                                      =",
		"=                                      =",
		"=                                      =",
		"=                                      =",
		"=                                      =",
		"=                                      =",
		"=                                      =",
		"=                                      =",
		"=                                      =",
		"=                                      =",
		"=                                      =",
		"=                                      =",
		"=                                      =",
		"=                                      =",
		"=                                      =",
		"=                                      =",
		"=                                      =",
		"=                                      =",
		"========================================",
	],
	{
		width: block_size,
		height: block_size,
		tileWidth: block_size,
		tileHeight: block_size,
		pos: vec2(0, 0),
		tiles: {
			"=": () => [rect(block_size, block_size), color(255,0,0), area(), anchor('center'),"parede"]
		}
	}
)

const direcoes = {
	UP: "up",
	DOWN: "down",
	LEFT: "left",
	RIGHT: "right"
}

let current_direction = direcoes.RIGHT
let run_action = false 
let snake_length = 3
let snake_body = []

function respawn_snake() {
	destroyAll("snake")

	snake_body = []
	snake_length = 3

	let x = block_size + block_size
	for (i = 1; i<=snake_length; i++) {
		let segmento = add([
			rect(block_size, block_size),
			pos(x, x * i),
			color(0, 0, 255),
			anchor('center'),
			area(),
			"snake"
		])
		snake_body.push(segmento)
	}
	current_direction = direcoes.RIGHT
}

let food = null

function respawn_food() {
	let new_pos = rand(vec2(1,1), vec2(39,19))
	new_pos.x = Math.floor(new_pos.x)
	new_pos.y = Math.floor(new_pos.y)
	new_pos = new_pos.scale(block_size)

	if (food) {
		destroy(food)
	}

	food = add([
		rect(block_size, block_size),
		color(0, 255, 0),
		pos(new_pos),
		anchor('center'),
		area(),
		"food"
	])
}


onKeyPress("up", () => {
	if (current_direction != direcoes.DOWN) {
	  current_direction = direcoes.UP;
	}
  });
  
  onKeyPress("down", () => {
	if (current_direction != direcoes.UP) {
	  current_direction = direcoes.DOWN;
	}
  });
  
  onKeyPress("left", () => {
	if (current_direction != direcoes.RIGHT) {
	  current_direction = direcoes.LEFT;
	}
  });
  
  onKeyPress("right", () => {
	if (current_direction != direcoes.LEFT) {
	  current_direction = direcoes.RIGHT;
	}
  });

let move_delay = 0.2
let timer = 0

onUpdate( () => {
	if (!run_action) return;
	timer += dt()
	if (timer < move_delay) return 
	timer = 0

	let move_x = 0
	let move_y = 0

	switch (current_direction) {
		case direcoes.DOWN:
			move_x = 0
			move_y = block_size
			break
		case direcoes.UP:
			move_x = 0
			move_y = block_size * -1
			break
		case direcoes.RIGHT:
			move_x = block_size
			move_y = 0
			break
		case direcoes.LEFT:
			move_x = block_size * -1
			move_y = 0
			break
	}

	let  snake_head = snake_body[snake_body.length - 1]

	snake_body.push(add([
		rect(block_size, block_size),
		pos(snake_head.pos.x + move_x, snake_head.pos.y + move_y),
		color(0,0,255),
		anchor('center'),
		area(),
		"snake"
	]))

	if (snake_body.length > snake_length) {
		let rabo = snake_body.shift()
		destroy(rabo)
	}
})

function respawn_all() {
	run_action=false
	wait(0.5, function() {
		respawn_snake()
		respawn_food()
		run_action = true
	})
}

respawn_all()

onCollide("snake", "food", (s,f) => {
	if (s.pos.x == f.pos.x && s.pos.y == f.pos.y)
	{
		snake_length += 1
		respawn_food()	
	}
})

onCollide("snake", "parede", (s, f) => {
	if (s.pos.x == f.pos.x && s.pos.y == f.pos.y)
	{
		run_action = false 
		shake(12)
		respawn_all()		
	}
})

onCollide("snake", "snake", (s, f) => {
	if (s.pos.x == f.pos.x && s.pos.y == f.pos.y)
	{
		run_action = false 
		shake(12)
		respawn_all()		
	}
})
