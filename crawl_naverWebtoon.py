import os, io, requests
from bs4 import BeautifulSoup
from PIL import Image
from tqdm import tqdm

TOON_ID = '783053'
EPISODES = (1, 50)

headers = {'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.61 Safari/537.36'}
for epi in range(*EPISODES) :
    page_url = f"https://comic.naver.com/webtoon/detail?titleId={TOON_ID}&no={epi}"
    print(f'page : {page_url}')
    save_dir = f'{TOON_ID}/{str(epi).zfill(4)}'
    os.makedirs(save_dir, exist_ok=True)

    html = requests.get(page_url, headers=headers)
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
