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
pattern2 = r'^(.+)-(.+) Audiobook \(Online\)$' 

href_list = []
title_list = []
author_list = []
book_list = []

for bookinfo in h2tag:
    html_content = str(bookinfo)
    matches = re.search(pattern, html_content)
    if matches:
        title = matches.group(2)
        print(title)
        result = re.match(pattern2, title)
        if result:
        	author_name = result.group(1).strip()
        	book_name = result.group(2).strip()
        	author_list.append(author_name)
        	book_list.append(book_name)
        href = matches.group(1)
        title_list.append(title)
        href_list.append(href)

searchresult = []
for index, (href, title) in enumerate(zip(title_list, href_list), start=1):
    searchresult.append((title, href))

print(searchresult)
print(book_list)
print(author_list)