from pathlib import Path
from PIL import Image
import numpy as np
from numpy.typing import NDArray
from typing import Iterable, Deque
from tqdm import tqdm
import click
from collections import deque


def load_image(episode_path: Path | str) -> NDArray[np.uint8]:
    img_files = Path(episode_path).glob("*.jpg")
    img_files = filter(lambda p: p.stem != "white", img_files)
    img_files = sorted(img_files, key=lambda p: p.stem)
    merged_img = np.concatenate([np.array(Image.open(p)) for p in img_files],
                                axis=0)
    return merged_img


def is_all_black(img_arr: NDArray[np.uint8]) -> bool:
    assert img_arr.dtype == np.uint8
    return img_arr.sum() == 0


def is_all_white(img_arr: NDArray[np.uint8]) -> bool:
    inverted_img_arr = (255-img_arr)
    assert inverted_img_arr.dtype == np.uint8
    return inverted_img_arr.sum() == 0


class CutExtractor:
    def __init__(self,
                 webtoon_img_arr: NDArray[np.uint8],
                 height_threshold: int = 100,
                 black_bg=False) -> None:
        assert webtoon_img_arr.dtype == np.uint8

        self.webtoon_img_arr = webtoon_img_arr
        self.height_threshold = height_threshold
        self.black_bg = black_bg

        self.row_buf: Deque[NDArray[np.uint8]] = deque()

    def extract(self) -> Iterable[Image.Image]:
        for row in self.webtoon_img_arr:
            if not self.is_empty(row):
                self.row_buf.append(row)
                continue

            new_cut = self.get_new_cut()
            if new_cut is None:
                continue

            H, W, C = new_cut.shape
            black_bg = H > 5_000
            if black_bg:
                yield from CutExtractor(new_cut,
                                        self.height_threshold,
                                        black_bg=True).extract()
                self.row_buf.clear()
                continue

            if H > self.height_threshold:
                yield Image.fromarray(new_cut)
                self.row_buf.clear()
                continue

    def is_empty(self, row: NDArray[np.uint8]):
        return is_all_black(row) if self.black_bg else is_all_white(row)

    def get_new_cut(self) -> NDArray[np.uint8] | None:
        return np.stack(self.row_buf, axis=0) if len(self.row_buf) > 0 else None


@click.command()
@click.option("--src", default="./743838", type=click.STRING)
@click.option("--dst", default="./result", type=click.STRING)
@click.option("--ht", default=100, type=click.INT)
def main(src, dst, ht):
    src = Path(src)
    dst = Path(dst)
    dst.mkdir(exist_ok=True)
    for ep_dir in tqdm(list(src.glob("*"))):
        assert ep_dir.is_dir()
        (dst/ep_dir.stem).mkdir(exist_ok=True)
        webtoon_img_arr = load_image(ep_dir)
        for i, cut in enumerate(CutExtractor(webtoon_img_arr,
                                             height_threshold=ht).extract()):
            assert cut.height >= ht
            assert cut.height <= 5_000
            cut.save(dst/ep_dir.stem/f"{i:03}.jpg")


if __name__ == "__main__":
    main()
