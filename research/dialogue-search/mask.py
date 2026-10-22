import numpy as np
import cv2
import matplotlib.pyplot as plt
import os
from PIL import Image 

def create_image_mask(coordinates_list, image_shape):

    mask = np.zeros(image_shape, dtype=np.uint8)
    
    for coords, _, _ in coordinates_list:
        pts = np.array(coords, dtype=np.int32)
        cv2.fillPoly(mask, [pts], (255, 255, 255))
    mask=Image.fromarray(mask)
    mask.save("mask.png")
    return mask


def find_white_blobs(image_path,image_path2):

    # mask
    image = cv2.imread(image_path)
    
    # real image
    image2=Image.open(image_path2)
    image2=np.array(image2)
   
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    _, binary = cv2.threshold(gray, 240, 255, cv2.THRESH_BINARY)
    contours, _ = cv2.findContours(binary, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    bounding_boxes = []

    for contour in contours:

        x, y, w, h = cv2.boundingRect(contour)
        bounding_boxes.append((x, y, x + w, y + h))

    for index,box in enumerate(bounding_boxes):

        x1=box[0]
        y1=box[1]
        x2=box[2]
        y2=box[3]

        img=image2[y1:y2,x1:x2,:]
        img=Image.fromarray(img)
        img.save(f"/root/CartoonSegmentation/box/box_{index+1}.png")




    








