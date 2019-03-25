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
        name: 'TitlePage',
        props: ["title", "desc"],
        data() {
            return {}
        }
    }
</script>


<style lang="scss" scoped>
    .header-content {
        padding: 14px 20px;
        border-bottom: 1px solid #dddddd;
        position: relative;

        h2 {
            font-size: 16px;
            color: #1D2939;
            letter-spacing: -0.5px;
            margin: 0;

            i {
                font-size: 13px;
                margin-right: 7px;
                border-right: 1px dotted #dddddd;
                padding-right: 10px;
            }

            .header-content h2 span {
                font-size: 13px;
                text-transform: none;
                color: #999;
                font-style: italic;
                vertical-align: middle;
                letter-spacing: 0;
                margin-left: 5px;
            }

        }
    }
</style>
