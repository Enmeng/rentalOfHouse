该页面暂时为求租人的首页，但是将来求租人/出租人的首页使用同一个
<template>
    <div class="user-page">
    <title-component></title-component>
    <userMenu></userMenu>
    <div class="user-page-content">
        <!-- <searchRentSeekingPer></searchRentSeekingPer> -->
        <!-- <modifyPersonalInformation></modifyPersonalInformation> -->
        <!-- <fillHouseInformation></fillHouseInformation> -->
        <!-- <releasePost></releasePost> -->
        <!-- <setPostInvalid></setPostInvalid> -->
        <setCreditGrade></setCreditGrade>
    </div>
    </div>
</template>
<script>
    import titleComponent from '@/components/titleComponent';
    import userMenu from '@/components/rentSeekingPer/userMenu';
    import searchRentSeekingPer from '@/components/searchRentSeekingPer';
    import modifyPersonalInformation from '@/components/modifyPersonalInformation';
    import fillHouseInformation from '@/components/fillHouseInformation';
    import releasePost from '@/components/releasePost';
    import setPostInvalid from '@/components/setPostInvalid';
    import setCreditGrade from '@/components/rentSeekingPer/setCreditGrade'
    export default{
        name :'rentSeekingPerPageTemp',
        components:{
            titleComponent,
            userMenu,
            searchRentSeekingPer,
            modifyPersonalInformation,
            fillHouseInformation,
            releasePost,
            setPostInvalid,
            setCreditGrade
        },
        data(){
            return {

            }
        }
    }
</script>
<style>
    .user-page{
        width: 100%;
        height: 100%;
        display: flex;
        position: relative;
        margin: 0px;
    }
    .user-page-content{
        z-index:0;
        width: 100%;
        margin-top: 80px;
        margin-left: 200px;
    }
</style>