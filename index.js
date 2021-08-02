let betterwords = new Map();

function ReadFile(files){   
    let file = inputfile.files[0];  
    let reader = new FileReader();  
    reader.readAsText(file);    
    reader.onload = function(){ 
        filecontent.value = reader.result;
        spellCheck();            
    }   
}   

async function spellCheck() {   
    let badwords=[];
    var text = filecontent.value;
    console.log(text);
    let url = "https://api.textgears.com/spelling?key=1gVny1rfj02gy7kY&text=" + text + "!&language=en-GB";  
    let response = await fetch(url);
    let user = await response.json();
    console.log(user);  
    for(const item of user.response.errors){
        
        badwords.push(item.bad);
        betterwords.set(item.bad,item.better);
        
    }
    document.getElementById('result').innerHTML = transformContent(text, badwords);
    autoCorrect();
}   

function transformContent(content, keywords){
  let temp = content;

  keywords.forEach(keyword => {
    temp = temp.replace(new RegExp(keyword, 'ig'), wrapKeywordWithHTML(keyword, `https://www.google.com/search?q=${keyword}`));
  })

  return temp;
}

function wrapKeywordWithHTML(keyword, url){
  return `<a href="${url}" target="_blank"> <span style="; color: red;">  ${keyword}  </span> </a>`
}

function autoCorrect(){
    let typo_spans = document.querySelectorAll("span");

    typo_spans.forEach(
        (typo_span_i,idx)=>{
            typo_span_i.addEventListener("contextmenu",(event)=>{
                event.preventDefault();
                let ans_div = document.getElementById('suggestion');
                posDiv(ans_div,event.pageX, event.pageY);
                suggestion_content = "<ul>";
                var which_typo = typo_span_i.textContent.trim();
                for (const [which_typo, value] of betterwords.entries()) {
                    if(event.target.innerHTML.trim()==which_typo){
                        var n = value.length;
                        for (var i = 0; i < n; i++) {
                            suggestion_content += "<li class='clickMe'>" +value[i] +"</li>";
                        }
                    }
                }
                suggestion_content += "<ul>";
                ans_div.innerHTML = suggestion_content;
                $('.clickMe').click(function (e) {
                    var str = $(this).text();
                    event.target.innerHTML = str;
                    event.target.style.fontWeight = "";
                    event.target.style.color = "";  
                    event.target.style.fontSize = "";
                });
                return false;
            });
        }
    );
}
$(document).mouseup(function (e) { 
    if ($(e.target).closest(".contain").length 
                === 0) { 
        $(".container").hide(); 
    } 
}); 

function posDiv(a,x,y){
    a.style.display = "block";
    a.style.position = "absolute";
    a.style.left=x+'px';
    a.style.top=y+'px';
    a.style.backgroundColor = 'whitesmoke';
}