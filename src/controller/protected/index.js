const jsonpatch = require('json-patch');
const log = require('../../services/logger');
const axios = require('axios');
const resizeImg = require('resize-img');
const fs = require('fs');
const path = require('path');

module.exports = {
    jsonPatch : (req, res) => {
        let responseData= {};
        try{
            if(!req.body.json || !req.body.patch){
                return res.status(400).send({
                    success:false,
                    msg:"Insufficient data"
                })
            }
            
            let json = JSON.parse(req.body.json);
            let patch = JSON.parse(req.body.patch);

            let result = jsonpatch.apply(json, patch);
            responseData.success = true;
            responseData.result = result;
            return res.status(200).send(responseData);
        }
        catch(error){
            log.error('Failed to patch json object',error);
            responseData.success = false;
		    responseData.msg = 'Something went wrong 1';
		    return res.status(400).send(responseData);
        }
    },
    thumbNail: async (req, res) => {
        let responseData= {};
        try{
            if(!req.body.imgUrl){
                return res.status(400).send({
                    success:false,
                    msg:"Insufficient data"
                })
            }
            let url = req.body.imgUrl;
            const newPath = path.resolve(__dirname, '../../../images', 'node.jpg')
            const writer = fs.createWriteStream(newPath)

            const response = await axios({
                url,
                method: 'GET',
                responseType: 'stream'
            })
            
            response.data.pipe(writer);

            writer.on('finish', async ()=>{
                const image = await resizeImg(fs.readFileSync(newPath), {
                    width: 100,
                    height: 100
                });

                responseData.success = true;
                responseData.image = image;
                res.set({'Content-Type': 'image/png'});
                return res.status(200).send(responseData);
            })
                
            writer.on('error', ()=>{
                throw 'Something went wrong'
            })
        }
        catch(error){
            log.error('Failed to thumbnail: ',error);
            responseData.success = false;
		    responseData.msg = 'Something went wrong 2';
		    return res.status(400).send(responseData);
        }
    }
}