
interface WasmWithRust {
  resize_image: (buf: Uint8Array, src_width: number, src_height: number, dst_width: number, dst_height: number) => Uint8Array;
}

export const loadWASM = (): Promise<WasmWithRust> => import('wasm_with_rust');

let wwr: WasmWithRust;

const button = document.getElementById('resize') as HTMLButtonElement;
const srcCanvas = document.getElementById('srcCanvas') as HTMLCanvasElement;
const dstCanvas = document.getElementById('dstCanvas') as HTMLCanvasElement;

button.addEventListener('click', (e: MouseEvent) => {
  e.preventDefault();

  const srcContext = srcCanvas.getContext('2d') as CanvasRenderingContext2D ;
  if (srcContext == null) {
    return;
  }
  const dstContext = dstCanvas.getContext('2d') as CanvasRenderingContext2D ;
  if (dstContext == null) {
    return;
  }
  const srcImage = srcContext.getImageData(0, 0, srcCanvas.width, srcCanvas.height);

  const dstImage = wwr.resize_image(
    new Uint8Array(srcImage.data), srcCanvas.width, srcCanvas.height, dstCanvas.width, dstCanvas.height);

  dstContext.putImageData(
    new ImageData(new Uint8ClampedArray(dstImage), dstCanvas.width, dstCanvas.height), 0, 0);
});


const init = async () => {
  const image = new Image();
  image.addEventListener('load', () => {
    srcCanvas.width = image.naturalWidth;
    srcCanvas.height = image.naturalHeight;
    dstCanvas.width = 400;
    dstCanvas.height = dstCanvas.width / srcCanvas.width * srcCanvas.height;
    console.log(`w: ${srcCanvas.width}, h: ${srcCanvas.height}`);

    const srcContext = srcCanvas.getContext('2d') as CanvasRenderingContext2D ;
    if (srcContext == null) {
      return;
    }
    srcContext.drawImage(image, 0, 0);
  }, false);
  image.src = './sample.jpg';

  wwr = await loadWASM();

  button.disabled = false;
}

init();
