module.exports = {
  name: "Draw Gif behind Canvas",

  description: "Draw an Gif behind a Canvas MOD",

  category: ".MOD",

  inputs: [
    {
      "id": "action",
      "name": "Action",
      "description": "Acceptable Types: Action\n\nDescription: Executes this block.",
      "types": ["action"]
    },
    {
      "id": "path",
      "name": "Canvas",
      "description": "The canvas output from other canvas MOD blocks",
      "types": ["object", "text", "unspecified"],
      "required": true
    },
    {
      "id": "image",
      "name": "Gif",
      "description": "The Gif you want to put behind",
      "types": ["text", "object", "unspecified"],
      "required": true
    },
    {
      "id": "x",
      "name": "X Position",
      "description": "Position in Y axis (in px)",
      "types": ["number", "unspecified"]
    },
    {
      "id": "y",
      "name": "Y Position",
      "description": "Position in Y axis (in px)",
      "types": ["number", "unspecified"]
    },
    {
      "id": "w",
      "name": "Width",
      "description": "Gif witdh (in px)",
      "types": ["number", "unspecified"]
    },
    {
      "id": "h",
      "name": "Height",
      "description": "Gif height (in px)",
      "types": ["number", "unspecified"]
    }
  ],

  options: [],

  outputs: [
    {
      "id": "action",
      "name": "Action",
      "description": "Type: Action\n\nDescription: Executes the following blocks when this block finishes its task.",
      "types": ["action"]
   },
   {
      "id": "buffer",
      "name": "GifBuffer",
      "description": "The created Gif",
      "types": ["object", "unspecified"]
   }
  ],

  async code(cache) {
      const fs = require("fs");
      const Discord = await this.require('discord.js')
      const Canvas = await this.require('canvas');
      const fetch = await this.require('node-fetch');
      const GIFEncoder = await this.require('gif-encoder-2');
      const GIFDecoder = await this.require('decode-gif');
      const mask = this.GetInputValue("path", cache);
      let gif;
      const gifloc = this.GetInputValue("image", cache);

      if(gifloc.toString().startsWith("http")){
        const fet = await fetch(gifloc)
        gif = await fet.buffer()
      } else {
        gif = fs.readFileSync(gifloc)
      }
      
      if(!gif) return console.log("Could not Fetch Gif!")

      const gifInfos = GIFDecoder(gif)
      const outGif = new GIFEncoder(mask.width, mask.height, 'neuquant', true, gifInfos.frames.length)

      // outGif.on('progress', percent => {
      //   console.log("Making gif: '" + percent + "'%");
      // })

      const x = this.GetInputValue("x", cache);
      const y = this.GetInputValue("y", cache);
      const w = this.GetInputValue("w", cache);
      const h = this.GetInputValue("h", cache);

      const framebg = Canvas.createCanvas(mask.width, mask.height)
      const framebgctx = framebg.getContext('2d')
      framebgctx.fillStyle = '#36393f'
      framebgctx.fillRect(0, 0, mask.width, mask.height)

      const gifheight = gifInfos.height
      const gifwidth = gifInfos.width
      outGif.start()
      outGif.setDelay(gifInfos.frames[1].timeCode)
      outGif.setQuality(1)
      for (frameindex in gifInfos.frames){
        const frame = gifInfos.frames[frameindex]
        const framecan = Canvas.createCanvas(gifwidth, gifheight)
        const framectx = framecan.getContext('2d') 
        const imageData = Canvas.createImageData(frame.data, gifwidth, gifheight);
        framectx.putImageData(imageData, 0, 0);
        framebgctx.drawImage(framecan, x, y, w, h)
        framebgctx.drawImage(mask, 0, 0)
        outGif.addFrame(framebgctx)
      }

      outGif.finish()
      this.StoreOutputValue(outGif.out.getData(), "buffer", cache);
      this.RunNextBlock("action", cache);
  }
}