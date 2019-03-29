<template>
    <div class="postDetail">
        <div class="detailTitle">
            <div class="title">
                {{postD.user_name}}&nbsp;{{postD.post_id}}
            </div>
            <div class="detailContent">
                <div class="imgContainer">
                    <img :src="imageList[0]">
                    <Carousel autoplay  loop>
                        <CarouselItem>
                            <div class="demo-carousel">1</div>
                       </CarouselItem>
                       <CarouselItem>
                            <div class="demo-carousel">2</div>
                       </CarouselItem>
                       <CarouselItem>
                            <div class="demo-carousel">3</div>
                       </CarouselItem>
                       <CarouselItem>
                            <div class="demo-carousel">4</div>
                       </CarouselItem>
                   </Carousel>
                </div>
                <div class="informationContent">
                    <div class="price">
                        <span>{{postD.expected_price}}</span>元/月
                    </div>
                    <div class="other">
                        <div class="otherContent">
                                <div class="item">{{postD.house_size}}</div>
                                <div>面积</div>
                                <div class="item">{{postD.house_type}}</div>
                                <div>房屋类型</div>
                                <div class="item">{{postD.furnished}}</div>
                                <div>配备家具</div>
                        </div>
                        <div class="otherContent">
                                <div class="item">{{postD.PI_location}}</div>
                                <div>地址</div>
                                <div class="item">{{postD.rent_time}}</div>
                                <div>租期</div>
                        </div>
                        <div class="otherContent description">
                            <div>{{postD.other_description}}</div>
                        </div>
                    </div>
                </div>
                <div class="postUser">
                    <div class="avatar">
                        <img :src="avatar" class="user_avatar"></img>
                    </div>
                    <!-- <div>
                        <Rate  clearable v-model="postD.credit_grade*2" disabled></Rate>
                        <span>{{postD.credit_grade*2}}</span>
                  </div>  -->
                </div>
            </div>
        </div>
    </div>
</template>


<script>
    import Router from 'vue-router';
    import Vue from 'vue';
    import axios from 'axios';
    export default{
        name:"postDetail",
        data(){
            return{
                post:{},
                imageList:[],
                avatarName:'../../static/user.png'
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
            }
        },
        mounted(){
            // this.$route.query;
            var id=this.$route.query.postId;
            var _this=this;
            console.log(id)
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
                    imageList.length=0;
                    for(let j=0;j<res.data.length;j++){
                        var img=res.data[j].picture_location;
                        img="../../static/upload/"+img;
                          Vue.set(_this.imageList,j,img);
                        }
                                                    
                    }else{
                        console.log("没有图片");
                         _this.imageList=[];
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
        }
    }
</script>


<style></style>