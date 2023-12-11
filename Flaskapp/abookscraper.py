import requests
from bs4 import BeautifulSoup
import urllib.parse
import re

def book_description_scrape(bookname,authorname):
    book_text=""
    #bookname = input("enter book name: ")
    #authorname = input("enter author name: ") 
    authorwords = authorname.split()
    inauthor_words = ["inauthor:"+ authorword for authorword in authorwords]
    words = bookname.split()
    intitle_words = ["intitle:"+ word for word in words ]

    search_query = "+".join(intitle_words)+"+"+"+".join(inauthor_words)
    #print(search_query)

    url = f"https://www.google.com/search?tbo=p&tbm=bks&q={search_query}&num=10"
    print(url)
    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'html.parser')

    atag = soup.find('a',{'data-ved' : True})
    if atag:
        href = atag['href']
    print(href)
    url1 = href
    response1 = requests.get(url1)
    soup1 = BeautifulSoup(response1.content, 'html.parser')
    targettag = soup1.find('a',id="sidebar-atb-link")
    if targettag:
        href1 = targettag['href']
        print(href1)
        response2 = requests.get(href1)
        soup2 = BeautifulSoup(response2.content, 'html.parser')
        target_id = "synopsistext"
        target_div = soup2.find("div", id=target_id)
        if target_div:
            paragraphs = target_div.find_all('p')
            if paragraphs:
                text = " ".join([p.text.strip() for p in paragraphs])
                text = text.replace('Ā','').replace('\n','')
                #print(text)
                book_desc = text
            else:
                book_description = target_div.get_text(separator=' ').strip()
                # book_desc = text
        else:
            print(f"No div with id '{target_id}' found.")
    else:
        target_id = "synopsistext"
        target_div = soup1.find("div", id=target_id)
        if target_div:
            paragraphs = target_div.find_all('p')
            if paragraphs:
                text = " ".join([p.text.strip() for p in paragraphs])
                text = text.replace('Ā','').replace('\n','')
                book_desc = text
            else:
                book_description = target_div.get_text(separator=' ').strip()
                # book_desc = text
        else:
            print(f"No div with id '{target_id}' found.")
    return book_description

if __name__ == "__main__"
    bookname = input("enter book name: ")
    authorname = input("enter author name: ")    
    bookdesc = book_description_scrape(bookname,authorname)
    print(bookdesc)