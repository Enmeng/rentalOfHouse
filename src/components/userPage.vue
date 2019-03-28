<template>
    <div class="user-page">
    <title-component :userName="userInformation.userName"></title-component>
    <userMenu :userInformation="userInformation" @change-componentPage="userChangeComponentPage"></userMenu>
    <div class="user-page-content" v-if="userType=='renter'">
        <searchRentSeekingPer v-if="menuItem=='searchRentSeekingPer'"></searchRentSeekingPer>
        <modifyPersonalInformation v-else-if="menuItem=='modifyPersonalInformation'"></modifyPersonalInformation>
        <fillHouseInformation v-else-if="menuItem=='fillHouseInformation'"></fillHouseInformation>
        <releasePost v-else-if="menuItem=='releasePost'"></releasePost>
        <setPostInvalid v-else-if="menuItem=='setPostInvalid'"></setPostInvalid>
        <showPost v-else></showPost>
    </div>
    <div class="user-page-content" v-else>
        <modifyPersonalInformation v-if="menuItem=='modifyPersonalInformation'"></modifyPersonalInformation>
        <rentSeekingPerFillHouseInformation v-else-if="menuItem=='fillHouseInformation'"></rentSeekingPerFillHouseInformation>
        <showFollowedPost v-else-if="menuItem=='showFollowedPost'"></showFollowedPost>
        <showAllPost v-else-if="menuItem=='showAllPost'"></showAllPost>
        <searchPostList v-else-if="menuItem=='searchPostList'"></searchPostList>
        <setCreditGrade v-else></setCreditGrade>
    </div>
    </div>
</template>
<script>
    import axios from 'axios';
    import Router from 'vue-router'
    import titleComponent from '@/components/titleComponent';
    import userMenu from '@/components/userMenu';
    import searchRentSeekingPer from '@/components/searchRentSeekingPer';
    import modifyPersonalInformation from '@/components/modifyPersonalInformation';
    import fillHouseInformation from '@/components/fillHouseInformation';
    import releasePost from '@/components/releasePost';
    import setPostInvalid from '@/components/setPostInvalid';
    import showPost from '@/components/showPost';
    import rentSeekingPerFillHouseInformation from '@/components/rentSeekingPer/fillHouseInformation';
    import showFollowedPost from '@/components/rentSeekingPer/showFollowedPost';
    import showAllPost from '@/components/rentSeekingPer/showAllPost';
    import setCreditGrade from '@/components/rentSeekingPer/setCreditGrade';
    import searchPostList from '@/components/rentSeekingPer/searchPostList';
    export default{
        name :'userPage',
        components:{
            titleComponent,
            userMenu,
            searchRentSeekingPer,
            modifyPersonalInformation,
            fillHouseInformation,
            releasePost,
            setPostInvalid,
            showPost,
            rentSeekingPerFillHouseInformation,
            showFollowedPost,
            showAllPost,
            setCreditGrade,
            searchPostList
        },
        data(){
            return {
                userInformation:{
                    userName:'',//用户名
                    userType:'renter',//用户类型，出租者/求租者
                },
                pageName:'modifyPersonalInformation',//当前的菜单选项，默认为修改个人信息页
                user_type:'renter',
            }
        },
        computed:{
            userType(){
                return this.user_type;
              
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
            menuItem(){
                let pageName=this.pageName;
                return pageName;
            }
        },
        watch:{
            
        },
        methods:{
            userChangeComponentPage(pageName){
                this.pageName=pageName;
            }
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
            console.log("this,$router.query",this.$route.query);
            console.log("this.$route.params",this.$route.params);
            if(this.$route.query && this.$route.query.userName && this.$route.params && this.$route.params.userType){
                this.userInformation.userName=this.$route.query.userName;
                this.userInformation.userType=this.$route.params.userType;
                console.log("this.$route.query.userName",this.$route.query.userName);
                console.log("this.$route.params.userType",this.$route.params.userType);
            }
        }
    }
</script>
<style>
    .user-page{
        width: 100%;
        height: 100%;
        display: flex;
        position: relative;
        margin: 0px;
    }
    .user-page-content{
        z-index:0;
        width: 100%;
        margin-top: 80px;
        margin-left: 200px;
    }
</style>