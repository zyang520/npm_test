<template>
    <div style="width:100%;height:100%;">
        <Header></Header>
        <div class="page-container">
            <keep-alive>
                <router-view/>
            </keep-alive>
        </div>


    </div>
</template>


<script>
    import Header from '@/components/Header'

    export default {
        components: {
            Header
        },
        data() {
            return {
                selectedTitle: '',
            }
        }
    }
</script>

<style>
    .page-container {
        width: 100%;
        height: calc(100% - 66px);
        overflow-y: auto;
    }

</style>


