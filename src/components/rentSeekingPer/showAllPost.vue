<!-- 显示所有求租人的帖子并提供搜索功能 -->
<template>
    <div class="search-rent-seeking-per">
        <div class="search">
            <Input search enter-button="搜索" placeholder="请输入搜索的关键词" />
        </div>
        <div class="rent-post" v-for="(item,index) in postList">
            <div class="rent-post-information"  @click="spreadPost(index)">
                <Card :bordered="false">
                    <p slot="title">Enmeng</p>
                    <p slot="extra">2018/12/28 12:00:00</p>
                    <div class="all-rent-post-information">
                        <p>房屋位置：广东省广州市天河区五山街道308号</p>
                        <p>房屋大小：100平方米</p>
                        <p>房屋类型：2室1厅1卫</p>
                        <p>价格：2000元/月</p>
                        <p>是否要求配备家具：是</p>
                        <p>联系电话：131111111111</p>
                        <p>邮箱：8888888@qq.com</p>
                        <p>其他要求：希望该房屋位于交通方便地地段，能够配备些家具，超市与该房屋的距离不是很远</p>
                    </div>
                </Card>
            </div>
            <div class="rent-post-information"  @click="spreadPost(index)">
                <Card :bordered="false">
                    <p slot="title">Enmeng</p>
                    <p slot="extra">2018/12/28 12:00:00</p>
                    <div class="part-rent-post-information">
                        <p>房屋位置：广东省广州市天河区五山街道308号</p>
                        <p>房屋大小：100平方米</p>
                        <p>房屋类型：2室1厅1卫</p>
                        <p>价格：2000元/月</p>
                        <p>......</p>
                    </div>
                </Card>
            </div>
        </div>
    </div>
</template>
<script>
    export default{
        name:'showAllPost',
        data(){
            return {
                selectValue:'1',
                postCollapse:'collapse',
                postList:[
                   {name:'1'},
                   {name:'1'},
                   {name:'1'},
                   {name:'1'},
                ]
            }
        },
        methods:{
            spreadPost(index){
                console.log(index);
            }
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
</style>