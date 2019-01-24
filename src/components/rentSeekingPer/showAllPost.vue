<!-- 显示所有求租人的帖子并提供搜索功能 -->
<template>
    <div class="search-rent-seeking-per">
        <div class="search">
            <Input search enter-button="搜索" placeholder="请输入搜索的关键词" />
        </div>
        <div class="rent-post"  v-for="(item,index) in postList" :key="index">
            <div class="rent-post-information" >
                <Card :bordered="false">
                    <p slot="title">{{item.user_name}}-帖子{{item.post_id}}</p>
                    <p slot="extra">{{item.post_time}}</p>
                    <div class="all-rent-post-information">
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
                    <p class="set-to-invalid" @click="follow(index)">关注</p>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import axios from 'axios';
    export default{
        name:'showAllPost',
        data(){
            return {
                spreadIndex:-1,
                list:[],
                number:[],
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
            }
        },
        methods:{
            spreadPost(index){
                this.spreadIndex=index;
            },
            foldPost(index){
                this.spreadIndex=-1;
            },
            follow(index){
                var _this=this;
                var postId=this.list[index].post_id;
                axios.post('/api/rentSeekingPerFollowedPost/insertRentSeekingPerPost',{user_name:_this.currentUserName,post_id:postId})
                .then(function(respond){
                    if(respond.data&&respond.data.code=='1'){
                        _this.$Message.success("关注成功!");
                    }else{
                        _this.$Message.error("关注失败!");
                    }
                })
                .catch(function(err){
                    console.log(err);
                })
                
            //重新获取系统的所有帖子信息
            _this.list=[];
            axios.get('/api/postInformation/getAllPost')
            .then(function(respond){
                if(respond.data.length!=0){
                    console.log("All renter post",respond.data.length);
                    _this.list.length=0;
                    for(let i=0;i<respond.data.length;i++){
                        var item=Object.assign({},respond.data[i]);
                        
                        (function(postItem){
                            //判断该帖子该用户是否关注，如果已经关注就不显示
                        axios.get('/api/rentSeekingPerFollowedPost/getPostByIdAndName',{params:{post_id:postItem.post_id,user_name:_this.currentUserName}})
                        .then(function(postRes){
                            if(postRes.data.length==0){
                                _this.list.push(postItem);
                                console.log("postId,",postItem.post_id);
                                // 获取关注该帖子的人数
                                for(let i=0;i<respond.data.length;i++){
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
                                }
                            }else{
                                console.log(_this.currentUserName+' 已经关注了 '+item.post_id);
                            }
                        })
                        .catch(function(err){
                            console.log(err);
                        })
                        })(item);//函数





                        
                    }//for循环结束

                    
                }else{
                    _this.list=[];
                    _this.number=[];
                }

                
            })
            .catch(function(err){
                console.log(err);
            })
                }
        },
        mounted(){
            var _this=this;
            //获取系统的所有帖子信息
            axios.get('/api/postInformation/getAllPost')
            .then(function(respond){
                if(respond.data.length!=0){
                    console.log("All renter post",respond.data.length);
                    _this.list.length=0;
                    for(let i=0;i<respond.data.length;i++){
                        var item=Object.assign({},respond.data[i]);
                        
                        (function(postItem){
                            //判断该帖子该用户是否关注，如果已经关注就不显示
                        axios.get('/api/rentSeekingPerFollowedPost/getPostByIdAndName',{params:{post_id:postItem.post_id,user_name:_this.currentUserName}})
                        .then(function(postRes){
                            if(postRes.data.length==0){
                                _this.list.push(postItem);
                                console.log("postId,",postItem.post_id);
                                // 获取关注该帖子的人数
                                for(let i=0;i<respond.data.length;i++){
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
                                }
                            }else{
                                console.log(_this.currentUserName+' 已经关注了 '+item.post_id);
                            }
                        })
                        .catch(function(err){
                            console.log(err);
                        })
                        })(item);//函数





                        
                    }//for循环结束

                    
                }else{
                    _this.list=[]
                }

                
            })
            .catch(function(err){
                console.log(err);
            })
        }
    }
</script>
<style>
    .search-rent-seeking-per{
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
    }
    .search-rent-seeking-per>.search{
        width: 400px;
        margin-top: 40px;
    }
    .rent-post{
        width: 80%;
        margin-top: 40px;
    }
    .rent-post-information{
        background:#eee;
        padding: 20px;
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