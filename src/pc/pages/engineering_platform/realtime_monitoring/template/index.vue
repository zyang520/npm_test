<template>
	<div class="content content-realtime-monitoring">
      <component :options="{title:'ddd'}" v-bind:is="currentView">
       </component>
	</div>
</template>

<script type="text/ecmascript-6">
export default {
    components: {
        'componentA':{template:'<div style="color:red">我是 componentA</div>'}

    },
    data() {
        return {
            currentView : 'componentA'
        };
    },
    computed: {},
    mounted() {
        this._log(`realtime_monitoring has mounted`);
    },
    methods: {}

};
</script>

<style lang="scss" scoped>
    .content-realtime-monitoring{
      position: relative;
    }
</style>
