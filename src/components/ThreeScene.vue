<template>
  <div id="threeScene">
    <div id="threeContainer"></div>
    <div class="row">
      <div class="col-xs-12">
        <button id="btnExportImg" @click="exportImage">Save Image</button>
        <button id="btnExportModel" @click="exportModel">Save Model</button>
      </div>
      <div>
        <span>Base Seed</span>
        <input type="text" v-model="seed" />
      </div>
      <div>
        <span>Mutation Seed</span>
        <input type="text" v-model="mutateSeed" />
      </div>
      <div>
        <span>Color Seed</span>
        <input type="text" v-model="colorSeed" />
      </div>
    </div>
    <p>{{seed}}-{{mutateSeed}}{{colorSeed}}</p>
    <a id="downloadLink" ref="downloadLink"></a>
  </div>
</template>

<script>
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';

export default {
  name: 'ThreeScene',

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
    }
  },

  data () {
    return {
      three: THREE,
      scene: null,
      sceneWidth: 600,
      sceneHeight: 600,
      camera: null,
      renderer: null,
      controls: null,
      gltfExporter: null,
      creatureObj: null,
      geometry: null,
      exportOptions: {
        trs: false,
        onlyVisible: true,
        truncateDrawRange: true,
        binary: false,
        maxTextureSize: 4096 // To prevent NaN value
      }
    }
  },

  mounted: function () {
    this.$nextTick(function () {
      this.scene = new this.three.Scene()
      this.scene.background = new this.three.Color(0xffffff)
      this.camera = new this.three.PerspectiveCamera(75, this.sceneWidth / this.sceneHeight, 0.1, 1000)

      this.creatureObj = new this.three.Object3D()

      this.renderer = new this.three.WebGLRenderer()
      this.renderer.setSize(this.sceneWidth, this.sceneHeight)
      this.renderer.domElement.id = 'threeCanvas'
      document.getElementById('threeContainer').appendChild(this.renderer.domElement)

      this.controls = new OrbitControls(this.camera, this.renderer.domElement)
      this.controls.enableDamping = true
      this.controls.dampingFactor = 0.25
      this.controls.enablePan = false
      this.controls.enableZoom = true
      this.controls.minDistance = 3
      this.controls.maxDistance = 18

      this.camera.position.z = 12
      this.camera.position.y = -8

      this.gltfExporter = new GLTFExporter()

      this.creatureObj = new this.three.Object3D()
      this.geometry = new this.three.BoxGeometry()

      this.drawScene()
    })
  },

  methods: {
    exportImage () {
      this.$refs.downloadLink.click(this.$refs.downloadLink.href = document.getElementById('renderCanvas').toDataURL('image/png'), this.$refs.downloadLink.download = `${this.seed}-${this.mutateSeed}-${this.colorSeed}`)
    },

    exportModel () {
      let that = this
      this.gltfExporter.parse(this.creatureObj, function (result) {
        const output = JSON.stringify(result, null, 2);
        that.$refs.downloadLink.href = URL.createObjectURL(new Blob([output], {type: 'text/plain'}))
        that.$refs.downloadLink.download = `${that.seed}-${that.mutateSeed}-${that.colorSeed}.gltf`
        that.$refs.downloadLink.click()
      }, this.exportOptions)
    },

    buildCreature (imageData) {
      this.scene.remove(this.creatureObj)
      this.creatureObj = new this.three.Object3D()

      const indexes = Object.keys(imageData)
      for (var i = 0; i < indexes.length; i++) {
        if (imageData[indexes[i]] === 'rgb(255, 255, 255)') continue
        const material = new this.three.MeshBasicMaterial({ color: imageData[indexes[i]]})
        const cube = new this.three.Mesh(this.geometry, material)
        const pos = indexes[i].split(',')
        cube.position.x = pos[0] - (pos[0] * 2) + 8
        cube.position.y = pos[1] - (pos[1] * 2)
        this.creatureObj.add(cube)
      }

      var boundingBox = new this.three.Box3()
      boundingBox.setFromObject(this.creatureObj)
      var center = boundingBox.getCenter()
      this.controls.target = center
      this.scene.add(this.creatureObj)
    },

    drawScene () {
      requestAnimationFrame(this.drawScene);
      this.creatureObj.rotation.y += 0.005
      this.renderer.render(this.scene, this.camera)
    }
  }
}
</script>

<style>

</style>