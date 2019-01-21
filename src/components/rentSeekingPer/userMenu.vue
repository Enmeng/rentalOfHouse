<template>
    <div class="user-menu">
        <Menu active-name="5-2" :open-names="['5']" theme="dark" style="width:200px;">
            <Submenu name="1">
                <template slot="title">
                    <Icon type="ios-analytics" />
                    用户管理
                </template>
               <MenuItem name="1-1">修改个人信息</MenuItem>
            </Submenu>
            <Submenu name="2">
                <template slot="title">
                    <Icon type="ios-filing" />
                    房屋管理
                </template>
                <Submenu name="3">
                        <template slot="title">房屋信息</template>
                        <MenuItem name="3-1">填写房屋信息</MenuItem>
                </Submenu>
                <Submenu name="4">
                    <template slot="title">帖子</template>
                    <MenuItem name="4-1">显示系统所有帖子</MenuItem>
                    <MenuItem name="4-2">查看已关注的帖子</MenuItem>
                </Submenu>
            </Submenu>
            <Submenu name="5">
                <template slot="title">
                    <Icon type="ios-cog" />
                    信息管理
                </template>
                <MenuItem name="5-1">评价帖子</MenuItem>
            </Submenu>
        </Menu>
    </div>
</template>
<script>
    export default{
        name:'userMenu',
        
    }
</script>
<style>
    .user-menu{
        width: 200px;
        height: 100%;
        position: fixed;
        margin-top: 80px;
        z-index: 999;
    }

    /* iview的样式 */
    .user-menu>.ivu-menu.ivu-menu-dark.ivu-menu-vertical{
        width: 200px;
        height: 100%;
    }
    
</style>