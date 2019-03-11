var models = require('../db');
var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var $sql = require('../sqlMap');
 


var multer = require('multer');
var fs = require('fs');
var path = require('path');
// 连接数据库
var conn = mysql.createConnection(models.mysql);
conn.connect();
//增
var jsonAdd = function(res, ret) {
    if(typeof ret === 'undefined') {
        res.json({
            code: '-1',
            msg: '插入失败'
        });
    } else {
        ret={
            code:'1',
            msg:'插入成功'
        }
        res.json(ret);
    }
};
//删
var jsonDelete = function(res, ret) {
    if(typeof ret === 'undefined') {
        res.json({
            code: '-1',
            msg: '删除失败'
        });
    } else {
        ret={
            code:'1',
            msg:'删除成功'
        }
        res.json(ret);
    }
};
//查
var jsonSelect = function(res, ret) {
    if(typeof ret === 'undefined') {
        res.json({
            code: '-1',
            msg: '查找失败'
        });
    } else {
        res.json(ret);
    }
};
//改
var jsonModify = function(res, ret) {
    if(typeof ret === 'undefined') {
        res.json({
            code: '-1',
            msg: '修改失败'
        });
    } else {
        ret={
            code:'1',
            msg:'修改成功'
        }
        res.json(ret);
    }
};
 

// 增加用户接口


// 注册时增加用户
router.post('/userInformation/addUser', (req, res) => {
    var sql = $sql.userInformation.addUser;
    var params = req.body;
    console.log(params);
    conn.query(sql, [params.user_name, params.password,params.user_type_renter], function(err, result) {
        if (err) {
            console.log(err);
        }
        if (result) {
            jsonAdd(res, result);
        }
    })
});

 
//登录时检查用户是否存在，存在则登录成功，否则登录失败
router.get('/userInformation/getUserByName', (req,res) => {
    var sql=$sql.userInformation.getUserByName;
    var params =req.query||req.params;
    conn.query(sql,[params.user_name], function(err,result) {
        if (err) {
            console.log(err);
        }
        if (result) {
            jsonSelect(res, result);
        }
    })
})

//获取所有用户
router.get('/userInformation/selectAllUser', (req,res) => {
    var sql=$sql.userInformation.selectAllUser;
    var params = req.query||req.params;
    conn.query(sql, function(err,result) {
        if (err) {
            console.log(err);
        }
        if (result) {
            jsonSelect(res, result);
        }
    })
})
 
//获取相应类型的用户，为求租者/出租者
router.get('/userInformation/getUserByType', (req,res) => {
    var sql=$sql.userInformation.getUserByType;
    var params = req.query||req.params;
    conn.query(sql,[params.user_type_renter], function(err,result) {
        if (err) {
            console.log(err);
        }
        if (result) {
            jsonSelect(res, result);
        }
    })
})

//根据用户名修改密码
router.post('/userInformation/modifyPasswordByUserName', (req,res) => {
    var sql=$sql.userInformation.modifyPasswordByUserName;
    var params = req.body;
    conn.query(sql,[params.password,params.user_name], function(err,result) {
        if (err) {
            console.log(err);
        }
        if (result) {
            jsonModify(res, result);
        }
    })
})

//出租者信息的相关操作

//获取用户的所有信息
router.get('/renterInformation/getInformation', (req,res) => {
    var sql=$sql.renterInformation.getInformation;
    var params = req.query||req.params;
    conn.query(sql,[params.user_name], function(err,result) {
        if (err) {
            console.log(err);
        }
        if (result) {
            jsonSelect(res, result);
        }
    })
})


//一旦添加用户为出租者就主动添加出租者
router.post('/renterInformation/insertRenter', (req,res) => {
    var sql=$sql.renterInformation.insertRenter;
    var params = req.body;
    conn.query(sql,[params.user_name], function(err,result) {
        if (err) {
            console.log(err);
        }
        if (result) {
            jsonAdd(res, result);
        }
    })
})


//根据用户名修改用户信息
router.post('/renterInformation/modifyInformation', (req,res) => {
    // RI_gender= ?,RI_credit_grade =?,RI_location= ?,RI_phone_number= ?,RI_email= ?,avatar= ? where user_name= ?
    var sql=$sql.renterInformation.modifyInformation;
    var params = req.body;
    conn.query(sql,[params.RI_gender,params.RI_credit_grade,params.RI_location,params.RI_phone_number,params.RI_email,params.avatar,params.user_name], function(err,result) {
        if (err) {
            console.log(err);
        }
        if (result) {
            jsonModify(res, result);
        }
    })
})


//根据用户名获得用户头像
router.get('/renterInformation/getAvatarByUserName', (req,res) => {
    var sql=$sql.renterInformation.getAvatarByUserName;
    var params = req.query||req.params;
    conn.query(sql,[params.user_name], function(err,result) {
        if (err) {
            console.log(err);
        }
        if (result) {
            jsonSelect(res, result);
        }
    })
})

//根据用户名设置用户头像
router.post('/renterInformation/setAvatarByUserName', (req,res) => {
    var sql=$sql.renterInformation.setAvatarByUserName;
    var params = req.body;
    conn.query(sql,[params.avatar,params.user_name], function(err,result) {
        if (err) {
            console.log(err);
        }
        if (result) {
            jsonModify(res, result);
        }
    })
})



//求租者信息的相关操作

//一旦添加用户为求租者就主动添加求租者
router.post('/rentSeekingPerInformation/insertRentSeekingPer', (req,res) => {
    // RI_gender= ?,RI_credit_grade =?,RI_location= ?,RI_phone_number= ?,RI_email= ?,avatar= ? where user_name= ?
    var sql=$sql.rentSeekingPerInformation.insertRentSeekingPer;
    var params = req.body;
    conn.query(sql,[params.user_name], function(err,result) {
        if (err) {
            console.log(err);
        }
        if (result) {
            jsonAdd(res, result);
        }
    })
})

//根据用户名获取所有的其他信息
router.get('/rentSeekingPerInformation/getInformation', (req,res) => {
    var sql=$sql.rentSeekingPerInformation.getInformation;
    var params = req.query||req.params;
    conn.query(sql,[params.user_name], function(err,result) {
        if (err) {
            console.log(err);
        }
        if (result) {
            jsonSelect(res, result);
        }
    })
})

//根据用户名修改用户信息
router.post('/rentSeekingPerInformation/modifyInformation', (req,res) => {
    // RSPI_gender= ?,RSPI_location= ?,RSPI_phone_number= ?,RSPI_email= ?,avatar= ? where user_name= ?
    var sql=$sql.rentSeekingPerInformation.modifyInformation;
    var params = req.body;
    conn.query(sql,[params.RSPI_gender,params.RSPI_location,params.RSPI_phone_number,params.RSPI_email,params.avatar,params.user_name], function(err,result) {
        if (err) {
            console.log(err);
        }
        if (result) {
            jsonModify(res, result);
        }
    })
})

//根据用户名获得用户头像
router.get('/rentSeekingPerInformation/getAvatarByUserName', (req,res) => {
    var sql=$sql.rentSeekingPerInformation.getAvatarByUserName;
    var params = req.query||req.params;
    conn.query(sql,[params.user_name], function(err,result) {
        if (err) {
            console.log(err);
        }
        if (result) {
            jsonSelect(res, result);
        }
    })
})

//根据用户名设置用户头像
router.post('/rentSeekingPerInformation/setAvatarByUserName', (req,res) => {
    var sql=$sql.rentSeekingPerInformation.setAvatarByUserName;
    var params = req.body;
    conn.query(sql,[params.avatar,params.user_name], function(err,result) {
        if (err) {
            console.log(err);
        }
        if (result) {
            jsonModify(res, result);
        }
    })
})



//房屋信息的相关操作

//填写房屋信息表
router.post('/postInformation/fillInformation', (req,res) => {
    // user_name,post_time,is_available,PI_location,house_size,house_type,expected_price,furnished,rent_time,other_description
    var sql=$sql.postInformation.fillInformation;
    var params = req.body;
    conn.query(sql,[params.user_name,params.post_time,params.is_available,params.PI_location,params.house_size,params.house_type,params.expected_price,params.furnished,params.rent_time,params.other_description], function(err,result) {
        if (err) {
            console.log(err);
        }
        if (result) {
            jsonAdd(res, result);
        }
    })
})

//获取没有发布的帖子信息
router.get('/postInformation/getUnReleasePostByName', (req,res) => {
    var sql=$sql.postInformation.getUnReleasePostByName;
    var params = req.query||req.params;
    conn.query(sql,[params.user_name], function(err,result) {
        if (err) {
            console.log(err);
        }
        if (result) {
            jsonSelect(res, result);
        }
    })
})

//发布后更新发布时间和显示为已发布
router.post('/postInformation/setPostRelease', (req,res) => {
    var sql=$sql.postInformation.setPostRelease;
    var params = req.body;
    conn.query(sql,[params.post_time,params.post_id], function(err,result) {
        if (err) {
            console.log(err);
        }
        if (result) {
            jsonModify(res, result);
        }
    })
})

//获取有效的帖子信息
router.get('/postInformation/getAvailPostByName', (req,res) => {
    var sql=$sql.postInformation.getAvailPostByName;
    var params = req.query||req.params;
    conn.query(sql,[params.user_name], function(err,result) {
        if (err) {
            console.log(err);
        }
        if (result) {
            jsonSelect(res, result);
        }
    })
})

//根据帖子id设置帖子无效
router.post('/postInformation/setPostUnAvail', (req,res) => {
    var sql=$sql.postInformation.setPostUnAvail;
    var params = req.body;
    conn.query(sql,[params.post_id], function(err,result) {
        if (err) {
            console.log(err);
        }
        if (result) {
            jsonModify(res, result);
        }
    })
})

//获取某个出租者所有的帖子信息
router.get('/postInformation/getAllPostByName', (req,res) => {
    var sql=$sql.postInformation.getAllPostByName;
    var params = req.query||req.params;
    conn.query(sql,[params.user_name], function(err,result) {
        if (err) {
            console.log(err);
        }
        if (result) {
            jsonSelect(res, result);
        }
    })
})

//获取所有的求租者的帖子信息
router.get('/postInformation/getAllRentSeekingPer', (req,res) => {
    var sql=$sql.postInformation.getAllRentSeekingPer;
    var params = req.query||req.params;
    conn.query(sql, function(err,result) {
        if (err) {
            console.log(err);
        }
        if (result) {
            jsonSelect(res, result);
        }
    })
})

//根据post_id计算每个帖子的关注人数
router.get('/postInformation/getCountFollower', (req,res) => {
    var sql=$sql.postInformation.getCountFollower;
    var params = req.query||req.params;
    conn.query(sql, [params.post_id], function(err,result) {
        if (err) {
            console.log(err);
        }
        if (result) {
            jsonSelect(res, result);
        }
    })
})

//获取系统的所有出租者的已发布的有效的帖子信息
router.get('/postInformation/getAllPost', (req,res) => {
    var sql=$sql.postInformation.getAllPost;
    var params = req.query||req.params;
    conn.query(sql, function(err,result) {
        if (err) {
            console.log(err);
        }
        if (result) {
            jsonSelect(res, result);
        }
    })
})

//根据用户名获取帖子id
router.get('/postInformation/getFollowedPostByName', (req,res) => {
    var sql=$sql.postInformation.getFollowedPostByName;
    var params = req.query||req.params;
    conn.query(sql, [params.user_name], function(err,result) {
        if (err) {
            console.log(err);
        }
        if (result) {
            jsonSelect(res, result);
        }
    })
})

//根据帖子id获取帖子的所有信息
router.get('/postInformation/getFollowedPostInforById', (req,res) => {
    var sql=$sql.postInformation.getFollowedPostInforById;
    var params = req.query||req.params;
    conn.query(sql, [params.post_id], function(err,result) {
        if (err) {
            console.log(err);
        }
        if (result) {
            jsonSelect(res, result);
        }
    })
})


//求租者关注的帖子信息

//求租者关注出租者的帖子时插入记录
router.post('/rentSeekingPerFollowedPost/insertRentSeekingPerPost', (req,res) => {
    var sql=$sql.rentSeekingPerFollowedPost.insertRentSeekingPerPost;
    var params = req.body;
    conn.query(sql, [params.user_name,params.post_id], function(err,result) {
        if (err) {
            console.log(err);
        }
        if (result) {
            jsonModify(res, result);
        }
    })
})

//求租者对用户进行评价
router.post('/rentSeekingPerFollowedPost/setCredit', (req,res) => {
    var sql=$sql.rentSeekingPerFollowedPost.setCredit;
    var params = req.body;
    conn.query(sql, [params.RSPFP_credit_grade,params.post_id,params.user_name], function(err,result) {
        if (err) {
            console.log(err);
        }
        if (result) {
            jsonModify(res, result);
        }
    })
})

//根据用户名称获取用户信用评分
router.get('/rentSeekingPerFollowedPost/getUserCredit', (req,res) => {
    var sql=$sql.rentSeekingPerFollowedPost.getUserCredit;
    var params = req.query||req.params;
    conn.query(sql, [params.user_name], function(err,result) {
        if (err) {
            console.log(err);
        }
        if (result) {
            jsonSelect(res, result);
        }
    })
})

//根据用户名更新评分
router.post('/rentSeekingPerFollowedPost/setUserCredit', (req,res) => {
    var sql=$sql.rentSeekingPerFollowedPost.setUserCredit;
    var params = req.body;
    conn.query(sql, [params.RI_credit_grade,params.user_name], function(err,result) {
        if (err) {
            console.log(err);
        }
        if (result) {
            jsonModify(res, result);
        }
    })
})


//保存出租者上传的图片
//出租者每次添加帖子后就添加图片记录
router.post('/renterPostPicture/setPicture', (req,res) => {
    var sql=$sql.renterPostPicture.setPicture;
    var params = req.body;
    conn.query(sql, [params.post_id,params.picture_location], function(err,result) {
        if (err) {
            console.log(err);
        }
        if (result) {
            jsonModify(res, result);
        }
    })
})

//获取图片信息
router.get('/renterPostPicture/getPicture', (req,res) => {
    var sql=$sql.renterPostPicture.getPicture;
    var params = req.query||req.params;
    conn.query(sql, [params.post_id], function(err,result) {
        if (err) {
            console.log(err);
        }
        if (result) {
            jsonSelect(res, result);
        }
    })
})

//根据用户名和帖子id判断用户是否关注
router.get('/rentSeekingPerFollowedPost/getPostByIdAndName', (req,res) => {
    var sql=$sql.rentSeekingPerFollowedPost.getPostByIdAndName;
    var params = req.query||req.params;
    conn.query(sql, [params.post_id,params.user_name], function(err,result) {
        if (err) {
            console.log(err);
        }
        if (result) {
            jsonSelect(res, result);
        }
    })
})

//获取某一个帖子的平均得分
router.get('/rentSeekingPerFollowedPost/getAvgCredit', (req,res) => {
    var sql=$sql.rentSeekingPerFollowedPost.getAvgCredit;
    var params = req.query||req.params;
    conn.query(sql, [params.post_id], function(err,result) {
        if (err) {
            console.log(err);
        }
        if (result) {
            jsonSelect(res, result);
        }
    })
})

//根据用户名和帖子保存时间获取帖子id
router.get('/postInformation/getPostIdByNameTime', (req,res) => {
    var sql=$sql.postInformation.getPostIdByNameTime;
    var params = req.query||req.params;
    conn.query(sql, [params.user_name,params.post_time], function(err,result) {
        if (err) {
            console.log(err);
        }
        if (result) {
            jsonSelect(res, result);
        }
    })
})


// router.post('/picture', (req,res) => {
//     // var sql=$sql.renterPostPicture.setPicture;
//     // var params = req.body;
//     // conn.query(sql, [], function(err,result) {
//     //     if (err) {
//     //         console.log(err);
//     //     }
//     //     if (result) {
//     //         // jsonModify(res, result);
//     //         console.log(result);
//     //     }
//     // })
//     // console.log("req",req);
//     // console.log("res",res);
//     console.log("访问数据库");
//     console.log("req.file",req.url);
// })



//文件上传测试
 //multer文件的硬盘存储模式
 var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        //先创建路径在保存
        createFileDirectory('../static/upload');
        //指定文件保存路径
        // cb(null, 'upload/');
        cb(null, '../static/upload/');
    },
    filename: function(req, file, cb) {
        // console.log(file)
            // 将保存文件名设置为 时间戳 + 文件原始名，比如 151342376785-123.jpg
        cb(null, Date.now() + '-' + file.originalname);


    }
})
//创建文件夹
var createFileDirectory = function(path) {
    try {
        //检测文件夹是否存在，不存在抛出错误
        fs.accessSync(path);
    } catch (error) {
        //创建文件夹
        fs.mkdirSync(path);
    }
}
var upload = multer({
    storage: storage
});
router.post('/file', upload.single('file'), function(req, res) {
    let avatar = req.file;
    console.log("avatar:",avatar)
    console.log("req.body:",req.body)
    if (avatar) {
        // fs.unlink(avatar.path, (e) => {
        //     if (e) {
        //         console.log('文件操作失败')
        //         throw e;
        //     } else
        //         console.log('文件:' + avatar.path + '删除成功！');
        // });
    }
    console.log("fileName:",avatar.filename)
    // res.status(200).send('上传成功');
    //返回图片的文件名
    var result=[{fileName:avatar.filename}];
    jsonSelect(res, result);

})

module.exports = router;
