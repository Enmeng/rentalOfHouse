<template>
    <div class="release-post">
        <div class="release-title">
            <p>未发布的帖子列表</p>
        </div>
        <div class="release-post-content">
            <div class="release-post-information" v-for="(item,index) in postList" :key="index">
                <Card :bordered="false">
                    <p slot="title">帖子{{item.post_id}}</p>
                    <p slot="extra">{{item.post_time}}</p>
                    <div class="all-release-post-information">
                        <p>房屋地址：{{item.PI_location}}</p>
                        <p>房屋大小：{{item.house_size}}平方米</p>
                        <p>房屋类型：{{item.house_type}}</p>
                        <p>出租价格：{{item.expected_price}}元/月</p>
                        <p>是否配备家具：{{item.furnished}}</p>
                        <div v-if="spreadIndex==index">
                            <p>出租日期：{{item.rent_time}}</p>
                            <p>联系电话：{{item.RI_phone_number}}</p>
                            <p>邮箱：{{item.RI_email}}</p>
                            <p>其他要求：{{item.other_description}}</p>
                            <p>图片展示</p>
                        </div>
                    </div>
                </Card>
                <div class="card-footer">
                    <p class="show-detail" @click="spreadPost(index)" v-if="spreadIndex!=index">查看详情</p>
                    <p class="show-detail" @click="foldPost(index)"  v-if="spreadIndex==index">收起详情</p>
                    <p class="release-action" @click="releasePost(index)">发布</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';
    export default{
        name:'releasePost',
        data(){
           return {
                // selectValue:'1',
                spreadIndex:-1,
                list:[]
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
                return name;
            },
            postList(){
                
                var list=[];
                if(this.list.length){
                    list.length=this.list.length;
                    for(let i=0;i<this.list.length;i++){
                        list[i]=Object.assign({},this.list[i]);
                        if(list[i].furnished==1){
                            list[i].furnished='是';
                        }else{
                            list[i].furnished='否';
                        }
                        var postTime = new Date(list[i].post_time);
                        var timeStr=postTime.getFullYear() + '-' + (postTime.getMonth() + 1) + '-' + postTime.getDate()+' '+postTime.getHours()+':'+postTime.getMinutes()+':'+postTime.getSeconds();
                        list[i].post_time=timeStr;
                        
                    }
                }
                console.log("listChange",list)
                return list;
            }
        },
        watch:{
            // postList:{
            //     handler(newValue,oldValue){},
            //     deep:true
            // }
        },
        methods:{
            spreadPost(index){
                this.spreadIndex=index;
            },
            foldPost(index){
                this.spreadIndex=-1;
            },
            releasePost(index){
                var _this=this;
                //修改帖子为已发布
                var postId=this.list[index].post_id;
                var date=new Date();
                var currentTime=date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()+' '+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
                console.log("postId",postId);
                axios.post('/api/postInformation/setPostRelease',{post_time:currentTime,post_id:postId})
                .then(function(respond){
                    if(respond.data&&respond.data.code=='1'){
                        _this.$Message.success("发布成功!");
                    }else{
                        _this.$Message.error("发布失败!");
                    }
                })
                .catch(function(err){
                    console.log(err);
                })
                //重新获取未发布的帖子
                axios.get('/api/postInformation/getUnReleasePostByName',{params:{user_name:this.currentUserName}})
                .then(function(respond){
                    if(respond.data.length!=0){
                        _this.list.length=0;
                        for(let i=0;i<respond.data.length;i++){
                            var item=Object.assign({},respond.data[i]);
                            _this.list.push(item);
                        }
                    }else{
                        _this.list=[];
                    }
                })
                .catch(function(err){
                    console.log(err);
                })
            }
        },
        mounted(){
            var _this=this;
            //获取用户未发布的帖子信息
            axios.get('/api/postInformation/getUnReleasePostByName',{params:{user_name:this.currentUserName}})
            .then(function(respond){
                if(respond.data.length!=0){
                    _this.list.length=0;
                    for(let i=0;i<respond.data.length;i++){
                        var item=Object.assign({},respond.data[i]);
                        _this.list.push(item);
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
    .release-post{
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
    }
    .release-title>p{
        font-size:20px;
        font-weight:300px;
        margin-top:40px;
    }
    .release-post-content{
        width: 80%;
        margin-top: 40px;
    }
    .release-post-information{
        background:#eee;
        padding: 20px;
        margin-top:20px;
        cursor: pointer;
    }
    .card-footer{
        color: #2D8CF0;
        padding:10px 0px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        
    }
</style>