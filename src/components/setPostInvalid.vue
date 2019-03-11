<template>
    <div class="set-post-invalid">
        <div class="set-post-invalid-title">
            <p>已发布的帖子列表</p>
        </div>
        <div class="set-post-invalid-content">
            <div class="set-post-invalid-information"  v-for="(item,index) in postList" :key="index">
                <Card :bordered="false">
                    <p slot="title">帖子{{item.post_id}}</p>
                    <p slot="extra">{{item.post_time}}</p>
                    <div class="all-set-post-invalid-information">
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
                            <div class="imageList" v-if="imageList[index]&&imageList[index].length&&imageList[index].length!=0">
                                <img v-for="i in imageList[index]" :src="i"></img>
                            </div>
                        </div>
                    </div>
                </Card>
                <div class="card-footer">
                    <p class="show-detail" @click="spreadPost(index)" v-if="spreadIndex!=index">查看详情</p>
                    <p class="show-detail" @click="foldPost(index)"  v-if="spreadIndex==index">收起详情</p>
                    <p>关注人数：{{followedNumber[index]}}</p>
                    <p class="set-to-invalid" @click="setPostUnAvail(index)">标注为无效</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';
    export default{
        name:'setPostInvalid',
        data(){
           return {
                spreadIndex:-1,
                list:[],
                number:[],
                img:[]
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
            imageList(){
                var list=[];
                if(this.img.length){
                    list.length=this.img.length;
                    for(let i=0;i<this.img.length;i++){
                        list[i]=this.img[i];
                    }
                }
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
            setPostUnAvail(index){
                var _this=this;
                //修改帖子为已发布
                var postId=this.list[index].post_id;
                var date=new Date();
                var currentTime=date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()+' '+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
                console.log("postId",postId);
                axios.post('/api/postInformation/setPostUnAvail',{post_id:postId})
                .then(function(respond){
                    if(respond.data&&respond.data.code=='1'){
                        _this.$Message.success("标注为无效成功!");
                    }else{
                        _this.$Message.error("标注为无效失败!");
                    }
                })
                .catch(function(err){
                    console.log(err);
                })
                //重新获取未发布的帖子
                axios.get('/api/postInformation/getAvailPostByName',{params:{user_name:this.currentUserName}})
                .then(function(respond){
                    if(respond.data.length!=0){
                        _this.list.length=0;
                        for(let i=0;i<respond.data.length;i++){
                            var item=Object.assign({},respond.data[i]);
                            _this.list.push(item);
                        }
                        //获取关注该帖子的人数
                        _this.number=[];
                        for(let i=0;i<respond.data.length;i++){
                            axios.get('/api/postInformation/getCountFollower',{params:{post_id:_this.list[i].post_id}})
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
                    //获取图片列表
                    _this.img=[];
                    for(let i=0;i<respond.data.length;i++){
                        axios.get('/api/renterPostPicture/getPicture',{params:{post_id:_this.list[i].post_id}})
                            .then(function(res){
                                if(res.data.length!=0){
                                    var imageList=[];
                                    imageList.length=0;
                                    for(let j=0;j<res.data.length;j++){
                                        var img=res.data[j].picture_location;
                                        img="../../static/upload/"+img;
                                        console.log(_this.list[i].post_id+" 的第 "+(j+1)+" 图片的位置 "+img);
                                        imageList.push(img);
                                    }
                                    _this.img.push(imageList);
                                    
                                }else{
                                    console.log("没有图片");
                                    _this.img.push([]);
                                }
                                // console.log("帖子信息：",_this.list[i]);
                                // _this.list.push(item);
                            })
                            .catch(function(err){
                                console.log("获取图片列表失败");
                            })
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
            axios.get('/api/postInformation/getAvailPostByName',{params:{user_name:this.currentUserName}})
            .then(function(respond){
                if(respond.data.length!=0){
                    _this.list.length=0;
                    for(let i=0;i<respond.data.length;i++){
                        var item=Object.assign({},respond.data[i]);
                        _this.list.push(item);
                    }
                    //获取关注该帖子的人数
                    for(let i=0;i<respond.data.length;i++){
                            axios.get('/api/postInformation/getCountFollower',{params:{post_id:_this.list[i].post_id}})
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

                    //获取图片列表
                    for(let i=0;i<respond.data.length;i++){
                        axios.get('/api/renterPostPicture/getPicture',{params:{post_id:_this.list[i].post_id}})
                            .then(function(res){
                                if(res.data.length!=0){
                                    var imageList=[];
                                    imageList.length=0;
                                    for(let j=0;j<res.data.length;j++){
                                        var img=res.data[j].picture_location;
                                        img="../../static/upload/"+img;
                                        console.log(_this.list[i].post_id+" 的第 "+(j+1)+" 图片的位置 "+img);
                                        imageList.push(img);
                                    }
                                    _this.img.push(imageList);
                                    
                                }else{
                                    console.log("没有图片");
                                    _this.img.push([]);
                                }
                                // console.log("帖子信息：",_this.list[i]);
                                // _this.list.push(item);
                            })
                            .catch(function(err){
                                console.log("获取图片列表失败");
                            })
                    }
                    
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
    .set-post-invalid{
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
    }
    .set-post-invalid-title>p{
        font-size:20px;
        font-weight:300px;
        margin-top:40px;
    }
    .set-post-invalid-content{
        width: 80%;
        margin-top: 40px;
    }
    .set-post-invalid-information{
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
    .imageList{
        width:90%;
    }
    .imageList>img{
        width:100%;
    }
</style>