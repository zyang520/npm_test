<template>
  <div>
    <div class="header-content">
      <h2><i class="fa fa-th-list"></i>{{title}}<span>{{desc}}</span></h2>
      <div class="breadcrumb-wrapper hidden-xs">

      </div>
    </div>

  </div>
</template>


<script>
export default {
  props : ["title","desc"],
  data () {
    return {

    }
  }
}
</script>


<style lang="scss" scoped>
 
</style>
