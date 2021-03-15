<template>
  <div class="row">
    <div class="col-md-6 col-xs-12">
      <BlockGrid ref="blockGrid" v-on:setSelected="setSelected" :seed="gridBaseSeed" :mutateSeed="gridMutateSeed" :colorSeed="gridColorSeed" />
    </div>
    <div class="col-md-6 col-xs-12">
      <ThreeScene ref="threeScene" :seed="selectedBaseSeed" :mutateSeed="selectedMutateSeed" :colorSeed="selectedColorSeed" />
    </div>
  </div>
</template>

<script>
import BlockGrid from './BlockGrid.vue'
import ThreeScene from './ThreeScene.vue'

export default {
  name: 'ViewMain',

  components: {
    BlockGrid,
    ThreeScene
  },

  data () {
    return {
      selectedBaseSeed: '109024575',
      selectedMutateSeed: '0',
      selectedColorSeed: '0',
      gridBaseSeed: '109024575',
      gridMutateSeed: '0',
      gridColorSeed: '0',
      gridSize: 16
    }
  },

  mounted () {
    this.$refs.blockGrid.generateCreatures(this.gridBaseSeed, this.gridMutateSeed, this.gridColorSeed, 0)
  },

  methods: {
    setSelected (selectedData) {
      const imageData = this.$refs.blockGrid.getPixelArray()
      this.$refs.threeScene.buildCreature(imageData)
      this.selectedBaseSeed = selectedData.seed.toString()
      this.selectedMutateSeed = selectedData.mutateSeed.toString()
      this.selectedColorSeed = selectedData.colorSeed.toString()
    }
  }
}
</script>

<style lang="scss">

</style>