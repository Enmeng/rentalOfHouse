<!-- 显示所有求租人的帖子并提供搜索功能 -->
<template>
    <div class="searchPostList">
        <div class="searchPostListTitle">
            <Input search enter-button placeholder="输入关键字(地段名)" />
            <div class="knowledge">
                <Icon type="md-paw" />
                <p class="tip">足迹</p>
                <p class="redTip tip" @click="goToRKnowledge">租房知识</p>
                <p class="redTip tip" @click="goToWarning">防骗警告</p>
            </div>
        </div>
        <div class="divider"></div>
        <div class="condition">
            <div class="currentLocation">
                <p style="color:red;cursor:pointer;"  @click="showPlacename=true">[切换城市]</p>
                <p>{{currentCity}}</p>
            </div>
        </div>
        <div class="area">
            <div class="areaContent">
                <p>筛选条件</p>
                <div class="areaPart">
                    <p>区域：</p>
                    <div class="noLimit">不限</div>
                    <!-- <div class="areaItem" v-for="item in areaList">{{item}}</div> -->
                </div>
                <div class="areaPart">
                    <p>租金：</p>
                    <div class="noLimit">不限</div>
                    <!-- <div class="areaItem" v-for="item in ['500元以下','500-1000元','1000-2000元','2000-3000元','3000-5000元','5000-8000元','8000元以上]">{{item}}</div> -->
                </div>
                <div class="areaPart">
                    <p>户型：</p>
                    <div class="noLimit">不限</div>
                    <!-- <div class="areaItem" v-for="item in ['一室','二室','三室','四室','四室以上']">{{item}}</div> -->
                </div>
                <div class="areaPart">
                    <p>面积：</p>
                    <div class="noLimit">不限</div>
                    <!-- <div class="areaItem" v-for="item in ['20-30平','30-40平','40-50平','50-60平','60-80平','80-100平','100-150平','150-250平','250平以上']">{{item}}</div> -->
                </div>
            </div>
        </div>
        <Modal  title="选择城市"  v-model="showPlacename" :mask-closable="false" :fullscreen="true">
            <div class="titleImg">
                <img src="../../assets/img/searchPostList/selectCity3.png">
            </div>
            <div class="modalContent">
                <div class="hotCity">
                    <p class="hotCityTip hotItem">热门城市</p>
                    <p class="hotItem hoverTip" v-for="item in ['北京','上海','广州','深圳','成都','杭州','南京','天津','武汉','重庆']" @click="changeCurrentCity($event)">{{item}}</p>
                </div>
                <div class="selectCity">
                    <p>城市选择</p>
                    <Select  style="width:200px" placeholder="省份" v-model="selectProvince">
                        <Option v-for="province in provinceList" :value="province" :key="province" class="hoverTip">{{ province }}</Option>
                    </Select>
                    <Select  style="width:200px" placeholder="城市" v-model="currentCity">
                        <Option v-for="city in cityList" :value="city" :key="city" class="hoverTip">{{ city }}</Option>
                    </Select>
                </div>
                <div class="byInitial">
                    <p>按省份首字母选择</p>
                    <div class="byInitialContent">
                        <div class="initialItem" v-for="item in placename">
                            <div class="initial">{{item.initial}}</div>
                            <div class="provinceContent">
                                <div class="provinceItem" v-for="province in item.province">
                                    <div class="province">{{province.pName}}</div>
                                    <div class="cityContent">
                                        <div class="city  hoverTip" v-for="city in province.city"  @click="changeCurrentCity($event)">{{city}}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
       </Modal>
    </div>
</template>
<script>
    import axios from 'axios';
    import Router from 'vue-router';
    import Vue from 'vue';
    export default{
        name:'searchPostList',
        data(){
            return {
                spreadIndex:-1,
                list:[],
                number:[],
                img:[],
                showPlacename:false,//modal是否显示
                placename:[],//json
                provinceList:[],//省份列表
                selectProvince:"",//下拉框当前选择的省份
                cityList:[],//当前省份的城市列表
                currentCity:"广州",//当前位置
                areaList:[]
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
        watch:{
            selectProvince(newVal,oldVal){
                if(newVal!=""){
                    for(let i=0;i<this.placename.length;i++){
                        var ps=this.placename[i].province;
                        for(let j=0;j<ps.length;j++){
                            if(ps[j].pName==newVal){
                                for(let k=0;k<ps[j].city.length;k++){
                                    Vue.set(this.cityList,k,ps[j].city[k]);
                                }
                            }
                        }
                    }
                }else{
                    this.cityList=[];
                }
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
                                _this.number=[];
                                _this.img=[];
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

                                //获取图片列表
                                for(let i=0;i<respond.data.length;i++){
                                    axios.get('/api/renterPostPicture/getPicture',{params:{post_id:postItem.post_id}})
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
                },
            goToRKnowledge(){
               
                const {href} = this.$router.resolve({name: "rentalKnowledge",params: {}});
                window.open(href, '_blank');

            },
            goToWarning(){
                const {href} = this.$router.resolve({name: "warning",params: {}});
                window.open(href, '_blank');
            },
            changeCurrentCity(event){
                this.currentCity=event.target.innerHTML;
                this.showPlacename=false;
            }
        },
        mounted(){
            // var _this=this;
            // //获取系统的所有帖子信息
            // axios.get('/api/postInformation/getAllPost')
            // .then(function(respond){
            //     if(respond.data.length!=0){
            //         console.log("All renter post",respond.data.length);
            //         _this.list.length=0;
            //         for(let i=0;i<respond.data.length;i++){
            //             var item=Object.assign({},respond.data[i]);
                        
            //             (function(postItem){
            //                 //判断该帖子该用户是否关注，如果已经关注就不显示
            //             axios.get('/api/rentSeekingPerFollowedPost/getPostByIdAndName',{params:{post_id:postItem.post_id,user_name:_this.currentUserName}})
            //             .then(function(postRes){
            //                 if(postRes.data.length==0){
            //                     _this.list.push(postItem);
            //                     console.log("postId,",postItem.post_id);
            //                     // 获取关注该帖子的人数
            //                     for(let i=0;i<respond.data.length;i++){
            //                             axios.get('/api/postInformation/getCountFollower',{params:{post_id:postItem.post_id}})
            //                             .then(function(res){
            //                                 if(res.data.length!=0&&res.data[0]&&(res.data[0].followedNumber!=undefined)){
                                                
            //                                     _this.number.push(res.data[0].followedNumber);
            //                                 }else{
            //                                     _this.number=[];
            //                                 }
                                            
            //                             })
            //                             .catch(function(err){
            //                                 console.log(err);
            //                             })
            //                     }

            //                     //获取图片列表
            //                     for(let i=0;i<respond.data.length;i++){
            //                         axios.get('/api/renterPostPicture/getPicture',{params:{post_id:postItem.post_id}})
            //                             .then(function(res){
            //                                 if(res.data.length!=0){
            //                                     var imageList=[];
            //                                     imageList.length=0;
            //                                     for(let j=0;j<res.data.length;j++){
            //                                         var img=res.data[j].picture_location;
            //                                         img="../../static/upload/"+img;
            //                                         console.log(_this.list[i].post_id+" 的第 "+(j+1)+" 图片的位置 "+img);
            //                                         imageList.push(img);
            //                                     }
            //                                     _this.img.push(imageList);
                                                
            //                                 }else{
            //                                     console.log("没有图片");
            //                                     _this.img.push([]);
            //                                 }
            //                             })
            //                             .catch(function(err){
            //                                 console.log("获取图片列表失败");
            //                             })
            //                     }


            //                 }else{
            //                     console.log(_this.currentUserName+' 已经关注了 '+item.post_id);
            //                 }
            //             })
            //             .catch(function(err){
            //                 console.log(err);
            //             })
            //             })(item);//函数





                        
            //         }//for循环结束

                    
            //     }else{
            //         _this.list=[]
            //     }

                
            // })
            // .catch(function(err){
            //     console.log(err);
            // })
            var _this=this;
            axios.get("../static/data/placename.json",{}).then(response => {
                     var data=response.data;
                     for(let i=0;i<data.length;i++){
                         Vue.set(_this.placename,i,data[i]);
                     }
                     var index=0;
                     for(let j=0;j<_this.placename.length;j++){
                         var item=_this.placename[j].province;
                         for(let k=0;k<item.length;k++){
                             Vue.set(_this.provinceList,index++,item[k].pName);
                         }
                     }
            });
        }
    }
</script>
<style>
    .searchPostList{
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        background-color:#F7F7F7;
        font-size:14px;
    }
    
    .searchPostList>.searchPostListTitle{
        width:90%;
        display:flex;
        justify-content:center;
        align-items:center;
        margin-top: 40px;
    }
    .ivu-input-wrapper.ivu-input-wrapper-default.ivu-input-type.ivu-input-group.ivu-input-group-default.ivu-input-group-with-append.ivu-input-with-search{
        height:45px;
    }
    .ivu-input.ivu-input-default{
        height:45px;
    }
    .knowledge{
        width:50%;
        display:flex;
        justify-content:center;
        align-items:center;
        margin-left:40px;
    }
    .knowledge>.tip{
        padding-left:10px;
    }
    .knowledge>.redTip{
        color:#2D8CF0;
        cursor:pointer;
    }
    .searchPostList .divider{
        width:100%;
        height:1px;
        background-color:#515a6e;
        margin-top:20px;
    }
    .condition{
        width:90%;
        margin-top:20px;
        display:flex;
        flex-direction:column;
        justify-content:flex-start;
        align-items:flex-start;
    }
    .currentLocation{
        display:flex;
        justify-content:flex-start;
        align-items:flex-start;
        margin-left:10px;
        cursor:pointer;
    }
   .ivu-modal-fullscreen .ivu-modal-body {
        width: 90%;
        overflow: auto;
        position: absolute;
        top: 51px;
        left: 5%;
        bottom: 61px;
    }
    .titleImg{
        background-image:url("../../assets/img/searchPostList/selectCity2.png");
        background-repeat: no-repeat;
        width:100%;
        height:223px;
        display:flex;
        justify-content:center;
        align-items:center;
    }
    .modalContent{
        display:flex;
        flex-direction:column;
        justify-content:flex-start;
        align-items:flex-start;
        margin-top:40px;
    }
    .modalContent p{
        font-size:14px;
    }
    .hotCity,.selectCity{
        display:flex;
        justify-content:flex-start;
        align-items:flex-start;
        margin-bottom:10px;
    }
    .hotItem{
        margin-right:20px;
    }
    .hotCityTip{
        color:red;
    }
    .selectCity>p{
        text-align:center;
        color:#000;
        margin-right:20px;
        font-weight:600;
        padding-top:6px;
    }
    .byInitial{
        display:flex;
        flex-direction:column;
        width:100%;
    }
    .byInitial>p{
        color:#000000;
        font-weight:600;
        font-size:22px;
        margin-bottom:30px;
    }
    .byInitialContent{
        width:100%;
        border:1px solid #eeeeee;
        display:flex;
        flex-direction:column;
    }
    .initialItem{
        width:100%;
        display:flex;
        flex-direction:row;
        border:1px solid #eeeeee;
    }
    .provinceContent{
        display:flex;
        flex-direction:column;
        border-width:0px 1px 0px 1px;
        border-color:#eeeeee;
        border-style:solid;
    }
    .provinceItem{
        display:flex;
        flex-direction:row;
        padding-bottom:20px;
    }
    .initial{
        width:40px;
        flex-shrink: 0;
        background-color:#F5F5F5;
        display:flex;
        justify-content:center;
        align-items:center;
        font-size:22px;
        font-weight:600;
        color:#999999;
    }
    .province{
        width:70px;
        display:flex;
        flex-shrink: 0;
        justify-content:center;
        align-items:flex-start;
        margin-top:15px;
        border-width:0px 1px 0px 0px;
        border-color:#eeeeee;
        border-style:solid;
        font-size:20px;
        font-weight:400;
        color:#291e1e;
        white-space:nowrap;
    }
    .cityContent{
        color:#999999;
        display:flex;
        flex-wrap:wrap;
        justify-content:flex-start;
        align-items:center;
        margin:15px 0px 15px 0px;
    }
    .city{
        width:80px;
        display:flex;
        justify-content:center;
        align-items:center;
        color:#333333;
    }
    .hoverTip{
        cursor:pointer;
    }
    .hoverTip:hover{
        color:red;
    }
    .area{
        border:1px solid #eeeeee;
        display:flex;
        flex-direction:column;
    }
</style>