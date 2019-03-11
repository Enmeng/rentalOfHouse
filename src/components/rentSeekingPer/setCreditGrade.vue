<template>
    <div class="set-credit-grade">
        <div class="post-content">
          <div  v-for="(item,index) in postList" :key="index" class="post-item">
            <div class="post-information">
                <Card :bordered="false">
                    <p slot="title">帖子{{postId[index].post_id}}</p>
                    <p slot="extra">作者：{{item.user_name}}<span style="padding-left:10px;">{{item.post_time}}</span></p>
                    <div class="part-post-information">
                            <p>房屋地址：{{item.PI_location}}</p>
                            <p>房屋大小：{{item.house_size}}平方米</p>
                            <p>房屋类型：{{item.house_type}}</p>
                            <p>出租价格：{{item.expected_price}}元/月</p>
                            <p>是否配备家具：{{item.furnished}}</p>
                            <p>出租日期：{{item.rent_time}}</p>
                            <p>联系电话：{{item.RI_phone_number}}</p>
                            <p>邮箱：{{item.RI_email}}</p>
                            <p>其他要求：{{item.other_description}}</p>
                            <p>图片展示</p>
                            <div class="imageList" v-if="imageList[index]&&imageList[index].length&&imageList[index].length!=0">
                                <img v-for="i in imageList[index]" :src="i"></img>
                            </div>
                        <!-- <div class="imageList">
                            <img src="../../assets/img/user/1.png" class="houseImage" alt="加载错误"></img>
                            <img src="../../assets/img/user/2.png" class="houseImage" alt="加载错误"></img>
                        </div> -->
                    </div>
                </Card>
            </div>
            <div class="set-grade">
                <p>信用评分</p>
                <div>
                    <Rate  clearable v-model="valueCustomText[index]"></Rate>
                    <span>{{valueCustomText[index]*2}}</span>
                </div>
                <Button type="primary" class="btn" @click="saveCredit(index)">保存</Button>
            </div>
          </div>
        </div>
    </div>
</template>
<script>
    import axios from 'axios';
    export default{
        name:'setCreditGrade',
        data(){
            return {
                // houseImage:[
                //     {src:'../../static/user/1.png'},
                //     {src:'../../static/user/2.png'}
                // ],
                valueCustomText:[],
                list:[],
                postId:[],
                sumValue:0,
                postSum:0,
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
            saveCredit(index){
                var _this=this;
                this.sumValue=0;
                this.postSum=0;
                var credit=this.valueCustomText[index]*2;
                console.log("index and credit,",index+","+this.valueCustomText[index]*2);
                //更新求租者对用户的评价
                axios.post('/api/rentSeekingPerFollowedPost/setCredit',{RSPFP_credit_grade:credit,post_id:_this.postId[index].post_id,user_name:_this.currentUserName})
                .then(function(respond){
                    if(respond.data.code=='1'){
                        _this.$Message.success("评价成功!");
                        
                        //获取该帖子所属的出租者
                        console.log("post_id,",_this.postId[index].post_id)
                        axios.get('/api/postInformation/getFollowedPostInforById',{params:{post_id:_this.postId[index].post_id}})
                        .then(function(res){
                            console.log("belong to ,",res.data);
                            if(res.data.length!=0&&res.data[0].user_name){
                                var name=res.data[0].user_name;
                                
                                //获取该出租者的所有帖子id
                                axios.get('/api/postInformation/getAllPostByName',{params:{user_name:name}})
                                .then(function(userRes){
                                    if(userRes.data.length!=0){
                                        _this.postSum=userRes.data.length;
                                        for(let i=0;i<userRes.data.length;i++){
                                            var itemId=userRes.data[i].post_id;

                                            (function(id){
                                                axios.get('/api/rentSeekingPerFollowedPost/getAvgCredit',{params:{post_id:id}})
                                                .then(function(postRes){
                                                    if(postRes.data.length!=0){
                                                        var val=postRes.data[0].avg_credit;
                                                        _this.sumValue+=val;
                                                        console.log("sumValue:",_this.sumValue);
                                                        //每次都更新出租者的评价
                                                        var avg=_this.sumValue/_this.postSum;
                                                        axios.post('/api/rentSeekingPerFollowedPost/setUserCredit',{RI_credit_grade:avg,user_name:name})
                                                        .then(function(r){
                                                            if(r.data.code=='1'){
                                                                console.log("该出租者的信用评价已更新");
                                                            }else{
                                                                console.log("该出租者的信用评价更新失败");
                                                            }
                                                        })
                                                        .catch(function(err){
                                                            console.log(err);
                                                        })
                                                    }
                                                })
                                                .catch(function(err){
                                                    console.log(err);
                                                })
                                            })(itemId);
                                        }
                                    }
                                    
                                })
                            }
                        })
                        .catch(function(err){
                            console.log(err);
                        })
                    }else{
                        _this.$Message.error("评价失败!");
                    }
                }) 
                .catch(function(err){
                    console.log(err);
                })
            }
        },
        mounted(){
            var _this=this;
            //获取该用户关注的帖子id
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

                     }
                     for(let j=0;j<respond.data.length;j++){
                         _this.valueCustomText[j]=3;
                     }

                     //获取图片列表
                     for(let i=0;i<respond.data.length;i++){
                                    axios.get('/api/renterPostPicture/getPicture',{params:{post_id:_this.postId[i].post_id}})
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
                                        })
                                        .catch(function(err){
                                            console.log("获取图片列表失败");
                                        })
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
    .set-credit-grade{
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
    }
    .post-content{
        width: 80%;
        margin-top: 40px;
        display: flex;
        flex-direction: column;
    }
    .post-item{
        height: 600px;
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        margin-top: 40px;
    }
    .post-information{
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        background:#eee;
        padding: 20px;
        cursor: pointer;
        height: 500px;
        overflow-y: auto;
        border: 1px solid #eee;
    }
    .imageList{
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
    }
    .set-grade{
        margin-top: 30px;
        margin-left: 0px;
        height:100px;
        align-self: flex-start;
        display: flex;
        justify-content: space-around;
    }
    .set-grade>p{
        font-size: 20px;
        font-weight: 300;
        color:#2D8CF0;
    }
    .btn{
        margin-left: 20px;
    }
    .imageList{
        width:90%;
    }
    .imageList>img{
        width:100%;
    }
</style>