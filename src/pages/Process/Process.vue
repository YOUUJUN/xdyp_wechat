<template>
    <div id="app">

        <header>

            <van-nav-bar
                    title="车辆报废进度查询"
                    left-text="返回"
                    left-arrow
                    @click-left="onClickLeft"
            />

        </header>

        <main>

            <van-cell-group class="panel">
                <div class="panel-body">

                    <van-field
                            v-model="carNo"
                            center
                            clearable
                            label="车牌号码"
                            label-width="65"
                            placeholder="请输入车牌号码"
                    >
                        <template #button>
                            <van-button size="small" type="info" @click="search">搜索</van-button>
                        </template>
                    </van-field>

                </div>
            </van-cell-group>


            <div class="process">
                <van-steps class="process-panel" direction="vertical" :active="0">
                    <van-step>
                        <h3>【城市】物流状态1</h3>
                        <p>2016-07-12 12:40</p>
                    </van-step>
                    <van-step>
                        <h3>【城市】物流状态2</h3>
                        <p>2016-07-11 10:00</p>
                    </van-step>
                    <van-step>
                        <h3>快件已发货</h3>
                        <p>2016-07-10 09:30</p>
                    </van-step>
                </van-steps>
            </div>


        </main>

        <footer>


        </footer>

    </div>
</template>
<script>

    import { Toast } from 'vant';

    const page_static = {
        model_name: 'wx_old_part_regist',
        act_send : 'QueryVerifyCode',
        act_post: 'Send',
    };

    export default {
        components : {},

        data() {

            return {
                carNo : '',
            }

        },

        beforeCreate(){

        },


        created(){

        },


        methods : {

            onClickLeft() {
                document.addEventListener('WeixinJSBridgeReady', function(){ WeixinJSBridge.call('closeWindow'); }, false);
                WeixinJSBridge.call('closeWindow');
            },

            search(){

            }

        }
    };
</script>
<style>

    body {
        background-color: #f7f8fa;
    }

</style>

<style scoped>

    .panel {
        padding: 7px;
        background-color: #f7f8fa;

    }

    .panel-body{
        border-radius: 8px;
        overflow: hidden;
    }

    .process{
        padding:7px;
    }

    .process-panel{
        border-radius: 8px;
        padding-left: 40px;
    }

</style>
