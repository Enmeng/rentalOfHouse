// sql语句
var sqlMap = {
    // 用户登录/注册
    userInformation: {
        addUser: 'insert into userInformation(user_name,password,user_type_renter) values (?,?,?)',//注册时添加用户
        getUserByName:'select * from userInformation where user_name= ?',//登录时判断用户是否存在
        selectAllUser:'select user_name from userInformation',//获取所有用户
        getUserByType:'select user_name from userInformation where user_type_renter= ?',//获取相应类型的用户，为求租者/出租者
        modifyPasswordByUserName:'update userInformation set password= ? where user_name= ?',//根据用户名修改密码
    },
    //出租者信息的相关操作
    renterInformation:{
        insertRenter:'insert into renterInformation(user_name) values (?)',//一旦添加用户为出租者就主动添加出租者
        getInformation:'select password,RI_gender,RI_credit_grade,RI_location,RI_phone_number,RI_email,avatar from userInformation natural join renterInformation where user_name= ?',//获取用户的所有信息
        modifyInformation:'update renterInformation set RI_gender= ?,RI_credit_grade =?,RI_location= ?,RI_phone_number= ?,RI_email= ?,avatar= ? where user_name= ?',//根据用户名修改用户信息

    },
    //求租者信息的相关操作
    rentSeekingPerInformation:{
        insertRentSeekingPer:'insert into rentSeekingPerInformation(user_name) values(?)',//一旦添加用户为求租者就主动添加求租者
        getInformation:'select password,RSPI_gender,RSPI_location,RSPI_phone_number,RSPI_email,avatar from userInformation natural join rentSeekingPerInformation where user_name= ?',//根据用户名获取所有的其他信息
        modifyInformation:'update rentSeekingPerInformation set RSPI_gender= ?,RSPI_location= ?,RSPI_phone_number= ?,RSPI_email= ?,avatar= ? where user_name= ?',//根据用户名修改用户信息

    },
    //房屋信息的相关操作
    postInformation:{
        fillInformation:'insert into postInformation(user_name,post_time,is_available,PI_location,house_size,house_type,expected_price,furnished,rent_time,other_description) values(?,?,?,?,?,?,?,?,?,?)',//填写房屋信息表
        getUnReleasePostByName:'select post_id,post_time,PI_location,house_size,house_type,expected_price,furnished,rent_time,RI_phone_number,RI_email,other_description from postInformation natural join renterInformation where  is_release=false and is_available=true and user_name= ?',//获取没有发布的帖子信息
        setPostRelease:'update postInformation set post_time= ?,is_release=true where post_id= ?',//发布后更新发布时间和显示为已发布
        getAvailPostByName:'select post_id,user_name,post_time,PI_location,house_size,house_type,expected_price,furnished,rent_time,RI_phone_number,RI_email,other_description from postInformation natural join renterInformation where user_name=? and is_available=true and is_release=true',//获取有效的帖子信息
        setPostUnAvail:'update postInformation set is_available=false where post_id= ?',//根据帖子id设置帖子无效
        getAllPostByName:'select post_id,post_time,PI_location,house_size,house_type,expected_price,furnished,rent_time,RI_phone_number,RI_email,is_release,is_available,other_description from postInformation  natural join renterInformation where user_name= ?',//获取某个出租者所有的帖子信息
        getAllRentSeekingPer:'select post_id,user_name,post_time,PI_location,house_size,house_type,expected_price,furnished,rent_time,RSPI_phone_number,RSPI_email,other_description from postInformation natural join userInformation natural join rentSeekingPerInformation where user_type_renter=false',//获取所有的求租者的帖子信息
        getCountFollower:'select count(distinct user_name) as followedNumber from rentSeekingPerFollowedPost where post_id= ?',//根据post_id计算每个帖子的关注人数
        getAllPost:'select post_id,user_name,post_time,PI_location,house_size,house_type,expected_price,furnished,rent_time,RI_phone_number,RI_email,other_description from postInformation natural join userInformation natural join renterInformation where user_type_renter=true and is_release=true and is_available=true',//获取系统的所有出租者的已发布的有效的帖子信息
        getFollowedPostByName:'select post_id from rentSeekingPerFollowedPost where user_name= ?',//根据用户名获取帖子id
        getFollowedPostInforById:'select user_name, post_time,PI_location,house_size,house_type,expected_price,furnished,rent_time,RI_phone_number,RI_email,other_description from postInformation natural join renterInformation where post_id= ?',//根据帖子id获取帖子的所有信息
        getPostIdByNameTime:'select post_id from postInformation where user_name=? and post_time=?'//根据用户名和帖子保存时间获取帖子id
    },
    //求租者关注的帖子信息
    rentSeekingPerFollowedPost:{
        insertRentSeekingPerPost:'insert into rentSeekingPerFollowedPost(user_name,post_id) values(?,?)',//求租者关注出租者的帖子时插入记录
        setCredit:'update rentSeekingPerFollowedPost set RSPFP_credit_grade= ? where post_id=? and user_name= ?',//求租者对用户进行评价
        getUserCredit:'select RI_credit_grade from renterInformation where user_name= ?',//根据用户名称获取用户信用评分
        setUserCredit:'update renterInformation set RI_credit_grade= ? where user_name= ?',//根据用户名更新评分
        getPostByIdAndName:'select * from rentSeekingPerFollowedPost where post_id= ? and user_name= ?',//根据用户名和帖子id判断用户是否关注
        getAvgCredit:'select avg(RSPFP_credit_grade) as avg_credit from rentSeekingPerFollowedPost where post_id=?',//获取某一个帖子的平均得分

        
    },
    //保存出租者上传的图片
    renterPostPicture:{
        setPicture:'insert into renterPostPicture(post_id,picture_location) values(?,?)',//出租者每次添加帖子后就添加图片记录
        getPicture:'select picture_location from renterPostPicture where post_id=?',//获取图片信息
    }
}
 
module.exports = sqlMap;
