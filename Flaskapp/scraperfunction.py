import requests 
from bs4 import BeautifulSoup
import urllib.parse
import re

def search_audiobook(searchbookname):
    base_url = 'https://findaudiobook.net/'
    encoded_searchbookname = urllib.parse.quote(searchbookname)
    search_url = f'{base_url}?s={encoded_searchbookname}' 
    searchresponse = requests.get(search_url)
    soup = BeautifulSoup(searchresponse.content, 'html.parser') 

    pattern = r'<h2 class="entry-title post-title"><a href="([^"]+)" rel="bookmark">([^<]+)</a></h2>'
    h2tag = soup.find_all('h2', class_='entry-title post-title')

    href_list = []
    title_list = []

    for bookinfo in h2tag:
        html_content = str(bookinfo)
        matches = re.search(pattern, html_content)
        if matches:
            title = matches.group(1)
            href = matches.group(2)
            title_list.append(title)
            href_list.append(href)

    searchresult = []
    for index,(href,title) in enumerate(zip(title_list,href_list), start=1):
    	searchresult.append((title,href))
    return searchresult


          



#searchbookname = input("Enter Book name: ")
#result = search_audiobook(searchbookname)
#print(result)

#def searchresult():
	#searchresult = []
	#for index, (href, title) in enumerate(zip(titleres,hrefres), start=1):
		#searchresult.append((title,href))
	#print(searchresult)

#searchresult()
