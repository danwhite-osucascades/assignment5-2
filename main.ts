scene.setBackgroundColor(6)
scene.setTileMapLevel(assets.tilemap`level`)

//console.log(assets.tilemap`level`.getTileImage(0).width)

// get the width of the entire map dynamically based on the size of the tiles and the number of tiles
let tileWidth = assets.tilemap`level`.getTileImage(0).width
let tileHeight = assets.tilemap`level`.getTileImage(0).height
let totalWidth = assets.tilemap`level`.width * tileWidth
let totalHeight = assets.tilemap`level`.height * tileHeight


// Create player sprite, set up movement and set the camera to follow the sprite
let playerSprite = sprites.create(assets.animation`playerFront`[0], SpriteKind.Player)
controller.moveSprite(playerSprite, 80 , 80)
scene.cameraFollowSprite(playerSprite)

// this is the initial direction of the player
let direction = "None"


// store the food images in an array
let foodImages = [
    assets.image`burger`,
    assets.image`apple`,
    assets.image`pizza`,
    assets.image`cake`,
    assets.image`ham`
]


// this is how fast the food will spawn
let foodSpawn = 200

// This runs every foodSpawn number of milleseconds
game.onUpdateInterval(foodSpawn, () => {
    // call the spawn food function to randomly spawn food
    spawnFood()
})

game.onUpdate(() => {
    // Code in this function will run once per frame. MakeCode
    // Arcade games run at 30 FPS
    if (controller.down.isPressed()) {
        if (direction != "Down") {
            direction = "Down"
            animation.runImageAnimation(playerSprite, assets.animation`playerFront`, 200, true)
        }
    }
    else if (controller.up.isPressed()) {
        if (direction != "Up") {
            direction = "Up"
            animation.runImageAnimation(playerSprite, assets.animation`playerBack`, 200, true)
        }
    }
    else if (controller.left.isPressed()) {
        if (direction != "Left") {
            direction = "Left"
            animation.runImageAnimation(playerSprite, assets.animation`playerLeft`, 200, true)
        }
    }
    else if (controller.right.isPressed()) {
        if (direction != "Right") {
            direction = "Right"
            animation.runImageAnimation(playerSprite, assets.animation`playerRight`, 200, true)
        }
    }
    else {
        direction = "None"
        animation.stopAnimation(animation.AnimationTypes.All, playerSprite)
        playerSprite.setImage(assets.animation`playerFront`[0])
    }

});



function spawnFood() {
    // choose a random integer between 0 and 1 less than the length of the food images
    let r = randint(0, foodImages.length - 1)
    
    // create a sprite using a random image selected from the foodImages array
    let foodSprite = sprites.create(foodImages[r], SpriteKind.Food)

    // Set the xOffset and yOffset so the food doesn't spawn in the walls
    let xOffset = tileWidth + foodImages[r].width
    let yOffset = tileHeight + foodImages[r].height

    // choose a random position anywher on the map
    let randX = randint(xOffset, totalWidth - xOffset)
    let randY = randint(yOffset, totalHeight - yOffset)

    foodSprite.setPosition(randX, randY)
    
}


// controller.down.onEvent(ControllerButtonEvent.Pressed, () => {
//     animation.runImageAnimation(playerSprite, assets.animation`playerFront`, 200, true)
// })

// controller.up.onEvent(ControllerButtonEvent.Pressed, () => {
//     animation.runImageAnimation(playerSprite, assets.animation`playerBack`, 200, true)
// })

// controller.left.onEvent(ControllerButtonEvent.Pressed, () => {
//     animation.runImageAnimation(playerSprite, assets.animation`playerLeft`, 200, true)
// })

// controller.right.onEvent(ControllerButtonEvent.Pressed, () => {
//     animation.runImageAnimation(playerSprite, assets.animation`playerRight`, 200, true)
// })

// TODO: Create animations for left, right, back

// controller.anyButton.onEvent(ControllerButtonEvent.Released, () => {
//     animation.stopAnimation(animation.AnimationTypes.All, playerSprite)
//     playerSprite.setImage(assets.animation`playerFront`[0])
// })
