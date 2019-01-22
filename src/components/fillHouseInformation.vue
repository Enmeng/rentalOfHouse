<template>
    <div class="fill-house-information">
        <div class="information-title">
            <p>
                填写房屋信息
            </p>
        </div>
        <div class="information-panel">
            <Form :label-width="80">
                <FormItem label="房屋地址">
                    <Row>
                        <Col span="7">
                            <Input placeholder="广东" v-model="houseInformation.location.province">
                                <span slot="append">省</span>
                            </Input>
                        </Col>
                        <Col span="7">
                            <Input  placeholder="广州" v-model="houseInformation.location.city">
                                <span slot="append">市</span>
                            </Input>
                        </Col>
                        <Col span="7">
                            <Input  placeholder="天河" v-model="houseInformation.location.area">
                                <span slot="append">区</span>
                            </Input>
                        </Col>
                    </Row>
                </FormItem>
                <FormItem label="房屋大小">
                    <Input  type="number"  placeholder="100" v-model="houseInformation.houseSize">
                        <span slot="append">平方米</span>
                    </Input>
                </FormItem>
                <FormItem label="房屋类型">
                    <Row>
                        <Col span="7">
                            <Input placeholder="1" type="number" v-model="houseInformation.houseType.shi">
                                <span slot="append">室</span>
                            </Input>
                        </Col>
                        <Col span="7">
                            <Input  placeholder="1" type="number" v-model="houseInformation.houseType.ting">
                                <span slot="append">厅</span>
                            </Input>
                        </Col>
                        <Col span="7">
                            <Input  placeholder="1" type="number" v-model="houseInformation.houseType.wei">
                                <span slot="append">卫</span>
                            </Input>
                        </Col>
                    </Row>
                </FormItem>
                <FormItem label="出租价格">
                    <Input  type="number"  placeholder="2000" v-model="houseInformation.price">
                        <span slot="append">元/月</span>
                    </Input>
                </FormItem>
                <FormItem label="配备家具">
                    <i-switch size="large" v-model="houseInformation.furnished">
                        <span slot="open">是</span>
                        <span slot="close">否</span>
                    </i-switch>
                </FormItem>
                <FormItem label="出租日期">
                    <Row>
                        <Col span="11">
                            <DatePicker type="date" placeholder="开始日期" v-model="houseInformation.rentTime.startTime"></DatePicker>
                        </Col>
                        <Col span="2" style="text-align: center">-</Col>
                        <Col span="11">
                            <DatePicker type="date" placeholder="结束日期"  v-model="houseInformation.rentTime.endTime"></DatePicker>
                        </Col>
                    </Row>
                </FormItem>
                <FormItem label="上传照片">
                    <Button type="primary">上传</Button>
                </FormItem>
                <FormItem label="备注">
                    <Input  v-model="houseInformation.otherDescription" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="其他描述信息"></Input>
                </FormItem>
                <FormItem>
                    <Button @click="resetInformation">重置</Button>
                    <Button style="margin-left: 8px" type="primary" @click="saveInformation">保存</Button>
                </FormItem>
            </Form>
        </div>
    </div>
</template>
<style>
    .fill-house-information{
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .information-title{
        font-size:20px;
        font-weight:300px;
        margin-top:40px;
    }
    .information-panel{
        margin-top:20px;
    }
</style>
<script>
    import axios from 'axios';
    export default{
        name:'fillHouseInformation',
        props:['userName'],
        data(){
            return {
                houseInformation:{
                    location:{
                        province:'',
                        city:'',
                        area:''
                    },
                    houseSize:0,
                    houseType:{
                        shi:0,
                        ting:0,
                        wei:0
                    },
                    price:'',
                    furnished:'',
                    rentTime:{
                        startTime:'',
                        endTime:''
                    },
                    picture:[],
                    otherDescription:''
                }
            }
        },
        computed:{
            currentUserName(){
                var name='';
                if(window.localStorage){
                    var storage=window.localStorage;
                    if(storage.getItem("userName")!=undefined){
                        name=storage.getItem("userName");
                    }
                }
                return this.userName||name;
            },
        },
        methods:{
            saveInformation(){
                var _this=this;
                var date=new Date();
                var currentTime=date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()+' '+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
                var startD = new Date(_this.houseInformation.rentTime.startTime);
                var endD = new Date(_this.houseInformation.rentTime.endTime);
                var startDate=startD.getFullYear() + '-' + (startD.getMonth() + 1) + '-' + startD.getDate();
                var endDate=endD.getFullYear() + '-' + (endD.getMonth() + 1) + '-' + endD.getDate()
                var rentTime=startDate+'-'+endDate;
                console.log("rentTime:",rentTime);

                var location=_this.houseInformation.location.province+'省'+_this.houseInformation.location.city+'市'+_this.houseInformation.location.area+'区';
                var houseType=_this.houseInformation.houseType.shi+'室'+_this.houseInformation.houseType.ting+'厅'+_this.houseInformation.houseType.wei+'卫';
                axios.post('/api/postInformation/fillInformation',
                    {user_name:_this.currentUserName,post_time:currentTime,is_available:true,PI_location:location,house_size:_this.houseInformation.houseSize,house_type:houseType,expected_price:_this.houseInformation.price,furnished:_this.houseInformation.furnished,rent_time:rentTime,other_description:_this.houseInformation.otherDescription})
                    .then(function(respond){
                        if(respond.data&&(respond.data.code=='1')){
                            _this.$Message.success("帖子保存成功!");
                        }else{
                            _this.$Message.error("帖子保存失败!");
                        }
                    })
                    .catch(function(err){
                        console.log(err);
                    })
            },
            resetInformation(){
                this.houseInformation.location.province='';
                this.houseInformation.location.city='';
                this.houseInformation.location.area='';
                this.houseInformation.houseSize=0;
                this.houseInformation.houseType.shi=0;
                this.houseInformation.houseType.ting=0;
                this.houseInformation.houseType.wei=0;
                this.houseInformation.price='';
                this.houseInformation.furnished=false;
                this.houseInformation.rentTime.startTime='';
                this.houseInformation.rentTime.endTime='';
                this.houseInformation.otherDescription='';
            }
        },
        mounted(){
            
        }
    }
</script>