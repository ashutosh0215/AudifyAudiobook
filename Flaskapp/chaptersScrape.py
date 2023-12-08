import requests
from bs4 import BeautifulSoup
import urllib
from flask import Flask,request,jsonify


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
