import ResizeImage from 'image-resize';

const ri = new ResizeImage({
  width: 1014,
  format: 'png',
  quality: 1,
});

export default {

  log(...val) {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.log(...val);
    }
  },
    /**
    * Produces a File given a base64 string
    *
    * @param { base64 file } dataurl
    * @param { string } filename
    */
  dataURLtoFile(dataurl, filename) {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n) {
      n -= 1;
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Promise((res) => {
      res(new File([u8arr], filename, { type: mime }));
    });
  },
    /**
     * Produces a base64 resized image
     * @param { <input> Elm } inputComponent
     * @param { options } optional params to change some parameters
     * such as height/width, quality, etc
     */
  resizeImage(inputComponent, options) {
    if (options) {
      ri.updateOptions(options);
    }
    return ri.play(inputComponent);
  },
  resizeImages(files) {
    debugger;
    const b64images = [];
    for (let i = 0; i <= files.length; i += 1) {
      const reader = new FileReader();
      reader.onloadend = function process() {
        const tempImg = new Image();
        tempImg.src = reader.result;
        tempImg.onload = function onLoad() {
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 800;
          let tempW = tempImg.width;
          let tempH = tempImg.height;
          if (tempW > tempH) {
            if (tempW > MAX_WIDTH) {
              tempH *= MAX_WIDTH / tempW;
              tempW = MAX_WIDTH;
            }
          } else if (tempH > MAX_HEIGHT) {
            tempW *= MAX_HEIGHT / tempH;
            tempH = MAX_HEIGHT;
          }
          const canvas = document.createElement('canvas');
          canvas.width = tempW;
          canvas.height = tempH;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(this, 0, 0, tempW, tempH);
          debugger;
          b64images.push(canvas.toDataURL('image/png'));
        };
      };
      reader.readAsDataURL(files[i]);
    }

    return b64images;
  },
};
