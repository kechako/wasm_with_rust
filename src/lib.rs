extern crate image;
extern crate wasm_bindgen;

use image::DynamicImage;
use image::RgbaImage;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

macro_rules! console_log {
    ($($t:tt)*) => (log(&format_args!($($t)*).to_string()))
}

#[wasm_bindgen]
pub fn resize_image(
    buf: &[u8],
    src_width: u32,
    src_height: u32,
    dst_width: u32,
    dst_height: u32,
) -> Result<Box<[u8]>, JsValue> {
    console_log!(
        "src_w: {}, src_h: {}, dst_w: {}, dst_h: {}",
        src_width,
        src_height,
        dst_width,
        dst_height
    );

    let src_img: DynamicImage = match RgbaImage::from_raw(src_width, src_height, buf.to_vec()) {
        Some(img) => DynamicImage::ImageRgba8(img),
        None => return Err(JsValue::from_str("failed to load image from raw pixcels")),
    };

    let dst_img = src_img.resize(dst_width, dst_height, image::imageops::FilterType::Gaussian);

    Ok(dst_img.raw_pixels().into_boxed_slice())
}
