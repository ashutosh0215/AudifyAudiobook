import requests 
from bs4 import BeautifulSoup
import urllib.parse
import re

bn=input("Enter book name: ")

def siteParser(searchbookname):
    base_url = 'https://findaudiobook.net/'
    print(searchbookname)
    encoded_searchbookname = urllib.parse.quote(searchbookname)
    print(encoded_searchbookname)
    search_url = f'{base_url}?s={encoded_searchbookname}' 
    searchresponse = requests.get(search_url)
    soup = BeautifulSoup(searchresponse.content, 'html.parser')
    return soup


soup = siteParser(bn)

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


audiobook_list = scrape_audiobook(soup)
print(audiobook_list)





