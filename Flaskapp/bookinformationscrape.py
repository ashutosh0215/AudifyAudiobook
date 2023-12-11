import requests
from bs4 import BeautifulSoup

def scrape_book_info(book_title):
    # Construct the URL for the book on Goodreads
    url = f'https://www.goodreads.com/search?q={book_title}'

    # Send an HTTP request to the URL
    response = requests.get(url)

    if response.status_code == 200:
        # Parse the HTML content of the page
        soup = BeautifulSoup(response.text, 'html.parser')

        # Extract relevant information (example: author, year published, overview)
        author = soup.find('span', itemprop='name').text.strip()
        year_published = soup.find('nobr', class_='greyText').text.strip()
        overview = soup.find('div', class_='readable stacked').find('span', style=None).text.strip()

        # Display the information
        print(f"Author: {author}")
        print(f"Year Published: {year_published}")
        print(f"Overview: {overview}")
    else:
        print(f"Failed to retrieve data. Status code: {response.status_code}")

# Example usage
book_title = 'The Great Gatsby'
scrape_book_info(book_title)
