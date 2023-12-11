import requests 
from bs4 import BeautifulSoup
import urllib.parse
import re
from flask import Flask, request, jsonify

app= Flask(__name__)


def siteParser(searchbookname):
    base_url = 'https://findaudiobook.net/'
    print(searchbookname)
    encoded_searchbookname = urllib.parse.quote(searchbookname)
    print(encoded_searchbookname)
    search_url = f'{base_url}?s={encoded_searchbookname}' 
    searchresponse = requests.get(search_url)
    soup = BeautifulSoup(searchresponse.content, 'html.parser')
    return soup #returns soup object in context of the search query 

def scrape_audiobook(soup):

    pattern = r'<h2 class="entry-title post-title"><a href="([^"]+)" rel="bookmark">([^<]+)</a></h2>'
    h2tag = soup.find_all('h2', class_='entry-title post-title')
 
    href_list = []
    title_list = []
    src_list = []
    bookname_list = []
    author_list = []

    imgtags = soup.find_all('div', {'class' : 'wp-caption aligncenter'})


    for imgtag in imgtags:
        img = imgtag.find('img')
        src = img.get('src')
        src_list.append(src)

    for bookinfo in h2tag:
        html_content = str(bookinfo)
        matches = re.search(pattern, html_content)
        if matches:
            title = matches.group(2)
            author_pattern = re.compile(r'^([^\–]+)')
            bookname_pattern = re.compile(r'–\s*([^–(]+)\s*Audiobook \(Online\)')
            match_ap = author_pattern.search(title) # ap --> author_pattern
            match_bnp = bookname_pattern.search(title) # bnp --> bookname_pattern
            href = matches.group(1)
            href_list.append(href)
            title_list.append(title)
            if match_ap and match_bnp:
                authorName = match_ap.group(1)
                bookName = match_bnp.group(1).strip()
                author_list.append(authorName)
                bookname_list.append(bookName)

    searchresult = []
    for index,(bookname,author,title,href,src) in enumerate(zip(bookname_list,author_list,title_list,href_list,src_list), start=1):
        searchresult.append((bookname,author,title,href,src))

    return searchresult

def book_description_scrape(bookname,authorname):
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
                book_description = text
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
                book_description = text
            else:
                book_description = target_div.get_text(separator=' ').strip()
                # book_desc = text
        else:
            print(f"No div with id '{target_id}' found.")
    return book_description



def nameprint(selected_audbook):
    print(selected_audbook)




def chapterScrape(selected_audbook):

    htmlxmlcontent = requests.get(selected_audbook)
    soup = BeautifulSoup(htmlxmlcontent.content, 'html.parser')

    chapterslink = []

    chapterTags = soup.find_all('audio')

    for chapterTag in chapterTags:
        source = chapterTag.find('source')
        src = source.get('src')
        #print(src)
        chapterslink.append(src)

    # print(chapterslink)
    return chapterslink





@app.route('/api/search', methods=['GET'])
def search_audiobook():
    audiobook_name = request.args.get('name')
    soup = siteParser(audiobook_name)
    audiobook_list = scrape_audiobook(soup)
    nameprint(audiobook_list)
    return jsonify(audiobook_list)

@app.route('/api/receivelink', methods = ['POST'])
def linkReceive():     
    data = request.get_json()
    book_name = data.get('bookName')
    author_name = data.get('authorName')
    book_desc = book_description_scrape(book_name,author_name)
    link = data.get('link')
    linksarr = chapterScrape(link)

    response_data = {
        'book_desc' : book_desc,
        'linksarr'  : linksarr
    }

    #nameprint(book_name)
    #nameprint(author_name)
    for arr in linksarr:
        print("-"*80)
        print(arr)
    return jsonify(response_data)

if __name__ =='__main__':
	app.run(debug=True,host="0.0.0.0")


