import openai
import easyocr
import os 
from mask import create_image_mask,find_white_blobs
from PIL import Image 
import numpy as np
import glob 
import re
import shutil
import json
import Levenshtein

"""


def chat_gpt(contents,prompt):
    
    conversation=[]
    conversation.append({"role": "system", "content": contents})
    conversation.append({"role": "user", "content": prompt})

    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=conversation
    )

    answer = response.choices[0].message.content.strip()

    return answer

"""

def clean_and_combine_text(text_list):

    cleaned_texts = [re.sub(r'[^a-zA-Z가-힣0-9\s]', '', text).strip() for text in text_list]
    combined_text = ' '.join(cleaned_texts)
    combined_text = re.sub(r'\s+', ' ', combined_text)

    return combined_text

def extract_path_after_keyword(file_path, keyword):
    
    start_idx = file_path.find(keyword)
    
    if start_idx == -1:
        return None  

    return file_path[start_idx:]

def calculate_similarity(sentence1, sentence2):

    distance = Levenshtein.distance(sentence1, sentence2)
    
    max_len = max(len(sentence1), len(sentence2))
    
    similarity = 1 - (distance / max_len)
    
    return similarity

# # 사용 예시
# sentence1 = "오늘 장어 먹었다"
# sentence2 = "오늘 저녁에 장어 먹었다"

# similarity_score = calculate_similarity(sentence1, sentence2)
# print(f"형식적인 유사성 점수: {similarity_score:.2f}")

# # 사용 예시
# texts = ["'오늘 장어", "먹없다 '"]
# combined_text = clean_and_combine_text(texts)
# print(combined_text)  # 출력: 오늘 장어 먹었다

if __name__ == '__main__':
     
    #sen1="나는 고기를 먹었다"
    #sen2="그녀는 고기를 먹었다"
    #score=calculate_similarity(sen1,sen2)
    
    paths=glob.glob("/root/CartoonSegmentation/girl_imgs/orig-result/*/*.jpg")
    main_list=[]
    number=0

    for index,path in enumerate(paths):

        episode=path.split("/")[-2]

        if episode in ["0042","0001","0048","0054","0057","0068","0082","0088","0092","0112","0126"]:
        
            print("True")
            print(episode)
            pass

        else:

            print("False")
            print(episode)
            continue

        # 1 42 48 54 57 68 82 88 92 112 126 
        
        number+=1
        dict={}
        reader = easyocr.Reader(['ko','en']) # this needs to run only once to load the model into memory
        result = reader.readtext(path)
        img=Image.open(path)
        img=np.array(img)[:,:,0:3]

        mask=create_image_mask(result,img.shape)
        find_white_blobs("mask.png",path)
        os.remove("mask.png")
        path_list=glob.glob("/root/CartoonSegmentation/box/*.png")
      
        dict["path"]=extract_path_after_keyword(path,"orig-result")
        text_list=[]

        for img_path in path_list:
            
            # a="""
            # OCR 로 추출된 텍스트 리스트가 있습니다. 해당 리스트 안의 한국어 단어와 글자를 
            # 자연스럽게 한문장으로 합치시오 단 상황에 따라서 두문장 이상으로 나누어야할때도 있습니다. 
            # 자연스럽게 문장들을 완성하고 문법이 잘못된 문장이나 단어가 있을경우 고치시오.
            # 예: 먹없다 -> 먹었다. 스타박스 -> 스타벅스. 지내련->지내렴
            # """

            b=reader.readtext(img_path,detail=0)
            b=clean_and_combine_text(b)
            text_list.append(b)

        dict["sentences"]=text_list
        shutil.rmtree("/root/CartoonSegmentation/box")
        os.mkdir("/root/CartoonSegmentation/box")
        main_list.append(dict)
        print("Done")

        if number!=0 and number%100==0:
            json_data = json.dumps(main_list, ensure_ascii=False, indent=4)
            with open(f'webtoon3_list_{index}.json', 'w', encoding='utf-8') as file:
                file.write(json_data)
            main_list=[]
            print("Json made")

    
 
    
       
