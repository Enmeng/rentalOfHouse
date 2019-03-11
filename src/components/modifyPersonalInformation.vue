<template>
    <div class="modify-personal-information">
        <!-- 显示用户个人信息 -->
        <div class="personal-information">
            <Card :bordered="false">
                <p slot="title" class="title"><img :src="currentAvatar" class="user_avatar"></img><span>用户信息</span></p>
                <p slot="extra" class="edit" @click="callEditor">编辑<Icon type="ios-create-outline" /></p>
                <div class="show-information">
                    <div class="information-item">
                        <h3>基本信息</h3>
                        <div class="information-block">
                            <p>用户名：{{currentUserName}}</p>
                            <p>性别：{{userInformation.gender}}</p>
                            <p v-if="userType=='renter'">信用评分：{{userInformation.creditGrade}}</p>
                        </div>
                        <h3>联系信息</h3>
                        <div class="information-block">
                            <p>地理位置：{{userInformation.location}}</p>
                            <p>联系电话：{{userInformation.phoneNumber}}</p>
                            <p>邮箱：{{userInformation.email}}</p>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
        <!-- 弹出编辑界面 -->
        <Drawer
            title="信息编辑"
            v-model="editPage"
            width="520"
            :mask-closable="false"
            :styles="styles"
            class="editor-drawer"
        >
            <Form :model="editData">
                <FormItem label="头像">
                    <input type="file" name="file" accept=".jpg, .jpeg, .png" @change="uploadAvatar">
                </FormItem>
                <FormItem label="性别">
                    <RadioGroup v-model="editData.gender">
                        <Radio label="男"></Radio>
                        <Radio label="女"></Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="地址">
                    <Row>
                        <Col span="7">
                            <Input v-model="editData.location.province" placeholder="广东">
                                <span slot="append">省</span>
                            </Input>
                        </Col>
                        <Col span="7">
                            <Input v-model="editData.location.city" placeholder="广州">
                                <span slot="append">市</span>
                            </Input>
                        </Col>
                        <Col span="7">
                            <Input v-model="editData.location.area" placeholder="天河">
                                <span slot="append">区</span>
                            </Input>
                        </Col>
                    </Row>
                </FormItem>
                <FormItem label="联系方式">
                    <Input  placeholder="13111111111" v-model="editData.phoneNumber">
                    </Input>
                </FormItem>
                <FormItem label="邮箱">
                    <Input v-model="editData.email"  placeholder="88888888">
                        <Select  slot="append" style="width: 70px" v-model="editData.emailType">
                            <Option value="@qq.com">@qq.com</Option>
                            <Option value="@163.com">@163.com</Option>
                            <Option value="@126.com">@126.com</Option>
                        </Select>
                    </Input>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="passwordDrawer=true">修改密码</Button>
                </FormItem>
            </Form>
            <div class="demo-drawer-footer">
                <Button style="margin-right: 8px" @click="cancelEdit">取消</Button>
                <Button type="primary" @click="saveEdit">保存</Button>
            </div>
        </Drawer>
        <Drawer title="修改密码" :closable="false" v-model="passwordDrawer">
            <Form :model="editData.password">
                <FormItem label="新密码">
                    <Input v-model="editData.password.newPassword"></Input>
                </FormItem>
                <FormItem label="确认密码">
                    <Input v-model="editData.password.confirmPassword"></Input>
                </FormItem>
            </Form>
            <div class="demo-drawer-footer">
                <Button style="margin-right: 8px" @click="passwordDrawer=false">取消</Button>
                <Button type="primary" @click="savePassword">保存</Button>
            </div>
        </Drawer>
    </div>
</template>
<script>
    import axios from 'axios';
    import {eventBus} from '../eventBus'
    export default{
        name:'modifyPersonalInformation',
        props:['userName'],
        data(){
            return {
                editPage:false,//展开编辑框
                passwordDrawer:false,//修改密码
                styles: {
                    height: 'calc(100% - 55px)',
                    overflow: 'auto',
                    paddingBottom: '53px',
                    position: 'static'
                },
                editData:{
                    gender:'',
                    location:{
                        province:'',
                        city:'',
                        area:''
                    },
                    phoneNumber:'',
                    email:'',
                    emailType:'',
                    password:{
                        newPassword:'',
                        confirmPassword:''
                    }
                },
                currentData:{
                    gender:'男',
                    creditGrade:'5',
                    location:'',
                    phoneNumber:'',
                    email:''
                },
                userType:'renter',
                avatarName:'',
            }
        },
        computed:{
            userInformation(){
                var data=this.currentData;
                console.log("this.currentData change",this.currentData.gender);
                return {
                    gender:this.currentData.gender,
                    creditGrade:this.currentData.creditGrade,
                    location:this.currentData.location,
                    phoneNumber:this.currentData.phoneNumber,
                    email:this.currentData.email
                }
            },
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
            currentAvatar(){
                var location='';
                if(this.avatarName!=''){
                    location='../../static/upload/'+this.avatarName;
                }else{
                    location='../../static/user.png';
                }
                return location;
            }
        },
        watch:{
            editData:{
                handler(newValue, oldValue) {
　　　　       　 　console.log(newValue)
　　　        　},
　　        　　deep: true
            }
        },
        methods:{
            callEditor(){
                this.editPage=true;
            },
            cancelEdit(){
                this.editPage=false;
            },
            saveEdit(){
                var _this=this;
                this.currentData.gender=this.editData.gender;
                this.currentData.location=this.editData.location.province+'省'+this.editData.location.city+'市'+this.editData.location.area+'区';
                this.currentData.phoneNumber=this.editData.phoneNumber;
                this.currentData.email=this.editData.email+this.editData.emailType;
                var gender=0;
                if(this.currentData.gender=='男'){
                    gender=1;
                }else if(this.currentData.gender=='女'){
                    gender=2;
                }else{
                    gender=0;
                }
                if(_this.userType=='renter'){
                    //出租者修改信息
                    axios.post('/api/renterInformation/modifyInformation',
                    {RI_gender:gender,RI_credit_grade:_this.currentData.creditGrade,RI_location:_this.currentData.location,RI_phone_number:_this.currentData.phoneNumber,RI_email:_this.currentData.email,avatar:_this.avatarName||'',user_name:_this.currentUserName})
                    .then(function(respond){
                        if(respond.data&&(respond.data.code=='1')){
                            _this.$Message.success("修改成功!");
                            let user_type=_this.userType;
                            eventBus.$emit("changeAvatar",{user_type});
                            
                        }else{
                            _this.$Message.error("修改失败!");
                        }
                    })
                    .catch(function(err){
                        console.log(err);
                    })
                }else{
                    //求租者修改信息
                    axios.post('/api/rentSeekingPerInformation/modifyInformation',
                    {RSPI_gender:gender,RSPI_location:_this.currentData.location,RSPI_phone_number:_this.currentData.phoneNumber,RSPI_email:_this.currentData.email,avatar:_this.avatarName||'',user_name:_this.currentUserName})
                    .then(function(respond){
                        if(respond.data&&(respond.data.code=='1')){
                            _this.$Message.success("修改成功!");
                            let user_type=_this.userType;
                            eventBus.$emit("changeAvatar",{user_type});
                        }else{
                            _this.$Message.error("修改失败!");
                        }
                    })
                    .catch(function(err){
                        console.log(err);
                    })
                }
                this.editPage=false;
            },
            savePassword(){
                var _this=this;
                if(this.editData.password.newPassword==this.editData.password.confirmPassword){
                    if(this.editData.password.newPassword.length>=6){
                        axios.post('/api/userInformation/modifyPasswordByUserName',{password:_this.editData.password.newPassword,user_name:_this.currentUserName})
                        .then(function(respond){
                            if(respond.data&&(respond.data.code=='1')){
                                _this.$Message.success("修改密码成功!");
                            }else{
                                _this.$Message.error("修改密码失败!");
                            }
                            _this.passwordDrawer=false;
                        })
                        .catch(function(err){
                            console.log(err);
                        })
                    }else{
                        _this.$Message.success("密码长度应为6-20位!");
                    }
                }else{
                    _this.$Message.success("新密码与确认密码不一致!");
                }
                
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
                                _this.avatarName=pName;
                                // console.log("当前上传的图片名称列表：",_this.imageListName);
                            }
                        })
                        .catch(function(err){
                            console.log("上传图片错误");
                        })
                
                           
                            
            },
            
        },
        beforeMount(){
            
        },
        mounted(){
            var _this=this;
            //获取用户类型
            axios.get('/api/userInformation/getUserByName',{params:{user_name:_this.currentUserName}})
            .then(function(respond){
                if(respond.data.length!=0){
                    var data=respond.data[0];
                    if(data.user_type_renter!=undefined){
                        if(data.user_type_renter==1){
                            _this.userType='renter';
                        }else{
                            _this.userType='rentSeekingPer';
                        }
                        //获取用户类型完后根据用户类型获取信息
                        if(_this.userType=='renter'){
                        axios.get('/api/renterInformation/getInformation',{params:{user_name:_this.currentUserName}})
                        .then(function(respond){
                            if(respond.data.length){
                                var data=respond.data[0];
                                if(data.RI_gender!=undefined){
                                    if(data.RI_gender==1){
                                        _this.currentData.gender='男';
                                    }else if(data.RI_gender==2){
                                        _this.currentData.gender='女';
                                    }else{
                                        _this.currentData.gender='保密';
                                    }
                                }
                                
                                if(data.RI_credit_grade!=undefined){
                                    _this.currentData.creditGrade=data.RI_credit_grade;
                                }
                                
                                if(data.RI_location!=undefined){
                                    _this.currentData.location=data.RI_location;
                                }
                                
                                if(data.RI_phone_number!=undefined){
                                    _this.currentData.phoneNumber=data.RI_phone_number;
                                }

                                if(data.RI_email!=undefined){
                                    _this.currentData.email=data.RI_email;
                                }

                                //获取用户头像，如果为空就显示为系统默认头像
                                if(data.avatar!=undefined){
                                    _this.avatarName=data.avatar;
                                }
                            }
                        })
                        .catch(function(err){
                            console.log(err);
                        })
                    }else{
                        console.log("rent");
                        axios.get('/api/rentSeekingPerInformation/getInformation',{params:{user_name:_this.currentUserName}})
                        .then(function(respond){
                            if(respond.data.length){
                                var data=respond.data[0];
                                if(data.RSPI_gender!=undefined){
                                    if(data.RSPI_gender==1){
                                        _this.currentData.gender='男';
                                    }else if(data.RSPI_gender==2){
                                        _this.currentData.gender='女';
                                    }else{
                                        _this.currentData.gender='保密';
                                    }
                                }
                                
                                
                                if(data.RSPI_location!=undefined){
                                    _this.currentData.location=data.RSPI_location;
                                }
                                
                                if(data.RSPI_phone_number!=undefined){
                                    _this.currentData.phoneNumber=data.RSPI_phone_number;
                                }

                                if(data.RSPI_email!=undefined){
                                    _this.currentData.email=data.RSPI_email;
                                }
                            }
                        })
                        .catch(function(err){
                            console.log(err);
                        })
                    }


                    }else{
                        console.log("用户不存在!");
                    }
                }
            })
            .catch(function(err){
                console.log(err);
            })

            
            
        },
    }
</script>
<style>
    .modify-personal-information{
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    .personal-information{
        background:#eee;
        padding: 20px;
        width: 80%;
    }
    .edit{
        cursor: pointer;
        color: #2D8CF0;
    }
    .information-item{
        margin-top: 20px;
    }
    .editor-drawer{
        display:flex;
        flex-direction:column;
        justify-content:flex-start;
    }
    .demo-drawer-footer{
        align-self:center;
    }
    .title{
        display: flex;
        justify-content: center;
        align-items:center;
        height:50px;
    }
    .user_avatar{
        width:30px;
        height:30px;
        border:20px;
        border-radius:50% 50%;
    }
    .information-block{
        margin-top:10px;
        margin-bottom:10px;
    }
    .information-item>h3{
        color:#87D068;
    }
    .ivu-card-head p{
        height:50px;
        display:flex;
    }
</style>