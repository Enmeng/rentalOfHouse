<template>
    <div class="set-credit-grade">
        <div class="post-content">
            <div class="post-information">
                <Card :bordered="false">
                    <p slot="title">帖子1</p>
                    <p slot="extra">作者：Enmeng<span style="padding-left:10px;">2018/12/28 12:00:00</span></p>
                    <div class="part-post-information">
                        <p>房屋地址：广东省广州市天河区五山街道308号</p>
                        <p>房屋大小：100平方米</p>
                        <p>房屋类型：2室1厅1卫</p>
                        <p>出租价格：2000元/月</p>
                        <p>是否配备家具：是</p>
                        <p>联系电话：131111111111</p>
                        <p>邮箱：8888888@qq.com</p>
                        <p>出租时间：2018/12/5-2012/12/5</p>
                        <p>其他描述信息：广东省广州市天河区五山街道308号广东省广州市天河区五山街道308号广东省广州市天河区五山街道308号广东省广州市天河区五山街道308号</p>
                        <div class="imageList">
                            <img src="../../assets/img/user/1.png" class="houseImage" alt="加载错误"></img>
                            <img src="../../assets/img/user/2.png" class="houseImage" alt="加载错误"></img>
                        </div>
                    </div>
                </Card>
            </div>
            <div class="set-grade">
                <p>信用评分</p>
                <div>
                    <Rate  clearable v-model="valueCustomText"></Rate>
                    <span>{{valueCustomText*2}}</span>
                </div>
                <Button type="primary">保存</Button>
            </div>
        </div>
    </div>
</template>
<script>
    export default{
        name:'setCreditGrade',
        data(){
            return {
                houseImage:[
                    {src:'../../static/user/1.png'},
                    {src:'../../static/user/2.png'}
                ],
                valueCustomText:3
            }
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
    }
    .post-information{
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        background:#eee;
        padding: 20px;
        margin-top:20px;
        cursor: pointer;
        height: 400px;
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
        align-self: flex-start;
        display: flex;
        justify-content: space-around;
    }
    .set-grade>p{
        font-size: 20px;
        font-weight: 300;
        color:#2D8CF0;
    }
</style>