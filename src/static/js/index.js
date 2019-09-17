import LongTake from './longTake';

import {getHomePage} from './widget';



console.log(getHomePage())

let home = document.querySelector('.home');

let longTake = new LongTake({
    container: home, // DOM容器
    resource: getResource(), // 加载的资源
    touchOptions: {
      touch: '.home', // 反馈触摸的dom
      initialValue: 0, // 起始位置
      sensitivity: 0.5, // 不必需,触摸区域的灵敏度，默认值为1，可以为负数
      maxSpeed: 0.5 // 不必需，触摸反馈的最大速度限制
    },
    // sprites: this.getSprites(), // 精灵图
    // spritesAnimations: this.getSpritesAnimations(), // 精灵动画
    // texts: this.getTexts(), // 文本
    // textsAnimations: this.getTextsAnimations() // 文本动画
})


// 加载资源
function getResource() {
    const resource = { sprites: [] }
    for (let i = 0; i < 50; i += 1) {
      resource.sprites.push({
        name: `ani${i}`,
        url: `${getHomePage()}images/ani/${701 + i}.png`
      })
    }
    for (let i = 0; i < 62; i += 1) {
      resource.sprites.push({
        name: `girl${i}`,
        url: `${getHomePage()}images/girl/${160 + i}.png`
      })
    }
    for (let i = 1; i < 8; i += 1) {
      resource.sprites.push({
        name: `item${i}`,
        url: `${getHomePage()}images/items/${i}.png`
      })
    }
    for (let i = 0; i < 25; i += 1) {
      resource.sprites.push({
        name: `plane${i}`,
        url: `${getHomePage()}images/plane/${408 + i}.png`
      })
    }
    return resource
  }



  console.log(getResource())


