<template>
  <div id="blockGrid">
    <canvas id="renderCanvas" ref="renderCanvas"></canvas>
    <canvas id="spriteCanvas" ref="spriteCanvas"></canvas>
    <div class="row">
      <div class="col-md-6 col-xs-12">
        <span>Base Seed</span>
        <input id="gridBaseSeed" tabindex="1" type="text" v-model="seed" />
      </div>
      <div class="col-md-6 col-xs-12">
        <span>Mutation Seed</span>
        <input id="gridMutateSeed" tabindex="2" type="text" v-model="mutateSeed" />
      </div>
      <div class="col-md-6 col-xs-12">
        <span>Color Seed</span>
        <input id="gridColorSeed" tabindex="3" type="text" v-model="colorSeed" />
      </div>
      <div class="col-md-6 col-xs-12">
        <span>Grid Size</span>
        <input id="gridSize" tabindex="4" type="number" v-model="gridSize" />
      </div>
    </div>
    <div class="row">
      <button id="btnRandBase" @click="randBase">Random Seeds</button>
      <button id="btnRandMutationColor" @click="randMutationColor">Random Mutations & Colors</button>
      <button id="btnRandMutation" @click="randMutation">Random Mutations</button>
      <button id="btnRandColor" @click="randColor">Random Colors</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BlockGrid',

  props: {
    seed: {
      type: String,
      required: true
    },
    mutateSeed: {
      type: String,
      required: true
    },
    colorSeed: {
      type: String,
      required: true
    },
    gridSize: {
      type: Number,
      default: 16
    }
  },

  data () {
    return {
      tileSize: 16,
      colorMode: 0, //0: Full colors, 1: 4 colors, 2: 2 colors, 3: 1 color
      spriteContext: null,
      renderContext: null,
      rows: 6,
      columns: 6,
      randomSeed: 0,
      sheetSeed: null,
      animationSeed: null,
      savedParameters: {}
    }
  },

  mounted () {
    this.$refs.spriteCanvas.height = this.rows * this.tileSize
    this.$refs.spriteCanvas.width = this.columns * this.tileSize
    this.spriteContext = this.$refs.spriteCanvas.getContext('2d')
    this.renderContext = this.$refs.renderCanvas.getContext('2d')
    this.$refs.renderCanvas.width = this.tileSize
    this.$refs.renderCanvas.height = this.tileSize
    this.sheetSeed = this.generateRandomSeed()
    this.animationSeed = this.generateRandomSeed()

    let that = this
    this.$refs.spriteCanvas.onmousedown = function(e) {
      const rect = that.$refs.spriteCanvas.getBoundingClientRect()
      const scaleX = that.$refs.spriteCanvas.width / rect.width
      const scaleY = that.$refs.spriteCanvas.height / rect.height
      const tileX = (e.x - rect.left) * scaleX / that.tileSize|0
      const tileY = (e.y - rect.top) * scaleY / that.tileSize|0
      that.setSelectedCreature(tileX, tileY)
    }
  },

  methods: {
    Random (min = 0, max = 1) {
      this.randomSeed ^= this.randomSeed << 13
      this.randomSeed ^= this.randomSeed >>> 17
      return (Math.abs(this.randomSeed ^= this.randomSeed << 5) % 1e9 / 1e9) * (max - min) + min
    },

    generateRandomSeed () {
      return Math.random() * 1e9|0;
    },

    parseSeed (inputSeed) {
      let finalSeed = '';
      for (let i = 0; i < inputSeed.length; i++) {
        if (!isNaN(Number(inputSeed.charAt(i)))) {
          finalSeed += inputSeed.charAt(i).toString();
        } else finalSeed += inputSeed.charCodeAt(i).toString();
      }
      return (Number(finalSeed)).toString();
    },

    randBase () {
      // this.setupCanvas(0);
    },

    randMutationColor () {
      // this.setupCanvas(1);
    },

    randMutation () {
      // this.setupCanvas(2);
    },

    randColor () {
      // this.setupCanvas(3);
    },

    generateCreatures (newSeed, newMutateSeed, newColorSeed, mode) {
      this.$refs.spriteCanvas.height = this.rows * this.tileSize
      this.$refs.spriteCanvas.width = this.columns * this.tileSize
      newSeed = Number(this.parseSeed(newSeed)) % 1e9|0;
      newMutateSeed = Number(this.parseSeed(newMutateSeed)) % 1e9|0;
      newColorSeed = Number(this.parseSeed(newColorSeed)) % 1e4|0;
      mode = Number(mode);

      // context.clearRect(0, 0, canvas.width, canvas.height);

      for(let y = 0; y < this.rows; y++) {
        for(let x = 0; x < this.columns; x++)
        {
          if ((x || y))
          {
            // 0: Seeds, 1: Mutate seed and color, 2: Mutate color only
            this.randomSeed = this.sheetSeed;
            if (mode == 0) {
              newSeed = this.Random(1e9)|0
            }
            if (mode == 1) {
              newMutateSeed = this.Random(1e9)|0
              newColorSeed = this.Random(1e4)|0
            }
            else if (mode == 2) {
              newMutateSeed = this.Random(1e9)|0
            }
            else if (mode == 3) {
              newColorSeed = this.Random(1e4)|0
            }
            this.sheetSeed = this.randomSeed
          }

          this.savedParameters[`${x},${y}`] = {
            seed: newSeed,
            mutateSeed: newMutateSeed,
            colorSeed: newColorSeed
          }

          this.drawNewSprite(this.spriteContext, x * this.tileSize, y * this.tileSize, newSeed, this.tileSize, this.colorMode, newMutateSeed, newColorSeed)
        }
      }
    },

    drawSelectedCreature (seed, mutateSeed, colorSeed) {
      this.renderContext.clearRect(0, 0, this.$refs.renderCanvas.width, this.$refs.renderCanvas.height)
      this.renderContext.fillStyle = '#fff'
      this.renderContext.fillRect(0, 0, 2e3, 2e3)
      this.drawNewSprite(this.renderContext, 0, 0, seed, this.tileSize, 0, mutateSeed, colorSeed)
    },

    setSelectedCreature (x, y) {
      let data = this.savedParameters[`${x},${y}`]
      this.drawSelectedCreature(data.seed, data.mutateSeed, data.colorSeed)
      this.$emit('setSelected', this.savedParameters[`${x},${y}`])
    },

    getPixelArray () {
      let pixelArray = {};
      for (var x = 0; x < this.$refs.renderCanvas.width; x++) {
        for (var y = 0; y < this.$refs.renderCanvas.height; y++) {
          const pixel = this.renderContext.getImageData(x, y, 1, 1)
          const data = pixel.data
          pixelArray[`${x},${y}`] = `rgba(${data[0]}, ${data[1]}, ${data[2]}, ${data[3] / 255})`
        }
      }
      return pixelArray
    },

    drawNewSprite(context, x=0, y=0, seed=1, size=16, mode=0, mutateSeed=0, colorSeed=0) {
      function Random(max=1, min=0)
      {
        randomSeed ^= randomSeed << 13
        randomSeed ^= randomSeed >>> 17
        return (Math.abs(randomSeed ^= randomSeed << 5) % 1e9 / 1e9)*(max-min) + min
      }

      // random chance to flip drawing axis
      let randomSeed = seed;
      const flipAxis = Random() < .5;
      const w = flipAxis ? size-3 : size/2 - 1 |0;
      const h = !flipAxis ? size-3 : size/2 - 1 |0;

      // apply mutations
      randomSeed += mutateSeed + 1e8;
      const spriteSize = size * Random(.9, .6);
      const density = Random(1, .9);
      const doubleCenter = Random() < .5;
      const yBias = Random(.1, -.1);
      const colorRand = (mode==1 ? .08 : .04);

      // recenter
      x += size/2 |0;
      y += 2 |0;

      function DrawSpriteInternal(x, y, outline)
      {
        // draw each pixel
        randomSeed = seed;
        const passCount = mode == 3 ? 3: 1
        for(let pass=0; pass < passCount; ++pass) {
          for(let k=0; k < w*h; ++k) {
            const i = flipAxis  ? k/w|0 : k%w;
            const j = !flipAxis ? k/w|0 : k%w;

            // pick new random color using color seed
            const saveSeed = randomSeed;
            randomSeed += colorSeed + 1e9;
            const r = Random(360)|0;
            let newColor = `hsl(${ r },${ Random(200,0)|0 }%,${ Random(100,20)|0 }%)`;
            if (outline || mode == 3) newColor = '#000';
            else if (mode == 1) newColor = r%2? '#777' : '#fff';
            else if (mode == 2) newColor = `#fff`;
            if (!k || Random() < colorRand) context.fillStyle = newColor;
            randomSeed = saveSeed;

            // check if pixel should be drawn
            const isHole = Random() > density;
            if (Random(spriteSize/2)**2 > i*i + (j-(1-2*yBias)*h/2)**2 && !isHole) {
              const o = !!outline;
              context.fillRect(x+i-o-doubleCenter, y+j-o, 1+2*o, 1+2*o);
              context.fillRect(x-i-o, y+j-o, 1+2*o, 1+2*o);
            }
          }
        }
      }

      // outline then fill
      if (mode != 3) {
        DrawSpriteInternal(x, y, 1);
      }
      DrawSpriteInternal(x, y);
    }
  }
}
</script>

<style>
canvas {
  image-rendering: -moz-crisp-edges;
  image-rendering: pixelated;
  border: 1px solid #000;
}

#renderCanvas {
  /* display: none; */
  position: absolute;
  top: 100px;
  right: 100px;
  scale: 10;
}

#spriteCanvas {
  width: 800px;
  background: #ccc;
}
</style>