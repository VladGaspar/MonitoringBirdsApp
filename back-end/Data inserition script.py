from seleniumwire import webdriver
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
import json
from selenium.webdriver.common.by import By
import pandas as pd
import mysql.connector
from mysql.connector import Error
from concurrent.futures import ThreadPoolExecutor, as_completed
import os
import bcrypt

def initialize_driver():
    chrome_options = Options()
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--headless")
    seleniumwire_options = {'disable_encoding': True, 'verify_ssl': False}
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), 
                              seleniumwire_options=seleniumwire_options, options=chrome_options)
    return driver

def wait_for_request(driver, url):
    WebDriverWait(driver, 10).until(lambda d: any(req for req in d.requests if req.url == url))

def convert_date_format(date_str):
    return pd.to_datetime(date_str).strftime('%Y-%m-%d')

def get_or_create_bird_id(connection, cursor, species_name):
    cursor.execute("SELECT id FROM birds WHERE species = %s", (species_name,))
    result = cursor.fetchone()
    if result:
        return result[0]
    else:
        cursor.execute("INSERT INTO birds (species, rarity) VALUES (%s,%s)", (species_name, "NO_RARITY"))
        connection.commit()
        return cursor.lastrowid

def get_or_create_user_id(connection, cursor, firstname, lastname):
    username = f"{firstname}.{lastname}".lower()
    cursor.execute("SELECT id FROM users WHERE username = %s", (username,))
    result = cursor.fetchone()
    if result:
        return result[0]
    else:
        password = bcrypt.hashpw("Password123!".encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        cursor.execute("INSERT INTO users (username, first_name, last_name, password, role) VALUES (%s, %s, %s, %s, %s)",
                       (username, firstname, lastname, password, "USER")) 
        connection.commit()
        return cursor.lastrowid

def insert_data(df):
    try:
        connection = mysql.connector.connect(host='localhost',
                                             database='pasari',
                                             user='root',
                                             password='root')
        if connection.is_connected():
            cursor = connection.cursor()
            bird_cache = {}
            user_cache = {}
            for row in df.itertuples(index=False):
                bird_id = bird_cache.get(row.species) or get_or_create_bird_id(connection, cursor, row.species)
                bird_cache[row.species] = bird_id

                user_id = user_cache.get((row.firstname, row.lastname)) or get_or_create_user_id(connection, cursor, row.firstname, row.lastname)
                user_cache[(row.firstname, row.lastname)] = user_id

                insert_query = """INSERT INTO observations (date, bird_id, user_id, no_of_specimens, latitude, longitude) 
                                  VALUES (%s, %s, %s, %s, %s, %s)"""
                formatted_date = convert_date_format(row.date)
                data_tuple = (formatted_date, bird_id, user_id, row.no_of_specimens, row.latitude, row.longitude)
                cursor.execute(insert_query, data_tuple)
            connection.commit()
            print(f"{cursor.rowcount} rows were inserted.")

    except Error as e:
        print("Error while connecting to MySQL", e)
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()
            print("MySQL connection is closed")

def fetch_data(id):
    data = []
    driver = None
    try:
        driver = initialize_driver()
        url = f'{base_url}{id}'
        driver.get(url)
        driver.requests.clear()

        obs_rows = driver.find_elements(By.CLASS_NAME, "obs-row")[:4]
        if len(obs_rows) >= 4:
            date_text = obs_rows[0].find_element(By.TAG_NAME, 'h2').text
            species_text = obs_rows[1].find_element(By.TAG_NAME, 'h2').text.split('\n')[0]
            no_of_specimens_text = obs_rows[2].find_element(By.TAG_NAME, 'h2').text
            firstname_text = obs_rows[3].find_element(By.TAG_NAME, 'h2').text.split(' ')[0]
            lastname_text = obs_rows[3].find_element(By.TAG_NAME, 'h2').text.split(' ')[1]

            wait_for_request(driver, 'https://maps.googleapis.com/$rpc/google.internal.maps.mapsjs.v1.MapsJsInternalService/GetViewportInfo')
            latitude, longitude = None, None
            for request in driver.requests:
                if request.url == 'https://maps.googleapis.com/$rpc/google.internal.maps.mapsjs.v1.MapsJsInternalService/GetViewportInfo':
                    payload = request.body
                    payload_str = payload.decode('utf-8')
                    payload_json = json.loads(payload_str)
                    coordinates = payload_json[0][0]
                    latitude, longitude = coordinates[0], coordinates[1]
                    break

            if latitude is not None and longitude is not None:
                data.append({
                    'date': date_text,
                    'species': species_text,
                    'no_of_specimens': no_of_specimens_text,
                    'latitude': latitude,
                    'longitude': longitude,
                    'firstname': firstname_text,
                    'lastname': lastname_text
                })
    except Exception as e:
        print(f"Error fetching data for id {id}: {e}")
    finally:
        if driver:
            driver.quit()
    return data

base_url = 'https://pasaridinromania.sor.ro/ornitodata/'
all_data = []
batch_size = 10

def process_data(start, batch_size):
    with ThreadPoolExecutor(max_workers=5) as executor:
        for start_id in range(start, start + 10, batch_size):
            # 1810200, 1810210
            batch_data = []
            futures = [executor.submit(fetch_data, id) for id in range(start_id, start_id + batch_size)]
            for future in as_completed(futures):
                result = future.result()
                if result:
                    batch_data.extend(result)

            if batch_data:
                df = pd.DataFrame(batch_data, columns=['date', 'species', 'no_of_specimens', 'latitude', 'longitude', 'firstname', 'lastname'])
                df['latitude'].replace({None: pd.NA}, inplace=True)
                df['longitude'].replace({None: pd.NA}, inplace=True)
                insert_data(df)
                all_data.extend(batch_data)
            
            os.system("taskkill /f /im chromedriver.exe /T")
            os.system("taskkill /f /im chrome.exe /T")

# Batch 1
process_data(1556000, batch_size)
process_data(1558000, batch_size)
process_data(1560000, batch_size)
process_data(1562000, batch_size)

# Batch 2
process_data(1564000, batch_size)
process_data(1566000, batch_size)
process_data(1568000, batch_size)
process_data(1570000, batch_size)
process_data(1572000, batch_size)

# Batch 3
process_data(1574000, batch_size)
process_data(1576000, batch_size)
process_data(1578000, batch_size)
process_data(1580000, batch_size)
process_data(1582000, batch_size)

# Batch 4
process_data(1584000, batch_size)
process_data(1586000, batch_size)
process_data(1588000, batch_size)
process_data(1590000, batch_size)
process_data(1592000, batch_size)

# Batch 5
process_data(1594000, batch_size)
process_data(1596000, batch_size)
process_data(1598000, batch_size)
process_data(1600000, batch_size)
process_data(1602000, batch_size)

# Batch 1
process_data(1604000, batch_size)
process_data(1606000, batch_size)
process_data(1608000, batch_size)
process_data(1610000, batch_size)
process_data(1612000, batch_size)

# Batch 2
process_data(1614000, batch_size)
process_data(1616000, batch_size)
process_data(1618000, batch_size)
process_data(1620000, batch_size)
process_data(1622000, batch_size)

# Batch 3
process_data(1624000, batch_size)
process_data(1626000, batch_size)
process_data(1628000, batch_size)
process_data(1630000, batch_size)
process_data(1632000, batch_size)

# Batch 4
process_data(1634000, batch_size)
process_data(1636000, batch_size)
process_data(1638000, batch_size)
process_data(1640000, batch_size)
process_data(1642000, batch_size)

# Batch 5
process_data(1644000, batch_size)
process_data(1646000, batch_size)
process_data(1648000, batch_size)
process_data(1650000, batch_size)

# Batch 1
process_data(1652000, batch_size)
process_data(1654000, batch_size)
process_data(1656000, batch_size)
process_data(1658000, batch_size)
process_data(1660000, batch_size)

# Batch 2
process_data(1662000, batch_size)
process_data(1664000, batch_size)
process_data(1666000, batch_size)
process_data(1668000, batch_size)
process_data(1670000, batch_size)

# Batch 3
process_data(1672000, batch_size)
process_data(1674000, batch_size)
process_data(1676000, batch_size)
process_data(1678000, batch_size)
process_data(1680000, batch_size)

# Batch 4
process_data(1682000, batch_size)
process_data(1684000, batch_size)
process_data(1686000, batch_size)
process_data(1688000, batch_size)
process_data(1690000, batch_size)

# Batch 5
process_data(1692000, batch_size)
process_data(1694000, batch_size)
process_data(1696000, batch_size)
process_data(1698000, batch_size)
process_data(1700000, batch_size)

# Batch 1
process_data(1702000, batch_size)
process_data(1704000, batch_size)
process_data(1706000, batch_size)
process_data(1708000, batch_size)
process_data(1710000, batch_size)

# Batch 2
process_data(1712000, batch_size)
process_data(1714000, batch_size)
process_data(1716000, batch_size)
process_data(1718000, batch_size)
process_data(1720000, batch_size)

# Batch 3
process_data(1722000, batch_size)
process_data(1724000, batch_size)
process_data(1726000, batch_size)
process_data(1728000, batch_size)
process_data(1730000, batch_size)

# Batch 4
process_data(1732000, batch_size)
process_data(1734000, batch_size)
process_data(1736000, batch_size)
process_data(1738000, batch_size)
process_data(1740000, batch_size)

# Batch 5
process_data(1742000, batch_size)
process_data(1744000, batch_size)
process_data(1746000, batch_size)
process_data(1748000, batch_size)

# Batch 1
process_data(1750000, batch_size)
process_data(1752000, batch_size)
process_data(1754000, batch_size)
process_data(1756000, batch_size)
process_data(1758000, batch_size)

# Batch 2
process_data(1760000, batch_size)
process_data(1762000, batch_size)
process_data(1764000, batch_size)
process_data(1766000, batch_size)
process_data(1768000, batch_size)

# Batch 3
process_data(1770000, batch_size)
process_data(1772000, batch_size)
process_data(1774000, batch_size)
process_data(1776000, batch_size)
process_data(1778000, batch_size)

# Batch 4
process_data(1780000, batch_size)
process_data(1782000, batch_size)
process_data(1784000, batch_size)
process_data(1786000, batch_size)
process_data(1788000, batch_size)

# Batch 5
process_data(1790000, batch_size)
process_data(1792000, batch_size)
process_data(1794000, batch_size)
process_data(1796000, batch_size)
process_data(1798000, batch_size)

# Batch 1
process_data(1800000, batch_size)
process_data(1802000, batch_size)
process_data(1804000, batch_size)
process_data(1806000, batch_size)
process_data(1808000, batch_size)

# Batch 2
process_data(1810000, batch_size)
process_data(1812000, batch_size)
process_data(1814000, batch_size)
process_data(1816000, batch_size)
process_data(1818000, batch_size)

# Batch 3
process_data(1820000, batch_size)
process_data(1822000, batch_size)
process_data(1824000, batch_size)
process_data(1826000, batch_size)
process_data(1828000, batch_size)

# Batch 4
process_data(1830000, batch_size)
process_data(1832000, batch_size)
process_data(1834000, batch_size)
process_data(1836000, batch_size)
process_data(1838000, batch_size)

# Batch 5
process_data(1840000, batch_size)
process_data(1842000, batch_size)
process_data(1844000, batch_size)
process_data(1846000, batch_size)

# Batch 1
process_data(1848000, batch_size)
process_data(1850000, batch_size)
process_data(1852000, batch_size)
process_data(1854000, batch_size)
process_data(1856000, batch_size)

# Batch 2
process_data(1858000, batch_size)
process_data(1860000, batch_size)
process_data(1862000, batch_size)
process_data(1864000, batch_size)
process_data(1866000, batch_size)

# Batch 3
process_data(1868000, batch_size)
process_data(1870000, batch_size)
process_data(1872000, batch_size)
process_data(1874000, batch_size)
process_data(1876000, batch_size)

# Batch 4
process_data(1878000, batch_size)
process_data(1880000, batch_size)
process_data(1882000, batch_size)
process_data(1884000, batch_size)
process_data(1886000, batch_size)

# Batch 5
process_data(1888000, batch_size)
process_data(1890000, batch_size)
process_data(1892000, batch_size)
process_data(1894000, batch_size)
process_data(1896000, batch_size)

# Batch 1
process_data(1898000, batch_size)
process_data(1900000, batch_size)
process_data(1902000, batch_size)
process_data(1904000, batch_size)
process_data(1906000, batch_size)

# Batch 2
process_data(1908000, batch_size)
process_data(1910000, batch_size)
process_data(1912000, batch_size)
process_data(1914000, batch_size)
process_data(1916000, batch_size)

# Batch 3
process_data(1918000, batch_size)
process_data(1920000, batch_size)
process_data(1922000, batch_size)
process_data(1924000, batch_size)
process_data(1926000, batch_size)

# Batch 4
process_data(1928000, batch_size)
process_data(1930000, batch_size)
process_data(1932000, batch_size)
process_data(1934000, batch_size)
process_data(1936000, batch_size)

# Batch 5
process_data(1938000, batch_size)
process_data(1940000, batch_size)
process_data(1942000, batch_size)
process_data(1944000, batch_size)
process_data(1946000, batch_size)

# Batch 1
process_data(1946000, batch_size)
process_data(1948000, batch_size)
process_data(1950000, batch_size)
process_data(1952000, batch_size)
process_data(1954000, batch_size)

# Batch 2
process_data(1956000, batch_size)
process_data(1958000, batch_size)
process_data(1960000, batch_size)
process_data(1962000, batch_size)
process_data(1964000, batch_size)

# Batch 3
process_data(1966000, batch_size)
process_data(1968000, batch_size)
process_data(1970000, batch_size)
process_data(1972000, batch_size)
process_data(1974000, batch_size)

# Batch 4
process_data(1976000, batch_size)
process_data(1978000, batch_size)
process_data(1980000, batch_size)
process_data(1982000, batch_size)
process_data(1984000, batch_size)

# Batch 5
process_data(1986000, batch_size)
process_data(1988000, batch_size)
process_data(1990000, batch_size)
process_data(1992000, batch_size)
process_data(1994000, batch_size)

# Batch 1
process_data(1996000, batch_size)
process_data(1998000, batch_size)
process_data(2000000, batch_size)
process_data(2002000, batch_size)
process_data(2004000, batch_size)

# Batch 2
process_data(2006000, batch_size)
print(pd.DataFrame(all_data, columns=['date', 'species', 'no_of_specimens', 'latitude', 'longitude', 'firstname', 'lastname']))
