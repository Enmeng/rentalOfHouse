<template>
    <div class="modify-personal-information">
        <!-- 显示用户个人信息 -->
        <div class="personal-information">
            <Card :bordered="false">
                <p slot="title"><Avatar style="background-color: #87d068;" icon="ios-person" size="small" />用户信息</p>
                <p slot="extra" class="edit" @click="callEditor">编辑<Icon type="ios-create-outline" /></p>
                <div class="show-information">
                    <div class="information-item">
                        <p>用户名：{{userName}}</p>
                        <p>性别：{{userInformation.gender}}</p>
                        <p>信用评分：{{userInformation.creditGrade}}</p>
                        <p>地理位置：{{userInformation.location}}</p>
                        <p>联系电话：{{userInformation.phoneNumber}}</p>
                        <p>邮箱：{{userInformation.email}}</p>
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
                <Button style="margin-right: 8px" @click="value3 = false">取消</Button>
                <Button type="primary" @click="value3 = false">保存</Button>
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
                <Button style="margin-right: 8px" @click="value3 = false">取消</Button>
                <Button type="primary" @click="value3 = false">保存</Button>
            </div>
        </Drawer>
    </div>
</template>
<script>
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
                }
            }
        },
        computed:{
            userInformation(){
                return {
                    name:this.gUserName.userName,
                    gender:'男',
                    creditGrade:'5',
                    location:'',
                    phoneNumber:'',
                    email:''
                }
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
        beforeMount(){
            
        },
        mounted(){
            
        },
        methods:{
            callEditor(){
                this.editPage=true;
            }
        }
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
</style>