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

                        <!-- <div class="update-image">
                            <div class="demo-upload-list" v-for="item in uploadList">
                                <template v-if="item.status === 'finished'">
                                    <img :src="item.url" >
                                    <div class="demo-upload-list-cover">
                                        <Icon type="ios-eye-outline" @click.native="handleView(item.name)"></Icon>
                                        <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
                                    </div>
                                </template>
                                <template v-else>
                                    <Progress  v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                                </template>
                            </div>
                            <Upload
                                ref="upload"
                                :show-upload-list="false"
                                :default-file-list="defaultList"
                                :on-success="handleSuccess"
                                :on-error="handlerError"
                                :format="['jpg','jpeg','png']"
                                :max-size="2048"
                                :on-format-error="handleFormatError"
                                :on-exceeded-size="handleMaxSize"
                                :before-upload="handleBeforeUpload"
                                multiple
                                type="drag"
                                action="/api/picture"
                                style="display: inline-block;width:58px;">
                                <div style="width: 58px;height:58px;line-height: 58px;">
                                    <Icon type="ios-camera" size="20"></Icon>
                                </div>
                            </Upload>
                        </div>
                            <Modal title="图片预览" v-model="visible">
                                <img :src="'https://o5wwk8baw.qnssl.com/' + imgName + '/large'" v-if="visible" style="width: 100%">
                            </Modal> -->
                            <input type="file" name="file" accept=".jpg, .jpeg, .png" @change="uploadAvatar">



                            <!-- <img v-for="item in imageList":src="item.src"></img> -->

                           <!-- 上传图片列表  -->
                            <div class="imageList">
                                    
                                    <!-- <img class="imageItem" :src="imageUrl"></img> -->
                                <img class="imageItem" v-for="item in imageList" :src="item.src"></img>
                            </div>


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
    .demo-upload-list{
        display: inline-block;
        width: 60px;
        height: 60px;
        text-align: center;
        line-height: 60px;
        border: 1px solid transparent;
        border-radius: 4px;
        overflow: hidden;
        background: #fff;
        position: relative;
        box-shadow: 0 1px 1px rgba(0,0,0,.2);
        margin-right: 4px;
    }
    .demo-upload-list img{
        width: 100%;
        height: 100%;
    }
    .demo-upload-list-cover{
        display: none;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0,0,0,.6);
    }
    .demo-upload-list:hover .demo-upload-list-cover{
        display: block;
    }
    .demo-upload-list-cover i{
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        margin: 0 2px;
    }
    .imageList{
        display:flex;
        flex-direction:row;
        justify-content:flex-start;
    }
    .imageItem{
        width:30px;
        height:30px;
        margin-right:10px;
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
                },
                
                
                defaultList: [
                    {
                        'name': 'a42bdcc1178e62b4694c830f028db5c0',
                        'url': 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1551173867821&di=fe999831d7b6a44673b048ace8ca55b7&imgtype=0&src=http%3A%2F%2Fimage.xghylt.com%2Fforum%2Fpw%2FMon_1502%2F476_256769_08f2b1780994832.jpg'
                    },
                    {
                        'name': 'bc7521e033abdd1e92222d733590f104',
                        'url': 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1551173867821&di=fe999831d7b6a44673b048ace8ca55b7&imgtype=0&src=http%3A%2F%2Fimage.xghylt.com%2Fforum%2Fpw%2FMon_1502%2F476_256769_08f2b1780994832.jpg'
                    }
                ],
                imgName: '',
                visible: false,
                uploadList: [],
                // imageList:,
                // img:require("../../server/upload/1551782966906-vip.png"),
                imageListName:[],
                // imageUrl:"../../static/gift.png"
                
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
            imageList(){
                let length=this.imageListName.length;
                var _this=this;
                var imageL=[];
                if(length==0){
                    return [];
                }else{
                    for(let i=0;i<length;i++){
                        var item={src:"../../static/upload/"+_this.imageListName[i]};
                        imageL.push(item);
                    }
                }
                
                
                return imageL;
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
                           
                            //获取帖子id之后保存图片
                            axios.get('/api/postInformation/getPostIdByNameTime',{params:{user_name:_this.currentUserName,post_time:currentTime}})
                            .then(function(res){
                                if(res.data.length){
                                    var data=res.data[0];
                                    if(data.post_id!=undefined){
                                        let postId=data.post_id;
                                        console.log("帖子id:",postId);
                                        for(let i=0;i<_this.imageListName.length;i++){
                                            //将上传的每张图片呢保存的名称上传到数据库
                                            axios.post('/api//renterPostPicture/setPicture',{post_id:postId,picture_location:_this.imageListName[i]})
                                            .then(function(iRes){
                                                if(iRes.data&&(iRes.data[0].code=='1')){
                                                    console.log("图片 "+_this.imageListName[i]+" 保存成功");
                                                }
                                            })
                                            .catch(function(err){
                                                console.log("图片 "+_this.imageListName[i]+" 保存失败");
                                            })
                                        }
                                    }
                                }
                            })
                            .catch(function(err){
                                console.log("获取帖子id错误！");
                            })


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
            },
            handleView (name) {
                this.imgName = name;
                this.visible = true;
            },
            handleRemove (file) {
                const fileList = this.$refs.upload.fileList;
                this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
            },
            handleSuccess (res, file, fileList) {
                console.log("图片上传成功,",res);
                // file.url = 'https://o5wwk8baw.qnssl.com/7eb99afb9d5f317c912f08b5212fd69a/avatar';
                // file.name = '7eb99afb9d5f317c912f08b5212fd69a';
            },
            handlerError(err,file,fileList){
                console.log("图片上传失败,",err);
            },
            handleFormatError (file) {
                this.$Notice.warning({
                    title: '图片格式不正确，应为jpg,jpeg,png',
                    desc: 'File format of ' + file.name + ' is incorrect, please select jpg or png.'
                });
            },
            handleMaxSize (file) {
                this.$Notice.warning({
                    title: 'Exceeding file size limit',
                    desc: 'File  ' + file.name + ' is too large, no more than 2M.'
                });
            },
            handleBeforeUpload () {
                const check = this.uploadList.length < 6;
                if (!check) {
                    this.$Notice.warning({
                        title: '最多上传6张图片.'
                    });
                }
                return check;
            },
            uploadAvatar(avatar) {
                var _this=this;
                console.log(avatar.target.files[0])
                let file = avatar.target.files[0]
                let data = new FormData();
                data.append("file", file, file.name);//很重要 data.append("file", file);不成功
                data.append('data',Date.now());
                console.log("data.get('file'):",data.get('file'))
                return axios.post("api/file", data, {
                            headers: { "content-type": "multipart/form-data" }
                        })
                        .then(function(respond){
                            if(respond.data&&(respond.data[0]!=undefined)){
                                var data=respond.data[0];
                                console.log("上传的图片文件信息:",data);
                                //获取图片的上传后保存的名称
                                let pName=data.fileName;
                                _this.imageListName.push(pName);
                                console.log("当前上传的图片名称列表：",_this.imageListName);
                            }
                        })
                        .catch(function(err){
                            console.log("上传图片错误");
                        })
                
                           
                            
            },
            
        },
        mounted(){
            // this.uploadList = this.$refs.upload.fileList;
        }
    }
</script>