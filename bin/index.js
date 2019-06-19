#!/usr/bin/env node
    const path = require('path')    
    const fs = require('fs')

    var os = require('os')
    var userInfo = os.userInfo()
    const {username} = userInfo
    // console.log(userInfo)
    // console.log("当前pc用户： %s", username)

    process.title = 'packinfo';

    const program = require('commander')
    const projectInfo = require('../package')
    program.version(projectInfo.version)
    program.description(projectInfo.description + projectInfo.usage)

    program.option('-a, --author <author>','who packs the bundle')
    program.option('-i, --info <info>','otherinfo of the bundle')

    program.parse(process.argv)

    console.log('打包人员：',program.author||username);
    console.log('附加信息：',program.info||'无' );
    
    
    // 文件路径设置
    const dir = process.cwd()
    // console.log(dir);

    const indexHtml = path.join(dir,'index.html')
    // console.log(indexHtml);

    // packinfo组装
    let now = new Date().toLocaleString()
    console.log(now);
    
    let packinfo =  
`<!--packinfo-script-start-->
        <script>
            let info = [{
                key:'打包时间',
                value:'${now}'
            },{
                key:'打包者',
                value:'${program.author||username||'Anonymous'}'
            },{
                key:'备注信息',
                value:'${program.info||'无'}'
            }];
            console.table(info);
        </script>
        <!--packinfo-script-end-->`  
    // 判断当前目录是否有index.html文件
    fs.readFile(indexHtml,'utf8', (err, data)=>{
        if(err) throw err;
        // 初始化新内容
        let newdata = data;
        let hastag = data.indexOf('packinfo-script-start')
        if(hastag !== -1){
            // 已存在packinfo
            console.warn('已存在packinfo');
            
            let matchres = data.match(/<!--packinfo-script-start-->/)
            // console.log('matchres:',matchres);
            if(matchres && matchres.length > 0){
                // 删除回车、换行符
                // let rm_n = data.replace(/(\n\r)|\n|\r/g,  '')
                // 替换入新的字符串
                newdata = data.replace(
                    /<!--packinfo-script-start-->[\s\S]+<!--packinfo-script-end-->/, 
                    packinfo
                )
            }
        }else{
            // 不存在packinfo 直接写入文件
            console.warn('不存在packinfo');
            
            newdata = data.replace('</head>', packinfo+`</head>` )
        }
        
        // 把新字符串写入文件
        fs.writeFile(indexHtml, newdata, 'utf8', (err, res)=>{
            if(err) throw err;
            console.log('文件写入成功！');
            
        });
    })
    


