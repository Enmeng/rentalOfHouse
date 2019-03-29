<!-- 显示所有求租人的帖子并提供搜索功能 -->
<template>
    <div class="searchPostList">
        <div class="searchPostListTitle">
            <!-- <Input search enter-button placeholder="输入关键字(地区名)" v-model="searchCondition"/> -->
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
                    <div class="noLimit"   @click="changeCondition($event,'area')">不限</div>
                    <div class="areaItem" v-for="item in areaList" @click="changeCondition($event,'area')">{{item}}</div>
                </div>
                <div class="areaPart">
                    <p>租金：</p>
                    <div class="noLimit"  @click="changeCondition($event,'price')">不限</div>
                    <div class="areaItem"   @click="changeCondition($event,'price')" v-for="item in ['500元以下','500-1000元','1000-2000元','2000-3000元','3000-5000元','5000-8000元','8000元以上']">{{item}}</div>
                </div>
                <div class="areaPart">
                    <p>户型：</p>
                    <div class="noLimit"  @click="changeCondition($event,'houseType')">不限</div>
                    <div class="areaItem"  @click="changeCondition($event,'houseType')" v-for="item in ['一室','二室','三室','四室','四室以上']">{{item}}</div>
                </div>
                <div class="areaPart">
                    <p>面积：</p>
                    <div class="noLimit"  @click="changeCondition($event,'houseSize')">不限</div>
                    <div class="areaItem"  @click="changeCondition($event,'houseSize')" v-for="item in ['20-30平','30-40平','40-50平','50-60平','60-80平','80-100平','100-150平','150-250平','250平以上']">{{item}}</div>
                </div>
            </div>
        </div>
        <div class="postList">
            <div class="postItem" v-for="(item,index) in postList" @click="goToDetail(item)">
                <div class="imgContainer"  v-if="imageList[index]&&imageList[index].length&&imageList[index].length!=0">
                    <img :src="imageList[index][0]">
                    <div class="imageLength">
                        <span>{{imageList[index].length}}</span>
                        <Icon type="md-images" />
                    </div>
                </div>
                <div class="contentContainer">
                    <div class="title">
                        <p>{{item.user_name}}-帖子{{item.post_id}}</p>
                    </div>
                    <div class="Itemcontent">
                         <div class="firstContent">
                             <div class="partItme"><p>{{item.house_size}}平方米</p></div>
                             <div class="hDivider"></div>
                             <div class="partItme"><p>{{item.house_type}}</p></div>
                         </div>
                         <div class="secondContent">
                             <div><p>房屋地址：{{item.PI_location}}</p></div>
                         </div>
                    </div>
                </div>
                <div class="priceContainer">
                    <div class="itemPrice">
                        <p><span>{{item.expected_price}}</span>元/月</p>
                    </div>
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
    import { eventBus } from '../../eventBus';
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
                areaList:["越秀区","荔湾区","海珠区","天河区","白云区","黄埔区","番禺区","花都区","南沙区"],//每个市下面的区
                conditionList:[],//点击进行选择的条件
                searchCondition:"",//输入框的搜索条件
                
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
                    // list.length=this.list.length;
                    var index=0;
                    for(let i=0;i<this.list.length;i++){
                        var jud=false,searchJud=false;
                        // if(this.searchCondition=""){
                        //     searchJud=true;
                        // }else{
                        //     if(this.list[i].PI_location.indexOf(this.searchCondition)!=-1){
                        //         this.conditionList=[];
                        //         searchJud=true;
                        //     }
                        // }
                        if(this.list[i].PI_location.indexOf(this.currentCity)!=-1){
                            jud=true;
                        }
                        var len=0;
                        for(let j=0;j<this.conditionList.length;j++){
                            switch (this.conditionList[j].name){
                                case "area":
                                     if(this.list[i].PI_location.indexOf(this.conditionList[j].value)!=-1){
                                         len++;
                                         console.log("area",len);
                                     }
                                     break;
                                case "houseType":
                                    if(this.list[i].house_type.indexOf(this.conditionList[j].value)!=-1){
                                            len++;console.log("houseType",len);
                                           
                                    }
                                    if(this.conditionList[j].value.indexOf("以上")!=-1){
                                        let temp=this.conditionList[j].value.split("室")[0];
                                        let itemTemp=this.list[i].house_type.split("室")[0];
                                        if(Number(temp)<Number(itemTemp)){
                                            len++;
                                            console.log("houseType",len);
                                        }
                                    }
                                    break;
                                case "houseSize":
                                    if(this.conditionList[j].value.indexOf("-")!=-1){
                                        let str1=this.conditionList[j].value.split("-");
                                        let str2=str1[1].split("平");
                                        if(Number(str1[0])<=Number(this.list[i].house_size)&&Number(str2[0])>Number(this.list[i].house_size)){
                                            len++;console.log("houseSize",len);
                                        }
                                    }
                                    if(this.conditionList[j].value.indexOf("以上")!=-1){
                                        let temp=this.conditionList[j].value.split("平")[0];
                                        if(Number(temp)<=Number(this.list[i].house_size)){
                                            len++;console.log("houseSize",len);
                                        }
                                    }
                                    break;
                                case "price":
                                    if(this.conditionList[j].value.indexOf("-")!=-1){
                                            let str1=this.conditionList[j].value.split("-");
                                            let str2=str1[1].split("元");
                                            if(Number(str1[0])<=Number(this.list[i].expected_price)&&Number(str2[0])>Number(this.list[i].expected_price)){
                                               len++;
                                               console.log("price",len);
                                            }
                                        }
                                    if(this.conditionList[j].value.indexOf("以上")!=-1){
                                        let temp=this.conditionList[j].value.split("元")[0];
                                        if(Number(temp)<=Number(this.list[i].expected_price)){
                                            len++;console.log("price",len);
                                        }
                                    }
                                    break;
                                default:break;
                            }
                        }
                        if((len==this.conditionList.length)&&jud){
                            list[index++]=Object.assign({},this.list[i]);
                            if(list[index-1].furnished==1){
                                list[index-1].furnished='是';
                            }else{
                                list[index-1].furnished='否';
                            }
                            var postTime = new Date(list[index-1].post_time);
                            var timeStr=postTime.getFullYear() + '-' + (postTime.getMonth() + 1) + '-' + postTime.getDate()+' '+postTime.getHours()+':'+postTime.getMinutes()+':'+postTime.getSeconds();
                            list[index-1].post_time=timeStr;
                        }
                        
                    }
                }
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
            getData(){
                var _this=this;
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
            spreadPost(index){
                this.spreadIndex=index;
            },
            foldPost(index){
                this.spreadIndex=-1;
            },
            changeFollow(id){
                var _this=this;
                axios.post('/api/rentSeekingPerFollowedPost/insertRentSeekingPerPost',{user_name:_this.currentUserName,post_id:id})
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
                this.getData();
            
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
                var _this=this;
                axios.get("../static/data/city.json",{}).then(response => {
                        var data=response.data;
                        for(let i=0;i<data.length;i++){
                            if(data[i].name==_this.currentCity){
                                var tempCity=data[i].sub;
                                var len=tempCity.length>10?10:tempCity.length;
                                if(tempCity.length!=0){
                                    for(let j=0;j<len;j++){
                                        Vue.set(_this.areaList,j,tempCity[j].name);
                                    }
                                    // Vue.set(_this.areaList,len,"其他");
                                }else{
                                    for(let j=0;j<len;j++){
                                        Vue.set(_this.areaList,j,"");
                                    }
                                    // Vue.set(_this.areaList,0,"其他");
                                }
                            }
                        }
                });
                this.showPlacename=false;
                this.conditionList=[];
            },
            changeCondition(event,domType){
                var itemName=event.target.innerHTML;
                var temp=false;
                if(this.conditionList.length!=0){
                    
                    for(let i=0;i<this.conditionList.length;i++){
                        var val=event.target.innerHTML;
                        if(this.conditionList[i].name==domType){
                           if(event.target.innerHTML=="不限"){
                               this.conditionList.splice(i,1);
                               temp=true;
                               break;
                           }
                           
                            if(domType=="houseType"){
                                
                                switch(val){
                                    case "一室":val="1室";break;
                                    case "二室":val="2室";break;
                                    case "三室":val="3室";break;
                                    case "四室":val="4室";break;
                                    case "四室以上":val="4室以上";break;
                                    default: break;
                                }
                            }
                           this.conditionList[i].value=val;
                           temp=true;
                           break;
                        }
                    }
                    
                }
                if(temp==false){
                        var value=event.target.innerHTML;
                        if(domType=="houseType"){
                            
                            switch(value){
                                case "一室":value="1室";break;
                                case "二室":value="2室";break;
                                case "三室":value="3室";break;
                                case "四室":value="4室";break;
                                case "四室以上":value="4室以上";break;
                                default: break;
                            }
                        }
                        this.conditionList.push({name:domType,value:value})
                    }
                    console.log("changeCondition,",this.conditionList);
            },
            goToDetail(item){
                const {href} = this.$router.resolve({name:'postDetail',path: '/postDetail',query:{postId:item.post_id}});
                window.open(href, '_blank');
            }
        },
        mounted(){
            var _this=this;
            eventBus.$on('follow',({id})=>{
                console.log("followId",id)
                // _this.changeFollow(id);
              }
            )
            //获取系统的所有帖子信息
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
            _this.getData();
            // var _this=this;
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
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        /* align-items: center; */
        background-color:#F7F7F7;
        font-size:14px;
    }
    
    .searchPostList>.searchPostListTitle{
        width:80%;
        margin-left:5%;
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
        margin-left:5%;
    }
    .currentLocation{
        display:flex;
        justify-content:flex-start;
        align-items:flex-start;
        /* margin-left:10px; */
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
    .area,.postList{
        border:1px solid #eeeeee;
        display:flex;
        flex-direction:column;
        width:90%;
        margin-left:5%;
        margin-top:30px;
        background-color:#ffffff;
        justify-content:flex-start;
        align-items:flex-start;
    }
    .postList{
        width:70%;
        margin-left:5%;
        height:100%;
        flex:1;
    }
    .areaContent{
        display:flex;
        flex-direction:column;
        padding-bottom:20px;
    }
    .areaContent>p{
        font-size:16px;
        color:#000000;
        font-weight:600;
        margin-bottom:10px;
        margin-top:20px;
    }
    .areaPart{
        display:flex;
        flex-direction:row;
        justify-content:flex-start;
        align-items:center;
        margin-bottom:20px;
        margin-left:20px;
    }
    .areaItem{
        margin-left:20px;
        cursor:pointer;
    }
    .noLimit{
        color:red;
        cursor:pointer;
    }
    .postItem{
        display:flex;
        flex-direction:row;
        justify-content:space-around;
        padding:30px 0px 20px 0px;
        border-width:0px 0px 1px 0px;
        border-color:#eeeeee;
        border-style:solid;
        width:100%;
        height:200px;
        box-sizing:border-box;
        /* flex:1 0 auto; */
        flex-shrink:0;
        cursor:pointer;
    }
    .imgContainer{
        display:flex;
        flex-direction:row;
        justify-content:space-around;
        align-items:flex-end;
        flex-shrink:0;
        width:200px;
    }
    .imgContainer>img{
        width:100%;
    }
    .imageLength{
        position:relative;
        left:-200px;
        width:50px;
        height:20px;
        padding:0px 20px 0px 20px;
        /* bottom:-20px; */
        background-color:rgba(255,255,255,0.5);
        display:flex;
        align-items:center;
    }
    .contentContainer{
        /* height:200px; */
        display:flex;
        flex-direction:column;
        justify-content:flex-start;
        /* align-items:space-around; */
    }
    .contentContainer,.Itemcontent{
        display:flex;
        flex-direction:column;
        justify-content:flex-start;
        align-items:flex-start;
    }
    .contentContainer>.title{
        color:#000000;
        font-size:22px;
        font-weight:600;
    }
    .firstContent{
        display:flex;
        flex-direction:row;
        justify-content:flex-start;
        margin-bottom:10px;
        color:#000000;
        font-weight:600;
    }
    .firstContent>.hDivider{
        width:2px;
        height:20px;
        background-color:#eeeeee;
        margin:0px 5px 0px 5px;
    }
    .priceContainer{
        display:flex;
        justify-content:center;
        align-items:center;
        height:150px;
    }
    .priceContainer span{
        color:red;
        font-size:22px;
        font-weight:600;
    }
</style>