const express = require("express");
const fs = require('fs');
const sharp = require('sharp');
const bodyParser = require('body-parser');
const Jimp = require('jimp');

const fileupload = require("express-fileupload")
const PORT = 80

const axios = require("axios");
const { time, Console } = require("console");

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// const { createCanvas, loadImage } = require('canvas');
const { json } = require("express");

const app = express()

app.use(fileupload());



app.use(express.static('public'));

app.use(express.json({extended: true, limit: '100mb',parameterLimit:500000}));

app.use(express.urlencoded({limit: '50mb'}));




app.listen(PORT, () => console.log("Listening"));



// app.get("/", (req,res) =>{
//     //res.send('<img src="' + canvas.toDataURL() + '" />')

//      res.sendFile(__dirname+ "/index.html")
// })




app.get("/", (req,res) =>{


var fen = "8/8/8/8/8/2R5/P7/8 b - - 0 1";

// game.aiMove()
// var newfen = game.exportFen()
// console.log(newfen)



})

app.post('/pic', async (req, res) => {
    console.log('started /pic')
    // this is upload from form data (PC moment)
    //var { image } = req.files;
     

    // this is upload from api call (Mobile moment)
    var image = req.body.pic;

    // this is needed to convert from base64 in order to save photo  
    var data = Buffer.from(image, 'base64');
    fs.writeFile('image.jpg', data, (err) => {
        if (err) throw err;
        console.log('Image saved!');
               
    });
    await sleep(100);
    await sharp('image.jpg').rotate(-90).withMetadata().toFile('imagenew.jpg');
    

    var referenceData = [
                        [[427,198],[492,199],[558,196],[623,194],[689,191],[756,189],[825,188],[894,186],[965,185]],
                        [[411,230],[480,230],[549,228],[618,226],[687,225],[758,224],[830,222],[904,220],[979,219]],
                        [[392,266],[467,265],[539,264],[612,263],[685,262],[760,261],[837,259],[915,258],[955,256]],
                        [[375,306],[452,306],[529,305],[605,305],[683,304],[763,303],[844,301],[928,300],[1013,300]],
                        [[351,355],[434,354],[516,354],[599,353],[681,354],[766,352],[853,352],[943,352],[1032,351]],
                        [[325,410],[413,410],[502,409],[590,409],[678,409],[769,408],[863,408],[959,409],[1056,409]],
                        [[296,474],[390,473],[485,472],[580,472],[676,472],[774,472],[875,473],[979,474],[1082,474]],
                        [[264,546],[364,547],[466,546],[569,546],[673,547],[779,548],[889,549],[1000,550],[1112,551]],
                        [[227,632],[334,633],[444,634],[556,635],[669,636],[785,638],[905,640],[1025,641],[1150,643]]
    ]

    var resultdata =   [['1','1','1','1','1','1','1','1'],
                        ['1','1','1','1','1','1','1','1'],
                        ['1','1','1','1','1','1','1','1'],
                        ['1','1','1','1','1','1','1','1'],
                        ['1','1','1','1','1','1','1','1'],
                        ['1','1','1','1','1','1','1','1'],
                        ['1','1','1','1','1','1','1','1'],
                        ['1','1','1','1','1','1','1','1'],
    ] 

    



    // img.mv(__dirname+'/uploads/test')    

    // converting modified photo to base64
    function base64_encode(file) {
        // read binary data
        var bitmap = fs.readFileSync(file);
        // convert binary data to base64 encoded string
        return new Buffer(bitmap).toString('base64');
    }
    var newdata = base64_encode('imagenew.jpg')
    
    await sleep(2000);
    
    axios({
        method: 'POST',
        format: 'image',
        url: 'https://detect.roboflow.com/chesspiecedetection-ncrf1/5/',
        params: {
            api_key: "gGn4Rxmd56BSBAYx6IQf"
        },
        data: newdata,
    })
    .then(function(response) {
        const rjson = response.data;
        console.log("done " + Object.keys(rjson.predictions).length, rjson)

        for (let i = 0; i < Object.keys(rjson.predictions).length; i++) {
            if(rjson.predictions[i].confidence<0.7)continue;
            var core = [Math.floor(rjson.predictions[i].x), Math.floor(rjson.predictions[i].y+(rjson.predictions[i].height/2.3))]
            outerloop: 
            for (let a= 0; a< 9; a++){
                for (let b = 0; b < 9; b++) {
                    if((core[0]>referenceData[a][b][0])||(core[1]>referenceData[a][b][1])){
                        continue;
                    } else{
                        console.log(a,b)
                        console.log(core[0],core[1])
                        console.log(referenceData[a][b][0],referenceData[a][b][1])
                        var test = rjson.predictions[i].class; 
                        if(test.slice(0,6)==="white-") 
                            if(test.substring(6)==="knight")
                                resultdata[a-1][b-1] = 'N'
                            else
                                resultdata[a-1][b-1] = test.substring(6,7).toUpperCase()
                        else if(test.substring(6)==="knight")
                                resultdata[a-1][b-1] = 'n'
                            else
                                resultdata[a-1][b-1] = test.substring(6,7)
                        break outerloop;
                    }
                }
                
            }
        }
        var fen = '';    

        for (let i = 0; i < 8; i++) {
            var count = 0;
            for (let j = 0; j < 8; j++) {
                if(resultdata[i][j] === '1')count++;
                else{
                    fen+= (count===0 ? '':count) + resultdata[i][j];
                    count = 0;
                }
            }
            fen += (count !=0 ? count:'') + '/'
        }
        fen = fen.substring(0,fen.length-1) + ' b - - 0 1'
        console.log(fen)
        res.send(fen)

    })
    .catch(function(error) {
        console.log(error.message);
    }); 

    


    fs.unlink(__dirname+'image.jpg', (err) => {});
    fs.unlink(__dirname+'imagenew.jpg', (err) => {});


});


