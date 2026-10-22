from pathlib import Path
import numpy as np
from numpy.typing import NDArray
from typing import Iterable
from typing_extensions import override
import cv2
from abc import ABC, abstractmethod


class ImageLoaderBase(ABC):
    @abstractmethod
    def iter_rows(self) -> Iterable[NDArray[np.uint8]]:
        pass


class ChunkImageLoader(ImageLoaderBase):
    def __init__(self,
                 episode_path: Path | str):
        self.episode_path = Path(episode_path)

    def load_img_chunk(self, path: Path | str) -> NDArray[np.uint8]:
        im: NDArray[np.uint8] = cv2.cvtColor(cv2.imread(f"{path}"),
                                             cv2.COLOR_BGR2RGB)  # type: ignore

        assert im.dtype == np.uint8

        return im

    def iter_chunks(self) -> Iterable[NDArray[np.uint8]]:
        img_chunk_files = Path(self.episode_path).glob("*.jpg")
        img_chunk_files = filter(lambda p: p.stem != "white", img_chunk_files)
        img_chunk_files = sorted(img_chunk_files, key=lambda p: p.stem)
        for chunk_file in img_chunk_files:
            yield self.load_img_chunk(chunk_file)

    @override
    def iter_rows(self) -> Iterable[NDArray[np.uint8]]:
        for img_chunk in self.iter_chunks():
            for row in img_chunk:
                yield row

    def load(self) -> NDArray[np.uint8]:
        return np.concatenate([*self.iter_chunks()], axis=0)


class ImageLoader(ImageLoaderBase):
    def __init__(self, img_array: NDArray[np.uint8]) -> None:
        self.img_array = img_array

    @override
    def iter_rows(self) -> Iterable[NDArray[np.uint8]]:
        for row in self.img_array:
            yield row
