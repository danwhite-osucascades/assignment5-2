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

info.setScore(0)

// this is the initial direction of the player
let direction = "None"

const PLAYERBUFFER = 60
const FOODBUFFER = 20
const FOODSPAWN = 500
const ENEMYSPAWN = 3000

// store the food images in an array
let foodImages = [
    assets.image`burger`,
    assets.image`apple`,
    assets.image`pizza`,
    assets.image`cake`,
    assets.image`ham`
]


// this is how fast the food will spawn


// This runs every foodSpawn number of milleseconds
game.onUpdateInterval(FOODSPAWN, () => {
    // call the spawn food function to randomly spawn food
    spawnFood()
})

game.onUpdateInterval(ENEMYSPAWN, () => {
    // call the spawn food function to randomly spawn food
    spawnEnemy()
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

    // let enemySprites = sprites.allOfKind(SpriteKind.Enemy)
    // for (let i = 0; i < enemySprites.length; i++){
    //     enemySprites[i]
        
    //     animateEnemy(enemySprites[i])

    // }

});

function spawnEnemy() {

    let valid = false
    let xOffset = tileWidth + assets.animation`enemyLeft`[0].width
    let yOffset = tileHeight + assets.animation`enemyLeft`[0].height
    let randX
    let randY
    while (!valid) {
        valid = true
        // choose a random position anywher on the map
        randX = randint(xOffset, totalWidth - xOffset)
        randY = randint(yOffset, totalHeight - yOffset)

        let distance = getDistance(playerSprite.x, playerSprite.y, randX, randY)
        if (distance < PLAYERBUFFER) {
            valid = false
        }
    }



    let enemySprite = sprites.create(assets.animation`enemyLeft`[0], SpriteKind.Enemy)
    enemySprite.setPosition(randX, randY)
    enemySprite.follow(playerSprite, 60, 50)

    animateEnemy(enemySprite)


}

function animateEnemy(enemySprite: Sprite) {
    if (enemySprite.x < playerSprite.x) {
        // face right
        animation.runImageAnimation(enemySprite, assets.animation`enemyRight`, 200, true)
    }
    else {
        animation.runImageAnimation(enemySprite, assets.animation`enemyLeft`, 200, true)
    }
}

function spawnFood() {
    // choose a random integer between 0 and 1 less than the length of the food images
    let r = randint(0, foodImages.length - 1)
    
    

    // Set the xOffset and yOffset so the food doesn't spawn in the walls
    let xOffset = tileWidth + foodImages[r].width
    let yOffset = tileHeight + foodImages[r].height

    let valid = false
    let randX
    let randY
    let foodSprites = sprites.allOfKind(SpriteKind.Food)
    let counter = 0
    while (!valid) {
        counter++
        if (counter > 100) {
            return
        }
        valid = true
        // choose a random position anywher on the map
        randX = randint(xOffset, totalWidth - xOffset)
        randY = randint(yOffset, totalHeight - yOffset)
        // Call the getDistance function to get the distance between
        // randX randY and the player's position
        let distance = getDistance(playerSprite.x, playerSprite.y, randX, randY)
        if (distance < PLAYERBUFFER) {
            valid = false
        }
        // Also check distances from each foodsprite to randX randY
        // only spawn food if it's not inside of the buffer for the player
        // or the other foodsprites
        for (let i = 0; i < foodSprites.length; i++){
            let distance = getDistance(foodSprites[i].x, foodSprites[i].y, randX, randY)
            if (distance < FOODBUFFER) {
                valid = false
            }
        }


    }

    // create a sprite using a random image selected from the foodImages array
    let foodSprite = sprites.create(foodImages[r], SpriteKind.Food)
    foodSprite.setPosition(randX, randY)
    
}

function getDistance(x1: number, y1: number, x2: number, y2: number) {
    let dx = x2 - x1
    let dy = y2 - y1
    let distance = Math.sqrt(dx * dx + dy * dy)
    return distance
}

sprites.onOverlap(SpriteKind.Player, SpriteKind.Food, (sprite: Sprite, otherSprite: Sprite) => {
    otherSprite.destroy()
    info.changeScoreBy(1)
})

sprites.onOverlap(SpriteKind.Enemy, SpriteKind.Food, (sprite: Sprite, otherSprite: Sprite) => {
    otherSprite.destroy()
    info.changeScoreBy(-1)
})

sprites.onOverlap(SpriteKind.Player, SpriteKind.Enemy, (sprite: Sprite, otherSprite: Sprite) => {
    game.gameOver(true)
})


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
