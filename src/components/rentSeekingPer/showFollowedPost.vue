<template>
    <div class="show-post">
        <div class="show-post-title">
            <p>已帖子列表</p>
        </div>
        <div class="show-post-content">
            <div class="show-post-information"  @click="spreadPost(index)">
                <Card :bordered="false">
                    <p slot="title">帖子1</p>
                    <p slot="extra">2018/12/28 12:00:00</p>
                    <div class="all-show-post-information">
                        <p>房屋地址：广东省广州市天河区五山街道308号</p>
                        <p>房屋大小：100平方米</p>
                        <p>房屋类型：2室1厅1卫</p>
                        <p>出租价格：2000元/月</p>
                        <p>是否配备家具：是</p>
                        <p>联系电话：131111111111</p>
                        <p>邮箱：8888888@qq.com</p>
                        <p>......</p>
                    </div>
                </Card>
                <div class="card-footer">
                    <p class="show-detail">查看详情</p>
                    <p>关注人数：20</p>
                </div>
            </div>
        </div>
    </div>
</template>
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
<script>
    export default{
        name:'showFollowedPost',
        data(){
           return {
               selectValue:'1',
                postList:[
                   {name:'2'},
                   {name:'3'}
                ]
           }
        },
        methods:{
            spreadPost(index){

            }
        }
    }
</script>