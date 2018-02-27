function generateTilemap(height, width) {
	const tiles = height * width
	const tilemap = []

	for(var y = 0; y < height; y++) {
			for (var x = 0; x < width; x++) {
				tilemap.push(build_tile(x, y))
			}
	}
	drawTiles(tilemap, height, width)
}


const randomize = (max) => {
	return Math.floor(Math.random() * Math.floor(max + 1))
}


const generateTerrain = () => {
	const random_factor = randomize(100)

	if (random_factor <= 30) return "grass"
	if (random_factor >= 31 && random_factor <= 50) return "tree"
	if (random_factor >= 51 && random_factor <= 60) return "water"
	if (random_factor >= 61 && random_factor <= 70) return "mountain"
	if (random_factor >= 71 && random_factor <= 100) return "huge_grass"
}


const build_tile = ( x_, y_) => {
	const tile = ({
		x: x_,
		y: y_,
		terrain: generateTerrain()
	})
	return tile
}


function drawTiles(tilemap, height, width) {
	for (var y = 0; y < height; y++){	
		var displayString = "";
				for (var x = 0; x < width; x++) {
					
						if (y === 0) { var counter = x }
						
						else if (y > 0 ) { var counter = ((y * height) + x) }
							
							function draw(terrain) {
								if (terrain == "grass") {
									displayString = displayString += "#"
								}
								if (terrain == "tree") {
									displayString = displayString += "@"
								}
								if (terrain == "water") {
									displayString = displayString += "~"
								}
								if (terrain == "mountain") {
									displayString = displayString += "0"
								}
								if (terrain == "huge_grass") {
									displayString = displayString += "9"
								}
							}

							draw(tilemap[counter].terrain)
				}
				console.log(displayString)
		}
	}
