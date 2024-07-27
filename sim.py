from web_ocr import calculate_similarity 
#import jsonwith open(file, 'r', encoding='utf-8') as file:
import json

def find_most_similar_desc(query, data):
    max_sim = -1
    best_img_path = None
    
    for doc in data['all_doc']:
        for dialogue in doc['dialogue']:
            desc = dialogue['desc']
            sim = calculate_similarity(query, desc)
            if sim > max_sim:
                max_sim = sim
                best_img_path = doc['img_path']
    
    return best_img_path

if __name__ == '__main__':
    import time 
    #   with open(file, 'r', encoding='utf-8') as file:
    #     data = json.load(file)
    query_text="너 옷 두고 갔으니까 시간나면 가지러와"
    start=time.time()
    with open("dialogue_data.json","r",encoding='utf-8') as file:
        data2 = json.load(file)

    the_path=find_most_similar_desc(query_text,data2)
    end=time.time()

    print(the_path)
    print(end-start)

    
    


