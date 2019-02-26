import * as PIXI from 'pixi.js'

import catUrl from '../images/cat-skip.png';

import tileset from '../images/tileset.png';

//Aliases
let Application = PIXI.Application, // Pixi 应用对象
    loader = PIXI.loader, // loader 对象加载图像资源
    resources = PIXI.loader.resources,
    TextureCache = PIXI.utils.TextureCache, // 纹理缓存
    Rectangle = PIXI.Rectangle, // 定义矩形形状
    Sprite = PIXI.Sprite; // Pixi 精灵创建一新精灵

//Create a Pixi Application
let app = new Application({
    width: 256,
    height: 256,                       
    antialias: true,
    transparent: false,
    resolution: 1
  }
);   


//Add the canvas that Pixi automatically created for you to the HTML document
$('.home').append(app.view);


//load an image and run the `setup` function when it's done
loader
  .add(tileset)
  .on("progress", loadProgressHandler)
  .load(setup);


function loadProgressHandler(loader, resource) {
     //Display the file `url` currently being loaded
    console.log("loading: " + resource.url);
    //Display the percentage of files currently loaded
    console.log("progress: " + loader.progress + "%");
    //If you gave your files names as the first argument
    //of the `add` method, you can access them like this
    //console.log("loading: " + resource.name);
}

// //This `setup` function will run when the image has loaded
// function setup() {

//   //Create the cat sprite
//   let cat = new Sprite(resources[catUrl].texture);

//   //Change the sprite's position
//   // cat.x = 96;
//   // cat.y = 96;
//   cat.position.set(96, 96)

//   //Change the sprite's size
//   cat.width = 100;
//   cat.height = 100;

//   // cat.scale.set(2, 2);



//   // 改变锚点(旋转中心)
//   cat.anchor.x = 0.5;
//   cat.anchor.y = 0.5;

//   cat.rotation = 0.5; // 角度调整

//   //Add the cat to the stage
//   app.stage.addChild(cat);
// }


function setup() {
  //Create the `tileset` sprite from the texture
  let texture = TextureCache[tileset];

  //Create a rectangle object that defines the position and
  //size of the sub-image you want to extract from the texture
  //(`Rectangle` is an alias for `PIXI.Rectangle`)
  let rectangle = new Rectangle(96, 64, 32, 32);

  //Tell the texture to use that rectangular section
  texture.frame = rectangle;

  //Create the sprite from the texture
  let rocket = new Sprite(texture);

  //Position the rocket sprite on the canvas
  rocket.x = 32;
  rocket.y = 32;

  //Add the rocket to the stage
  app.stage.addChild(rocket);
}