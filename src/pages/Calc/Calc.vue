<template>
    <div id="app">

        <header>

            <van-nav-bar
                    title="旧车回收价格预估"
                    left-text="返回"
                    left-arrow
                    @click-left="onClickLeft"
            />

        </header>

        <main>

            <h2 class="title">我的报废车值多少钱?</h2>
            <p class="sup-title">限小车，供参考</p>

            <van-form @submit="onSubmit" class="panel">

                <div class="panel-body">

                    <van-field
                            v-model="price"
                            name="收购价格(元/吨)"
                            label="收购价格(元/吨)"
                            label-width="120"
                            left-icon="question-o"
                    >
                        <template #left-icon>

                            <van-popover v-model="showPopover1" trigger="click" placement="bottom-start" theme="dark">
                                <div class="pop-panel">参考钢厂对外发布的废钢收购价格适时调整</div>
                                <template #reference>
                                    <van-icon name="question-o" />
                                </template>

                            </van-popover>

                        </template>

                    </van-field>

                    <van-field
                            v-model="weight"
                            name="整备质量(公斤)"
                            label="整备质量(公斤)"
                            label-width="120"
                            placeholder="输入车辆整备质量"
                            :rules="[{ required: true, message: '请输入车辆整备质量' }]"
                    >
                        <template #left-icon>

                            <van-popover v-model="showPopover2" trigger="click" placement="bottom-start" theme="dark">
                                <div class="pop-panel">请查阅车辆行驶证副页上的“整备质量”</div>
                                <template #reference>
                                    <van-icon name="question-o" />
                                </template>

                            </van-popover>

                        </template>

                    </van-field>

<!--                    <van-field-->
<!--                            v-model="impurity"-->
<!--                            name="扣杂率"-->
<!--                            label="扣杂率"-->
<!--                            label-width="120"-->
<!--                    >-->
<!--                        <template #left-icon>-->

<!--                            <van-popover v-model="showPopover3" trigger="click" placement="bottom-start" theme="dark">-->
<!--                                <div class="pop-panel">车辆废铁之外的重量</div>-->
<!--                                <template #reference>-->
<!--                                    <van-icon name="question-o" />-->
<!--                                </template>-->

<!--                            </van-popover>-->

<!--                        </template>-->

<!--                    </van-field>-->


                    <van-field
                            v-model="distance"
                            name="距离报废厂里程(公里)"
                            label="距离报废厂里程(公里)"
                            label-width="120"
                            type="number"
                            placeholder="请输入距离，自送输0"
                            :rules="[{ required: true, message: '请输入距离，自送输0' }]"
                    >
                        <template #left-icon>

                            <van-popover v-model="showPopover4" trigger="click" placement="bottom-start" theme="dark">
                                <div class="pop-panel">车辆停放处距离报废厂的里程，参考高德、百度、腾讯等地图。若选择自己开车到报废厂，则距离填0。</div>
                                <template #reference>
                                    <van-icon name="question-o" />
                                </template>

                            </van-popover>

                        </template>

                    </van-field>

                    <van-field
                            readonly
                            clickable
                            name="picker"
                            :value="ifTWC"
                            label="三元催化是否完整"
                            label-width="120"
                            placeholder="选择是否完整"
                            @click="showTWCPicker = true"
                            :rules="[{ required: true, message: '请选择是否完整' }]"
                    />
                    <van-popup v-model="showTWCPicker" position="bottom">
                        <van-picker
                                show-toolbar
                                :columns="batteryColumns"
                                @confirm="onTWCConfirm"
                                @cancel="showTWCPicker = false"
                        />
                    </van-popup>


                    <van-field
                            readonly
                            clickable
                            name="picker"
                            :value="ifBattery"
                            label="电瓶是否完整"
                            label-width="120"
                            placeholder="选择是否完整"
                            @click="showBatterPicker = true"
                            :rules="[{ required: true, message: '请选择是否完整' }]"
                    />
                    <van-popup v-model="showBatterPicker" position="bottom">
                        <van-picker
                                show-toolbar
                                :columns="batteryColumns2"
                                @confirm="onBatteryConfirm"
                                @cancel="showBatterPicker = false"
                        />
                    </van-popup>


                    <van-field
                            v-model="serviceFee"
                            name="服务费"
                            label="服务费"
                            label-width="120"
                            readonly
                    >
                        <template #left-icon>

                            <van-popover v-model="showPopover5" trigger="click" placement="bottom-start" theme="dark">
                                <div class="pop-panel">即收购点收购车辆、办理手续等服务的费率</div>
                                <template #reference>
                                    <van-icon name="question-o" />
                                </template>

                            </van-popover>

                        </template>

                    </van-field>


                    <van-field
                            v-model="cleaningFee"
                            name="垃圾清运费"
                            label="垃圾清运费"
                            label-width="120"
                            readonly
                    >
                        <template #left-icon>

                            <van-popover v-model="showPopover6" trigger="click" placement="bottom-start" theme="dark">
                                <div class="pop-panel">即报废车所产生的垃圾清理费用按300元/吨计算</div>
                                <template #reference>
                                    <van-icon name="question-o" />
                                </template>

                            </van-popover>

                        </template>

                    </van-field>


                </div>

                <div style="margin: 16px;">
                    <van-button round block type="info" native-type="submit">查看估价</van-button>
                </div>

            </van-form>


            <van-popup v-model="showResult" :round="true">
                <div class="result-panel">
                    <div>您的车子残值预计：</div>
                    <div style="text-align: center;color:red;margin-top:8px;">{{result}}元</div>
                </div>
            </van-popup>


            <div class="alert">

                <p>1.估价公式：整备质量*（1-扣杂率）*废钢压块价格*（1-服务费率）-运费-完整率扣款-垃圾清运费</p>
                <p>2.收购价格：参考钢厂对外发布的废钢收购价格适时调整。</p>
                <p>3.车辆整备质量：请查阅车辆行驶证副页上的“整备质量”</p>
                <p>4.扣杂率：即车辆废铁之外的重量</p>
                <p>5.服务费：回收总价的15%</p>
                <p>6.距离报废厂的里程：车辆停放处距离报废厂的里程，参考高德、百度、腾讯等地图。若选择自己开车到报废厂，则距离填0。</p>
                <p>7.三元催化是否完整：若没有拆过，则选择“完整”，否则选择“缺失”</p>
                <p>8.电瓶是否完整：若没有拆过，则选择“完整”，否则选择“缺失”</p>
                <p>9.垃圾清运费：即报废车所产生的垃圾清理费用</p>

            </div>


        </main>

        <footer>


        </footer>

    </div>
</template>
<script>

    import { Toast } from 'vant';

    const adapter = {

        wx_car_access:{
            ados:{
                data_m:{rows:'dataList',vars: 'vars'}
            },
            group:true,
        }
    };

    const page_static = {
        groupName: 'wx_car_access',
        model_name: 'wx_car_access',
        main_ado_name: 'data_m',
    };

    export default {
        components : {},

        data() {

            return {
                ifBattery : '',
                ifTWC : '',
                distance : '',
                serviceFee : '',
                impurity : '20%',
                weight : '',
                price : 300,

                sych_price : '',
                xdc_price : '',
                garbage_price : 300,

                dataList : [],
                vars : {},


                batteryColumns: ['完整', '缺失'],
                batteryColumns2 : ['完整', '缺失'],
                showBatterPicker : false,
                showTWCPicker : false,
                showResult : false,

                result : '',


                showPopover1 : false,
                showPopover2 : false,
                showPopover3 : false,
                showPopover4 : false,
                showPopover5 : false,
                showPopover6 : false,
                actions: [{ text: '选项一' }, { text: '选项二' }, { text: '选项三' }],
            }

        },

        created(){
            this.$e = new this.$Engine(this, adapter);
            console.log('$e', this.$e);

            this.$e.init(null, 'wx_car_access' , null, {

            }).then(res => {
                console.log('this ==>',this);
                console.log('res ==>',res);
                console.log("this.dataList ===>",this.dataList);
            }).catch(err => {
                console.error("err====>",err);
            });

        },


        beforeDestroy(){
            this.$e.release();
        },

        watch:{
            dataList (newData, oldData){
                newData = newData[0];
                this.impurity_num = newData.impurity;
                this.cover_price_num = newData.cover_price;

                this.impurity = this.toPercent(newData.impurity);
                // this.serviceFee = this.toPercent(newData.cover_price);

                this.max_distance = newData.traffic_distince;
                this.start_traffice_fee = newData.start_traffice_fee;
                this.extraPrice = newData.km_price;

                this.price = newData.fg_price;
                this.sych_price = newData.sych_price;
                this.xdc_price = newData.xdc_price;
                this.garbage_price = newData.garbage_price;
            }
        },

        computed : {
            cleaningFee : function () {
                let vm = this;
                return parseInt((vm.weight / 1000) * vm.garbage_price);
            }
        },


        methods : {
            toPercent(point){
                let str=Number(point*100).toFixed(1);
                str+="%";
                return str;
            },

            onClickLeft() {
                document.addEventListener('WeixinJSBridgeReady', function(){ WeixinJSBridge.call('closeWindow'); }, false);
                WeixinJSBridge.call('closeWindow');
            },

            onSubmit(values) {
                this.doCalc();
            },



            onBatteryConfirm(value, index) {
                this.ifBattery = value;
                this.showBatterPicker = false;
            },

            onTWCConfirm(value, index) {
                this.ifTWC = value;
                this.showTWCPicker = false;
            },

            doCalc(){
                // 车子估价=整备质量*80%*废钢压块价格*（1-服务费率）-运费-完整率扣款-垃圾清运费;

                let carriage = this.start_traffice_fee;

                if(this.distance > 0){
                    if(this.distance > this.max_distance){
                        let extra = (this.distance - this.max_distance) * this.extraPrice;
                        carriage += extra;
                    }
                }else{
                    carriage = 0;
                }

                console.log('carriage===>',carriage);

                let Debit = 0;
                if(this.ifTWC === '缺失'){
                    Debit += this.sych_price;
                }

                if(this.ifBattery === '缺失'){
                    Debit += this.xdc_price;
                }

                console.log('Debit==>',Debit);

                let cover_price = (this.weight / 1000) * this.price * this.cover_price_num;
                console.log('cover_price==>',cover_price);
                this.serviceFee = parseInt(cover_price);

                let result = (this.weight / 1000) * this.price * (1 - this.impurity_num) * (1 - this.cover_price_num) - cover_price - carriage - Debit - this.cleaningFee;

                this.result = parseInt(result);
                // Toast(result);
                this.showResult = true;
            }

        }
    };
</script>
<style>

    body{
        background-color: #f7f8fa;
    }

    .van-icon{
        color: #e67e22;
        cursor : pointer;
    }

</style>

<style scoped>

    .title{
        text-align: center;
        font-size: 19px;
        margin-bottom: 4px;
    }

    .sup-title{
        font-size: 14px;
        text-align: center;
        margin: 0 0 6px 0;
        color: rgba(0,0,0,0.6);
    }

    .panel {
        padding: 7px;

    }

    .panel-body{
        border-radius: 8px;
        overflow: hidden;
    }

    .alert{
        font-size: 15px;
        color: rgba(0,0,0,0.6);
        margin: 0 15px 15px 15px;
        background: #fff;
        padding: 5px 20px;
        border-radius: 7px;
    }

    .result-panel{
        padding:20px;

    }

    .pop-panel{
        padding: 6px 8px;
        max-width: 260px;
        font-size: 14px;
    }

</style>



