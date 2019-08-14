import urllib.request
from bs4 import BeautifulSoup
import json

url = 'http://www.nba.com/players'
outputFile = open('./data/nba-id.json', 'w')
with urllib.request.urlopen(url) as file:
    soup = BeautifulSoup(file, 'html.parser')
    players = soup.find_all(class_='nba-player-index__trending-item')
    data = {}
    for player in players:
        name = player.find('a')['title']
        id = player.find('a').find('img')['data-src']
        id = id.split('/')[-1][0:-4]
        data[name] = id
        print('{} - {}'.format(id, name))
    json.dump(data, outputFile)
        

