from pathlib import Path
from PIL import Image
import numpy as np
from numpy.typing import NDArray
from typing import Iterable, Deque, Optional
from tqdm import tqdm
import click
from collections import deque
import cv2
from image_loader import ImageLoaderBase, ImageLoader, ChunkImageLoader


def is_all_black(img_arr: NDArray[np.uint8], tol: float = 25.0) -> bool:
    assert img_arr.dtype == np.uint8

    return np.all(img_arr.sum(axis=-1) < tol)  # type: ignore


def is_all_white(img_arr: NDArray[np.uint8], tol: float = 25.0) -> bool:
    inverted_img_arr = (255-img_arr)
    assert inverted_img_arr.dtype == np.uint8

    return np.all(inverted_img_arr.sum(axis=-1) < tol)  # type: ignore


class CutExtractor:
    def __init__(self,
                 img_loader: ImageLoaderBase,
                 min_height: int = 100,
                 max_height: int = 5_000,
                 color_tol: float = 50.0,
                 black_bg: bool = False,
                 ep_dir: Optional[str | Path] = None,
                 dst: str | Path = "./result"):
        if ep_dir is None:
            assert isinstance(img_loader, ChunkImageLoader)
            ep_dir = img_loader.episode_path
        self.ep_dir = Path(ep_dir)
        assert self.ep_dir.is_dir()

        self.img_loader = img_loader
        self.min_height = min_height
        self.max_height = max_height
        self.black_bg = black_bg

        self.row_buf: Deque[NDArray[np.uint8]] = deque()
        self.color_tol = color_tol
        self.dst = Path(dst)

    def iter_cand_cuts(self) -> Iterable[NDArray[np.uint8]]:
        for row in self.img_loader.iter_rows():
            if not self.is_empty(row):
                self.row_buf.append(row)
                continue

            cut = self.get_candid_cut()
            if cut is not None:
                yield cut

    def extract_and_save(self) -> None:
        for i, im in enumerate(self.extract()):
            im.save(self.dst / self.ep_dir.stem / f"{i:03}.jpg")

    def extract(self) -> Iterable[Image.Image]:
        for cand_cut in self.iter_cand_cuts():
            yield from self.proc_cand_cut(cand_cut)
        yield from self.finalize_extract_process()

    def finalize_extract_process(self) -> Iterable[Image.Image]:
        cut = self.get_candid_cut()
        if cut is not None:
            yield from self.proc_cand_cut(cut)

    def proc_cand_cut(self, cut: NDArray[np.uint8]) -> Iterable[Image.Image]:
        H, W, C = cut.shape
        too_high_height = H > self.max_height
        if too_high_height and self.white_bg:
            yield from CutExtractor(ImageLoader(cut),
                                    self.min_height,
                                    self.max_height,
                                    black_bg=True,
                                    color_tol=self.color_tol,
                                    ep_dir=self.ep_dir).extract()
            self.row_buf.clear()
            return
        if too_high_height and self.black_bg:
            self.save_as_rejected(cut)
            self.row_buf.clear()
            return

        if H > self.min_height:
            yield Image.fromarray(cut)

        self.row_buf.clear()

    def is_empty(self, row: NDArray[np.uint8]) -> bool:
        return (
            is_all_black(row, self.color_tol)
            if self.black_bg else
            is_all_white(row, self.color_tol)
        )

    def get_candid_cut(self) -> NDArray[np.uint8] | None:
        return np.stack(self.row_buf, axis=0) if len(self.row_buf) > 0 else None

    @property
    def white_bg(self) -> bool:
        return not self.black_bg

    def save_as_rejected(self, cut: NDArray[np.uint8]):
        rejected = (
            self.dst.with_name(f"{self.dst.name}(rejected)") / self.ep_dir.stem
        )
        rejected.mkdir(parents=True, exist_ok=True)
        f = len(list(rejected.glob("*.jpg")))
        Image.fromarray(cut).save(rejected/f"{f}.jpg")


@click.command()
@click.option("--src", default="./girls-trial", type=click.STRING)
@click.option("--dst", default="./result", type=click.STRING)
@click.option("--hlim",
              default=(100, 5_000),
              type=click.Tuple([click.INT, click.INT]))
@click.option("--tol", default=50.0, type=click.FLOAT)
def main(src, dst, hlim: tuple[int, int], tol: float):
    min_height, max_height = hlim
    src = Path(src)
    dst = Path(dst)
    dst.mkdir(exist_ok=True)
    for ep_dir in tqdm(list(src.glob("*"))):
        assert ep_dir.is_dir()
        (dst/ep_dir.stem).mkdir(exist_ok=True)
        extractor = CutExtractor(ChunkImageLoader(ep_dir),
                                 min_height,
                                 max_height,
                                 color_tol=tol,
                                 dst=dst)
        for i, cut in enumerate(extractor.extract()):
            assert cut.height >= min_height
            assert cut.height <= max_height
            cut.save(dst/ep_dir.stem/f"{i:03}.jpg")


if __name__ == "__main__":
    main()
