import ResizeImage from 'image-resize';

const ri = new ResizeImage({
  width: 400,
  format: 'png',
  quality: 0.9,
});

export default {

  log(string) {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.log(string);
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
};
