<template>
    <div id="app">

        <header>

            <van-nav-bar
                    title="旧件购买"
                    left-text="返回"
                    left-arrow
                    @click-left="onClickLeft"
            />

        </header>

        <main>

            <van-cell-group class="panel">
                <div class="panel-body">

                    <van-field label="车辆品牌系列" placeholder="请选择品牌系列" :value="brandSeries" readonly @click="openChoiceBrand()"/>

<!--                        <van-field v-model="year" label="年款" placeholder="请输入年款" />-->

                    <van-field
                            v-model="part"
                            center
                            clearable
                            label="旧件名称"
                            placeholder="请输入旧件名称"
                    >
                        <template #button>
                            <van-button size="small" type="primary" @click="search">搜索</van-button>
                        </template>
                    </van-field>

                </div>
            </van-cell-group>

            <p v-if="partList.length === 0" style="color: #969799;font-size: 14px;line-height: 50px;text-align: center;">请点击搜索按钮,搜索数据</p>

                <van-list
                        v-model="loading"
                        :finished="finished"
                        finished-text="没有更多了"
                        :immediate-check = "false"
                        @load="onLoad"
                >


                    <van-cell value="查看详情" is-link v-for="item of partList" @click="goDetail(item.__rowid)">
                        <template #title>
                            <span class="custom-title" style="font-size: 15px">{{item.m_name}}</span>
                            <!--                            <van-tag type="danger">标签</van-tag>-->
                        </template>

                        <template #label>
                            <div class="custom-title">年款:{{item.nk}}</div>
                            <div class="custom-title">品牌：{{item.car_brand_name}}</div>
                            <div class="custom-title">系列：{{item.car_serial_name}}</div>
                        </template>

                    </van-cell>



                </van-list>



            <van-popup v-model="show" position="right" :style="{ height: '100%', width : '70%' }">

                <van-index-bar :sticky="false"  :style="{ height: '100%', overflow : 'auto'}">

                    <template v-for="(item, index) in Object.entries(getIndexList)" >
                        <van-index-anchor :index="item[0]" :key="index">{{ item[0] }}</van-index-anchor>
                        <template v-for="i in item[1]">
                            <van-cell :title="i.name" @click="openChoiceSerial(i.name)"/>
                        </template>
                    </template>


                </van-index-bar>


            </van-popup>

            <!--            <van-popup v-model="showBottom" position="bottom" :style="{ height: '50%', width : '100%' }">-->



            <!--            </van-popup>-->

            <van-action-sheet v-model="showBottom" :actions="viewData.serial" @select="onSelect" />

        </main>

        <footer>


        </footer>

</div>
</template>
<script>

    import { Toast } from 'vant';

    const page_static = {
        groupName: 'wx_old_part_buy',
        moduleName: 'wx_old_part_buy',
        action_refresh: 'filter.Refresh',
        action_edit: 'bill.Edit',
        comp_ado_name: 'data_list',
    };

    const list_module = {
        moduleName: 'phone_brands_list',
        action_get: 'GetSerial',
        comp_ado_name: 'car_brands',
    };



    export default {
        components : {},

        data() {

            return {
                brand : '',
                series : '',
                year : '',
                part : '',

                list: [],
                loading: false,
                finished: false,


                show : false,
                showBottom : false,

                brandsList: [],

                partList : [],

                viewData: {
                    serial : []
                }
            }

        },

        beforeCreate(){
            if(!this.$e){
                this.$e = new this.$Engine();
            }
        },

        created(){

            console.log('get in=======>',this.partList);
            if(this.partList.length === 0){
                let adapter = this.$e.getActiveModule(page_static.moduleName, true).createAdapter(this, true);
                adapter.mappingData(page_static.comp_ado_name, "partList");

                adapter = this.$e.getActiveModule(list_module.moduleName, true).createAdapter(this, true);
                adapter.mappingData(list_module.comp_ado_name, "brandsList");
                this.getBrandsData();
            }

            // this.$bus.$on('ok',(res)=>{
            //     this.search();
            // })
        },

        computed : {

            getIndexList(){
                let obj = {};
                let list = this.brandsList;
                for(let item of list){
                    if(item.pre_char){
                        if(!obj[item.pre_char]){
                            obj[item.pre_char] = [];
                        }else{
                            let cell = {};
                            cell.name = item.car_brand_name;
                            cell.rowid = item.__rowid;
                            obj[item.pre_char].push(cell);
                        }
                    }
                }
                console.log("obj==>",obj);
                return obj;
            },

            brandSeries (){
                return this.brand.concat(" ",this.series);
            }

        },


        methods : {

            onLoad : function(){
                let vm = this;

                let ado = this.$e.getADO(page_static.comp_ado_name,page_static.moduleName);
                if(ado){
                    ado.nextPage().then(res => {
                        vm.loading = false;

                        if(!ado.hasNextPage()){
                            vm.finished = true;
                        }
                    });
                }
            },


            openChoiceBrand(){
                this.show = true;
            },

            openChoiceSerial(name){
                this.brand = name;
                this.series = "";
                this.$e.call(list_module.moduleName, list_module.action_get, null, null, {
                    params: {
                        car_brands: name,
                    }
                }).then(res => {
                    let s=this.$e.getEnv('var_serial');
                    let arr = s.split(';');
                    arr = arr.map((current, index, arr) => {
                        let obj = {};
                        obj.name = current;
                        return obj;
                    });
                    this.viewData.serial = arr;
                    console.log('length',arr.length);
                    if(s){
                        this.showBottom = true;
                    }else{
                        Toast('该车型无系列');
                    }
                }).finally(() => {
                    this.show = false;
                });
            },

            getBrandsData(){
                let vm = this;
                this.$e.init(page_static.groupName, page_static.moduleName, null, {
                    _act: '',
                }).then(function (res) {

                }).catch(err =>{
                    console.log("err ============>",err);
                    console.log("this.brandsList ===>",vm.brandsList);
                });

            },

            onSelect(item){
                console.log('name',item.name);
                this.series = item.name;
                this.showBottom = false;
            },

            search(){
                let vm = this;
                let payLoad = {
                    m_name: this.part,
                    car_brand_name : this.brand,
                    car_serial_name : this.series,
                    nk : this.year
                };
                for(let item in payLoad){
                    if(payLoad[item] === ''){
                        delete payLoad[item];
                    }
                }

                this.$e.call(page_static.moduleName, page_static.action_refresh, null, payLoad, {
                    params: {

                    }
                }).then(res => {
                    console.log('res',res);
                    console.log('---------->list',vm.partList);
                    if(vm.partList.length == 0){
                        Toast('仓库没有找到该车型的零部件.');
                    }
                    // vm.finishedText = "没有更多了"

                    if(vm.partList.length < 18){
                        vm.finished = true;
                    }
                }).catch(err => {
                    console.log('err',err);
                })
            },

            goDetail(rowid){
                let vm = this;
                this.$e.call(page_static.moduleName, page_static.action_edit, null, null, {
                    params: {
                        rowid : rowid
                    }
                }).then(res => {
                    console.log('res',res);
                    vm.$router.push({
                        name: 'detail',
                        // params: { $e: this.$e },
                        query: {
                            amgn : this.$e._amgn,
                            checkid : this.$e._checkid,
                            rowid : rowid
                        }
                    });
                }).catch(err => {
                    console.log('err',err);
                });
            },

            generateUrl (){
                return {
                    name: 'detail',
                    query: {
                        amgn : this.$e._amgn,
                        checkid : this.$e._checkid
                    }
                };
            },

            onClickLeft(){
                document.addEventListener('WeixinJSBridgeReady', function(){ WeixinJSBridge.call('closeWindow'); }, false);
                WeixinJSBridge.call('closeWindow');
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

</style>
