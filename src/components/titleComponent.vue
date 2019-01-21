<!-- 每一页的系统名称 -->
<template>
    <div class="title-component">
        <div class="system-name">
            <p>房屋租赁系统</p>
        </div>
        <div class="user-name">
            <Avatar style="background-color: #87d068" icon="ios-person" />
            <p>{{userName}}</p>
        </div>
    </div>
</template>
<script>
    export default{
        name:'titleComponent',
        data(){
            return {
                userName:this.gUserName.userName
            }
        },
        mounted(){
            this.userName=this.gUserName.userName;
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
</style>