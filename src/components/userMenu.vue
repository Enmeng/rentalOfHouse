<template>
    <div class="user-menu">
        <Menu v-if="userType=='renter'" active-name="1-1" :open-names="['1']" theme="dark" style="width:200px;" @on-select="menuModifyInformation">
            <Submenu name="1">
                <template slot="title">
                    <Icon type="ios-analytics" />
                    用户管理
                </template>
               <MenuItem name="1-1">修改个人信息</MenuItem>
            </Submenu>
            <Submenu name="2">
                <template slot="title">
                    <Icon type="ios-filing" />
                    房屋管理
                </template>
                <Submenu name="3">
                        <template slot="title">房屋信息</template>
                        <MenuItem name="3-1">填写房屋信息</MenuItem>
                </Submenu>
                <Submenu name="4">
                    <template slot="title">帖子</template>
                    <MenuItem name="4-1">发布帖子</MenuItem>
                    <MenuItem name="4-2">标注帖子无效</MenuItem>
                </Submenu>
            </Submenu>
            <Submenu name="5">
                <template slot="title">
                    <Icon type="ios-cog" />
                    信息管理
                </template>
                <MenuItem name="5-1">查看帖子</MenuItem>
                <MenuItem name="5-2">查看求租人</MenuItem>
            </Submenu>
        </Menu>
        <Menu v-else active-name="1-1" :open-names="['1']" theme="dark" style="width:200px;"  @on-select="menuModifyInformation">
                <Submenu name="1">
                    <template slot="title">
                        <Icon type="ios-analytics" />
                        用户管理
                    </template>
                   <MenuItem name="1-1">修改个人信息</MenuItem>
                </Submenu>
                <Submenu name="2">
                    <template slot="title">
                        <Icon type="ios-filing" />
                        房屋管理
                    </template>
                    <Submenu name="3">
                            <template slot="title">房屋信息</template>
                            <MenuItem name="3-1">填写房屋信息</MenuItem>
                    </Submenu>
                    <Submenu name="4">
                        <template slot="title">帖子</template>
                        <MenuItem name="4-1">显示系统所有帖子</MenuItem>
                        <MenuItem name="4-2">查看已关注的帖子</MenuItem>
                        <MenuItem name="4-3">搜索房屋信息</MenuItem>
                    </Submenu>
                </Submenu>
                <Submenu name="5">
                    <template slot="title">
                        <Icon type="ios-cog" />
                        信息管理
                    </template>
                    <MenuItem name="5-1">评价帖子</MenuItem>
                </Submenu>
            </Menu>
    </div>
</template>
<script>
    import axios from 'axios';
    export default{
        name:'userMenu',
        props:['userInformation'],
        data(){
            return{
                renterMenu:[
                    {name:'1-1',alias:'modifyPersonalInformation'},
                    {name:'3-1',alias:'fillHouseInformation'},
                    {name:'4-1',alias:'releasePost'},
                    {name:'4-2',alias:'setPostInvalid'},
                    {name:'5-1',alias:'showPost'},
                    {name:'5-2',alias:'searchRentSeekingPer'}

                ],
                rentSeekingPerMenu:[
                    {name:'1-1',alias:'modifyPersonalInformation'},
                    {name:'3-1',alias:'fillHouseInformation'},
                    {name:'4-1',alias:'showAllPost'},
                    {name:'4-2',alias:'showFollowedPost'},
                    {name:'4-3',alias:'searchPostList'},
                    {name:'5-1',alias:'setCreditGrade'}
                ],
                user_type:'renter',
            }
        },
        computed:{
            userType(){
                // if(this.userInformation && this.userInformation.userType){
                //    return this.userInformation.userType; //从登录或者注册页面传递
                // }else{
                    return this.user_type;
                // }
            },
            currentUserName(){
                var name='';
                if(window.localStorage){
                    var storage=window.localStorage;
                    if(storage.getItem("userName")!=undefined){
                        name=storage.getItem("userName");
                    }
                }
                return name;
            },
        },
        methods:{
            menuModifyInformation(itemName){
                let menuItem='';
                //出租者的菜单
                if(this.userType=='renter'){
                    for(let i=0;i<this.renterMenu.length;i++){
                        if(this.renterMenu[i].name==itemName){
                            menuItem=this.renterMenu[i].alias;
                        }
                    }
                }
                else{
                    //求租者的菜单
                    for(let i=0;i<this.rentSeekingPerMenu.length;i++){
                        if(this.rentSeekingPerMenu[i].name==itemName){
                            menuItem=this.rentSeekingPerMenu[i].alias;
                        }
                    }
                }
                console.log("click",menuItem);
                this.$emit('change-componentPage',menuItem);//向首页提供改变菜单选项的值
            }
        },
        beforeCreate(){
            
        },
        mounted(){
            var _this=this;
             axios.get('/api/userInformation/getUserByName',{params:{user_name:_this.currentUserName}})
                .then(function(respond){
                   if(respond.data.length!=0){
                       var data=respond.data[0];
                       console.log("type,",data)
                     if(data.user_type_renter==1){
                         console.log("renter")
                         _this.user_type='renter';
                     }else{
                        console.log("rentSeeking")
                        _this.user_type='rentSeeking';
                     }
                    }
                })
                .catch(function(err){
                    console.log(err);
                })
        
        }
    }
</script>
<style>
    .user-menu{
        width: 200px;
        height: 100%;
        position: fixed;
        margin-top: 80px;
        z-index: 999;
    }

    /* iview的样式 */
    .user-menu>.ivu-menu.ivu-menu-dark.ivu-menu-vertical{
        width: 200px;
        height: 100%;
    }
    
</style>