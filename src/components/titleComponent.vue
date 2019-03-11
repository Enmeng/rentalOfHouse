<!-- 每一页的系统名称 -->
<template>
    <div class="title-component">
        <div class="system-name">
            <p>房屋租赁系统</p>
        </div>
        <div class="user-name">
            <!-- <Avatar style="background-color: #87d068" icon="ios-person" /> -->
            <img :src="avatar" class="user_avatar"></img>
            <p>{{userName}}</p>
        </div>
    </div>
</template>
<script>
    import { eventBus } from '../eventBus';
    import axios from 'axios';
    export default{
        name:'titleComponent',
        data(){
            return {
                userName:this.gUserName.userName,
                avatarName:'../../static/user.png'
            }
        },
        computed:{
            avatar(){
                var location='';
                if(this.avatarName!=''){
                    location='../../static/upload/'+this.avatarName;
                }else{
                    location='../../static/user.png';
                }
                return location;
            }
        },
        mounted(){
            this.userName=this.gUserName.userName;
            var _this=this;
            eventBus.$on('changeAvatar',({user_type})=>{
                console.log("changeAvatar",user_type);
                if(user_type=='renter'){
                    axios.get('/api/renterInformation/getAvatarByUserName',{params:{user_name:this.userName}})
                    .then(function(respond){
                        if(respond.data.length!=0&&respond.data[0].avatar){
                            _this.avatarName=respond.data[0].avatar
                        }else{
                            _this.avatarName='';
                        }

                    })
                    .catch(function(err){
                        console.log(err);
                    })
                }else{
                    axios.get('/api/rentSeekingPerInformation/getAvatarByUserName',{params:{user_name:this.userName}})
                    .then(function(respond){
                        if(respond.data.length!=0&&respond.data[0].avatar){
                            _this.avatarName=respond.data[0].avatar
                        }else{
                            _this.avatarName='';
                        }

                    })
                    .catch(function(err){
                        console.log(err);
                    })
                }
                
            })
        }
    }
</script>
<style>
    .title-component{
        width: 100%;
        height: 80px;
        background-color: #515a6e;
        position: fixed;
        z-index: 999;
        margin:0px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding:0px 10px;
        color: rgba(255,255,255,0.8);
    }
    .system-name>p{
        font-size: 34px;
        font-weight: bold;
        letter-spacing: 0.2em;
    }
    .user-name{
        display: flex;
        justify-content: space-around;
        align-items: center;
    }
    .user-name>p{
        padding-left: 10px;
    }
    .user_avatar{
        width:30px;
        height:30px;
        border:20px;
        border-radius:50% 50%;
    }
</style>