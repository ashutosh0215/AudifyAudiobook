import requests 
from bs4 import BeautifulSoup
import urllib.parse
import re

searchbookname = input("Enter Book Name: ")
base_url = 'https://findaudiobook.net/'
encoded_searchbookname = urllib.parse.quote(searchbookname)
search_url = f'{base_url}?s={encoded_searchbookname}' 
searchresponse = requests.get(search_url)
soup = BeautifulSoup(searchresponse.content, 'html.parser') 

pattern = r'<h2 class="entry-title post-title"><a href="([^"]+)" rel="bookmark">([^<]+)</a></h2>'
h2tag = soup.find_all('h2', class_='entry-title post-title')

href_list=[]
title_list=[]
bookname_list=[]
author_list=[]

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
            #print(f'{authorName}| {bookName} | {href}')

print(bookname_list)
print(author_list)
print(title_list)
print(href_list)