<template>
    <div class="postDetail">
        <div class="detailTitle">
            <div class="title">
                {{postD.user_name}}&nbsp;&nbsp;&nbsp;{{postD.post_id}}
            </div>
            <div class="detailContent">
                <div class="imgContainer">
                    <!-- <img :src="imageList[0]"> -->
                    <Carousel autoplay  loop  :autoplay-speed="autoplay" :arrow="arrow">
                        <CarouselItem v-for="(item,index) in list" :key="index">
                            <div class="demo-carousel">
                                <img class="carouseItem" :src="item" @click="changeImage(item,index)">
                            </div>
                       </CarouselItem>
                   </Carousel>
                </div>
                <div class="informationContent">
                    <div class="price">
                        <span>{{postD.expected_price}}</span>元/月
                    </div>
                    <div class="other">
                        <div class="otherContent">
                                <div>
                                    <div class="item">{{postD.house_size}}平方米</div>
                                    <div>面积</div>
                                </div>
                                <div>
                                    <div class="item">{{postD.house_type}}</div>
                                    <div>房屋类型</div>
                                </div>
                                <div>
                                    <div class="item">{{postD.furnished}}</div>
                                    <div>配备家具</div>
                                </div>
                        </div>
                        <div class="otherContent">
                                <div>
                                    <div class="item">{{postD.PI_location}}</div>
                                    <div>地址</div>
                                </div>
                                <div>
                                    <div class="item">{{postD.rent_time}}</div>
                                    <div>租期</div>
                                </div>
                        </div>
                        <div class="otherContent description">
                            <div>{{postD.other_description}}</div>
                        </div>
                    </div>
                    <div class="postUser">
                        <div class="avatar">
                            <img :src="avatar" class="user_avatar"></img>
                        </div>
                        <div class="creditGrade">
                            <Rate  clearable v-model="creditGrade" disabled></Rate>
                            <span>{{postD.RI_credit_grade*2}}</span>
                      </div> 
                      <div class="tel">
                          <div class="phone">
                              <div>联系方式：</div>
                              <div class="number">{{postD.RI_phone_number}}</div>
                          </div>
                          <div class="email">
                            <div>邮箱：</div>
                            <div class="number">{{postD.RI_email}}</div>
                        </div>
                        
                      </div>
                    </div>
                    <!-- <div class="follow">
                        <p class="followNumber">关注人数：{{followedNumber}}</p>
                        <button  @click="followAdd()">关注</button>
                    </div> -->
                </div>
            </div>
        </div>
    </div>
</template>


<script>
    import Router from 'vue-router';
    import Vue from 'vue';
    import axios from 'axios';
    import {eventBus} from '../../eventBus';
    export default{
        name:"postDetail",
        data(){
            return{
                post:{},
                imageList:[],
                list:[],
                avatarName:'../../static/user.png',
                value2:0,
                autoplay:4000,
                arrow:"always",
                number:""
            }
        },
        computed:{
            postD(){
                var post;
                if(this.post!=null){
                    post=Object.assign({},this.post);
                    if(post.furnished==1){
                            post.furnished='是';
                        }else{
                            post.furnished='否';
                        }
                        var postTime = new Date(post.post_time);
                        var timeStr=postTime.getFullYear() + '-' + (postTime.getMonth() + 1) + '-' + postTime.getDate()+' '+postTime.getHours()+':'+postTime.getMinutes()+':'+postTime.getSeconds();
                        post.post_time=timeStr;
                    }
                return post; 
            },
            avatar(){
                var location='';
                if(this.avatarName!=''){
                    location='../../static/upload/'+this.avatarName;
                }else{
                    location='../../static/user.png';
                }
                return location;
            },
            creditGrade(){
                return this.post.RI_credit_grade;
            },
            followedNumber(){
                return this.number;
                
            },
        },
        methods:{
            changeImage(item,index){
                var temp=this.imageList[0];
                Vue.set(this.imageList,index,temp);
                Vue.set(this.imageList,0,item);
            },
            followAdd(){
                var id=this.$route.query.postId;
                this.number++;
                eventBus.$emit("follow",{id});
                console.log("follow",id)
            }
        },
        mounted(){
            // this.$route.query;
            var id=this.$route.query.postId;
            var _this=this;
            axios.get('/api/postInformation/postDetailById',{params:{post_id:id}})
                .then(function(respond){
                    if(respond.data.length!=0){
                        console.log(respond.data[0])
                        _this.post=Object.assign({},respond.data[0],{post_id:id});
                    }
                }
            )
            .catch(function(err){
                {
                   console.log("获取数据失败");
               }
            })

            //获取图片
            axios.get('/api/renterPostPicture/getPicture',{params:{post_id:id}})
                .then(function(res){
                    if(res.data.length!=0){
                    var imageList=[];
                    var list=[];
                    imageList.length=0;
                    for(let j=0;j<res.data.length;j++){
                        var img=res.data[j].picture_location;
                        img="../../static/upload/"+img;
                          Vue.set(_this.imageList,j,img);
                          Vue.set(_this.list,j,img);
                        }
                                                    
                    }else{
                        console.log("没有图片");
                         _this.imageList=[];
                         _this.list=[];
                     }
                })
                .catch(function(err){
                    console.log("获取图片列表失败");
                })
                   
                //获取该帖子的用户头像
                axios.get('/api/renterInformation/getAvatarByUserName',{params:{user_name:this.post.user_name}})
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


                    //获取该帖子的关注人数
                    axios.get('/api/postInformation/getCountFollower',{params:{post_id:id}})
                                        .then(function(res){
                                            if(res.data.length!=0&&res.data[0]&&(res.data[0].followedNumber!=undefined)){
                                                
                                                _this.number=res.data[0].followedNumber;
                                            }else{
                                                _this.number=0;
                                            }
                                            
                                        })
                                        .catch(function(err){
                                            console.log(err);
                                        })
        }
    }
</script>


<style>
    .postDetail{
        width: 100%;
        display: flex;
        justify-content: center; 
        flex:1 0 auto;
    }
    .detailTitle{
        width: 90%;
        margin-left:5%;
        /* margin-left: 0px; */
        margin-top:20px;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        /* overflow-x: hidden; */
        flex-shrink: 0;
        flex:1 0 auto;
    }
    .ivu-carousel{
        width: 500px;
        /* background-color:rgba(0,0,0,1); */
    }
    .title{
        margin-bottom:10px;
        color:#000000;
        font-size: 22px;
        font-weight:600;
    }
    .detailContent{
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        flex:1 0 auto;
    }
    .imgContainer{
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: flex-start;
        flex-shrink: 0;
        width: 500px;
        overflow-x: hidden;
    }
    .informationContent{
        margin-left:200px ;
        
    }
    .imgContainer>img{
        width: 500px;
        height:400px;
        margin-bottom:30px;
       
    }
    .carouseItem{
        width: 500px;
        height: 450px;
    }
    .other{
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        flex:1 0 auto;
        /* width: 400px; */
    }
    .otherContent{
        padding:15px 0px 15px 0px;
        border-width: 1px 0px 0px 0px;
        border-color: #eeeeee;
        border-style: solid;
        display:flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        flex:1 0 auto;
        width: 500px;
    }
    .price>span{
        color:red;
        font-size: 26px;
        font-weight: 600;
    }
    .otherContent>div{
        margin-right: 40px;
    }
    .item{
        color:#000000;
        font-size: 22px;
    }
    .description{
        color: #000000;
        font-size: 18px;
        margin-bottom: 20px;
    }
    .postUser{
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;;
    }
    .avatar{
        margin-right: 20px;
    }
    .user_avatar{
        width: 50px;
    }
    .creditGrade{
        margin-right: 20px;
    }
    .tel{
        font-size: 18px;
        display: flex;
        flex-direction: column;
    }
    .phone,.email{
        display: flex;
        
    }
    .number{
        color: red;
    }
    .follow{
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        margin-top: 20px;
    }
    .followNumber{
        font-size: 18px;
        margin-right: 30px;
    }
    button{
        width: 80px;
        background-color: #2D8CF0;
        height: 50px;
        border: none;
        font-size: 18px;
        color: #ffffff;
    }
</style>