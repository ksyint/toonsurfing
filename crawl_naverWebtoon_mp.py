import os, io, requests, argparse
from bs4 import BeautifulSoup
from PIL import Image
from tqdm import tqdm
from concurrent.futures import ThreadPoolExecutor
headers = {'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.61 Safari/537.36'}


def fetch_url(url):
    response = requests.get(url, headers=headers)
    return response


def parse_html(html, save_dir):
    html_parse = BeautifulSoup(html.content, "html.parser")
    webtoon_images = html_parse.find("div", {"class", "wt_viewer"}).findAll("img")
    for webtoon_image in tqdm(webtoon_images) :  
        src = webtoon_image['src']
        base = os.path.basename(src)
        fn, ext = os.path.splitext(base)
        fn_key = fn.split('_')[-1]
        save_path = f'{save_dir}/{fn_key.zfill(3)}.jpg'

        img_byte = requests.get(src, headers=headers)
        Image.open(io.BytesIO(img_byte.content)).save(save_path)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--toon_id", type=int, default=743838)
    parser.add_argument("--epi_start_idx", type=int, default=1)
    parser.add_argument("--epi_end_idx", type=int, default=195)
    parser.add_argument("--webtoon_name", type=str, default="소녀재판")
    parser.add_argument("--max_workers", type=int, default=128)
    args = parser.parse_args()
    
    urls, save_dirs = [], []
    for epi in range(args.epi_start_idx, args.epi_end_idx+1) :
        page_url = f"https://comic.naver.com/webtoon/detail?titleId={args.toon_id}&no={epi}"
        save_dir = f'{args.webtoon_name}/{str(epi).zfill(4)}'
        os.makedirs(save_dir, exist_ok=True)
        urls.append(page_url)
        save_dirs.append(save_dir)

    with ThreadPoolExecutor(max_workers=args.max_workers) as executor:
        htmls = executor.map(fetch_url, urls)
        for idx, html in enumerate(htmls):
            parse_html(html, save_dirs[idx])
