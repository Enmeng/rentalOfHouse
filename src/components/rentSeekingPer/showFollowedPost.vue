<template>
    <div class="show-post">
        <div class="show-post-title">
            <p>已关注帖子列表</p>
        </div>
        <div class="show-post-content">
            <div class="show-post-information"   v-for="(item,index) in postList" :key="index">
                <Card :bordered="false">
                    <p slot="title">{{item.user_name}}-帖子{{postId[index].post_id}}</p>
                    <p slot="extra">{{item.post_time}}</p>
                    <div class="all-show-post-information">
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
                    <p>关注人数：{{followedNumber[index]}}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';
    export default{
        name:'showFollowedPost',
        data(){
           return {
                spreadIndex:-1,
                list:[],
                number:[],
                postId:[]
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
            },
            followedNumber(){
                var list=[];
                if(this.number.length){
                    list.length=this.number.length;
                    for(let i=0;i<this.number.length;i++){
                        list[i]=this.number[i];
                        
                    }
                }
                console.log("list",list)
                return list;
            },
            postIdList(){
                var list=[];
                if(this.postId.length){
                    list.length=this.postId.length;
                    for(let i=0;i<this.postId.length;i++){
                        list[i]=this.postId[i];
                        
                    }
                }
                console.log("postIdList",list)
                return list;
            }
        },
        methods:{
            spreadPost(index){
                this.spreadIndex=index;
            },
            foldPost(index){
                this.spreadIndex=-1;
            },

        },
        mounted(){
            var _this=this;
            //获取系统的所有帖子信息
            axios.get('/api/postInformation/getFollowedPostByName',{params:{user_name:_this.currentUserName}})
            .then(function(respond){
                if(respond.data.length!=0){
                    console.log("All followed post",respond.data.length);
                    _this.list.length=0;
                    for(let i=0;i<respond.data.length;i++){
                        var item=Object.assign({},respond.data[i]);
                        _this.postId.push(item);
                        //获取该帖子的所有信息
                        (function(postItem){
                            axios.get('/api/postInformation/getFollowedPostInforById',{params:{post_id:postItem.post_id}})
                            .then(function(postRes){
                                if(postRes.data.length!=0){
                                  _this.list.push(postRes.data[0]);
                            }else{
                                console.log(postItem.post_id+" 不存在");
                            }
                            })
                            .catch(function(err){
                                console.log(err);
                            })
                        })(item);



                       (function(postItem){
                           // 获取关注该帖子的人数
                            axios.get('/api/postInformation/getCountFollower',{params:{post_id:postItem.post_id}})
                                        .then(function(res){
                                            if(res.data.length!=0&&res.data[0]&&(res.data[0].followedNumber!=undefined)){
                                                _this.number.push(res.data[0].followedNumber);

                                            }else{
                                                _this.number=[];
                                            }
                                                    
                                            })
                                        .catch(function(err){
                                                console.log(err);
                                        })
                       })(item);
                     }


                    
                }else{
                    _this.list=[];
                    _this.postId=[];
                }

                
            })
            .catch(function(err){
                console.log(err);
            })
        }
    }
</script>

<style>
    .show-post{
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
    }
    .show-post-title>p{
        font-size:20px;
        font-weight:300px;
        margin-top:40px;
    }
    .show-post-content{
        width: 80%;
        margin-top: 40px;
    }
    .show-post-information{
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