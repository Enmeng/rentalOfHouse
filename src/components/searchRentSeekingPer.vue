<!-- 显示所有求租人的帖子并提供搜索功能 -->
<template>
    <div class="search-rent-seeking-per">
        <div class="search">
            <Input search enter-button="搜索" placeholder="请输入搜索的关键词" />
        </div>
        <div class="rent-post">
            <div class="rent-post-information" v-for="(item,index) in userList">
                <Card :bordered="false">
                    <p slot="title">{{item.user_name}}</p>
                    <p slot="extra">{{item.post_time}}</p>
                    <div class="all-rent-post-information">
                        <p>求租人期望的位置：{{item.PI_location}}</p>
                        <p>求租人期望的房屋大小：{{item.house_size}}平方米</p>
                        <p>求租人期望的房屋类型：{{item.house_type}}</p>
                        <p>求租人期望的价格：{{item.expected_price}}元/月</p>
                        <p>是否要求配备家具：{{item.furnished}}</p>
                        <p>联系电话：{{item.RSPI_phone_number}}</p>
                        <p>邮箱：{{item.RSPI_email}}</p>
                        <p>其他要求：{{item.other_description}}</p>
                    </div>
                </Card>
            </div>
        </div>
    </div>
</template>
<script>
    import axios from 'axios';
    export default{
        name:'searchRentSeekingPer',
        data(){
            return {
                selectValue:'1',
                postCollapse:'collapse',
                list:[],
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
            userList(){
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
                        if(list[i].is_available==1){
                            list[i].is_available='是';
                        }else{
                            list[i].is_available='否';
                        }
                        var postTime = new Date(list[i].post_time);
                        var timeStr=postTime.getFullYear() + '-' + (postTime.getMonth() + 1) + '-' + postTime.getDate()+' '+postTime.getHours()+':'+postTime.getMinutes()+':'+postTime.getSeconds();
                        list[i].post_time=timeStr;
                        
                    }
                }
                return list;
            },
        },
        methods:{
            
        },
        mounted(){
            var _this=this;
            //获取用户未发布的帖子信息
            axios.get('/api/postInformation/getAllRentSeekingPer',{params:{}})
            .then(function(respond){
                if(respond.data.length!=0){
                    _this.list.length=0;
                    for(let i=0;i<respond.data.length;i++){
                        var item=Object.assign({},respond.data[i]);
                        _this.list.push(item);
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
        margin-top: 20px;
    }
</style>