<!-- 登录、注册页面 -->
<template>
  <div class="sign-in-up-page">
    <div class="sign-in-up-title">
      <p class="title-arial">房屋租赁系统</p>
      <p class="title-name">Rental Of Houses System</p>
    </div>
    <div class="sign-in-up-content">
      <div class="sign-in-up-content-choice">
        <!-- 登录 -->
        <div class="sign-in sign-choice" v-bind:class="selectActive ? 'active' : '' " @click="changeSign">
          <p>登录</p>
        </div>
        <!-- 注册 -->
        <div class="sign-up sign-choice" v-bind:class="selectActive ? '' : 'active' " @click="changeSign">
          <p>注册</p>
        </div>
      </div>
      <!-- 登录需填写的内容 -->
      <div class="sign-in-content" v-if="selectActive">
          <Form ref="signInUser" :model="signInUser" :rules="validateSignInUser" inline>
              <FormItem prop="userName">
                  <Input type="text" v-model="signInUser.userName" placeholder="用户名/账号">
                      <Icon type="ios-person-outline" slot="prepend"></Icon>
                  </Input>
              </FormItem>
              <FormItem prop="password">
                  <Input type="password" v-model="signInUser.password" placeholder="密码">
                      <Icon type="ios-lock-outline" slot="prepend"></Icon>
                  </Input>
              </FormItem>
              <FormItem>
                  <Button type="primary" @click="handleSubmit('signInUser')">{{signChoice}}</Button>
              </FormItem>
          </Form>
          <RadioGroup v-model="userType">
              <Radio label="renter">出租人</Radio>
              <Radio label="rentSeekingPer">求租人</Radio>
          </RadioGroup>
      </div>
      <!-- 注册需填写的内容 -->
      <div class="sign-in-content" v-if="!selectActive">
          <Form ref="signUpUser" :model="signUpUser" :rules="validateSignUpUser" inline>
              <FormItem prop="userName">
                  <Input type="text" v-model="signUpUser.userName" placeholder="用户名/账号">
                      <Icon type="ios-person-outline" slot="prepend"></Icon>
                  </Input>
              </FormItem>
              <FormItem prop="password">
                  <Input type="password" v-model="signUpUser.password" placeholder="密码">
                      <Icon type="ios-lock-outline" slot="prepend"></Icon>
                  </Input>
              </FormItem>
              <FormItem prop="confirmPassword">
                  <Input type="password" v-model="signUpUser.confirmPassword" placeholder="确认密码">
                      <Icon type="ios-lock-outline" slot="prepend"></Icon>
                  </Input>
              </FormItem>
              <FormItem>
                  <Button type="primary" @click="handleSubmit('signUpUser')">{{signChoice}}</Button>
              </FormItem>
          </Form>
          <RadioGroup v-model="userType">
              <Radio label="renter">出租人</Radio>
              <Radio label="rentSeekingPer">求租人</Radio>
          </RadioGroup>
      </div>
    </div>
  </div>
</template>

<script>
import Router from 'vue-router'
import axios from 'axios'
export default {
  name: 'signInUp',
  data () {
    return {
      //登录
      signInUser:{
        userName:'',//用户名
        password:''//密码
      },
      //登录时的账号、密码的验证
      validateSignInUser:{
        userName:[
                    { required: true, message: '请填写帐户名', trigger: 'blur' },
                    { type: 'string', max: 20, message: '账号长度不能超过20位'}
                  ],
        password:[
                    { required: true, message: '请填写密码', trigger: 'blur' },
                    { type: 'string', min: 6, message: '密码长度不能少于6位且不能大于20位', max: 20, trigger: 'blur' }
                  ]
      },

      //注册
      signUpUser:{
        userName:'',//用户名
        password:'',//密码
        confirmPassword:''//确认密码
      },
      //注册时的账号、密码的验证
      validateSignUpUser:{
        userName:[
                    { required: true, message: '请填写帐户名', trigger: 'blur' },
                    { type: 'string', max: 20, message: '账号长度不能超过20位'}
                  ],
        password:[
                    { required: true, message: '请填写密码', trigger: 'blur' },
                    { type: 'string', min: 6, message: '密码长度位数为6-20', max: 20, trigger: 'blur' }
                  ],
        confirmPassword:[
                      { required: true, message: '请确认密码', trigger: 'blur' },
                      { type: 'string', min: 6, message: '密码长度位数为6-20', max: 20, trigger: 'blur' }
                    ]
      },
      signChoice:"登录",//按钮为注册或者登录
      selectActive:true,//为了显示下划线
      userType:'renter',//登录、注册人的类型

    }
  },
  computed:{},
  watch:{
    userType(){
      console.log("changeUser");
    }
  },
  methods:{
    handleSubmit(name) {
      //登录
        var _this=this;
        if(name=='signInUser'){
          this.$refs[name].validate((valid) => {
            if (valid) {
                axios.get('/api/userInformation/getUserByName',{params:{user_name:_this.signInUser.userName}})
                .then(function(respond){
                   if(respond.data.length){
                     var tempType='1';
                     if(_this.userType=='renter'){
                       tempType='1';
                     }else{
                       tempType='0';
                     }
                     if(respond.data[0].user_type_renter==tempType){
                       //用户存在且密码正确才能登陆
                        if(respond.data[0].password==_this.signInUser.password){
                            _this.$Message.success('登录成功!');
                            _this.gUserName.setUserName(_this.signInUser.userName);
                            if(window.localStorage){
                              var storage=window.localStorage;
                              storage.setItem("userName",_this.signInUser.userName)
                            }
                            _this.$router.push({name:'userPage',path: '/userPage',query:{userName:_this.signInUser.userName},params:{userType:_this.userType}});
                        }else{
                          _this.$Message.error("密码错误!");
                        }
                     }else{
                       _this.$Message.error("用户类型错误!");
                     }
                   }else{
                     _this.$Message.error("账号不存在!");
                   }
                })
                .catch(function(err){
                   console.log("err",err);
                })
                
            } else {
                _this.$Message.error('登录失败!');
            }
        })
        }
        //注册
        if(name=='signUpUser'){
          this.$refs[name].validate((valid) => {
            if (valid) {
                if(this.signUpUser.password==this.signUpUser.confirmPassword){
                  axios.get('/api/userInformation/getUserByName',{params:{user_name:_this.signUpUser.userName}})
                  .then(function(respond){
                    if(respond.data.length==0){
                      //用户不存在可插入
                      var tempType=true;
                      if(_this.userType=='renter'){
                        tempType=true;
                      }else{
                        tempType=false;
                      }
                      axios.post('/api/userInformation/addUser',{user_name:_this.signUpUser.userName,password:_this.signUpUser.password,user_type_renter:tempType})
                      .then(function(respond){
                        if(respond.data.code=='1'){
                          _this.$Message.success('注册成功!');
                          _this.gUserName.setUserName(_this.signUpUser.userName);
                          _this._userName=_this.signUpUser.userName;
                          if(window.localStorage){
                            var storage=window.localStorage;
                            storage.setItem("userName",_this.signUpUser.userName)
                          } 
                          //根据用户类型添加renterInformation和rentSeekingPerInformation
                          //出租者
                          if(_this.userType=='renter'){
                              axios.post('/api/renterInformation/insertRenter',{user_name:_this.signUpUser.userName,password:_this.signUpUser.password,user_type_renter:tempType})
                              .then(function(respond){
                                if(respond.data.code=='1'){
                                  console.log("/api/renterInformation/insertRenter插入成功");
                                }
                              }
                              )
                              .catch(function(err){
                                console.log(err);
                              })
                          }
                          else{
                            //求租者
                            axios.post('/api/rentSeekingPerInformation/insertRentSeekingPer',{user_name:_this.signUpUser.userName,password:_this.signUpUser.password,user_type_renter:tempType})
                              .then(function(respond){
                                if(respond.data.code=='1'){
                                  console.log("/api/rentSeekingPerInformation/insertRentSeekingPer插入成功");
                                }
                              }
                              )
                              .catch(function(err){
                                console.log(err);
                              })
                          }
                          
                          _this.$router.push({name:'userPage',path: '/userPage',query:{userName:_this.signUpUser.userName},params:{userType:_this.userType}});
                        }
                      })
                     }else{
                           _this.$Message.error("账号已存在!");
                     }
                  })
                  .catch(function(err){
                    console.log("err",err);
                  })
                  // this.$Message.success('注册成功!');
                  
                }
                if(this.signUpUser.password!=this.signUpUser.confirmPassword){
                  this.$Message.error('密码与确认密码不一致!');
                }
            } else {
                this.$Message.error('注册失败!');
            }
        }) 
        }
        
        // axios.post('/api/userInformation/getUserByName',{user_name:"小可爱"})
        // .then(function(respond){
        //   console.log("responds",respond.data);
        // })
        // .catch(function(err){
        //   console.log("err",err);
        // })
        
    },
    //验证密码
    confirmPassword(){
      console.log("confirmPassword");
    },
    changeSign(){
      this.selectActive=this.selectActive ? false : true;
      this.signChoice=this.signChoice == '登录' ? '注册' : '登录';
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.sign-in-up-page{
  width: 100%;
  height: 100%;
  background-image: url('../assets/img/signInUp/background.jpg');
  background-repeat: no-repeat;
  background-position: center center;
  background-attachment: fixed;
  background-size: cover;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.sign-in-up-title{
  justify-content: center;
  align-items: center;
}
.sign-in-up-title .title-arial,.sign-in-up-title .title-name{
  font-size: 40px;
  font-weight: bold;
  color: #031212;
  letter-spacing: 0.5em;
}
.sign-in-up-title .title-name{
  letter-spacing: 0em;
  font-size: 28px;
  font-weight: 400;
  font-family: 'Courier New', Courier, monospace;
}
.sign-in-up-content{
  padding:10px 10px;
  display: flex;
  flex-direction: column;
  width: 40%;
  background-color:#ffffff;
  min-width: 400px;
  max-width: 500px;
}
.sign-in-up-content-choice{
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.sign-choice{
  font-size:20px;
  position: relative;
  margin-left: 0px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  cursor: pointer;
}
.sign-choice.active::after{
  content: "";
  position: absolute;
  width: 130%;
  height: 2px;
  background-color: #3B94F1;
}
.sign-in-up-content{
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.sign-in-up-content form{
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
