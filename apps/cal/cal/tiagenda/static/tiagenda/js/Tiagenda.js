(function($){
        //先定義JQuery為$，不要讓它衝突        
            $(function(){
                /**一開始的簡易版使用說明**/
                //toastr.success("1. 請從選擇系級開始（未選擇系級，無法使用以下功能）<br />2. 點擊課表中的+字號，旁邊欄位會顯示可排的課程，請善加利用<br />3. 任何課程都可以使用課程查詢來找<br />特別小叮嚀(1)：課程查詢以各位輸入的條件篩選，條件越少，找到符合的課程就越多<br />特別小叮嚀(2)：如果有想要查詢其他系的必選修，也可以使用課程查詢<br />4. 如果排好課，有需要請截圖來保留自己理想的課表（如果課表太大，可利用縮放功能來縮小視窗以利截圖）", "使用說明", {timeOut: 2500});

                //如果先前有使用過(沒有關機),會直接讀取之前的資料
                if (typeof(Storage) !== "undefined") {
                    // Store
                    window.agenda_count=[[0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0]];
                    window.modify_agenda_count=[[0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0]];
                    window.agenda_name_count=[[{},{},{},{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{},{},{},{}]];
                    window.fileName="";
                    window.modify_userName="";
                    window.modify_userDept="";
                    window.json_num=1;
                    window.obj=[];
                    window.files=[];
                    window.no_one="沒人可以到喔";
                    window.current_name="" //存放目前json的name 
                    window.td_mode=1;
                    window.demo_mode=1;
                    window.init_agenda_count=[[0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0]];
                    window.init_agenda_name_count=[[{},{},{},{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{},{},{},{}]];
                    //用sessionStorage.length判斷,在firefox或chrome都沒問題
                    //如果判斷sessionStorage是否為空,firefox會有問題
                    if(sessionStorage.length!=0)
                    {
                        agenda_count=$.parseJSON(sessionStorage['agenda_count']);
                        agenda_name_count=$.parseJSON(sessionStorage['agenda_name_count']);
                        json_num=parseInt(sessionStorage['json_num']);
                        // demo_click(agenda_count,json_num,"demo");
                        fileName=sessionStorage['fileName'];
                        $('#upload_file_name').text("已上傳:"+fileName);
                        init_agenda_count=$.parseJSON(sessionStorage['init_agenda_count']);
                        init_agenda_name_count=$.parseJSON(sessionStorage['init_agenda_name_count']);
                    }
                } 
                else 
                {
                    window.agenda_count=[[0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0]];
                    window.modify_agenda_count=[[0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0]];
                    window.agenda_name_count=[[{},{},{},{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{},{},{},{}]];
                    window.fileName="";
                    window.modify_userName="";
                    window.modify_userDept="";
                    window.json_num=1;
                    window.obj=[];
                    window.files=[];
                    window.no_one="沒人可以到喔";
                    window.current_name="" //存放目前json的name 
                    window.td_mode=1;
                    window.demo_mode=1;
                } 
            });
        
            //顯示選擇幾個檔案
            //顯示要上傳檔案的名稱
            $('input[type="file"]').change(function(e){
                $('.file_name.'+e.target.id).attr("value","共"+e.target.files.length+"個檔案");
                var not_upload_file_name="";
                for (var i=0;i<e.target.files.length; i++) {
                    not_upload_file_name += e.target.files[i].name;
                }
                $('.not_upload_file_name.'+e.target.id).text("未上傳:"+not_upload_file_name);

            });
            //選擇完檔案按確定後,以下function會觸發
            window.if_select=0
            document.getElementById('file').addEventListener('change', readMultipleFiles, false);
            document.getElementById('modify_file').addEventListener('change', readMultipleFiles, false);
            function readMultipleFiles(evt) {
                //Retrieve all the files from the FileList object
                files = evt.target.files;
                obj=[];
                //儲存檔案
                if (files) {
                    var json_current_num=0;
                    for (var i=0, f; f=files[i]; i++) {
                          var r = new FileReader();
                        r.onload = (function(f) {
                            return function(e) {
                                var contents = e.target.result;
                                obj[json_current_num] = $.parseJSON(contents);
                                json_current_num+=1;
                            };
                        })(f);
                        r.readAsText(f);
                    } 
                    if_select=1;
                } 
                else {
                      alert("Failed to load files"); 
                }
            }
            $('#submit1').click(function(){
                //是否有選擇檔案
                if(if_select)
                {
                    json_num+=obj.length;
                    $.each(obj,function(uk,uv){
                        has_class=[[0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0]];//是否有課的陣列
                        $.each(uv.time_table,function(hk,hv){
                            $.each(hv.time_parsed,function(ik, iv){
                                $.each(iv.time,function(jk, jv){
                                    agenda_count[iv.day-1][jv-1]++;//那門課的重疊次數加一  
                                    has_class[iv.day-1][jv-1]=1;//判斷是否有課=1               
                                });                    
                            });
                        });
                        current_name=uv['user-dept']+':'+uv['user-name']+'<br>'    //存放目前json的name
                        fileName=fileName+uv['user-name']+".json";
                        //將有課的時段的tooltip加上名子
                        $.each(has_class,function(ik,iv){
                            $.each(iv,function(jk,jv){
                                if(jv==0)
                                {
                                    //將有課的name存入目前時段
                                    //且將相同部門的放在一起
                                    var has_key=0;
                                    //判斷是否為空字典
                                    if(!jQuery.isEmptyObject(agenda_name_count[ik][jk]))
                                    {
                                        var agenda_name_count_obj=agenda_name_count[ik][jk];
                                        $.each(agenda_name_count_obj,function(key,value){
                                            if(key==uv['user-dept'])
                                            {
                                                value+=current_name;
                                                has_key=1;
                                                agenda_name_count[ik][jk][uv['user-dept']]=value;
                                                return false;
                                            }
                                        });
                                    }
                                    if(has_key==0)
                                    {
                                        agenda_name_count[ik][jk][uv['user-dept']]=current_name;
                                    }
                                }
                            });
                        });
                    });
                    after_submit(fileName,"submit1");
                }
                else
                {
                    toastr.warning('尚未選擇檔案!');
                }
            });
            $('#submit2').click(function(){
                //是否有選擇檔案
                if(if_select)
                {
                    modify_agenda_count=[[0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0]];
                    var file_name="";
                    $.each(obj,function(uk,uv){
                        $.each(uv.time_table,function(hk,hv){
                            $.each(hv.time_parsed,function(ik, iv){
                                $.each(iv.time,function(jk, jv){
                                    modify_agenda_count[iv.day-1][jv-1]=1;//那門課的重疊次數加一              
                                });                    
                            });
                        });
                    });
                    file_name=obj[0]['user-name']+".json";
                    after_submit(file_name,"submit2");
                    modify_userName=obj[0]['user-name'];
                    modify_userDept=obj[0]['user-dept'];
                }  
                else
                {
                    toastr.warning('尚未選擇檔案!');
                }
            });
            function after_submit(name,id)
            {
                $('.file_name.'+id).attr("value","上傳成功");
                $('.upload_file_name.'+id).text("已上傳:"+name);
                $('.not_upload_file_name').empty();
                if(id=="submit1")
                {
                    sessionStorage['fileName']=name;
                    sessionStorage['agenda_count']=JSON.stringify(agenda_count);
                    sessionStorage['agenda_name_count']=JSON.stringify(agenda_name_count);
                    sessionStorage['json_num']=json_num;
                }
                if_select=0
            }
            $("#demo").click(function(){    
                demo_click(agenda_count,json_num,"demo");
                td_mode=1;
                demo_mode=1;

            });
            $(".demo2").click(function(){   
                demo_click(modify_agenda_count,1,"demo2");
                td_mode=2;
                demo_mode=2;
            });
            window.demo_click = function(count,num,demo){
                $("td").html('<div><span></span></div>');
                $("td").attr({"style":""}); 
                //找尋每個時段有多少人有課的值
                $.each(count,function(ik,iv){
                    $.each(iv,function(jk,jv){
                        var tooltip_position="";
                        var $td = $("#time-table").find('tr[data-hour=' + (jk+1) + '] td[data-day=' + (ik+1) + ']');     //將目前所在的td位置指派給$td    
                        var $div = $("#time-table").find('tr[data-hour=' + (jk+1) + '] td[data-day=' + (ik+1) + '] div');//將目前所在的div位置指派給$div
                        var $sp = $("#time-table").find('tr[data-hour=' + (jk+1) + '] td[data-day=' + (ik+1) + '] span');//將目前所在的span位置指派給$sp

                        //將目前課堂時段的名字取出
                        var all_name="";
                        //判斷是否為空字典
                        if(!jQuery.isEmptyObject(agenda_name_count[ik][jk]))
                        {
                            var agenda_name_count_obj=agenda_name_count[ik][jk];
                            $.each(agenda_name_count_obj,function(key,value){
                                all_name+=value;
                            });
                        }
                        else
                        {
                           all_name=no_one; 
                        }
                        if(demo=="demo")
                        {
                            $div.attr({
                            "data-toggle": "tooltip",
                            "data-html":"true",
                            "data-placement": tooltip_position,
                            "title": all_name,
                            "style": "height: 80%;width:100%",
                            "class": 'table_name'
                        });//放上tooltip顯示有誰可到
                        }
                        $sp.attr({
                            "class":"",
                            "style":"color:black;font-weight:bold"
                        });
                        if(jk+1<5)
                        {
                            tooltip_position="bottom";
                        }
                        else
                        {
                            tooltip_position="top";
                        }

                        if(jv>=0&&jv<=num/4&&jv!=num)
                        {
                            $div.attr({
                                "data-placement": tooltip_position,
                            });//放上tooltip的顯示位置
                            $td.attr({
                                "style": "color:#3074B5;background-color:#58FA58",
                            });//0~總數的1/4個人有課就會改綠色;
                            $sp.html("<h1>"+(num-jv)+"</h1>");//顯示目前時段可到人數
                        }
                        else if(jv>num/4&&jv<=num/2&&jv!=num)
                        {
                            $div.attr({
                                "data-placement": tooltip_position,
                            });//放上tooltip的顯示位置
                            $td.attr({
                                "style": "color:#3074B5;background-color:#81F7F3",
                            });//總數的1/4個人~總數的2/4個人有課就會改藍色;
                            $sp.html("<h1>"+(num-jv)+"</h1>");//顯示目前時段可到人數
                        }
                        else if(jv>num/2&&jv<=num*3/4&&jv!=num)
                        {
                            $div.attr({
                                "data-placement": tooltip_position,
                            });//放上tooltip的顯示位置
                            $td.attr({
                                "style": "color:#3074B5;background-color:#F4FA58",
                            });//總數的2/4個人~總數的3/4個人有課就會改黃色;
                            $sp.html("<h1>"+(num-jv)+"</h1>");//顯示目前時段可到人數
                        }
                        else if(jv>num*3/4&&jv<num&&jv!=num)
                        {
                            $div.attr({
                                "data-placement": tooltip_position,
                            });//放上tooltip的顯示位置
                            $td.attr({
                                "style": "color:#3074B5;background-color:#FF8000",
                            });//總數的3/4個人~總數有課就會改黃色;
                            $sp.html("<h1>"+(num-jv)+"</h1>");//顯示目前時段可到人數
                        }
                        else
                        {
                            $div.attr({
                                "data-placement": tooltip_position,
                            });//放上tooltip的顯示位置
                            $td.attr({
                                "style": "color:#3074B5;background-color:#FA5858",
                            });//全部有課就會改紅色;
                            $sp.html("<h1>"+(num-jv)+"</h1>");//顯示目前時段可到人數
                        }
                        if(demo=="demo")
                        {
                            $('[data-toggle="tooltip"]').tooltip(); //讓tooltip功能綁上去
                        }
                                    
                    }); 
                });
                $('#tab a[href="#profile"]').tab('show');
                //儲存目前的資料,讓使用者在重新整理頁面後,也保存資料 
            }
            // 將tooltip的內容顯示在結果中
            $('td').click(function(){
                if(td_mode==1)
                {
                    var names=$(this).find('.table_name').attr('data-original-title');
                    td_click(names);
                }
                else
                {
                    if($(this).css('background-color')=="rgb(250, 88, 88)")
                    {
                        $(this).css('background-color','rgb(88, 250, 88)');
                        modify_agenda_count[$(this).attr('data-day')-1][$(this).parent().attr('data-hour')-1]=0;
                    }
                    else
                    {
                        $(this).css('background-color','rgb(250, 88, 88)');
                        modify_agenda_count[$(this).attr('data-day')-1][$(this).parent().attr('data-hour')-1]=1;
                    }
                    var current_num=$(this).find('span').text();
                    $(this).find('span').html("<h1>"+(1-current_num)+"</h1>");
                }
            });

            //新增或修改後json檔下載
            window.json={"user-name":"","user-dept":"","time_table":[]};
            $('#download_json').click(function(){
                json={"user-name":"","user-dept":"","time_table":[]};
                $.each(modify_agenda_count,function(mk,mv){
                    var json_time_table={"time_parsed":[{"day":1,"time":[]}]};
                    json_time_table.time_parsed[0].day=mk+1;
                    var a=0;
                    $.each(mv,function(nk,nv){
                        if(nv==1)
                        {
                            nv+=a;
                            json_time_table.time_parsed[0].time.push(nv);

                        }
                        a+=1;
                    });  
                    json.time_table.push(json_time_table);
                });
                fileSaver(json);
            });
            function fileSaver(json){
                json['user-name']=$('#user_name').val();
                json['user-dept']=$('#user_dept').val();
                add_to_local();
                var filename = $('#user_name').val();
                var json_string =  JSON.stringify(json);
                var blob = new Blob([json_string], {type: "application/json"});//這是存檔的物件
                saveAs(blob, filename+".json");
            }
            var add_to_local =function(){
                if(typeof(Storage) !== "undefined") {//如果typeof(Storage)!==undefined，代表他的瀏覽器有支援sessionStorage
                    stringify=JSON.stringify(window.user);
                    sessionStorage['jsonstorage']=stringify;
                }
            }
            //toastr設定
            //不重複出現提示訊息
            toastr.options = {
              "preventDuplicates": true,
            }
            window.td_click = function(names){
                if(names)
                {
                    $('#name_box_content').attr({'style':'padding-top:3px;padding-left:3px;padding-bottom:3px'});
                    $('#name_box_content').html('<h4>'+names+'</h4>');
                }
                else
                {
                    toastr.warning('尚未分析資料!');
                }
                
            }
        })(jQuery);
