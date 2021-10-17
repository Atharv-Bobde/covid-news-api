const express=require('express')
const axios =require('axios');
const cheerio=require('cheerio')
const { response } = require('express');
const PORT=process.env.PORT || 8000;

const app=express()
const sources=[
    {
        name:'thehindu',
        website:'https://www.thehindu.com',
        base:''
    },
    {
        name:'telegraph',
        website:'https://www.telegraphindia.com/',
        base:'https://www.telegraphindia.com/'
    },
    {
        name:'indiatoday',
        website:'https://www.indiatoday.in/news.html',
        base:'https://www.indiatoday.in'
    },
    {
        name:'india',
        website:'https://www.india.com/news/',
        base:''
    },
    {
        name:'abcnews',
        website:'https://abcnews.go.com/Health/Coronavirus',
        base:''
    },
    {
        name:'nbcnews',
        website:'https://www.nbcnews.com/health/coronavirus',
        base:''
    },
    {
        name:'guardian',
        website:'https://www.theguardian.com/international',
        base:''
    },
    {
        name:'bbc',
        website:'https://www.bbc.com/news',
        base:''
    }
]
const articles=[];

sources.forEach(ele => {
    axios.get(ele.website)
        .then((response)=>{
            const html=response.data;
            //console.log(html)
            const $=cheerio.load(html);
            $('a:contains("Covid"),a:contains("corona"),a:contains("COVID")',html).each(function(){
                const title=$(this).text().trim()
                const url=$(this).attr('href')
                articles.push({
                    title:title,
                    url:ele.base+url,
                    source:ele.name
                })
            })
            //res.json(articles);
        }).catch(err=>{console.log(err)
        
        })
    
});
app.get('/',(req,res)=>{
    res.send("Welcome to my covid news api")
})

app.get('/news',(req,res)=>{
    res.json(articles)
})

app.get('/news/:newspaperId',(req,res)=>{
    const newspaperId=req.params.newspaperId
    const result=sources.filter(source=>source.name==newspaperId)
    const specificArticles=[];
    if(result.length!=0)
    {
        axios.get(result[0].website)
        .then((response)=>{
            const html=response.data;
            //console.log(html)
            const $=cheerio.load(html);
            $('a:contains("Covid"),a:contains("corona"),a:contains("COVID")',html).each(function(){
                const title=$(this).text().trim()
                const url=$(this).attr('href')
                specificArticles.push({
                    title:title,
                    url:result[0].base+url,
                    source:result[0].name
                })
            })
            res.json(specificArticles);
        }).catch(err=>{console.log(err)})
    }
    else
        res.json({"error":"wrong newspaperId"})
    
})

app.get("/sources",(req,res)=>{
    let q=[];
    sources.forEach(source=>{
        q.push({newspaperId:source.name,url:source.website});
    })
    res.json(q);
})





app.listen(PORT,()=>{
    console.log(`your app is listening on port ${PORT}`)
});